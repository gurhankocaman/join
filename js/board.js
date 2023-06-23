async function initBoard() {
    loadTasks();

}

async function loadTasks() {
    tasks = JSON.parse(await getItem('tasks'));
    updateTasksHTML();
}

// Drag And Drop
let currentDraggedElement;

function updateTasksHTML() {
    let toDo = tasks.filter(t => t['status'] == 'to-do');
    document.getElementById('to-do').innerHTML = '';
    for (let i = 0; i < toDo.length; i++) {
        const element = toDo[i];
        document.getElementById('to-do').innerHTML += generateTasksHTML(element);
    }

    let inProgress = tasks.filter(t => t['status'] == 'in-progress');
    document.getElementById('in-progress').innerHTML = '';
    for (let i = 0; i < inProgress.length; i++) {
        const element = inProgress[i];
        document.getElementById('in-progress').innerHTML += generateTasksHTML(element);
    }

    let awaitingFeedback = tasks.filter(t => t['status'] == 'awaiting-feedback');
    document.getElementById('awaiting-feedback').innerHTML = '';
    for (let i = 0; i < awaitingFeedback.length; i++) {
        const element = awaitingFeedback[i];
        document.getElementById('awaiting-feedback').innerHTML += generateTasksHTML(element);
    }

    let done = tasks.filter(t => t['status'] == 'done');
    document.getElementById('done').innerHTML = '';
    for (let i = 0; i < done.length; i++) {
        const element = done[i];
        document.getElementById('done').innerHTML += generateTasksHTML(element);
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
}

// Generate Tasks 
function generateTasksHTML(tasks) {
    const initials = getUserInitials(tasks['assignedTo']);

    return /*html*/ `
        <div class="card-container" draggable="true" ondragstart="startDragging(${tasks['id']})" onclick="openPopupCard()">
            <div class="card-category">${tasks['category']}</div>
            <div class="card-title">${tasks['title']}</div>
            <div class="card-description">${tasks['description']}</div>
            <div class="card-progress">
                <div class="progress-bar"></div>
            </div>
            <div class="card-user">
                <div>${initials}</div>
            </div>
        </div>
    `;
}

// Getting name initials
function getUserInitials(username) {
    const splitNames = username.split(' '); // Teilt den String in Wörter auf
    const initials = splitNames.map(word => word.charAt(0)); // Extrahiert den ersten Buchstaben jedes Wortes
    return initials.join(''); // Verbindet die Initialen zu einem String und gibt sie zurück
}

// 

function openPopupCard() {
    document.getElementById('popup-card').classList.remove('d-none');
}

// Add Task Pop Up
function openAddTask() {
    document.getElementById('add-task-popup').classList.remove('d-none');
}

function closePopUp() {
    document.getElementById('add-task-popup').classList.add('d-none');
}

