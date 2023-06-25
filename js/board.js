async function initBoard() {
    loadTasks();

}

async function loadTasks() {
    tasks = JSON.parse(await getItem('tasks'));

    for (let i = 0; i < tasks.length; i++) {
        generatePopupCardHTML(i);

    }
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
        <div class="card-container margin-bottom-10" draggable="true" ondragstart="startDragging(${tasks['id']})" onclick="openPopupCard()">
            <div class="card-category margin-bottom-10">${tasks['category']}</div>
            <div class="card-title margin-bottom-10">${tasks['title']}</div>
            <div class="card-description margin-bottom-10">${tasks['description']}</div>
            <div class="margin-bottom-10">
                <div class="progress-bar"></div>
            </div>
            <div class="card-user-initials">
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

// popup card
function generatePopupCardHTML(i) {
    let content = document.getElementById('popup-card');
    content.innerHTML = '';
    content.innerHTML += /*html*/ `
    <div>
        <div class="close-popup-card" onclick="closePopupCard()">
            <img src="../assets/img/close-btn.png">
         </div>
        <div class="popup-card-category margin-bottom-25">${tasks[i]['category']}</div>
        <div class="popup-card-title margin-bottom-25">
            <h2>${tasks[i]['title']}</h2>
        </div>
        <div class="margin-bottom-25">${tasks[i]['description']}</div>
        <div class="margin-bottom-25">
            <b>Due date:</b> ${tasks[i]['date']}
        </div>
        <div class="margin-bottom-25">
            <b>Priority:</b> ${tasks[i]['priority']}
        </div>
        <div>
            <b>Assigned To:</b>
            <div class="popup-card-assigned-to-container">
                
                <div class="popup-card-user-initials">
                </div>
                <div>
                    ${tasks[i]['assignedTo']}
                </div>
            </div>
        </div>
        <div class="popup-card-btns">
            <div class="delete-btn">
                <img src="../assets/img/delete-button.png">
            </div>
            <div class="edit-btn">
                <img src="../assets/img/edit-pencil.png">
            </div>
        </div>
    </div>
    `;


}

function openPopupCard() {
    document.getElementById('popup-card').classList.remove('d-none');
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

