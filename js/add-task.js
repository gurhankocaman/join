let tasks = [];
let categories = [];
let subtasks = [];
var subtaskValues = [];
// Load Tasks
async function loadTasks() {
    tasks = JSON.parse(await getItem('tasks')) || [];
}

async function loadCategories() {
    categories = JSON.parse(await getItem('categories')) || [];
}

async function loadContacts() {
    contacts = JSON.parse(await getItem('contacts')) || [];
}

async function loadSubtasks() {
    subtasks = JSON.parse(await getItem('subtasks')) || [];
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

    subtasksToArray()
    

    tasks.push({ "id" : tasks.length, "status" : "to-do", "title" : title.value, "description" : description.value, "category" : categoryValue, "assignedTo" : contactValue, "date" : date.value, "priority" : checkedValue, "subtask" : subtaskValues});

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

function subtasksToArray(){
    var subtasks = document.querySelectorAll("#subtaskList input[type='checkbox']:checked");
    subtasks.forEach(function(input) {
      subtaskValues.push(input.name);
    });
}

function resetCategoryOptions() {
    var categoryOptions = document.getElementById("chooseCategory");
    categoryOptions.selectedIndex = 0;
 }

function resetContactOptions() {
    var contactOptions = document.getElementById("chooseContact");
    contactOptions.selectedIndex = 0;
}




async function setContactOptions(){
    await loadContacts();
    let contactSelectBox = document.getElementById('chooseContact');
    for (let i = 0; i < contacts.length; i++) {
        contactSelectBox.innerHTML += `<option value="${contacts[i]['firstName'] + ' ' + contacts[i]['lastName']}">${contacts[i]['firstName'] + ' ' + contacts[i]['lastName']}</option>`; 
    }
}


function addCategory() {
    var selectElement = document.getElementById("chooseCategory");
    var selectedValue = selectElement.value;
    
    if (selectedValue === "NewCategory") {
        selectToInput();
    }
  }

function selectToInput(){
    let selectToInput = document.getElementById('selectToInput');
    selectToInput.innerHTML = `
    <div id="subtaskField">
        <div>
            <input id="newCategoryInput" type="text" placeholder="New Category">
            <img onclick="addNewCategory()" src="../assets/img/plus.png">
        </div>                  
    </div>`
    var element = document.getElementById("categoryColors");
    element.classList.remove("d-none");
}

async function addNewCategory(){
    var category = document.getElementById('newCategoryInput');
    
    categories.push({"category" : category.value});
    await setItem('categories', JSON.stringify(categories));
    resetSelect();
}

async function addNewSubtask(){
    var subtask = document.getElementById('subtaskInput');
    
    subtasks.push({"subtask" : subtask.value});
    await setItem('subtasks', JSON.stringify(subtasks));
    subtask.value = ''
    renderSubtasks();
}

async function renderSubtasks(){
    await loadSubtasks();
    let subtaskList = document.getElementById('subtaskList');
    for (let i = 0; i < subtasks.length; i++) {
        subtaskList.innerHTML += `<li><input type="checkbox" name="${subtasks[i]['subtask']}">${subtasks[i]['subtask']}</li>`
    }
}

function resetSelect(){
    let selectToInput = document.getElementById('selectToInput');
    selectToInput.innerHTML = `
    <select name="" id="chooseCategory" class="chooseContact" onchange="addCategory()">
        <option selected disabled>Choose Category</option>
        <option value="NewCategory">New Category</option>
    </select>`;
    var element = document.getElementById("categoryColors");
    element.classList.add("d-none");
    setCategoryOptions();
}

async function setCategoryOptions(){
    await loadCategories();
    let categorySelectBox = document.getElementById('chooseCategory');
    for (let i = 0; i < categories.length; i++) {
        categorySelectBox.innerHTML += `<option value="${categories[i]['category']}">${categories[i]['category']}</option>`
    }
}