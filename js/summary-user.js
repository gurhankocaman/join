/**
 * Initializes the summary page
 */
async function initSummary() {
    await includeHTML();
    await loadTasks();
    navLinkActive('nav-summary-user');
};


/**
 * Loads the tasks from local storage and generates side content
 */
async function loadTasks() {
    tasks = JSON.parse(await getItem('tasks'));
    loadContent();
}


/**
 * Loads the content on the summary page and checks if there are any tasks available
 */
function loadContent() {
    if (tasks.length > 0) {
        numberOfTasks();
        tasksInProgress();
        tasksAwaitingFeedback();
        tasksUrgent();
        getDeadline();
        tasksToDo();
        tasksDone();
    }
    getUsername();
    getTime();
    greetUser();
}


/**
 * Displays the number of tasks
 */
function numberOfTasks() {
    document.getElementById('tasks-in-board').innerHTML = '';
    document.getElementById('tasks-in-board').innerHTML = /*html*/`
        ${tasks.length}
    `;
}


/**
 * Displays the number of tasks in progress
 */
function tasksInProgress() {
    let inProgress = tasks.filter(t => t['status'] == 'in-progress');
    document.getElementById('tasks-in-progress').innerHTML = '';
    document.getElementById('tasks-in-progress').innerHTML += /*html*/`
        ${inProgress.length}
    `;
}


/**
 * Displays the number of tasks awaiting feedback
 */
function tasksAwaitingFeedback() {
    let awaitingFeedback = tasks.filter(t => t['status'] == 'awaiting-feedback');
    document.getElementById('tasks-awaiting-feedback').innerHTML = '';
    document.getElementById('tasks-awaiting-feedback').innerHTML += /*html*/`
        ${awaitingFeedback.length}
    `;
}


/**
 * Displays the number of urgent tasks
 */
function tasksUrgent() {
    let urgent = tasks.filter(t => t['priority'] == 'Urgent');
    document.getElementById('tasks-urgent').innerHTML = '';
    document.getElementById('tasks-urgent').innerHTML += /*html*/`
        ${urgent.length}
    `;
}


/**
 * Displays the upcoming deadline
 */
function getDeadline() {
    document.getElementById('upcoming-deadline').innerHTML = '';
    let oldestDate = tasks[0].date;

    for (let i = 1; i < tasks.length; i++) {
        if (tasks[i].date < oldestDate) {
            oldestDate = tasks[i].date;
        }
    }

    document.getElementById('upcoming-deadline').innerHTML += `
            ${oldestDate}
    `;
}


/**
 * Displays the number of tasks to do
 */
function tasksToDo() {
    let toDo = tasks.filter(t => t['status'] == 'to-do');
    document.getElementById('tasks-to-do').innerHTML = '';
    document.getElementById('tasks-to-do').innerHTML += /*html*/`
        ${toDo.length}
    `;
}


/**
 * Displays the number of tasks done
 */
function tasksDone() {
    let done = tasks.filter(t => t['status'] == 'done');
    document.getElementById('tasks-done').innerHTML = '';
    document.getElementById('tasks-done').innerHTML += /*html*/`
        ${done.length}
    `;
}


/**
 * Greets the user by displaying a personalized message
 */
function greetUser() {
    document.getElementById('user-greetings').innerHTML = '';
    document.getElementById('user-name').innerHTML = '';

    if (getUsername()) {
        document.getElementById('user-greetings').innerHTML += `<div>${getTime()}</div>`;
        document.getElementById('user-name').innerHTML += `<div>${getUsername()}</div>`;
    } else { // Display modified time (without comma) in user-greetings element
        document.getElementById('user-greetings').innerHTML += `<div>${getTime().slice(0, -1)}</div>`;
    }
}


/**
 * Retrieves the current username from local storage
 * @returns {string} - The username of the current user
 */
function getUsername() {
    let userAsText = localStorage.getItem('currentUser');

    if (userAsText) {
        let user = JSON.parse(userAsText);
        let username = user['name'];
        return username;
    }
}


/**
* Gets the current time and chooses the greeting message based on the hour
 * @returns {string} - The greeting message based on the current time
 */
function getTime() {
    const time = new Date();
    let userGreetings;

    let hour = time.getHours();
    if (hour >= 5 && hour <= 12) {
        userGreetings = 'Good morning,';
    }
    else if (hour >= 12 && hour <= 18) {
        userGreetings = 'Good afternoon,';
    }
    else if (hour >= 18 && hour <= 23) {
        userGreetings = 'Good evening,';
    }
    else {
        userGreetings = 'Hello,';
    }

    return userGreetings;
}


/**
 * Redirects the user to the board.html page
 */
function linkToBoard() {
    window.location.href = 'board.html';
}


