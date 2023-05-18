let category = [];
let categoryColor = [];
let description = [];
let title = [];
let assignedPeople = [];
let contactList = [];
let duedate = [];
let newSelectedPrio = [];
let subtasks = [];
let tempTasklist = [];
let taskId = [];
let categorys = [];
let tempCategorys = [];
let categoryColors = ['#FC71FF', '#1FD7C1', '#8AA4FF', '#FF0000', '#2AD300', '#FF8A00', '#E200BE', '#0038FF'];


/**
 * Initilasing the add Task Popup-menu
 */
async function initAddTaskPopup() {
    await loadTasklistForId();
    await loadContacts();
    await loadCategorys();
    getMinDate();
}

/**
 * Gets "tasklist" from the server
 */
async function loadTasklistForId() {
    setURL("https://maximilian-leyh.developerakademie.net/smallest_backend_ever");
    await downloadFromServer();
    tempTasklist = JSON.parse(backend.getItem("tasklist")) || [];
}

/**
 * Gets "contacts" from the server
 */
async function loadContacts() {
    setURL("https://maximilian-leyh.developerakademie.net/smallest_backend_ever");
    await downloadFromServer();
    contactList = JSON.parse(backend.getItem("contacts")) || [];
}

/**
 * Gets "categorys" from the server
 */
async function loadCategorys() {
    setURL("https://maximilian-leyh.developerakademie.net/smallest_backend_ever");
    await downloadFromServer();
    categorys = JSON.parse(backend.getItem("categorys")) || [{ 'name': 'General Topics', 'color': '#FC71FF' }];
    tempCategorys = JSON.parse(backend.getItem("categorys")) || [{ 'name': 'General Topics', 'color': '#FC71FF' }];
}

/**
 * sets "taskid" as running number
 */
function getIdFromTasklist() {
    taskId = tempTasklist.length;
}

function getMinDate() {
    document.getElementById('duedate').min = new Date().toISOString().split("T")[0];
}

/**
 * fills "category_selection" with an open category-dropdown
 */
function openCategorySelection() {
    document.getElementById('category_selection').innerHTML = templateOpenCategorySelection();
    for (let i = 0; i < tempCategorys.length; i++) {
        let categorySelect = tempCategorys[i];
        document.getElementById('category_selection').innerHTML += templateCategoryOption(i, categorySelect['name'], categorySelect['color']);
    }
}

/**
 * loads the create-input of a new category with the color-selection
 */
function createNewCategory() {
    document.getElementById('category_selection').innerHTML = templateCreateNewCategoryInput();
    for (let i = 0; i < categoryColors.length; i++) {
        let color = categoryColors[i];
        document.getElementById('category_colors').innerHTML += `
        <span class="all-colors" style="background-color: ${color}" 
        id="selected-color-${i}" onclick="newCategoryColor('${color}', ${i})"></span>`;
    }
}

/**
 * selects category color
 * 
 * @param {string} color selected color
 * @param {integer} i index of selected color
 */
function newCategoryColor(color, i) {
    categoryColor = color
    for (let j = 0; j < categoryColors.length; j++) {
        document.getElementById(`selected-color-${j}`).classList.remove('selectedColor');
    }
    document.getElementById(`selected-color-${i}`).classList.add('selectedColor');
    document.getElementById('selected-color').style.backgroundColor = color;
}

/**
 * A new category gets created and pushed in the tempCategorys array
 */
function addNewCategory() {
    newCategoryName = document.getElementById('new-category-name').value;
    if (categoryColor.length == 7 && newCategoryName) {
        category = ({
            'name': newCategoryName,
            'color': categoryColor
        });
        tempCategorys.push(category)
        document.getElementById('category_selection').innerHTML = templateNewCategory(category['name'], category['color'])
        document.getElementById('category_colors').innerHTML = ``;
    } else if (newCategoryName) {
        document.getElementById('mistake-category-fields').innerHTML = 'Please select the color for the new category.';
        setTimeout(removeAlert, 5000);
    } else {
        document.getElementById('mistake-category-fields').innerHTML = 'Please enter a new category name.';
        setTimeout(removeAlert, 5000);
    }
}

function removeAlert() {
    document.getElementById('mistake-category-fields').innerHTML = ``;
}

/**
 * closes the popup and clears the arrays
 */
function closePopup() {
    category = [];
    categoryColor = [];
    description = [];
    title = [];
    assignedPeople = [];
    duedate = [];
    newSelectedPrio = [];
    subtasks = [];
    closeBoardPopup();
}

/**
 * Opens the assign to Dropdown
 */
function openAssignToSelection() {
    document.getElementById('assign-container').innerHTML = templateOpenAssignToSelection();
    for (let i = 0; i < contactList.length; i++) {
        let contact = contactList[i];
        if (checkOnAssigned(contact['icon']) == true) {
            document.getElementById('assign-container').innerHTML += templateAssignedContactSelection(i, contact['name'], contact['icon'], contact['iconcolor']);
        } else {
            document.getElementById('assign-container').innerHTML += templateNotAssignedContactSelection(i, contact['name'], contact['icon'], contact['iconcolor']);
        }
    }
    for (let j = 0; j < assignedPeople.length; j++) {
        let contact = assignedPeople[j];
        if (checkOnContacts(contact['icon']) == false) {
            let index = j + contacts.length
            document.getElementById('assign-container').innerHTML += templateAssignedContactSelection(index, contact['name'], contact['icon'], contact['iconcolor']);
        }
    }
    document.getElementById('assign-container').innerHTML += templateInvitePerson();
}

