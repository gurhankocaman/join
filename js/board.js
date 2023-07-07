let tasks = [];
let filteredTasks = [];

async function initBoard() {
    tasks = JSON.parse(await getItem('tasks'));
    updateId();
    updateTasksHTML();
    generateUsers();
    generateProgressBar();
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

async function moveTo(status) {
    tasks[currentDraggedElement]['status'] = status;
    await saveTasks();
    updateTasksHTML();
    generateUsers();
    generateProgressBar();
}

async function moveTask(taskIndex, status) {
    tasks[taskIndex].status = status;
    await saveTasks();
    updateTasksHTML();
    generateUsers();
    generateProgressBar();
    closePopupCard();
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
            <div id="progress-bar-container" class="progress-bar-container">
                <progress id="progress-bar-${task.id}" max="100" value="0"></progress>
                <div id="progress-value-${task.id}" class="progress-bar-counter"></div>
            </div>
            <div class="card-bottom">
                <div class="card-users" id="card-user-initials-${task.id}">
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
                    <div>${generateUsersPopupCard(taskIndex)}</div>
                </div>
            </div>
            <div class="margin-bottom-25"><b>Subtasks:</b>
                <div id="popup-card-subtasks"></div>
            </div>
            <div class="popup-card-move-task">
                <b>Move Task:</b>
                <div>
                    <div class="popup-card-move-task">
                        <button onclick="moveTask('${taskIndex}', 'to-do')">To Do</button>
                        <button onclick="moveTask('${taskIndex}', 'in-progress')">In Progress</button>
                        <button onclick="moveTask('${taskIndex}', 'awaiting-feedback')">Awaiting Feedback</button>
                        <button onclick="moveTask('${taskIndex}', 'done')">Done</button>
                    </div>
                </div>
            </div>
            <div class="popup-card-btns">
                <div onclick="deleteTask(${taskIndex})" class="delete-btn">
                    <img src="./assets/img/delete-button.png">
                </div>
                <div onclick="editTask(${taskIndex})" class="edit-btn">
                    <img src="./assets/img/edit-pencil.png">
                </div>
            </div>
        </div>
    `;
    generateSubtasks(taskIndex);
}

function editTask(taskIndex) {
    let content = document.getElementById('popup-card');
    content.innerHTML = '';
    content.innerHTML += /*html*/ `
        <div class="popup-card-content">
            <div class="close-popup-card" onclick="closePopupCard()">
                <img src="./assets/img/close-btn.png">
            </div>
            <div class="popup-card-category margin-bottom-25">${tasks[taskIndex]['category']}</div>
            <div class="edit-task-title margin-bottom-25">
                <p><b>Title</b></p>
                <input required id="input-title-edit-task" value="${tasks[taskIndex]['title']}" class="edit-task-input" type="text" placeholder="Enter a title">
            </div>
            <div class="edit-task-description margin-bottom-25">
                <p><b>Description</b></p>
                <input required id="input-description-edit-task" value="${tasks[taskIndex]['description']}" class="edit-task-input" type="text" placeholder="Enter a description">
            </div>
            <div class="popup-card-prio-container margin-bottom-25">
                <b>Priority:</b> 
                <div class="edit-task-show-prio">
                    <div class="popup-card-prio-btn edit-task-prio-urgent" onclick="saveEdit(${taskIndex}, 'Urgent')">
                        Urgent<img src="./assets/img/prio-urgent-white.png"></div>
                    <div class="popup-card-prio-btn edit-task-prio-medium" onclick="saveEdit(${taskIndex}, 'Medium')">
                        Medium<img src="./assets/img/prio-medium-white.png"></div>
                    <div class="popup-card-prio-btn edit-task-prio-low" onclick="saveEdit(${taskIndex}, 'Low')">
                        Low <img src="./assets/img/prio-low-white.png"></div>
                </div>
            </div>
            <div class="popup-card-btns">
                <div onclick="saveEdit(${taskIndex})">
                    OK ✓
                </div>
            </div>
        </div>
    `;
}

async function saveEdit(taskIndex, prio) {
    tasks[taskIndex]['title'] = document.getElementById('input-title-edit-task').value;
    tasks[taskIndex]['description'] = document.getElementById('input-description-edit-task').value;
    tasks[taskIndex]['priority'] = prio; // Speichere den Wert in einer Eigenschaft des tasks-Objekts
    console.log(tasks[taskIndex]['title']);
    console.log(tasks[taskIndex]['description']);
    console.log(tasks[taskIndex]['priority']);
    await setItem('tasks', JSON.stringify(tasks));
    updateTasksHTML();
    generateUsers();
    generateProgressBar();
}


function generateUsersPopupCard(taskIndex) {
    let usersHTML = '';
    for (let i = 0; i < tasks[taskIndex].assignedTo.length; i++) {
        usersHTML += /*html*/ `
            <div class="popup-card-assigned-to-container">
            <div class="popup-card-user-initials">
                <div>${getUserInitials(tasks[taskIndex].assignedTo[i].name)}</div>
            </div>
                <div>${tasks[taskIndex].assignedTo[i].name}</div>
            </div>`;
    }
    return usersHTML;
}

function getUserInitials(name) {
    const words = name.split(" "); // Teile den Namen in einzelne Wörter auf
    const initials = words.map(word => word.charAt(0));  // Initialen für jeden Namen erstellen
    const initialsString = initials.join(""); // Initialen zu einem String zusammenführen
    return initialsString;
}

function generateUsers() {
    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
        let content = document.getElementById(`card-user-initials-${taskIndex}`);
        content.innerHTML = '';
        for (let j = 0; j < tasks[taskIndex].assignedTo.length; j++) {
            content.innerHTML += /*html*/ `
            <div class="card-user-initials">${getUserInitials(tasks[taskIndex].assignedTo[j].name)}</div>`;
        }

    }
}

function generateProgressBar() {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].subtask && tasks[i].subtask.length > 0) {
            let trueSubtasks = tasks[i].subtask.filter(subtask => subtask.checked === true);
            let percent = trueSubtasks.length / tasks[i].subtask.length * 100;
            let progressBar = document.getElementById(`progress-bar-${i}`);
            progressBar.value = percent;

            let progressValue = document.getElementById(`progress-value-${i}`);
            progressValue.innerHTML = '';
            progressValue.innerHTML += `${trueSubtasks.length}/${tasks[i].subtask.length} Done`;
        } else {
            document.getElementById('progress-bar-container').classList.add('d-none');
        }
    }
}




function generateSubtasks(taskIndex) {
    let subtasks = tasks[taskIndex].subtask; // enthält das Array der Unteraufgaben für den gegebenen taskIndex
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

function openPopupCard(i) {
    document.getElementById('popup-card').classList.remove('d-none');
    generatePopupCardHTML(i);
}

function closePopupCard() {
    document.getElementById('popup-card').classList.add('d-none');
}

// Add Task Pop Up
function openAddTask() {
    window.location.href = 'add-task.html';
    // document.getElementById('add-task-popup').classList.remove('d-none');
}

function closePopUp() {
    document.getElementById('add-task-popup').classList.add('d-none');
}

function clearTasks() {
    tasks = [];
    filteredTasks = [];
    updateTasksHTML();
    saveTasks();
}
