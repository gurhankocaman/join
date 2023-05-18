let contacts = [];
let todos = [];
let inProgress = [];
let awaitFeedback = [];
let doneTasks = [];
let currentDraggedElement;
let assignetContacts = [];
let assignetContactsTemp = [];
let selectedPrio = [];
let searchTodos = [];
let searchInProgress = [];
let searchAwaitFeedback = [];
let searchDoneTasks = [];


/**
 * Initialazing of the board
 */
async function initBoard() {
    await loadAll();
    renderBoard();
    document.getElementById('sidebar_board').classList.add('background-color');
}

/**
 * Loads Tasklist and sorts on progress
 */
async function loadAll() {
    await loadTasklist()
    loadTodos();
    loadInProgress();
    loadAwaitFeedback();
    loadDoneTasks();
}

/**
 * Saves changes to backend
 */
function saveBoard() {
    let tasklistAsString = JSON.stringify(tasklist);
    backend.setItem("tasklist", tasklistAsString);
}

/**
 * Gets tasklist from server
 */
async function loadTasklist() {
    setURL("https://maximilian-leyh.developerakademie.net/smallest_backend_ever");
    await downloadFromServer();
    tasklist = JSON.parse(backend.getItem("tasklist")) || [];
}

/**
 * Filters for progress "todo"
 */
function loadTodos() {
    todos = tasklist.filter(t => t['progress'] == 'todo');
}

/**
 * Filters for progress "in progress"
 */
function loadInProgress() {
    inProgress = tasklist.filter(t => t['progress'] == 'inprogresss');
}

/**
 * Filters for progress "awaiting feedback"
 */
function loadAwaitFeedback() {
    awaitFeedback = tasklist.filter(t => t['progress'] == 'awaitfeedback');
}

/**
 * Filters for progress "done task"
 */
function loadDoneTasks() {
    doneTasks = tasklist.filter(t => t['progress'] == 'donetask');
}

/**
 * Loads the render funktions
 */
function renderBoard() {
    renderTodos('toDos', 'todo', todos, 'inprogresss', 'todo');
    renderTodos('inProgress', 'inprogresss', inProgress, 'awaitfeedback', 'todo');
    renderTodos('awaitingFeedback', 'awaitfeedback', awaitFeedback, 'donetask', 'inprogresss');
    renderTodos('doneTasks', 'donetask', doneTasks, 'donetask', 'awaitfeedback');
}

/**
 * Renders the Bord
 * @param {string} boxid Id of the div container
 * @param {string} progression Name of the progression
 * @param {array} array Array of the progression
 */
function renderTodos(boxid, progression, array, next, previus) {
    document.getElementById(`${boxid}`).innerHTML = ``;
    for (let i = 0; i < array.length; i++) {
        let toDo = array[i];
        let id = toDo['id'];
        let color = toDo['category']['color'];
        let category = toDo['category']['categoryName'];
        let title = toDo['title'];
        let description = toDo['description'];
        let subtasks = toDo['subtasks']['tasks'].length;
        let completedtasks = 0;
        for (let j = 0; j < toDo['subtasks']['tasks'].length; j++) {
            let task = toDo['subtasks']['tasks'][j];
            if (task['completed']) {
                completedtasks++
            }
        }
        let assignedIconToThree = assignedTo(toDo['assignedTo']['user']);
        let priority = toDo['priority'];
        document.getElementById(`${boxid}`).innerHTML += toDoTemplate(id, color, category, title, description, subtasks, completedtasks, assignedIconToThree, priority, next, previus);
    }
    document.getElementById(`${boxid}`).innerHTML += addDragarea(progression);
}

/**
 * Shortening and returning the template of assigned users
 * @param {array} assignedTo Array of assigned users
 * @returns Shortent template of assignet users
 */
function assignedTo(assignedTo) {
    if (assignedTo.length == 0) {
        return noAssignedPersonsTemplate();
    }
    if (assignedTo.length == 1) {
        return oneAssignedPersonsTemplate(assignedTo);
    }
    if (assignedTo.length == 2) {
        return twoAssignedPersonsTemplate(assignedTo);
    }
    if (assignedTo.length == 3) {
        return threeAssignedPersonsTemplate(assignedTo);
    }
    else {
        return moreAssignedPersonsTemplate(assignedTo);
    }
}

/**
 * Moves a task to a progress destination
 * @param {integer} id Id from selected task
 * @param {string} destination Name of the progress destination
 */
