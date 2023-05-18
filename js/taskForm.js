/**
 * Gets contacts for further rendering
 */
async function loadContactsforTasks() {
    setURL("https://maximilian-leyh.developerakademie.net/smallest_backend_ever");
    await downloadFromServer();
    contacts = JSON.parse(backend.getItem("contacts")) || [];
}

/**
 * Renders the assigned users
 * @param {array} assignedTo Array of assigned persons
 */
function renderAssignedTo(assignedTo) {
    for (let i = 0; i < assignedTo['user'].length; i++) {
        let user = assignedTo['user'][i];
        document.getElementById('assignedto').innerHTML += `
        <div class="user"><div class="name" style="background-color: ${user['iconcolor']}">${user['icon']}</div><div class="username">${user['name']}</div></div>
        `;
    };
}

/**
 * Renders subtasks to detail-view
 * @param {integer} id Id of selected task
 */
function renderSubTasks(id) {
    document.getElementById('subtasks').innerHTML = ``;
    for (let i = 0; i < tasklist[id]['subtasks']['tasks'].length; i++) {
        let subtask = tasklist[id]['subtasks']['tasks'][i];
        if (subtask['completed'] == false) {
            document.getElementById('subtasks').innerHTML += `
        <div class="subtask"><input type="checkbox" id="${i}" onchange="taskStatusChange(${i}, ${id})"><label for="${i}">${subtask['task']}</label></div>
        `;
        } else {
            document.getElementById('subtasks').innerHTML += `
        <div class="subtask"><input type="checkbox" id="${i}" onchange="taskStatusChange(${i}, ${id})" checked><label for="${i}">${subtask['task']}</label></div>
        `;
        }
    }
}

/**
 * Renders the editable-view of the selected task
 * @param {integer} id Id of selected task
 */
function renderEditTask(id) {
    task = tasklist.filter(t => t['id'] == id);
    assignetContacts = task[0]['assignedTo']['user'];
    assignetContactsTemp = assignetContacts;
    let title = task[0]['title'];
    let description = task[0]['description'];
    let duedateunformated = JSON.stringify(task[0]['duedate']);
    let year = duedateunformated.slice(0, 4);
    let month = duedateunformated.slice(4, 6);
    let day = duedateunformated.slice(6);
    let duedate = year + '-' + month + '-' + day;
    let priority = task[0]['priority'];
    let subtasks = task[0]['subtasks']['tasks'];
    renderEditTaskTemplate(id,title,description,duedate,priority,subtasks);
}

function renderEditTaskTemplate(id,title,description,duedate,priority,subtasks) {
    document.getElementById('Boardpopup').innerHTML = editTaskTemplate(id);
    document.getElementById('titleinput').value = title;
    document.getElementById('descriptioninput').value = description;
    document.getElementById('duedate').value = duedate;
    loadSubtasks(subtasks, id);
    selectPrio(priority);
    loadAssignetPersons(id);
    loadContactsforTasks();
    getMinDate();
}

/**
 * Renders subtasks with edit buttons
 * @param {array} subtasks Array of added subtasks
 * @param {integer} id Id of selected task
 */
function loadSubtasks(subtasks, id) {
    document.getElementById('subtasks').innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i];
        document.getElementById('subtasks').innerHTML += templateEditabelSubtask(subtask['task'], i, id);
    }
}

/**
 * Adds new subtask to selected task
 * @param {integer} id Id of selected task
 */
async function addNewSubask(id) {
    let newtask = document.getElementById('newsubtask').value;
    tasklist[id]['subtasks']['tasks'].push({ 'task': newtask, 'completed': false })
    document.getElementById('newsubtask').value = '';
    await saveBoard();
    await setTimeout(loadAll, 100);
    renderBoard();
    task = tasklist.filter(t => t['id'] == id);
    let subtasks = task[0]['subtasks']['tasks'];
    loadSubtasks(subtasks, id);
}

/**
 * Deletes subtask from selected task
 * @param {integer} index Index of selected subtask
 * @param {integer} id Id of selected task
 */
