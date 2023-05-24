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
    

    tasks.push({ "title" : title.value, "description" : description.value});

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