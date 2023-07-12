function clearTasks() {
    tasks = [];
    filteredTasks = [];
    updateTasksHTML();
    saveTasks();
}

let tasks = [];
let filteredTasks = [];
let currentDraggedElement;
let selectedPriority;


/**
 * Initializes the board by retrieving tasks from storage, updating IDs, and generating HTML elements.
 * @returns {Promise<void>}
 */
async function initBoard() {
    tasks = JSON.parse(await getItem('tasks'));
    contacts = JSON.parse(await getItem('contacts'));
    updateId();
    updateTasksHTML();
    generateUsers();
    generateProgressBar();
    generateCategoryColor();
    getContacts();
}

function getContacts() {
    console.log(contacts);
}


/**
 * Updates the IDs of tasks in the array.
 */
function updateId() {
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].id = i;
        saveTasks();
    }
}


/**
 * Saves the updated tasks to storage.
 * @returns {Promise<void>}
 */
async function saveTasks() {
    await setItem('tasks', JSON.stringify(tasks));
}


/**
 * Updates the HTML elements for the tasks on the board.
 */
function updateTasksHTML() {
    updateToDo();
    updateInProgress();
    updateAwaitingFeedback();
    updateDone();
}


/**
 * Updates the "To Do" column on the board.
 */
function updateToDo() {
    let toDo = tasks.filter(t => t['status'] == 'to-do');
    document.getElementById('to-do').innerHTML = '';
    for (let i = 0; i < toDo.length; i++) {
        const task = toDo[i];
        document.getElementById('to-do').innerHTML += generateTasksHTML(task);
    }
}


/**
 * Updates the "In Progress" column on the board.
 */
function updateInProgress() {
    let inProgress = tasks.filter(t => t['status'] == 'in-progress');
    document.getElementById('in-progress').innerHTML = '';
    for (let i = 0; i < inProgress.length; i++) {
        const task = inProgress[i];
        document.getElementById('in-progress').innerHTML += generateTasksHTML(task);
    }
}


/**
 * Updates the "Awaiting Feedback" column on the board.
 */
function updateAwaitingFeedback() {
    let awaitingFeedback = tasks.filter(t => t['status'] == 'awaiting-feedback');
    document.getElementById('awaiting-feedback').innerHTML = '';
    for (let i = 0; i < awaitingFeedback.length; i++) {
        const task = awaitingFeedback[i];
        document.getElementById('awaiting-feedback').innerHTML += generateTasksHTML(task);
    }
}


/**
 * Updates the "Done" column on the board.
 */
function updateDone() {
    let done = tasks.filter(t => t['status'] == 'done');
    document.getElementById('done').innerHTML = '';
    for (let i = 0; i < done.length; i++) {
        const task = done[i];
        document.getElementById('done').innerHTML += generateTasksHTML(task);
    }
}


/**
 * Sets the current dragged element.
 * @param {number} id - The ID of the dragged element.
 */
function startDragging(id) {
    currentDraggedElement = id;
}


/**
 * Allows dropping of elements during drag and drop.
 * @param {Event} ev - The drag event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * Moves the current dragged task to the specified status and updates the board.
 * @param {string} status - The status to move the task to.
 * @returns {Promise<void>}
 */
async function moveTo(status) {
    tasks[currentDraggedElement]['status'] = status;
    await saveTasks();
    updateTasksHTML();
    generateUsers();
    generateProgressBar();
    generateCategoryColor();
}


/**
 * Moves a task to the specified status based on its index and updates the board.
 * @param {number} taskIndex - The index of the task to move.
 * @param {string} status - The status to move the task to.
 * @returns {Promise<void>}
 */
async function moveTask(taskIndex, status) {
    tasks[taskIndex].status = status;
    await saveTasks();
    updateTasksHTML();
    generateUsers();
    generateProgressBar();
    generateCategoryColor();
    closePopupCard();
}


/**
 * Finds tasks based on the search value and updates the board.
 */
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
    generateUsers();
    generateProgressBar();
    generateCategoryColor();
}