function deleteSubtask(index, id) {
    task = tasklist.filter(t => t['id'] == id);
    task[0]['subtasks']['tasks'].splice(index, 1);
    let subtasks = task[0]['subtasks']['tasks'];
    saveBoard();
    loadAll();
    renderBoard();
    loadSubtasks(subtasks, id);
}

/**
 * Adds inputfield for selected subtask for editing
 * @param {integer} index Index of selected subtask
 * @param {integer} id Id of selected task
 */
function editSubtask(index, id) {
    task = tasklist.filter(t => t['id'] == id);
    let subtask = task[0]['subtasks']['tasks'][index];
    document.getElementById(`subtask${index}`).innerHTML = templateEditabelSubtaskInput(subtask['task'], index, id);
}

/**
 * Saves the changes of the selected subtask to the selected task
 * @param {integer} index Index of selected subtask
 * @param {integer} id Id of selected task
 */
async function saveSubEdit(index, id) {
    newsubtask = document.getElementById(`subedit${index}`).value;
    tasklist[id]['subtasks']['tasks'][index]['task'] = newsubtask;
    await saveBoard();
    setTimeout(loadAll, 100);
    renderBoard();
    document.getElementById(`subtask${index}`).innerHTML = `
    <div><p>${newsubtask}</p></div>
    <div>
        <button onclick="deleteSubtask(${index}, ${id})">Delete</button>
        <button onclick="editSubtask(${index}, ${id})">Edit</button>
    </div>
    `
}

/**
 * Cancels the editing of selected subtask
 * @param {integer} index Index of selected subtask
 * @param {integer} id Id of selected task
 */
function cancelSubEdit(index, id) {
    task = tasklist.filter(t => t['id'] == id);
    let subtask = task[0]['subtasks']['tasks'][index];
    document.getElementById(`subtask${index}`).innerHTML = `
    <div><p>${subtask['task']}</p></div>
    <div>
        <button onclick="deleteSubtask(${index}, ${id})">Delete</button>
        <button onclick="editSubtask(${index}, ${id})">Edit</button>
    </div>
    `
}

/**
 * Changes the completed status of selected subtask
 * @param {integer} task Index of selected subtask
 * @param {integer} id Id of selected task
 */
async function taskStatusChange(task, id) {
    if (tasklist[id]['subtasks']['tasks'][task]['completed'] == true) {
        tasklist[id]['subtasks']['tasks'][task]['completed'] = false;
    } else {
        tasklist[id]['subtasks']['tasks'][task]['completed'] = true;
    }
    await saveBoard();
    renderSubTasks(id);
    setTimeout(await initBoard, 50);
}

/**
 * Changes priority to selected priority
 * @param {string} prio Name of selectet priority
 */
function selectPrio(prio) {
    if (prio == 'urgent') {
        setPrioUrgent();
    }
    if (prio == 'medium') {
        setPrioMedium();
    }
    if (prio == 'low') {
        setPrioLow();
    }
    selectedPrio = prio;
}

/**
 * Renders the assigned persons of the task
 * @param {integer} id Id of selected task
 */
function loadAssignetPersons(id) {
    document.getElementById('assignedpersons').innerHTML = ``;
    for (let i = 0; i < assignetContactsTemp.length; i++) {
        let assignetperson = assignetContactsTemp[i];
        document.getElementById('assignedpersons').innerHTML += `<div class="name" style="background-color: ${assignetperson['iconcolor']}">${assignetperson['icon']}</div>`
    }
}

/**
 * Renders the open dropdown-menu for assigning contacts
 * @param {integer} id Id of selected task
 */
function openDropdownAssignTo(id) {
    task = tasklist.filter(t => t['id'] == id);
    document.getElementById('assign-container').innerHTML = templateOfOpenDropdownAssignTo(id)
    openDropdownAssignToLoop1(id,);
    openDropdownAssignToLoop2(id);
    document.getElementById('assign-container').innerHTML += templateInviteContact(id);
}

function openDropdownAssignToLoop1(id) {
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        if (checkOnAssignedContacts(contact) != false) {
            document.getElementById('assign-container').innerHTML += templateAssignedContact(i, contact['name'], contact['icon'], contact['iconcolor'], id);
        } else {
            document.getElementById('assign-container').innerHTML += templateNotAssignedContact(i, contact['name'], contact['icon'], contact['iconcolor'], id);
        }
    }
}

