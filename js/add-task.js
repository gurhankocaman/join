let tasks = [];

// Create Task
async function createTask() {

    addTaskBTN.disabled = true;

    let title = document.getElementById('titleField');
    let description = document.getElementById('descriptionField');

    var category = document.getElementById('chooseCategory');
    var categoryValue = category.options[category.selectedIndex].value;

    var contact = document.getElementById('chooseContact');
    var contactValue = contact.options[contact.selectedIndex].value;

    var date = document.getElementById('dueDateField');

    var checkedValue = document.querySelector('.messageCheckbox:checked').value;
    console.log(checkedValue);

    tasks.push({ "title" : title.value, "description" : description.value, "Category" : categoryValue, "AssignedTo" : contactValue, "Date" : date.value});

    await setItem('tasks', JSON.stringify(tasks));
    title.value = '';
    description.value = '';
}
