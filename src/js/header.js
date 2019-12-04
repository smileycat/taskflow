'use strict';

var counter = 0;
var items = {}, taskList = [];

const sideNav = document.getElementById('side-panel');
const container = document.getElementById('todo-content');
const userInput = document.getElementById('inputBox');
const defaultConfig = [{"name":"Today","icon":"far fa-calendar-times","active":true,"itemList":[{"id":0,"text":"Brainstorm some concepts"},{"id":1,"text":"Design wireframe and mockup ✏️"},{"id":2,"text":"Bring umbrella ⛱"}]},{"name":"This Week","icon":"far fa-calendar-alt","itemList":[{"id":3,"text":"Hand in weekly report 📄"}]},{"name":"divider"},{"name":"Reminders","icon":"far fa-bell","itemList":[{"id":4,"text":"Buy cabbages 🥬"}]},{"name":"divider"},{"name":"Completed","icon":"far fa-calendar-check","itemList":[{"id":5,"text":"Meeting with client 🤦"}]}];

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
        for (const {id, text} of itemList) {
            this.newItem(text);
        }
    }

    newItem(text) {
        const newItem = new Item(counter, text);
        this.itemList.push(newItem);
        counter += 1;
        return newItem;
    }
    
    addItem(item) {
        // this.itemList[item.id] = item;
        this.itemList.push(item);
    }

    getItem(id) {
        for (const item of this.itemList) {
            if (item.id == id)
                return item;
        }
    }
    
    updateItem(id, value) {
        for (const item of this.itemList) {
            if (item.id == id)
                item.setText(value);
        }
    }

    removeItem(id) {
        for (var i = 0; i < this.itemList.length; i++) {
            if (this.itemList[i].id == id) {
                return this.itemList.splice(i, 1);
            }
        }
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
        for (const item of this.curTask.itemList) {
            appendItemDOM(item);
        }
        return this.curTask;
    }

    static getCurrentTask() {
        return this.curTask;
    }

    static getTask(taskName) {
        for (const task of taskList) {
            if (task.name == taskName)
                return task;
        }
    }
}

function loadTasks(content) {
    const {name, icon, itemList, active} = content;
    let isActive = '';
    
    taskList.push(new Task(name, icon, itemList, active));

    if (active) {
        isActive = ' active';
        Task.setCurrentTask(name);
        document.getElementById('todo-title').innerText = name;
    }

    const tabContent = 
        '<div id="' + name + '" class="tab' + isActive + '" onclick="switchTask(&quot;' + name +'&quot;)">' +
            '<i class="' + icon + '"></i>' +
            '<span class="ml-2">' + name + '</span>' +
        '</div>';
    
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
    console.log(JSON.stringify(taskList));
    localStorage.setItem('userConfig', JSON.stringify(taskList));
}
