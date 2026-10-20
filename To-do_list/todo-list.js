const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const timeInput = document.getElementById("time-input");
const addButton = document.getElementById("add-button");
const searchInput = document.getElementById("search-input");
const taskList = document.getElementById("task-list");
const message = document.getElementById("message");
const closeMessage = document.getElementById("close-message");

let tasks = [];
let editingId = 0;

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
const loadTasks = () => {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
}
const showMessage = () => {
  message.classList.remove("hidden");
}
const hideMessage = () => {
  message.classList.add("hidden");
}
const formatDate = date => {
  const parts = date.split("-");
  return `${parts[2]} / ${parts[1]} / ${parts[0]}`;
}
const formatTime = time => {
  const parts = time.split(":");
  let hour = Number(parts[0]);
  const minute = parts[1];

  let suffix = "am";
  if (hour >= 12) {
    suffix = "pm";
  }
  if (hour > 12) {
    hour = hour - 12;
  }
  if (hour === 0) {
    hour = 12;
  }

  let hourText = String(hour);
  if (hourText.length === 1) {
    hourText = "0" + hourText;
  }
  return `${hourText} : ${minute} ${suffix}`;
}

const getToday = () =>  {
  const now = new Date();
  const year = now.getFullYear();

  let month = String(now.getMonth() + 1); 
  let day = String(now.getDate());

  return `${year}-${month}-${day}`;
}
const showTask = task => {
  if (task.id === editingId) {
    const editBox = document.createElement("input");
    editBox.type = "text";
    editBox.className = "edit-input";
    editBox.value = task.text;

    editBox.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        saveEdit(task.id, editBox.value);
      }
    });

    taskList.appendChild(editBox);
    editBox.focus();
    return;
  }

  const item = document.createElement("div");
  item.classList.add("task-item");

  const left = document.createElement("span");
  left.textContent = `${task.text} at `;

  const timeText = document.createElement("span");
  timeText.classList.add("task-time");
  timeText.textContent = formatTime(task.time);
  left.appendChild(timeText);

  const buttons = document.createElement("div");
  buttons.classList.add("task-buttons");

  const editButton = document.createElement("button");
  editButton.classList.add("edit-button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", function () {
    editingId = task.id;
    renderTasks();
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function () {
    deleteTask(task.id);
  });

  buttons.appendChild(editButton);
  buttons.appendChild(deleteButton);

  item.appendChild(left);
  item.appendChild(buttons);
  taskList.appendChild(item);
}

const showSection = (title, list, withDates)=> {
  if (list.length === 0) return; 

  const heading = document.createElement("h2");
  heading.classList.add("section-title");
  heading.textContent = title;
  taskList.appendChild(heading);

  if (withDates === false) {
    for (let i = 0; i < list.length; i++) {
      showTask(list[i]);
    }
    return;
  }

  const dates = [];
  for (let i = 0; i < list.length; i++) {
    if (dates.includes(list[i].date) === false) {
      dates.push(list[i].date);
    }
  }
  dates.sort(); 

  for (let i = 0; i < dates.length; i++) {
    const dayHeading = document.createElement("div");
    dayHeading.classList.add("task-day");
    dayHeading.textContent = formatDate(dates[i]);
    taskList.appendChild(dayHeading);

    const tasksOfThatDay = list.filter(function (task) {
      return task.date === dates[i];
    });

    for (let j = 0; j < tasksOfThatDay.length; j++) {
      showTask(tasksOfThatDay[j]);
    }
  }
}

const renderTasks = () => {
  taskList.innerHTML = ""; 

  const searchText = searchInput.value.toLowerCase();
  const visible = tasks.filter(function (task) {
    return task.text.toLowerCase().includes(searchText);
  });

  if (visible.length === 0) {
    const empty = document.createElement("p");
    empty.classList.add("empty-state");
    empty.textContent = "No tasks to show.";
    taskList.appendChild(empty);
    return;
  }

  const today = getToday();

  const dueTasks = visible.filter(function (task) {
    return task.date < today;
  });
  const todayTasks = visible.filter(function (task) {
    return task.date === today;
  });
  const upcomingTasks = visible.filter(function (task) {
    return task.date > today;
  });

  showSection("Due Tasks", dueTasks, true);
  showSection("Today", todayTasks, false);
  showSection("Upcoming Tasks", upcomingTasks, true);
}

const addTask = () => {
  const text = taskInput.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;

  if (text === "" || date === "" || time === "") {
    showMessage();
    return; 
  }

  hideMessage();
  tasks.push({
    id: Date.now(), 
    text: text,
    date: date,
    time: time,
  });

  saveTasks();
  renderTasks();

  taskInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
  taskInput.focus();
}

const deleteTask = id => {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });

  saveTasks();
  renderTasks();
}

const saveEdit = (id, newText)=> {
  if (newText.trim() === "") return; 

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].text = newText.trim();
    }
  }
  editingId = 0; 
  saveTasks();
  renderTasks();
}
addButton.addEventListener("click", addTask);
closeMessage.addEventListener("click", hideMessage);

searchInput.addEventListener("input", renderTasks);

loadTasks();
renderTasks();