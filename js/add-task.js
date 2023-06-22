let tasks = [];

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

    tasks.push({ "title" : title.value, "description" : description.value, "Category" : categoryValue, "AssignedTo" : contactValue, "Date" : date.value, "Priority" : checkedValue, "Subtask" : subtask.value});

    await setItem('tasks', JSON.stringify(tasks));
    title.value = '';
    description.value = '';
    
    date.value = '';

    subtask.value = '';
}