/**
 * Generates the HTML for a task.
 * @param {Object} task - The task object.
 * @returns {string} The HTML string for the task.
 */
function generateTasksHTML(task) {
    if (filteredTasks.length > 0 && !filteredTasks.includes(task)) {
        return ''; // If the task object is not in the filteredTasks array, return an empty string and do not display the task
    } else {
        return tasksHTML(task);
    }
}


/**
 * Generates the category color for each task.
 */
function generateCategoryColor() {
    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
        document.getElementById(`card-category-${taskIndex}`).style.backgroundColor = `${tasks[taskIndex].categoryColor}`;
    }
}


/**
 * Generates the progress bar and value for each task.
 */
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


/**
 * Generates the user initials for each task.
 */
function generateUsers() {
    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
        let content = document.getElementById(`card-user-initials-${taskIndex}`);
        content.innerHTML = '';
        for (let j = 0; j < tasks[taskIndex].assignedTo.length; j++) {
            content.innerHTML += `<div class="card-user-initials">${getUserInitials(tasks[taskIndex].assignedTo[j].name)}</div>`;
        }
    }
}


/**
 * Checks the priority of a task and returns the corresponding HTML.
 * @param {string} prio - The priority value of the task.
 * @returns {string} The HTML string for the priority.
 */
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
    return `<img src="${prioImg}">`;
}


/**
 * Opens the popup card for a task.
 * @param {number} i - The index of the task.
 */
function openPopupCard(i) {
    document.getElementById('popup-card').classList.remove('d-none');
    generatePopupCardHTML(i);
    generatePopupCardCategoryColor(i);
}


/**
 * Closes the popup card.
 */
function closePopupCard() {
    document.getElementById('popup-card').classList.add('d-none');
}


/**
 * Generates the HTML content for the popup card of a task.
 * @param {number} taskIndex - The index of the task.
 */
function generatePopupCardHTML(taskIndex) {
    let content = document.getElementById('popup-card');
    content.innerHTML = '';
    content.innerHTML += popupCardHTML(taskIndex);
    generateSubtasks(taskIndex);
}


/**
 * Generates the category color for the popup card of a task.
 * @param {number} taskIndex - The index of the task.
 */
function generatePopupCardCategoryColor(taskIndex) {
    document.getElementById(`popup-card-category-${taskIndex}`).style.backgroundColor = `${tasks[taskIndex].categoryColor}`;
}


/**
 * Checks the priority of a task in the popup card and returns the corresponding HTML.
 * @param {string} prio - The priority value of the task.
 * @returns {string} The HTML string for the priority.
 */
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
    return `<div class="popup-card-prio-btn" style="background-color:${prioColor};"><span>${prioText}</span> <img src="${prioImg}"></div>`;
}


/**
 * Generates the user initials for the popup card of a task.
 * @param {number} taskIndex - The index of the task.
 * @returns {string} The HTML string for the user initials.
 */
function generateUsersPopupCard(taskIndex) {
    let usersHTML = '';
    for (let i = 0; i < tasks[taskIndex].assignedTo.length; i++) {
        usersHTML += `<div class="popup-card-assigned-to-container">
            <div class="popup-card-user-initials">
                <div>${getUserInitials(tasks[taskIndex].assignedTo[i].name)}</div>
            </div>
            <div>${tasks[taskIndex].assignedTo[i].name}</div>
        </div>`;
    }
    return usersHTML;
}


/**
 * Generates the subtasks for the popup card of a task.
 * @param {number} taskIndex - The index of the task.
 */
function generateSubtasks(taskIndex) {
    let subtasks = tasks[taskIndex].subtask;
    let content = document.getElementById('popup-card-subtasks');
    content.innerHTML = '';

    for (let i = 0; i < subtasks.length; i++) {
        const checkboxId = `subtask-${taskIndex}-${i}`;
        const isChecked = subtasks[i].checked ? 'checked' : '';

        content.innerHTML += `
            <input type="checkbox" id="${checkboxId}" onchange="submitCheckboxValue(${taskIndex}, ${i})" ${isChecked}>
            <label for="${checkboxId}">${subtasks[i].name}</label><br>
        `;
    }
};


