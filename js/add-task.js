let tasks = [];

// Load Tasks
async function loadTasks() {
    tasks = JSON.parse(await getItem('tasks')) || [];
    console.log(tasks);
}

// Create Task
async function createTask() {

    addTaskBTN.disabled = true;

    var title = document.getElementById('titleField');
    var description = document.getElementById('descriptionField');
    var category = document.getElementById('chooseCategory');
    var categoryValue = category.options[category.selectedIndex].value;
    var contact = document.getElementById('chooseContact');
    var contactValue = contact.options[contact.selectedIndex].value;
    var date = document.getElementById('dueDateField');
    var checkedValue = document.querySelector('.button1:checked').value;
    var subtask = document.getElementById('subtaskInput');

    tasks.push({ "title" : title.value, "description" : description.value, "category" : categoryValue, "assignedTo" : contactValue, "date" : date.value, "priority" : checkedValue, "subtask" : subtask.value});

    await setItem('tasks', JSON.stringify(tasks));
    title.value = '';
    description.value = '';
    resetCategoryOptions();
    resetContactOptions();
    let inputs = document.getElementById('prio-button');
    inputs.checked = false;
    date.value = '';
    subtask.value = '';
}

function resetCategoryOptions() {
    var categoryOptions = document.getElementById("chooseCategory");
    categoryOptions.selectedIndex = 0;
 }

function resetContactOptions() {
    var contactOptions = document.getElementById("chooseContact");
    contactOptions.selectedIndex = 0;
}

async function loadContacts() {
   contacts = JSON.parse(await getItem('contacts'));
}


async function setContactOptions(){
    await loadContacts();
    let contactSelectBox = document.getElementById('chooseContact');
    for (let i = 0; i < contacts.length; i++) {
        contactSelectBox.innerHTML += `<option value="${contacts[i]['firstName'] + contacts[i]['lastName']}">${contacts[i]['firstName'] + contacts[i]['lastName']}</option>`; 
    }
}

function addCategory(){
    let field = document.getElementById('categoryToInput');
    field.innerHTML = ''
}