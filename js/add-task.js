let tasks = [];

// Create Task
async function createTask() {

    addTaskBTN.disabled = true;

    let title = document.getElementById('titleField');
    let description = document.getElementById('descriptionField');
    

    tasks.push({ "title" : title.value, "description" : description.value});

    await setItem('tasks', JSON.stringify(tasks));
    title.value = '';
    description.value = '';
}