/**
 * Submits the checkbox value of a subtask.
 * @param {number} taskIndex - The index of the task.
 * @param {number} i - The index of the subtask.
 */
function submitCheckboxValue(taskIndex, i) {
    let checkbox = document.getElementById(`subtask-${taskIndex}-${i}`);
    tasks[taskIndex].subtask[i].checked = checkbox.checked;
    saveTasks();
    generateProgressBar();
}


/**
 * Deletes a task.
 * @param {number} i - The index of the task.
 */
function deleteTask(i) {
    tasks.splice(i, 1);
    updateId();
    saveTasks();
    closePopupCard();
    updateTasksHTML();
    generateUsers();
    generateProgressBar();
    generateCategoryColor();
}


/**
 * Edits a task.
 * @param {number} taskIndex - The index of the task.
 */
function editTask(taskIndex) {
    let content = document.getElementById('popup-card');
    content.innerHTML = '';
    content.innerHTML += editTaskHTML(taskIndex);
    generateEditTaskCategoryColor(taskIndex);
}


/**
 * Generates the category color for the edit task popup card.
 * @param {number} taskIndex - The index of the task.
 */
function generateEditTaskCategoryColor(taskIndex) {
    document.getElementById(`edit-task-category-${taskIndex}`).style.backgroundColor = `${tasks[taskIndex].categoryColor}`;
}


/**
 * Selects a priority for the task being edited.
 * @param {string} priority - The selected priority.
 */
function selectPriority(priority) {
    const urgentBtn = document.getElementById('edit-task-prio-urgent');
    const mediumBtn = document.getElementById('edit-task-prio-medium');
    const lowBtn = document.getElementById('edit-task-prio-low');

    urgentBtn.classList.remove('edit-task-prio-urgent');
    mediumBtn.classList.remove('edit-task-prio-medium');
    lowBtn.classList.remove('edit-task-prio-low');

    selectedPriority = priority;

    if (priority === 'Urgent') {
        urgentBtn.classList.add('edit-task-prio-urgent');
    } else if (priority === 'Medium') {
        mediumBtn.classList.add('edit-task-prio-medium');
    } else if (priority === 'Low') {
        lowBtn.classList.add('edit-task-prio-low');
    }
}


/**
 * Generates the user initials for the edit task popup card.
 * @param {number} taskIndex - The index of the task.
 * @returns {string} The HTML string for the user initials.
 */
function generateUsersEditTask(taskIndex) {
    let usersHTML = '';
    for (let i = 0; i < tasks[taskIndex].assignedTo.length; i++) {
        usersHTML += `<div class="popup-card-assigned-to-container">
            <div class="popup-card-user-initials">
                <div>${getUserInitials(tasks[taskIndex].assignedTo[i].name)}</div>
            </div>
        </div>`;
    }
    return usersHTML;
}


/**
 * Saves the edited task.
 * @param {number} taskIndex - The index of the task.
 */
async function saveEdit(taskIndex) {
    tasks[taskIndex]['title'] = document.getElementById('input-title-edit-task').value;
    tasks[taskIndex]['description'] = document.getElementById('input-description-edit-task').value;
    tasks[taskIndex]['date'] = document.getElementById('input-date-edit-task').value;

    if (selectedPriority) {
        tasks[taskIndex]['priority'] = selectedPriority;
    }

    await setItem('tasks', JSON.stringify(tasks));
    closePopupCard();
    updateTasksHTML();
    generateUsers();
    generateProgressBar();
    generateCategoryColor();
}


/**
 * Generates the initials for a user's name.
 * @param {string} name - The user's name.
 * @returns {string} The initials of the user's name.
 */
function getUserInitials(name) {
    const words = name.split(" ");
    const initials = words.map(word => word.charAt(0));
    const initialsString = initials.join("");
    return initialsString;
}


/**
 * Opens the add task popup.
 */
function openAddTask() {
    window.location.href = 'add-task.html';
}


/**
 * Closes the add task popup.
 */
function closePopUp() {
    document.getElementById('add-task-popup').classList.add('d-none');
}
