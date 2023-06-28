/**
 * Initializes the summary by performing necessary setup tasks.
 */
async function initSummary() {
    init(); // Initialize Sidebar and Header
    loadTasks();
};

async function loadTasks() {
    tasks = JSON.parse(await getItem('tasks'));
    loadContent();
}

function loadContent() {
    numberOfTasks();
    tasksInProgress();
    tasksAwaitingFeedback();
    getUsername();
    getTime();
    greetUser();
}

function numberOfTasks() {
    document.getElementById('tasks-in-board').innerHTML = '';
    document.getElementById('tasks-in-board').innerHTML = /*html*/`
        ${tasks.length}
    `;
}

function tasksInProgress() {
    let inProgress = tasks.filter(t => t['status'] == 'in-progress');
    document.getElementById('tasks-in-progress').innerHTML = '';
    document.getElementById('tasks-in-progress').innerHTML += `
        ${inProgress.length}
    `;
}

function tasksAwaitingFeedback() {
    let awaitingFeedback = tasks.filter(t => t['status'] == 'awaiting-feedback');
    document.getElementById('tasks-awaiting-feedback').innerHTML = '';
    document.getElementById('tasks-awaiting-feedback').innerHTML += `
        ${awaitingFeedback.length}
    `;
}

/**
 * Greets the user by displaying a personalized message.
 * Updates the user-greetings and user-name elements in the HTML document.
 */
function greetUser() {
    document.getElementById('user-greetings').innerHTML = '';
    document.getElementById('user-name').innerHTML = '';

    if (getUsername()) {
        // Display current time in user-greetings element
        document.getElementById('user-greetings').innerHTML += `<div>${getTime()}</div>`;
        // Display username in user-name element
        document.getElementById('user-name').innerHTML += `<div>${getUsername()}</div>`;
    } else {
        // Display modified time (without comma) in user-greetings element
        document.getElementById('user-greetings').innerHTML += `<div>${getTime().slice(0, -1)}</div>`;
    }
}

/**
 * Retrieves the current username from local storage.
 * @returns {string} The username of the current user.
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
 * Gets the current time and determines the appropriate greeting message based on the hour.
 * @returns {string} The greeting message based on the current time.
 */
function getTime() {
    const time = new Date();
    let userGreetings;

    let hour = time.getHours();
    if (hour >= 5 && hour <= 12) {
        userGreetings = 'Good morning,';
    }
    if (hour >= 14 && hour <= 18) {
        userGreetings = 'Good afternoon,';
    }
    if (hour >= 18 && hour <= 23) {
        userGreetings = 'Good evening,';
    }

    return userGreetings;
}