function openDropdownAssignToLoop2(id) {
    for (let j = 0; j < assignetContacts.length; j++) {
        let contact = assignetContacts[j];
        if (checkOnContact(contact) == false) {
            let index = j + contacts.length
            document.getElementById('assign-container').innerHTML += templateAssignedContact(index, contact['name'], contact['icon'], contact['iconcolor'], id);
        }
    }
}

/**
 * Changes the assign-status of selected contact
 * @param {string} name Name of selectet contact
 * @param {string} icon Icon of selected contact
 * @param {string} color Iconcolor of selected contact
 * @param {integer} id Id of selected task
 */
function assignChange(name, icon, color, id) {
    let contact = { 'name': name, 'icon': icon, 'iconcolor': color }
    let index = indexOfAssigned(contact);
    if (checkOnAssignedContacts(contact['icon']) == true) {
        assignetContactsTemp.splice(index, 1);
    } else {
        assignetContactsTemp.push({ 'name': name, 'icon': icon, 'iconcolor': color });
    }
    loadAssignetPersons(id);
}

/**
 * Creates new contact based on the email
 * @param {integer} id Id of selected task
 */
function addNewContact(id) {
    let email = document.getElementById('email').value;
    let icon = email.slice(0, 2);
    let color = getRandomColor();
    if (email.includes('@')) {
        let tempName = email.split('@');
        let name = tempName[0];
        assignetContactsTemp.push({ 'name': name, 'icon': icon, 'iconcolor': color, });
    } else {
        let name = email;
        assignetContactsTemp.push({ 'name': name, 'icon': icon, 'iconcolor': color, });
    }
    document.getElementById('assign-container').innerHTML = templateOfClosedDropdownAssignTo(id)
    loadAssignetPersons(id);
}

/**
 * Creates a random colorcode
 * @returns Random generated color
 */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Checks array for containing a spesific contact
 * @param {string} contact Name of contact
 * @returns status of containing the contact
 */
function checkOnContact(contact) {
    for (let i = 0; i < contacts.length; i++) {
        let name = contacts[i]['name'];
        if (name == contact) {
            return true;
        }
    }
    return false;
}

/**
 * Checks array for containing a spesific contact
 * @param {string} contact Name of contact
 * @returns status of containing the contact
 */
function checkOnAssignedContacts(contact) {
    for (let i = 0; i < assignetContactsTemp.length; i++) {
        let check = assignetContactsTemp[i]['icon'];
        if (check == contact) {
            return true;
        }
    }
    return false;
}

/**
 * Checks position in array of a spesific contact
 * @param {string} icon Icon of contact
 * @returns position in array of contact
 */
function indexOfAssigned(icon) {
    for (let i = 0; i < assignetContactsTemp.length; i++) {
        let name = assignetContactsTemp[i]['icon'];
        if (name == icon) {
            return i;
        }
    }
}

/**
 * Saves changes of selected task
 * @param {integer} id Id of selected task 
 */
async function editTask(id) {
    let newTitle = document.getElementById('titleinput').value;
    let newDescription = document.getElementById('descriptioninput').value;
    let newDuedate = transformDuedate();
    await editTaskLoop(newTitle,newDescription,newDuedate,id);
    tasklist[id]['priority'] = selectedPrio;
    await saveBoard();
    setTimeout(await initBoard, 100);
    closeBoardPopup();
}

async function editTaskLoop(newTitle,newDescription,newDuedate,id) {
    if (newTitle.length > 2) {
        tasklist[id]['title'] = newTitle;
    }
    if (newDescription.length > 2) {
        tasklist[id]['description'] = newDescription;
    }
    tasklist[id]['assignedTo']['user'] = assignetContacts;
    if (Number.isInteger(newDuedate)) {
        tasklist[id]['duedate'] = newDuedate;
    }
}

async function deleteTask(id) {
    tasklist.splice(id);
    await saveBoard();
    setTimeout(await initBoard, 1000);
    closeBoardPopup();
}