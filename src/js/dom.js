function draggables(id, element) {
    document.getElementById(id).draggable = true;
}

function undraggable(id, element) {
    document.getElementById(id).draggable = false;
}

function showHideSideNav() {
    if (sideNav.className.includes('active')) {
        sideNav.setAttribute('data-show', 'off');
        sideNav.className = sideNav.className.replace(' active', '');
    } else {
        sideNav.setAttribute('data-show', 'on');
        sideNav.className += ' active';
    }
}

function switchTask(taskName) {
    // Remove .active class on previous tab
    let prevTab = document.getElementById(Task.getCurrentTask().getName());
    prevTab.className = prevTab.className.replace(' active', '');
    
    // Add .active class to the current tab
    console.log(taskName);
    document.getElementById(taskName).className += ' active';
    
    // Change the display contents according to current tab
    taskContainer.innerHTML = '';
    Task.setCurrentTask(taskName);

    // Change title
    document.getElementById('task-title').value = taskName;
    // Close the side bar if it's active in small screen
    sideNav.className = sideNav.className.replace(' active', '');
    updateConfig();
}

function updateTaskNameDOM(element) {
    // Update task name
    const newName = element.value;
    const oldName = Task.getCurrentTask().getName();
    Task.getCurrentTask().setName(newName);
    // Update tab's name to the new name.
    document.getElementById(oldName).querySelector('span').innerText = newName;
    document.getElementById(oldName).onclick = () => switchTask(newName);
    document.getElementById(oldName).id = newName;
    updateConfig();
}

function appendItemDOM(item) {
    const {id, text} = item;
    const itemTag = `<li id="${id}" class="list-item">
                        <button class="btn-none mr-2" onclick="completeItemDOM(${id})">&#9675;</button>
                        <input type="text" class="item-input" value="${text}" onchange="updateItemDOM(${id}, this)" />
                        <div class="append">
                            <i class="fas fa-trash" onclick="removeItemDOM(${id});"></i>
                            <i class="ml-2 fas fa-bars" onmousedown="draggables(${id}, this);" onmouseleave="undraggable(${id}, this);"></i>
                        </div>
                    </li>`;

    taskContainer.insertAdjacentHTML('beforeend', itemTag);
}

function updateItemDOM(id, inputBox) {
    Task.getCurrentTask().updateItem(id, inputBox.value);
    updateConfig();
    if (inputBox.value.trim() == '')
        removeItemDOM(id);
}

function removeItemDOM(id) {
    Task.getCurrentTask().removeItem(id);
    updateConfig()
    // Animation for removing
    document.getElementById(id).className = "list-item animated fadeOutLeft faster";
    setTimeout(() => {
        document.getElementById(id).remove()
    }, 400);
}

function completeItemDOM(id) {
    // Move item from current task to completed task
    const item = Task.getCurrentTask().getItem(id).clone();
    Task.getCurrentTask().removeItem(id);
    Task.getTask('Completed').addItem(item);
    updateConfig();
    
    // Animation for the completion
    document.getElementById(id).className = "list-item animated fadeOutUp faster";
    document.getElementById('Completed').className += " animated pulse faster";
    setTimeout(() => {
        document.getElementById(id).remove();
        document.getElementById('Completed').className = document.getElementById('Completed').className.replace(' animated pulse faster', '');
    }, 500);
}

loadConfig();