/**
 * Checks if contact is assigned
 * @param {array} contact Informations of the contact
 * @returns If contact is assigned
 */
function checkOnAssignedpeople(contact) {
    for (let i = 0; i < assignedPeople.length; i++) {
        let name = assignedPeople[i]['name'];
        if (name == contact['name']) {
            return true;
        }
    }
    return false;
}

/**
 * Adds new person to assignedPersons
 */
function addNewPerson() {
    let email = document.getElementById('email').value;
    let icon = email.slice(0, 2);
    let color = getRandomColor();
    if (email.includes('@')) {
        newPersonIsEmail(email, icon, color);
    } else {
        newPersonIsName(email, icon, color);
    }
    document.getElementById('assign-container').innerHTML = templateOfClosedDropdownAssignToSelection();
    loadAssignedPeople();
}

function newPersonIsEmail(email, icon, color) {
    let tempName = email.split('@');
    let name = tempName[0];
    assignedPeople.push({ 'name': name, 'icon': icon, 'iconcolor': color, });
}

function newPersonIsName(email, icon, color) {
    let name = email;
    assignedPeople.push({ 'name': name, 'icon': icon, 'iconcolor': color, });
}

/**
 * Renders the assigned people
 */
function loadAssignedPeople() {
    document.getElementById('assignedpersons').innerHTML = ``;
    for (let i = 0; i < assignedPeople.length; i++) {
        let assigned = assignedPeople[i];
        document.getElementById('assignedpersons').innerHTML += `<div class="name" style="background-color: ${assigned['iconcolor']}">${assigned['icon']}</div>`
    }
}

/**
 * Assignes a contact to task
 * @param {string} name Name of contact
 * @param {string} icon Icon of contact
 * @param {string} color Colorcode of contact
 */
function assignContact(name, icon, color) {
    let contact = { 'name': name, 'icon': icon, 'iconcolor': color }
    let index = indexOfAssign(contact);
    if (checkOnAssigned(contact['icon']) == true) {
        assignedPeople.splice(index, 1);
    } else {
        assignedPeople.push({ 'name': name, 'icon': icon, 'iconcolor': color });
    }
    loadAssignedPeople();
}

function indexOfAssign(contact) {
    for (let i = 0; i < assignedPeople.length; i++) {
        let name = assignedPeople[i]['name'];
        if (name == contact['name']) {
            return i;
        }
    }
}

function checkOnAssigned(contact) {
    for (let i = 0; i < assignedPeople.length; i++) {
        let name = assignedPeople[i]['icon'];
        if (name == contact) {
            return true;
        }
    }
    return false;
}

function checkOnContacts(contact) {
    for (let i = 0; i < contactList.length; i++) {
        let name = contactList[i]['icon'];
        if (name == contact) {
            return true;
        }
    }
    return false;
}

/**
 * Changes priority to selected priority
 * @param {string} prio Name of selectet priority
 */
function selectPriority(prio) {
    if (prio == 'urgent') {
        setPrioUrgent();
    }
    if (prio == 'medium') {
        setPrioMedium();
    }
    if (prio == 'low') {
        setPrioLow();
    }
    newSelectedPrio = prio;
}

/**
 * Changes priority to urgent
 */
function setPrioUrgent() {
    document.getElementById('urgent').classList.add('urgent');
    document.getElementById('medium').classList.remove('medium');
    document.getElementById('low').classList.remove('low');
}

/**
 * Changes priority to medium
 */
function setPrioMedium() {
    document.getElementById('urgent').classList.remove('urgent');
    document.getElementById('medium').classList.add('medium');
    document.getElementById('low').classList.remove('low');
}

/**
 * Changes priority to low
 */
function setPrioLow() {
    document.getElementById('urgent').classList.remove('urgent');
    document.getElementById('medium').classList.remove('medium');
    document.getElementById('low').classList.add('low');
}

/**
 * Emptys the subtask input
 */
function clearSubtaskInput() {
    document.getElementById('input-subtask').value = ``;
}

/**
 * Checks if the subtask inputlength is long enough
 */
function checkSubtaskInput() {
    let inputSubtask = document.getElementById('input-subtask');
    if (inputSubtask.value.length > 3) {
        addSubtask(inputSubtask.value);
        document.getElementById('input-subtask').value = '';
    }
}

/**
 * Creates new subtask
 * @param {string} inputSubtask Text from inputfield
 */
function addSubtask(inputSubtask) {
    subtasks.push({ 'task': inputSubtask, 'completed': false });
    renderSubtasks();
}

/**
 * Renders the created subtasks
 */
function renderSubtasks() {
    let subtaskList = document.getElementById('subtasks');
    subtaskList.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        let taskElement = subtasks[i];
        if (subtasks[i]['completed'] == false) {
            subtaskList.innerHTML += templateSubtasks(taskElement, i);
        }
        else {
            subtaskList.innerHTML += templateSubtasksCompleted(taskElement, i);
        }
    }
}

/**
 * Changes the completed status of a subtask
 * @param {integer} i Index of selected subtask
 */
function changeCompleteStatus(i) {
    if (subtasks[i]['completed']) {
        subtasks[i]['completed'] = false;
    }
    else {
        subtasks[i]['completed'] = true;
    }
}