async function moveTask(id, destination) {
    tasklist[id]['progress'] = destination;
    await saveBoard();
    setTimeout(await initBoard, 100);
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Moves a task to a progress destination via drag and drop
 * @param {string} destination Name of the progress destination
 */
async function drop(destination) {
    tasklist[currentDraggedElement]['progress'] = destination;
    await saveBoard();
    setTimeout(await initBoard, 100);
}

/**
 * Highlights the droparea when hovering over it
 * @param {string} id Id of the dragarea
 */
function highlight(id) {
    document.getElementById(id).classList.add('dragarea-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('dragarea-highlight');
}

/**
 * Opens the add task Popup
 */
function taskPopup() {
    document.getElementById('Boardpopup').innerHTML = `
    <div w3-include-html="./assets/templates/add_task_popup.html"></div>
    `;
    includeHTML();
    document.getElementById('Boardpopup').classList.remove('d-none');
    document.getElementById('Boardpopup').style.overflow = 'scroll';
    initAddTaskPopup();
}

/**
 * Opens the detail-view of selected task
 * @param {integer} id Id of the task
 */
function openTask(id) {
    document.getElementById('Boardpopup').classList.remove('d-none');
    task = tasklist.filter(t => t['id'] == id);
    let category = task[0]['category']['categoryName'];
    let color = task[0]['category']['color'];
    let title = task[0]['title'];
    let description = task[0]['description'];
    let duedateunformated = JSON.stringify(task[0]['duedate']);
    let year = duedateunformated.slice(0, 4);
    let month = duedateunformated.slice(4, 6);
    let day = duedateunformated.slice(6);
    let duedate = day + '.' + month + '.' + year;
    let priority = task[0]['priority'];
    let assignedTo = task[0]['assignedTo'];
    document.getElementById('Boardpopup').innerHTML = taskformTemplate(category, color, title, description, duedate, priority, id);
    renderAssignedTo(assignedTo);
    renderSubTasks(id);
}

/**
 * Closes any popup
 */
function closeBoardPopup() {
    document.getElementById('Boardpopup').innerHTML = '';
    document.getElementById('Boardpopup').classList.add('d-none');
    document.getElementById('Boardpopup').style.overflow = 'unset';
}

/**
 * Opens the filter and render funktions of the search
 * @param {integer} id Id of the task
 */
function findTask(id) {
    let search = document.getElementById(id).value;
    searchInTodos(search);
    searchInInProgress(search);
    searchInAwaitFeedback(search);
    searchInDoneTasks(search);
    rendersearchedTodos(searchTodos, 'toDos', 'todo', 'inprogresss', 'todo');
    rendersearchedTodos(searchInProgress, 'inProgress', 'inprogresss', 'awaitfeedback', 'todo');
    rendersearchedTodos(searchAwaitFeedback, 'awaitingFeedback', 'awaitfeedback', 'donetask', 'inprogresss');
    rendersearchedTodos(searchDoneTasks, 'doneTasks', 'donetask', 'donetask', 'awaitfeedback');
}

/**
 * Search function
 * @param {string} search Input of the searchbar
 */
function searchInTodos(search) {
    searchTodos = [];
    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];
        if (todo['title'].toLowerCase().includes(search)) {
            searchTodos.push(todo)
        } else if (todo['description'].toLowerCase().includes(search)) {
            searchTodos.push(todo)
        }
    }
}

/**
 * Search function
 * @param {string} search Input of the searchbar
 */
function searchInInProgress(search) {
    searchInProgress = [];
    for (let i = 0; i < inProgress.length; i++) {
        let todo = inProgress[i];
        if (todo['title'].toLowerCase().includes(search)) {
            searchInProgress.push(todo)
        } else if (todo['description'].toLowerCase().includes(search)) {
            searchInProgress.push(todo)
        }
    }
}

/**
 * Search function
 * @param {string} search Input of the searchbar
 */
function searchInAwaitFeedback(search) {
    searchAwaitFeedback = [];
    for (let i = 0; i < awaitFeedback.length; i++) {
        let todo = awaitFeedback[i];
        if (todo['title'].toLowerCase().includes(search)) {
            searchAwaitFeedback.push(todo)
        } else if (todo['description'].toLowerCase().includes(search)) {
            searchAwaitFeedback.push(todo)
        }
    }
}

/**
 * Search function
 * @param {string} search Input of the searchbar
 */
function searchInDoneTasks(search) {
    searchDoneTasks = [];
    for (let i = 0; i < doneTasks.length; i++) {
        let todo = doneTasks[i];
        if (todo['title'].toLowerCase().includes(search)) {
            searchDoneTasks.push(todo)
        } else if (todo['description'].toLowerCase().includes(search)) {
            searchDoneTasks.push(todo)
        }
    }
}

/**
 * Renders the found tasks
 * @param {array} array Searched progress array
 * @param {string} id1 Id of searched progress
 * @param {string} id2 Id of dragarea progress
 */
function rendersearchedTodos(array, id1, id2, next, previus) {
    document.getElementById(id1).innerHTML = ``;
    for (let i = 0; i < array.length; i++) {
        let toDo = array[i];
        let id = toDo['id'];
        let color = toDo['category']['color'];
        let category = toDo['category']['categoryName'];
        let title = toDo['title'];
        let description = toDo['description'];
        let subtasks = toDo['subtasks']['tasks'].length;
        let completedtasks = 0;
        for (let j = 0; j < toDo['subtasks']['tasks'].length; j++) {
            let task = toDo['subtasks']['tasks'][j];
            if (task['completed']) {
                completedtasks++
            }
        }
        let assignedIconToThree = assignedTo(toDo['assignedTo']['user']);
        let priority = toDo['priority'];
        document.getElementById(id1).innerHTML += toDoTemplate(id, color, category, title, description, subtasks, completedtasks, assignedIconToThree, priority, next, previus)
    }
    document.getElementById(id1).innerHTML += addDragarea(id2);
}