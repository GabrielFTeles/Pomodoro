const btn             = document.querySelector('.start button');
const time            = document.querySelector('.time span');
const body            = document.querySelector('body');
const option1         = document.querySelector('.options li:nth-of-type(1)');
const option2         = document.querySelector('.options li:nth-of-type(2)');
const option3         = document.querySelector('.options li:nth-of-type(3)');
const optionTitle     = document.querySelector('.option-title h2')
const pendingBtn    = document.querySelector('#pending');
const finishedBtn   = document.querySelector('#finished');
const menu            = document.querySelector('#menu');
const bar             = document.querySelector('.bar');
const modal           = document.querySelector('.modal');
const sound           = document.querySelector('.sound');
const newTask         = document.querySelector('.new-task');
const addTask         = document.querySelector('.add-task');
const cancelTask      = document.querySelector('#cancel-task');
const saveTaskBtn     = document.querySelector('#save-task');
const taskTitle       = document.querySelector('#text');
const taskDescription = document.querySelector('#textArea');

const tick = new Audio('./sounds/tick.mp3');
const end = new Audio('./sounds/end-bell.mp3');

const options = [option1, option2, option3];

const tasks = [];

let actualOption = 1;

let mm = 25;
let ss = 00;
let tt;
let progress = 0;

let interval;

let btnState = 'start';
let isSoundMuted = false;

function optionClick(wich) {
    options.forEach((o) => {
        if (o.classList.contains('active')) {
            o.classList.toggle('active');
        }
    })

    if (wich === 'pomodoro') {
        option1.classList.toggle('active');
        actualOption = 1;
        onOptionChange('#d95550', '25:00', 'Time to focus!', 25)
    }
    if (wich === 'short-break') {
        option2.classList.toggle('active');
        actualOption = 2;
        onOptionChange('#4c9195', '05:00', 'Time for a break!', 5)
    }
    if (wich === 'long-break') {
        option3.classList.toggle('active');
        actualOption = 3;
        onOptionChange('#457ca3', '15:00', 'Time for a break!', 15)
    }
}

function onOptionChange(color, text, opTitle, minutes) {
    body.style.background = color;
    btn.style.color = color;
    time.innerText = text;
    optionTitle.innerText = opTitle;
    bar.style.width = '0';
    btnState = 'stop';
    isBtnPressed();
    progress = 0;
    ss = 0;
    mm = minutes
}

function taskFilterClick(wich, btn) {
    btn.classList.toggle(`${wich}-active`)
    filterState(`${wich}-active`, wich, btn);
}

function filterState(stateActive, state, btn, reload = false) {
    if (pendingBtn.classList.contains('pending-active') && finishedBtn.classList.contains('finished-active')) {
        taskList.innerHTML = '';
        updateTasksIndex(tasks);
        return;
    }
    if (!reload) {
        if (pendingBtn.classList.contains('pending-active')) {
            filterState('pending-active', 'pending', pendingBtn, true)
            return;
        }
        if (finishedBtn.classList.contains('finished-active')) {
            filterState('finished-active', 'finished', finishedBtn, true)
            return;
        }
    }
    if (btn.classList.contains(stateActive)) {
        const tasksOnState = tasks.filter((task) => {
            return task.status === state;
        });
        taskList.innerHTML = '';
            tasksOnState.forEach((task) => {
                createTaskOnScreen(task);
                let taskChanging = document.querySelector(`#task-${task.index}`)
                if (!(task.status === 'pending')) {
                    taskChanging.style.borderLeft = '4px solid rgba(9, 255, 0, 0.70)';
                }
            });
        return;
    }
    taskList.innerHTML = '';
    updateTasksIndex(tasks);
}

sound.addEventListener('click', () => {
    if (isSoundMuted === false) {
        sound.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'
        isSoundMuted = true;
    } else {
        sound.innerHTML = '<i class="fa-solid fa-volume-high"></i>'
        isSoundMuted = false;
    }
})

menu.addEventListener('click', () => {
    menu.style.transform = 'translateY(5px)'
    setTimeout(() => {
        menu.style.transform = 'translateY(0px)'
    }, 70)
    modal.classList.toggle('modal-active')
})

addEventListener('click', (e) => {
    if (e.target == body) {
        if (modal.classList.contains('modal-active')) {
            modal.classList.toggle('modal-active');
        }
    }
})

btn.addEventListener('click', () => {
    if (isSoundMuted === false) {
        tick.play();
    }

    isBtnPressed();
});

newTask.addEventListener('click', () => {
    newTask.style.display = 'none';
    addTask.style.display = 'block';
    setTimeout(() => {
        addTask.style.height = '278px';
    }, 100)
});

function requiredFieldsCheck() {
    if (taskTitle.value.length > 32) {
        taskTitle.style.color = 'red';
        saveTaskBtn.disabled = true;
    } else if (taskTitle.value.length > 0 && taskTitle.value.length < 33) {
        saveTaskBtn.disabled = false;
        taskTitle.style.color = '#8b8b8b';

    } else {
        saveTaskBtn.disabled = true;
    }
}

addEventListener('keyup', () => {
    requiredFieldsCheck();
});

addEventListener('keydown', () => {
    requiredFieldsCheck();
});

addEventListener('mouseup', () => {
    requiredFieldsCheck();
})

cancelTask.addEventListener('click', () => {
    closeAddTask();
})

