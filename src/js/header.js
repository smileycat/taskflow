'use strict';

let idCounter = 0;
let taskList = [];

const sideNav = document.getElementById('side-panel');
const taskContainer = document.getElementById('task-container');
const userInput = document.getElementById('inputBox');
const defaultConfig = [
  {
    name: 'Today',
    icon: 'far fa-calendar',
    active: true,
    itemList: [
      { id: 0, text: 'Brainstorm some concepts' },
      { id: 1, text: 'Design wireframe and mockup ✏️' },
      { id: 2, text: 'Bring umbrella home ⛱' },
      { id: 3, text: 'Buy some cabbages 🥬' },
      { id: 4, text: 'Pickup children from school 👨‍👧‍👦' },
    ],
  },
  {
    name: 'This Week',
    icon: 'far fa-calendar-alt',
    active: false,
    itemList: [
      { id: 5, text: 'Hand in weekly report 📄' },
      { id: 6, text: 'Meeting with client 🤦' },
    ],
  },
  { name: 'This Month', icon: 'far fa-calendar-times', active: false, itemList: [] },
  { name: 'divider' },
  { name: 'Reminders', icon: 'far fa-bell', active: false, itemList: [] },
  { name: 'divider' },
  { name: 'Completed', icon: 'far fa-calendar-check', active: false, itemList: [] },
];

function insertItem(id, event) {
  if (event.key != 'Enter') return;

  event.preventDefault();
  let location = document.getElementById(id);
  const itemTag = `<li id="${idCounter}" class="list-item">
                        <button class="btn-none mr-2" onclick="completeItemDOM(${idCounter})">&#9675;</button>
                        <input type="text" class="item-input" onchange="updateItemDOM(${idCounter}, this)" onkeydown="insertItem(${idCounter}, event)" />
                        <div class="append">
                        <i class="fas fa-trash" onclick="removeItemDOM(${idCounter});"></i>
                        <i class="ml-2 fas fa-bars" onmousedown="draggables(${idCounter}, this);" onmouseleave="undraggable(${idCounter}, this);"></i>
                        </div>
                    </li>`;

  location.insertAdjacentHTML('afterend', itemTag);
  document.getElementById(idCounter).querySelector('input').focus();
  Task.getCurrentTask().newItem('');
}
