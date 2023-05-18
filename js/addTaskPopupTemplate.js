/**
 * creates a category option
 * 
 * @param {integer} i index of the option
 * @param {string} name name of the option
 * @param {string} color affiliated color of the option
 * @returns template
 */
function templateCategoryOption(i, name, color) {
    return `
        <div class="category_option" onclick="selectCategory(${i})">
        <span>${name}<span class="all-colors" style="background-color: ${color}"></span></span>
        </div>`
}

/**
 * template for open category dropdown
 * 
 * @returns template
 */
function templateOpenCategorySelection() {
    return `
    <div class="selection" onclick="closeCategorySelection()">
        <span>Select task category</span>
        <img class="dropdown-img" src="./assets/img/vector-2.png" alt="klick">
    </div>
    <div class="category_option" onclick="createNewCategory()">
        <span>New category</span>
    </div>`
}

/**
 * closes dropdown of the category selection
 */
function closeCategorySelection() {
    document.getElementById('category_selection').innerHTML = `
    <div class="selection" onclick="openCategorySelection()">
        <span>Select task category</span>
        <img class="dropdown-img" src="./assets/img/vector-2.png" alt="klick">
    </div>`
}

/**
 * template of the category inputfield
 * 
 * @returns template
 */
function templateCreateNewCategoryInput() {
    return `
    <div class="category-input">
    <input class="input-category" type="text" placeholder="New Category Name" min="3" maxlength="32" required id="new-category-name">
    <span class="all-colors" id="selected-color"></span>
    <div class="category-icons">
        <img src="./assets/img/false-x.png" class="false-x" onclick="removeCategoryInput()"> | 
        <img src="./assets/img/checkmark.png" class="checkmark" onclick="addNewCategory()">
    </div></div>`
}

function selectCategory(index) {
    category = tempCategorys[index];
    document.getElementById('category_selection').innerHTML = `
    <span class="selectet_category" onclick="openCategorySelection()">${category['name']}
    <span class="all-colors" id="selected-color" style="background-color: ${category['color']}"></span></span>`
}

function templateNewCategory(name, color) {
    return `
        <span class="selectet_category" onclick="openCategorySelection()">${name}
        <span class="all-colors" id="selected-color" style="background-color: ${color}"></span></span>`;
}

function templateOpenAssignToSelection() {
    return `
    <div class="selection" onclick="closeAssignToSelection()">
        <span class="flex">Select contacts to assign</span>
        <img src="./assets/img/vector-2.png" alt="klick">
    </div>`
}

function templateAssignedContactSelection(i, name, icon, iconcolor) {
    return `
        <div class="contact_selection">
            <label for="contact${i}">${name}</label>
            <input type="checkbox" id="contact${i}" onchange="assignContact('${name}', '${icon}', '${iconcolor}')" checked>
        </div>`;
}

function templateNotAssignedContactSelection(i, name, icon, iconcolor) {
    return `
        <div class="contact_selection">
            <label for="contact${i}">${name}</label>
            <input type="checkbox" id="contact${i}" onchange="assignContact('${name}', '${icon}', '${iconcolor}')">
        </div>`;
}

function templateInvitePerson() {
    return `
    <div class="contact_selection" onclick="assignNewPerson()">
        <span>Invite new contact</span>
        <img src="./assets/img/invite-contact.png">
    </div>
    `;
}

function assignNewPerson() {
    document.getElementById('assign-container').innerHTML = `
    <div class="newcontact">
        <input type="email" placeholder="Contact email" id="email">
        <div class="check">
            <img src="./assets/img/false-x.png" onclick="exitNewPerson()">
            |
            <img src="./assets/img/checkmark.png" onclick="addNewPerson()">
        </div>
    </div>
    `
}

function exitNewPerson() {
    document.getElementById('assign-container').innerHTML = `
    <div class="selection" onclick="openAssignToSelection()">
        <span class="flex">Select contacts to assign</span>
        <img src="./assets/img/vector-2.png" alt="klick">
    </div>
    `;
}

function templateOfClosedDropdownAssignToSelection() {
    return `
    <div class="selection" onclick="openAssignToSelection()">
        <span class="flex">Select contacts to assign</span>
        <img src="./assets/img/vector-2.png" alt="klick">
    </div>`;
}

function closeAssignToSelection() {
    document.getElementById('assign-container').innerHTML = `
    <div class="selection" onclick="openAssignToSelection()">
        <span class="flex">Select contacts to assign</span>
        <img src="./assets/img/vector-2.png" alt="klick">
    </div>`
}

function addInput() {
    document.getElementById('subtaskinput').innerHTML = `
    <input class="inputarea_subtask" type="text" minlength="2" maxlength="100" id="input-subtask">
    <div id="subtask-icons" class="subtask_icons">
        <img src="./assets/img/false-x.png" class="false-x" onclick="clearSubtaskInput()">
        |
        <img src="./assets/img/checkmark.png" class="checkmark" onclick="checkSubtaskInput()">
    </div>
    `;
}

function templateSubtasks(taskElement, i) {
    return `
        <div class="subtask_checkbox ">   
            <input type="checkbox" id="checkbox-${i}" class="input_subtask" onchange="changeCompleteStatus(${i})">
            <label for="checkbox-${i}" class="margin-checkbox">${taskElement['task']}</label>
        </div>
        `;
}

function templateSubtasksCompleted(taskElement, i) {
    return `
        <div class="subtask_checkbox flex-start">  
            <input type="checkbox" id="checkbox-${i}" class="input_subtask" onchange="changeCompleteStatus(${i})" checked>
            <label for="checkbox-${i}" class="margin-checkbox">${taskElement['task']}</label>
        </div>
        `;
}
