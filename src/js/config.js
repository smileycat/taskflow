'use strict';

class Config {
    static loadTasks(content) {
        const { name, icon, itemList, active } = content;
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

    static loadDivider() {
        taskList.push({ "name": "divider" });
        const element = '<div class="divider"></div>';
        document.getElementById('side-panel').insertAdjacentHTML('beforeend', element);
    }

    static loadConfig() {
        let userConfig = JSON.parse(localStorage.getItem('userConfig'));
        userConfig = (userConfig == null) ? defaultConfig : userConfig;

        for (const conf of userConfig) {
            if (conf.name == "divider") {
                this.loadDivider();
            } else {
                this.loadTasks(conf);
            }
        }
    }

    static updateConfig() {
        localStorage.setItem('userConfig', JSON.stringify(taskList));
    }
}