function closeAddTask() {
    taskTitle.value = '';
    taskDescription.value = '';
    addTask.style.height = '64px';
    setTimeout(() => {
        addTask.style.display = 'none';
        newTask.style.display = 'flex';
    }, 550)
}

function isBtnPressed() {
    if (btnState === 'start') {
        startBtnAnimation('stop', 'none', 3, 6, 'STOP')
        start();
    } else {
        clearInterval(interval);
        startBtnAnimation('start', '6px solid rgb(235 235 235)', 0, 0, 'START')
    }
}

function startBtnAnimation(status, border, translate, margin, textContent) {
        btn.style.borderBottom = border;
        btn.style.transform = `translateY(${translate}px)`;
        btn.style.marginTop = `${margin}`
        btn.textContent = textContent;
        btnState = status;
}

function start() {
    let progressPerSecond = 100 / (mm * 60);
    interval = setInterval(() => {
        if (progress < 100 + (progressPerSecond)) {
            progress += progressPerSecond;
            bar.style.width = `${progress}%`;
        }
        timer();
    }, 1000);
}

function timer() {
    ss--;
    if (ss < 0) {
        mm--;
        if (ss < 0 && mm < 0) {
            if (isSoundMuted == false) {
                end.play();
            }
            clearInterval(interval);
            setTimeout(() => {
                if (actualOption != 1) {
                    optionClick('pomodoro');
                } else {
                    optionClick('short-break');
                }
            }, 2000)
            return;
        } else {
            ss = 59;
        }
    }

    tt = [mm, ss];

    for (let i in tt) {
        tt[i] = String(tt[i]).padStart(2, '0');
    }

    updateTimer();
}

function updateTimer() {
    time.innerText = `${tt[0]}:${tt[1]}`;
}

const taskList = document.querySelector('.tasksList')

function createTaskOnScreen(task) {
    if (task.description == '') {
        taskList.innerHTML += `
    <div id="task-${task.index}" class="taskBox">
        <span id="title">title</span>
        <div class="title">
            <h1>${task.title}</h1>
        </div>
        <div class="status">
            <span id="status">Status: ${task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
        </div>
        <div class="settings">
            <div class="task-modal">
                <ul>
                    <li>
                        <i class="fa-solid fa-pencil"></i>
                    </li>
                    <li onclick="changeTaskStatus(${task.index})">
                        <i class="fa-solid fa-circle-check"></i>
                    </li>
                    <li onclick="deleteTask(${task.index})">
                        <i class="fa-solid fa-trash-can"></i>
                    </li>
                </ul>
            </div>
        </div>
    </div>`
        return;
    }
    taskList.innerHTML += `
    <div id="task-${task.index}" class="taskBox">
        <span id="title">title</span>
        <div class="title">
            <h1>${task.title}</h1>
        </div>
        <span id="description">description</span>
        <div class="description">
            <p>${task.description}</p>
        </div>
        <div class="status">
            <span id="status">Status: ${task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
        </div>
        <div class="settings">
            <div class="task-modal">
                <ul>
                    <li>
                        <i class="fa-solid fa-pencil"></i>
                    </li>
                    <li onclick="changeTaskStatus(${task.index})">
                        <i class="fa-solid fa-circle-check"></i>
                    </li>
                    <li onclick="deleteTask(${task.index})">
                        <i class="fa-solid fa-trash-can"></i>
                    </li>
                </ul>
            </div>
        </div>
    </div>`
}

class Task {
    constructor(title, description, index) {
        this.title = title,
        this.description = description,
        this.status = 'pending',
        this.index = index
    }
    createElement() {
        createTaskOnScreen(this);
    }
}

saveTaskBtn.addEventListener('click', () =>{
    let taskElement = new Task(taskTitle.value.toUpperCase(), taskDescription.value, tasks.length);
    tasks.push(taskElement);
    taskElement.createElement();
    closeAddTask();
})

function deleteTask(wich) {
    if (confirm('Are you really sure you want to delete this task?')) {
        tasks.splice(wich, 1);
        if (pendingBtn.classList.contains('pending-active')) {
            filterState('pending-active', 'pending', pendingBtn)
            return;
        }
        if (finishedBtn.classList.contains('finished-active')) {
            filterState('finished-active', 'finished', finishedBtn)
            return;
        }
        updateTasksIndex(tasks);
    }
}

function changeTaskStatus(wich) {
    let taskChanging = document.querySelector(`#task-${wich}`)
    let taskStatusText = document.querySelector(`#task-${wich} .status span`)
    if (tasks[wich].status === 'pending') {
        tasks[wich].status = 'finished';
        taskChanging.style.borderLeft = '4px solid rgba(9, 255, 0, 0.70)';
        taskStatusText.innerText = 'Status: Finished'
    } else if (tasks[wich].status === 'finished') {
        tasks[wich].status = 'pending';
        taskChanging.style.borderLeft = '4px solid rgba(255, 247, 0, 0.70)';
        taskStatusText.innerText = 'Status: Pending'
    }
}

function updateTasksIndex(array) {
    taskList.innerHTML = '';
    let i = 0;
    array.forEach((tas) => {
        tas.index = i;
        createTaskOnScreen(tas);
    i++;
    })
    array.forEach((tas) => {
        let taskChanging = document.querySelector(`#task-${tas.index}`)
        if (!(tas.status === 'pending')) {
            taskChanging.style.borderLeft = '4px solid rgba(9, 255, 0, 0.70)';
        }
    })
}