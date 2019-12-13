'use strict';

let idCounter = 0
let taskList = [];

const sideNav = document.getElementById('side-panel');
const taskContainer = document.getElementById('task-container');
const userInput = document.getElementById('inputBox');
const defaultConfig = [{"name":"Today","icon":"far fa-calendar","active":true,"itemList":[{"id":0,"text":"Brainstorm some concepts"},{"id":1,"text":"Design wireframe and mockup ✏️"},{"id":2,"text":"Bring umbrella home ⛱"},{"id":3,"text":"Buy some cabbages 🥬"},{"id":4,"text":"Pickup children from school 👨‍👧‍👦"}]},{"name":"This Week","icon":"far fa-calendar-alt","active":false,"itemList":[{"id":5,"text":"Hand in weekly report 📄"},{"id":6,"text":"Meeting with client 🤦"}]},{"name":"This Month","icon":"far fa-calendar-times","active":false,"itemList":[]},{"name":"divider"},{"name":"Reminders","icon":"far fa-bell","active":false,"itemList":[]},{"name":"divider"},{"name":"Completed","icon":"far fa-calendar-check","active":false,"itemList":[]}];

// Add new item into the current task and DOM.
userInput.onkeydown = (e) => {
    if (e.key == 'Enter') {
        e.preventDefault();
        if (userInput.value.trim() != '') {
            const newItem = Task.getCurrentTask().newItem(userInput.value.trim());
            appendItemDOM(newItem);
            updateConfig();
            userInput.value = '';
        }
    }
}


class Item {
    constructor(id, text) {
        this.id = id;
        this.text = text;
        // this.date for possible Date feature
    }

    setText(text) {
        this.text = text;
    }

    clone() {
        return new Item(this.id, this.text);
    }
}


class Task {
    constructor(name, icon, itemList, active) {
        this.name = name;
        this.icon = icon;
        this.active = active;
        this.itemList = [];
        for (const {text} of itemList) {
            this.newItem(text);
        }
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;    
    }

    newItem(text) {
        const newItem = new Item(idCounter, text);
        this.itemList.push(newItem);
        idCounter += 1;
        return newItem;
    }
    
    addItem(item) {
        this.itemList.push(item);
    }

    getItem(id) {
        return this.itemList.filter(item => item.id == id)[0];
    }
    
    updateItem(id, value) {
        this.itemList.forEach(item => {
            if (item.id == id)
                item.setText(value);
        })
    }

    removeItem(id) {
        this.itemList.forEach((item, index) => {
            if (item.id == id) {
                return this.itemList.splice(index, 1);
            }
        });
    }

    static setCurrentTask(taskName) {
        if (this.curTask)
            this.curTask.active = false;

        // Assign current tab task to this.curTask
        for (const task of taskList) {
            if (task.name == taskName) {
                task.active = true;
                this.curTask = task;
            }
        }
        
        // Add all items of this task to the dom.
        this.curTask.itemList.forEach(item =>
            appendItemDOM(item)
        );

        return this.curTask;
    }

    static getCurrentTask() {
        return this.curTask;
    }

    static getTask(taskName) {
        return taskList.filter(task => task.name == taskName)[0];
    }
}

function loadTasks(content) {
    const {name, icon, itemList, active} = content;
    let isActive = '';
    
    taskList.push(new Task(name, icon, itemList, active));

    if (active) {
        isActive = ' active';
        Task.setCurrentTask(name);
        document.getElementById('task-title').value = name;
    }

    const tabContent = 
        `<div id="${name}" class="tab${isActive}" onclick="switchTask(&quot;${name}&quot;)">
            <i class="${icon}"></i>
            <span class="ml-2">${name}</span>
        </div>`;
    
    document.getElementById('side-panel').insertAdjacentHTML('beforeend', tabContent);
}

function loadDivider() {
    taskList.push({"name":"divider"});
    const element = '<div class="divider"></div>';
    document.getElementById('side-panel').insertAdjacentHTML('beforeend', element);
}

function loadConfig() {
    let userConfig = JSON.parse(localStorage.getItem('userConfig'));
    userConfig = (userConfig == null)? defaultConfig : userConfig;

    for (const conf of userConfig) {
        if (conf.name == "divider") {
            loadDivider();
        } else {
            loadTasks(conf);
        }
    }
}

function updateConfig() {
    localStorage.setItem('userConfig', JSON.stringify(taskList));
}
