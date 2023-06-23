async function initBoard() {
    loadTasks();
   
}

async function loadTasks() {
    tasks = JSON.parse(await getItem('tasks'));
    addStatusToObject(tasks);
   
} 


function addStatusToObject(tasks) {
    for (let i = 0; i < tasks.length; i++) {
        const element = tasks[i];
        element.status = 'to-do';
        element.id = 0;
        console.log(element);
    }
    updateTasksHTML();
}

/* let testContent = [{
    'id': 0,
    'title': 'Task 1',
    'status': 'to-do'
}, {
    'id': 1,
    'title': 'Task 2',
    'status': 'to-do'
}, {
    'id': 2,
    'title': 'Task 3',
    'status': 'in-progress'
},
{
    'id': 3,
    'title': 'Task 4',
    'status': 'awaiting-feedback'
},
{
    'id': 4,
    'title': 'Task 5',
    'status': 'done'
}
]; */

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

function generateTasksHTML(element) {
    return /*html*/ `
        <div class="task-container" draggable="true" ondragstart="startDragging(${element['id']})">${element['title']}</div>
        `;
}

// Add Task Pop Up
function openAddTask() {
    document.getElementById('add-task-popup').classList.remove('d-none');
}

function closePopUp() {
    document.getElementById('add-task-popup').classList.add('d-none');
}

