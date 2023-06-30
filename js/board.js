let tasks = [];
let filteredTasks = [];

async function initBoard() {
    loadTasks();
}

async function loadTasks() {
    tasks = JSON.parse(await getItem('tasks'));
    updateId();
    updateTasksHTML();
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
            <div class="margin-bottom-10">
                <div class="progress-bar"></div>
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
function generatePopupCardHTML(i) {
    let content = document.getElementById('popup-card');
    content.innerHTML = '';
    content.innerHTML += /*html*/ `
    <div>
        <div class="close-popup-card" onclick="closePopupCard()">
            <img src="./assets/img/close-btn.png">
         </div>
        <div class="popup-card-category margin-bottom-25">${tasks[i]['category']}</div>
        <div class="popup-card-title margin-bottom-25">
            <h2>${tasks[i]['title']}</h2>
        </div>
        <div class="margin-bottom-25">${tasks[i]['description']}</div>
        <div class="margin-bottom-25">
            <b>Due date:</b> ${tasks[i]['date']}
        </div>
        <div class="popup-card-prio-container margin-bottom-25">
            <b>Priority:</b> ${checkPopupCardPrio(tasks[i]['priority'])}
        </div>
        <div>
            <b>Assigned To:</b>
            <div class="popup-card-assigned-to-container">
                <div class="popup-card-user-initials">
                <div>${getUserInitials(tasks[i]['assignedTo'])}</div>
                </div>
                <div>
                    ${tasks[i]['assignedTo']}
                </div>
            </div>
        </div>
        <div>
            <b>Subtasks:</b>
                <div>
                    ${tasks[i].subtask}
                </div>        
        </div>
        <div class="popup-card-btns">
            <div onclick="deleteTask(${i})" class="delete-btn">
                <img src="./assets/img/delete-button.png">
            </div>
            <div class="edit-btn">
                <img src="./assets/img/edit-pencil.png">
            </div>
        </div>
    </div>
    `;
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
    const splitNames = username.split(' '); // Teilt den String in Wörter auf
    const initials = splitNames.map(word => word.charAt(0)); // Extrahiert den ersten Buchstaben jedes Wortes
    return initials.join(''); // Verbindet die Initialen zu einem String und gibt sie zurück
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