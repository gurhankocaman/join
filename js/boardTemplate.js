function toDoTemplate(id, color, category, title, description, subtasks, completedtasks, assignedIconToThree, priority, next, previus) {
    let width = completedtasks / subtasks * 100
    return `
    <div class="todo" draggable=true ondragstart="startDragging(${id})" onclick="openTask(${id})">
        <div class="category" style="background-color: ${color}">${category}</div>
        <div class="title">${title}</div>
        <div class="description">${description.slice(0, 50)}</div>
        <div class="subtaskbar">
            <div class="progress">
                <div class="progress-bar" style="width: ${width}%">
                </div>
            </div>${completedtasks}/${subtasks} Done
        </div>
        <div class="todofooter">
            <div class="assigned">${assignedIconToThree}
            </div>
            <img src="assets/img/${priority}.png" alt="${priority}">
        </div>
    </div>
        <div class="mobile-buttons">
            <button class="up" onclick="moveTask(${id}, '${previus}')">previous</button>
            <button class="down" onclick="moveTask(${id}, '${next}')">next</button>
        </div>`
}

function addDragarea(id) {
    return `
    <div id="${id}" class="dragarea" ondrop="drop('${id}')" ondragover="allowDrop(event); highlight('${id}')" ondragleave="removeHighlight('${id}')"></div>
    `
}

function noAssignedPersonsTemplate() {
    return `<div class="number">N/A</div>`;
}

function oneAssignedPersonsTemplate(assignedTo) {
    return `<div class="name" style="background-color: ${assignedTo[0]['iconcolor']}">${assignedTo[0]['icon']}</div>`;
}

function twoAssignedPersonsTemplate(assignedTo) {
    return `<div class="name" style="background-color: ${assignedTo[0]['iconcolor']}">${assignedTo[0]['icon']}</div><div class="name" style="background-color: ${assignedTo[1]['iconcolor']}">${assignedTo[1]['icon']}</div>`;
}

function threeAssignedPersonsTemplate(assignedTo) {
    return `<div class="name" style="background-color: ${assignedTo[0]['iconcolor']}">${assignedTo[0]['icon']}</div><div class="name" style="background-color: ${assignedTo[1]['iconcolor']}">${assignedTo[1]['icon']}</div><div class="name" style="background-color: ${assignedTo[2]['iconcolor']}">${assignedTo[2]['icon']}</div>`;
}

function moreAssignedPersonsTemplate(assignedTo) {
    let number = assignedTo.length - 2
    return `<div class="name" style="background-color: ${assignedTo[0]['iconcolor']}">${assignedTo[0]['icon']}</div><div class="name" style="background-color: ${assignedTo[1]['iconcolor']}">${assignedTo[1]['icon']}</div><div class="number">+${number}</div>`;
}