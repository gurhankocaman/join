let tasks = [];

async function initTasks() {
    loadTasks();
}

async function loadTasks() {
    tasks = await getItem('tasks');
}

// Create Task
async function createTask() {

    addTaskBTN.disabled = true;

    let title = document.getElementById('titleField');
    let description = document.getElementById('descriptionField');
    let category = document.getElementById('chooseCategory');
    let contact = document.getElementById('chooseContact');
    let date = document.getElementById('dueDateField');
    let priority = document.getElementById('?????');
    let subtask = document.getElementById('??????');

    tasks.push({ "title" : title.value, "description" : description.value, "category" : category.value, "contact" : contact.value, "date" : date.value, "priority" : priority.value, "subtask" : subtask.value});

    await setItem('tasks', JSON.stringify(tasks));
    
    resetTaskForm();
}

function resetTaskForm() {
    title.value = '';
    description.value = '';
    category.value = '';
    contact.value = '';
    date.value = '';
    priority.value = '';
    subtask.value = '';
    
    addTaskBTN.disabled = false;
}