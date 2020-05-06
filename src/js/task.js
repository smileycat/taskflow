'use strict';

class Task {
    constructor(name, icon, itemList, active) {
        this.name = name;
        this.icon = icon;
        this.active = active;
        this.itemList = [];
        for (const { text } of itemList) {
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

    insertItem(text, index) {
        const newItem = new Item(idCounter, text);
        this.itemList.insert(text, index);
        idCounter += 1;
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