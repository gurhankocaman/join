/**
 * Creates a new Task
 */
async function createTask() {
    title = document.getElementById('title_input').value;
    description = document.getElementById('description_input').value;
    duedate = transformDuedate();
    await createTaskLoop();
}

async function createTaskLoop() {
    if (checkMissingInfo(title, description, duedate) == true) {
        getIdFromTasklist();
        if (title && description && category && assignedPeople.length > 0 && duedate && newSelectedPrio) {
            pushTasklist(category['color'], category['name'], duedate, title, description)
            for (let i = 0; i < subtasks.length; i++) {
                let subtask = subtasks[i];
                tempTasklist[taskId]['subtasks']['tasks'].push(subtask);
            }
            let tasksAsString = JSON.stringify(tempTasklist);
            await backend.setItem('tasklist', tasksAsString);
            await checkCategoryNew();
            closePopup();
            initBoard();
        }
    }
}

/**
 * Formates the input value of duedate
 * @returns Formated duedate
 */
function transformDuedate() {
    let mynewDate = document.getElementById('duedate').value
    let year = mynewDate.slice(0, 4);
    let month = mynewDate.slice(5, 7);
    let day = mynewDate.slice(8);
    let newDuedate = year + month + day;
    return parseInt(newDuedate)
}

/**
 * Checks for missing information
 * @param {string} title value of the title input
 * @param {string} description Value of the description input
 * @returns true if all required inputs are correct
 */
function checkMissingInfo(title, description) {
    if (title == false) {
        missingTitleAlert();
        return false;
    } else if (description == false) {
        missingDescriptionAlert();
        return false;
    } else if (category == false) {
        missingCategoryAlert();
        return false;
    } else if (assignedPeople == false) {
        missingAssignsAlert();
        return false;
    } else if (Number.isInteger(duedate) == false) {
        missingDueDateAlert();
        return false;
    } else if (newSelectedPrio == false) {
        missingPrioAlert();
        return false;
    } else {
        return true;
    }
}

/**
 * Alerts if title is missing
 */
function missingTitleAlert() {
    document.getElementById('title_alert').classList.remove('d-none');
    setTimeout(hideAlert, 5000);
}

/**
 * Alerts if description is missing
 */
function missingDescriptionAlert() {
    document.getElementById('description_alert').classList.remove('d-none');
    setTimeout(hideAlert, 5000);
}

/**
 * Alerts if category is missing
 */
function missingCategoryAlert() {
    document.getElementById('category_alert').classList.remove('d-none');
    setTimeout(hideAlert, 5000);
}

/**
 * Alerts if no one is assigned
 */
function missingAssignsAlert() {
    document.getElementById('assign_alert').classList.remove('d-none');
    setTimeout(hideAlert, 5000);
}

/**
 * Alerts if duedate is missing
 */
function missingDueDateAlert() {
    document.getElementById('duedate_alert').classList.remove('d-none');
    setTimeout(hideAlert, 5000);
}

/**
 * Alerts if no priority is selected
 */
function missingPrioAlert() {
    document.getElementById('prio_alert').classList.remove('d-none');
    setTimeout(hideAlert, 5000);
}

/**
 * Hides the alerts again
 */
function hideAlert() {
    document.getElementById('description_alert').classList.add('d-none');
    document.getElementById('title_alert').classList.add('d-none');
    document.getElementById('category_alert').classList.add('d-none');
    document.getElementById('assign_alert').classList.add('d-none');
    document.getElementById('duedate_alert').classList.add('d-none');
    document.getElementById('prio_alert').classList.add('d-none');
}

/**
 * Creates a new task in the tempTasklist
 * @param {string} category_color color of selected category
 * @param {string} category_name Name of selected category
 * @param {integer} duedate Formated duedate
 * @param {string} title Title of the task
 * @param {string} description Description of the task
 */
function pushTasklist(category_color, category_name, duedate, title, description) {
    tempTasklist.push({
        'progress': 'todo',
        'id': taskId,
        'category': {
            'color': category_color,
            'categoryName': category_name,
        },
        'duedate': duedate,
        'title': title,
        'description': description,
        'subtasks': {
            'tasks': [],
        },
        'assignedTo': {
            'user': assignedPeople,
        },
        'priority': newSelectedPrio,
    },);
}

/**
 * checks if category is new and saves it if it is
 * @returns false if category already exists
 */
async function checkCategoryNew() {
    for (let i = 0; i < categorys.length; i++) {
        let category1 = categorys[i];
        if (category1['name'] == category['name']) {
            return false
        }
    }
    categorys.push({
        'color': category['color'],
        'name': category['name'],
    },);
    categoryAsString = JSON.stringify(categorys);
    await backend.setItem('categorys', categoryAsString);
}