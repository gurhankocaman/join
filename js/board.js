let tasks = [];
let filteredTasks = [];

async function initBoard() {
    loadTasks();
}

async function loadTasks() {
    tasks = JSON.parse(await getItem('tasks'));
    generateHTML();
}

function generateHTML() {
    updateId();
    updateTasksHTML();
    generateProgressBar();
    generateUsers();
}


// Property Id = Index Of Array
function updateId() {
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].id = i;
        saveTasks();
    }
}

// Drag And Drop
let currentDraggedElement;

function updateTasksHTML() {
    let toDo = tasks.filter(t => t['status'] == 'to-do');
    document.getElementById('to-do').innerHTML = '';
    for (let i = 0; i < toDo.length; i++) {
        const task = toDo[i];
        document.getElementById('to-do').innerHTML += generateTasksHTML(task);
    }

    let inProgress = tasks.filter(t => t['status'] == 'in-progress');
    document.getElementById('in-progress').innerHTML = '';
    for (let i = 0; i < inProgress.length; i++) {
        const task = inProgress[i];
        document.getElementById('in-progress').innerHTML += generateTasksHTML(task);
    }

    let awaitingFeedback = tasks.filter(t => t['status'] == 'awaiting-feedback');
    document.getElementById('awaiting-feedback').innerHTML = '';
    for (let i = 0; i < awaitingFeedback.length; i++) {
        const task = awaitingFeedback[i];
        document.getElementById('awaiting-feedback').innerHTML += generateTasksHTML(task);
    }

    let done = tasks.filter(t => t['status'] == 'done');
    document.getElementById('done').innerHTML = '';
    for (let i = 0; i < done.length; i++) {
        const task = done[i];
        document.getElementById('done').innerHTML += generateTasksHTML(task);
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(status) {
    tasks[currentDraggedElement]['status'] = status;
    updateTasksHTML();
    generateProgressBar();
    saveTasks(); // Aufruf der saveTasks-Funktion, um die aktualisierten tasks zu speichern
}

// Speichern der aktualisierten Tasksansicht
async function saveTasks() {
    await setItem('tasks', JSON.stringify(tasks));
}

// Generate Tasks 
function generateTasksHTML(task) {
    if (filteredTasks.length > 0 && !filteredTasks.includes(task)) {
        return ''; // Wenn das Task-Objekt nicht im filteredTasks-Array enthalten ist, wird ein leerer String zurückgegeben und der Task wird nicht angezeigt
    } else {
        return /*html*/ `
        <div class="card-container margin-bottom-25" draggable="true" ondragstart="startDragging(${task['id']})" onclick="openPopupCard(${task['id']})">
            <div class="card-category margin-bottom-10">${task['category']}</div>
            <div class="card-title margin-bottom-10">${task['title']}</div>
            <div class="card-description margin-bottom-10">${task['description']}</div>
            <div class="progress-bar-container">
                <progress id="progress-bar-${task.id}" max="100" value="0"></progress>
                <div id="progress-value-${task.id}" class="progress-bar-counter"></div>
            </div>
            <div class="card-bottom">
                <div class="card-user-initials">
                    <div>${getUserInitials(task['assignedTo'])}</div>
                </div>
                <div class="card-prio">${checkCardPrio(task['priority'])}</div>
            </div>
        </div>
    `;
    }
}


// Search
function findTasks() {
    let searchValue = document.querySelector('.search-box input').value;
    searchValue = searchValue.toLowerCase();

    filteredTasks = [];

    if (searchValue.length > 0) {
        for (let i = 0; i < tasks.length; i++) {
            let taskTitle = tasks[i].title;
            taskTitle = taskTitle.toLowerCase();
            let taskDescription = tasks[i].description;
            taskDescription = taskDescription.toLowerCase();

            if (taskTitle.includes(searchValue) || taskDescription.includes(searchValue)) {
                filteredTasks.push(tasks[i]);
            }
        }
    }
    console.log(filteredTasks);
    updateTasksHTML();
}


// Show Prio Images Card
function checkCardPrio(prio) {
    let prioImg;

    if (prio === 'Urgent') {
        prioImg = "./assets/img/prio-urgent.png"
    }
    if (prio === 'Medium') {
        prioImg = "./assets/img/prio-medium.png"
    }
    if (prio === 'Low') {
        prioImg = "./assets/img/prio-low.png"
    }
    return /*html*/ `<img src="${prioImg}">
    `;
}


// popup card
function generatePopupCardHTML(taskIndex) {
    let content = document.getElementById('popup-card');
    content.innerHTML = '';
    content.innerHTML += /*html*/ `
        <div class="popup-card-content">
            <div class="close-popup-card" onclick="closePopupCard()">
                <img src="./assets/img/close-btn.png">
            </div>
            <div class="popup-card-category margin-bottom-25">${tasks[taskIndex]['category']}</div>
            <div class="popup-card-title margin-bottom-25">
                <h2>${tasks[taskIndex]['title']}</h2>
            </div>
            <div class="margin-bottom-25">${tasks[taskIndex]['description']}</div>
            <div class="margin-bottom-25">
                <b>Due date:</b> ${tasks[taskIndex]['date']}
            </div>
            <div class="popup-card-prio-container margin-bottom-25">
                <b>Priority:</b> ${checkPopupCardPrio(tasks[taskIndex]['priority'])}
            </div>
            <div>
                <div class="margin-bottom-25"><b>Assigned To:</b>
                    <div class="popup-card-assigned-to-container">
                        <div class="popup-card-user-initials">
                            <div>${getUserInitials(tasks[taskIndex]['assignedTo'])}</div>
                        </div>
                    <div id="assigned-to">Users</div>
                </div>
            </div>
            <div class="margin-bottom-25"><b>Subtasks:</b>
                <div id="popup-card-subtasks"></div>
            </div>
            <div class="popup-card-btns">
                <div onclick="deleteTask(${taskIndex})" class="delete-btn">
                    <img src="./assets/img/delete-button.png">
                </div>
                <div class="edit-btn">
                    <img src="./assets/img/edit-pencil.png">
                </div>
            </div>
        </div>
    `;
    generateSubtasks(taskIndex);
}

function generateUsers() {
    for (let i = 0; i < tasks.length; i++) {
        for (let j = 0; j < tasks[i].assignedTo.length; j++) {
            console.log(tasks[i].assignedTo[j]);
        }
       
    }
}
function generateProgressBar() {
    for (let i = 0; i < tasks.length; i++) {
        let trueSubtasks = tasks[i].subtask.filter(subtask => subtask.checked === true);
        let percent = trueSubtasks.length / tasks[i].subtask.length * 100;
        let progressBar = document.getElementById(`progress-bar-${i}`);
        progressBar.value = percent;

        let content = document.getElementById(`progress-value-${i}`);
        content.innerHTML = '';
        content.innerHTML += `${trueSubtasks.length}/${tasks[i].subtask.length} Done`;
    }
}



function generateSubtasks(taskIndex) {
    let subtasks = tasks[taskIndex].subtask; // enthält das Array der Unteraufgaben für den gegebenen taskIndex
    let checkboxValues = []; // Array zur Zwischenspeicherung der Checkbox-Werte
    let content = document.getElementById('popup-card-subtasks');
    content.innerHTML = '';

    for (let i = 0; i < subtasks.length; i++) {
        const checkboxId = `subtask-${taskIndex}-${i}`;  // eindeutige ID für das Checkbox-Element wird generiert

        // Zustand der Unteraufgabe (aus dem "checked"-Attribut) wird überprüft und in der Variable "isChecked" gespeichert
        // wenn die Unteraufgabe als "checked" markiert ist, wird der Wert 'checked' zugewiesen, ansonsten ein leerer String ('').
        const isChecked = subtasks[i].checked ? 'checked' : '';

        content.innerHTML += `
            <input type="checkbox" id="${checkboxId}" onchange="submitCheckboxValue(${taskIndex}, ${i})" ${isChecked}>
            <label for="${checkboxId}">${subtasks[i].name}</label><br>
        `;
    }
};


function submitCheckboxValue(taskIndex, i) {
    let checkbox = document.getElementById(`subtask-${taskIndex}-${i}`);
    // Checked-Eigenschaft wird in das entsprechende Unteraufgabenobjekt gespeichert
    tasks[taskIndex].subtask[i].checked = checkbox.checked;
    saveTasks();
    generateProgressBar();
}

function deleteTask(i) {
    tasks.splice(i, 1);
    updateId();
    saveTasks();
    closePopupCard();
    updateTasksHTML();
}


// Show Prio Images Card
function checkPopupCardPrio(prio) {
    let prioImg;
    let prioText;
    let prioColor;

    if (prio === 'Urgent') {
        prioText = 'Urgent';
        prioImg = "./assets/img/prio-urgent-white.png";
        prioColor = "#FF3D00";
    }
    if (prio === 'Medium') {
        prioText = 'Medium';
        prioImg = "./assets/img/prio-medium-white.png";
        prioColor = "#FFA800";
    }
    if (prio === 'Low') {
        prioText = 'Low';
        prioImg = "./assets/img/prio-low-white.png"
        prioColor = "#7AE229";

    }
    return /*html*/ `<div class="popup-card-prio-btn" style="background-color:${prioColor};"><span>${prioText}</span> <img src="${prioImg}"></div>
    `;
}


// Getting name initials
function getUserInitials(username) {
    // const splitNames = username.split(' '); // Teilt den String in Wörter auf
    // const initials = splitNames.map(word => word.charAt(0)); // Extrahiert den ersten Buchstaben jedes Wortes
    // return initials.join(''); // Verbindet die Initialen zu einem String und gibt sie zurück
}

function openPopupCard(i) {
    document.getElementById('popup-card').classList.remove('d-none');
    generatePopupCardHTML(i);
}

function closePopupCard() {
    document.getElementById('popup-card').classList.add('d-none');
}

// Add Task Pop Up
function openAddTask() {
    document.getElementById('add-task-popup').classList.remove('d-none');
}

function closePopUp() {
    document.getElementById('add-task-popup').classList.add('d-none');
}


