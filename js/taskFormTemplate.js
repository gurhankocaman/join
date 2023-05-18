function templateAssignedContact(i, name, icon, iconcolor, id) {
    return `
        <div class="contact">
            <label for="contact${i}">${name}</label>
            <input type="checkbox" id="contact${i}" onchange="assignChange('${name}', '${icon}', '${iconcolor}', ${id})" checked>
        </div>`;
}

function templateNotAssignedContact(i, name, icon, iconcolor, id) {
    return `
        <div class="contact">
            <label for="contact${i}">${name}</label>
            <input type="checkbox" id="contact${i}" onchange="assignChange('${name}', '${icon}', '${iconcolor}', ${id})">
        </div>`;
}

function templateOfOpenDropdownAssignTo(id) {
    return `
    <div onclick="closeDropdownAssignTo(${id})">
        <span class="flex">Select contacts to assign</span>
        <img src="./assets/img/vector-2.png" alt="klick">
    </div>`;
}

function templateInviteContact(id) {
    return `
    <div class="contact" onclick="assignNewContact(${id})">
        <span>Invite new contact</span>
        <img src="./assets/img/contact-icon.png">
    </div>
    `;
}

function templateEditabelSubtask(task, i, task_id) {
    return `
        <div class="subtask" id="subtask${i}">
            <div><p class="subtasktext">${task}</p></div>
            <div>
                <button onclick="deleteSubtask(${i}, ${task_id})">Delete</button>
                <button onclick="editSubtask(${i}, ${task_id})">Edit</button>
            </div>
        </div>
        `;
}

function templateEditabelSubtaskInput(task, index, task_id) {
    return `
    <textarea id="subedit${index}" cols="30" rows="10" minlength="2" maxlength="200">${task}</textarea>
    <div>
        <button onclick="saveSubEdit(${index}, ${task_id})">Save</button>
        <button onclick="cancelSubEdit(${index}, ${task_id})">Cancel</button>
    </div>
    `;
}

function editTaskTemplate(id) {
    return `
    <div class="background" onclick="closeBoardPopup()"></div>
    <div class="taskform edittaskform">
        <div style="height: fit-content; position: relative; width:100%;">
            <div class="edittitle">Title <input type="text" required placeholder="Enter a Title" id="titleinput"></div>
            <div class="editdescription">Description <textarea id="descriptioninput" placeholder="Enter a Description" required></textarea></div>
            <div class="duedate">Due Date <input type="date" id="duedate" placeholder="dd/mm/yyyy" required></div>
            <div class="prio">Prio 
                <div class="prioselect">
                    <div class="prio-urgent" id="urgent" onclick="selectPrio('urgent')">Urgent <img src="assets/img/urgent.svg"></div>
                    <div class="prio-medium" id="medium" onclick="selectPrio('medium')">Medium <img src="assets/img/medium.svg"></div>
                    <div class="prio-low" id="low" onclick="selectPrio('low')">Low <img src="assets/img/low.svg"></div>
                </div>
            </div>
            <div class="editsubtask">
                Subtasks
                <div class="subtaskedit">
                    <input class="input-subtask" type="text" min="2" max="200" required
                    placeholder="Add new subtask" id="newsubtask">
                    <img src="./assets/img/plus-subtask.png" alt="Add" onclick="addNewSubask(${id})">
                </div>
                <div id="subtasks"></div>
            </div>
            <div class="assignedto" id="assignedto">Assigned to 
            <div class="dropdown-assign" id="assign-container">
                <div onclick="openDropdownAssignTo(${id})">
                    <span class="flex">Select contacts to assign</span>
                    <img src="./assets/img/vector-2.png" alt="klick">
                </div>
            </div>
            <div class="assignedpersons" id="assignedpersons"></div>
            </div>
            <div class="editTask" onclick="editTask(${id})"><img src="./assets/img/check-button.png" alt="Ok"></div>
        </div>
        <div class="close" onclick="closeBoardPopup()">x</div>
        
    </div>
    `;
}

function taskformTemplate(category, color, title, description, duedate, priority, id) {
    return `
<div class="background" onclick="closeBoardPopup()">
</div>
    <div class="taskform">
        <div>
            <div class="category" style="background-color: ${color}">${category}</div>
            <h2>${title}</h2>
            <p>${description}</p>
            <div class="duedate"><b>Due date:</b> ${duedate}</div>
            <div class="priority"><b>Priority:</b><div class="prioicon ${priority}">${priority}<img src="assets/img/${priority}.svg"></div></div>
            <div class="subtasks"><b>Subtasks:</b></div>
            <div class="subtaskwindow" id="subtasks"></div>
            <div class="assignedto"><b>Assigned To:</b>
                <div id="assignedto"></div>
            </div>
        </div>
            <div class="close" onclick="closeBoardPopup()">x</div>
            <div>
            <img class="edit" onclick="renderEditTask(${id})" src="./assets/img/edit-button.png" alt="edit"></div>
            <div>
            <img class="deleteTask" onclick="deleteTask(${id})" src="./assets/img/delete.png" alt="delete">
            </div>
    </div>`;
}

function assignNewContact(id) {
    document.getElementById('assign-container').innerHTML = `
    <div class="newcontact">
        <input type="email" placeholder="Contact email" id="email">
        <div class="check">
            <img src="./assets/img/false-x.png" onclick="exitNewContact(${id})">
            |
            <img src="./assets/img/checkmark.png" onclick="addNewContact(${id})">
        </div>
    </div>
    `;
}

function exitNewContact(id) {
    document.getElementById('assign-container').innerHTML = `
    <div onclick="openDropdownAssignTo(${id})">
        <span class="flex">Select contacts to assign</span>
        <img src="./assets/img/vector-2.png" alt="klick">
    </div>
    `;
}

function templateOfClosedDropdownAssignTo(id) {
    return `
    <div onclick="openDropdownAssignTo(${id})">
        <span class="flex">Select contacts to assign</span>
        <img src="./assets/img/vector-2.png" alt="klick">
    </div>`;
}

function closeDropdownAssignTo(id) {
    document.getElementById('assign-container').innerHTML = `
    <div onclick="openDropdownAssignTo(${id})">
        <span class="flex">Select contacts to assign</span>
        <img src="./assets/img/vector-2.png" alt="klick">
    </div>`
}