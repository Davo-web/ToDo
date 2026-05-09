const form = document.querySelector('.form');
const input = document.querySelector('.input');
const message = document.querySelector('.message');
const taskBox = document.querySelector('.task-box');
const taskArr = JSON.parse(localStorage.getItem('tasklist')) || []; // список, содержащий объекты-карточки для LocalStorage


// при перезагрузки страницы сохранённые карточки будут созданы
taskArr.forEach(element => {
    createTask(element.id, element.tasktext, element.ischecked);
});
changeMessage();


// обработчик формы (добавления задач)
form.addEventListener('submit', function(e) {
    e.preventDefault();

    let taskText = input.value.trim();
    if (!taskText) {
        input.focus();
        return // если инпут пуст, то не добавлять
    }
    // присваиваем карточке id, вставляем текст задачи и создаём состояние ischecked
    addTask(taskText);
    input.value = '';
    changeMessage();
})


function createTask(id, tasktext, ischecked) {
        let taskCard = document.createElement('div');
        // сохраняем id в dataset, чтобы потом связать DOM-элемент с объектом в массиве
        taskCard.dataset.id = id;
        taskCard.className = `task-card ${ischecked ? 'checked' : ''}`;
        // разметка отображаемой задачи
        taskCard.innerHTML = `
            <label class="custom-checkbox">
                <input type="checkbox" class="checkbox" ${ischecked ? 'checked' : ''}>
                <span class="checkmark"></span>
            </label>
            <p class="task"></p>
            <div class = "btns">
                <button class="edit-btn">
                    <img src="./img/Vector.png" alt="edit" class="edit-img">
                </button>
                <button class="delete-btn">
                    <span class="line1"></span>
                    <span class="line2"></span>
                </button>
            </div>
        `;

        // вставляем текст задачи в .task (<p>)
        taskCard.querySelector('.task').textContent = tasktext;
        taskBox.appendChild(taskCard); // вставляем задачу после контейнера
}

function addTask(tasktext) {
    const task = {
        id: Date.now(),
        tasktext,
        ischecked: false,
    };

    taskArr.push(task);
    saveTask();

    createTask(task.id, task.tasktext, task.ischecked);
}


function saveTask() {
    localStorage.setItem('tasklist', JSON.stringify(taskArr));
}


function countTask() {
    return taskArr.filter(task => !task.ischecked).length;
}

function changeMessage() { // смена текста message при выделении чекбоксов
    // если задач не 0 и все сделаны
    if (taskArr.length && taskArr.every(task => task.ischecked))
        message.textContent = 'Задачи сделаны. Отдыхай!';
    else if (!taskArr.length) message.textContent = 'Задач нет. Отдыхай!';
    else message.textContent = `Работаем! - Задач: ${countTask()}`;
}

function getTaskIndex(taskCard){
    const id = Number(taskCard.dataset.id);
    return taskArr.findIndex(task => task.id === id);
}

function handleCheckbox(event) {
    // перечёркивание и стиль выполненных задач
    let taskCard = event.target.closest('.task-card');
    let isChecked = event.target.checked;
    taskCard.classList.toggle('checked', isChecked);
    // нахождение индекста карточки для изменения состояния ischecked у неё в массиве taskArr
    const index = getTaskIndex(taskCard);
    taskArr[index].ischecked = isChecked;
    // отправляем в localStorage массив taskArr, тем самым обновляем данные
    saveTask();
    changeMessage();
}


function handleDelete(event) {
    let taskCard = event.target.closest('.task-card');
    // удаление из массива удалённое задачи в DOM
    const index = getTaskIndex(taskCard)
    taskArr.splice(index, 1);
    // отправка в localStorage обновлённый массив
    saveTask();

    taskCard.classList.add('deleted');
    setTimeout(() => {
        taskCard.remove();
        changeMessage();
    },350);
}


function handleEdit(event) {
    let editBtnEl = event.target.closest('.edit-btn');
        let taskCard = editBtnEl.closest('.task-card');
        let task = taskCard.querySelector('.task');


        // запрет появления инпута при редактировании одной и нажатия на кнопку редактирования другой задачи
        if (taskBox.querySelector('.edit-input')) return;

        let taskText = task.textContent;
        // вставляем поле ввода вместо текста задачи
        let editInputHtml = `
        <input type="text" class="edit-input" placeholder = "...">
        `;
        task.innerHTML =  editInputHtml;
        let editInputEl = taskCard.querySelector('.edit-input');
        editInputEl.value = taskText;


        
        // фокус на инпут, курсор в конец текста
        editInputEl.focus();
        const length = editInputEl.value.length;
        // устанавливаем курсор в конец текста
        editInputEl.setSelectionRange(length, length);



        // кнопка подтверждения изменений вместо карандаша
        editBtnEl.style.display = 'none';
        
        let editBtn2Html = `
        <button class="edit-btn2">
            <img src="./img/ok.svg" alt="edit" class="edit-img">
        </button>
        `
        editBtnEl.insertAdjacentHTML('afterend', editBtn2Html);
        



        let editBtn2 = taskCard.querySelector('.edit-btn2');
        // флаг для предотвращения двойного вызова функции (от blur и нажатия esc, enter)
        let isEditingFinished = false;
        function finishEditing() {
            // если редактирование уже закончено (был вызов) -> return
            if (isEditingFinished) return;
            let newText = editInputEl.value.trim();
            if (!newText) {
                editInputEl.focus();
                return;
            }
            // меняем флаг, т.к. вызов функции произошёл
            isEditingFinished = true;

            task.textContent = newText;                // вставляем отредактированную задачу в <p>
            // находим индекс изменённой задачи. Изменяем данные в массиве и отправляем в localStorage
            const index = getTaskIndex(taskCard);
            taskArr[index].tasktext = newText;
            saveTask();
            editBtnEl.style.display = 'block';    // показываем старую кнопку edit
            editBtn2.remove();                    // убираем кнопку "ок"
        }

        // на blur
        editInputEl.addEventListener('blur', finishEditing);

        // на Enter и Escape
        editInputEl.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                finishEditing();
            }
            else if (e.key === 'Escape'){
                e.preventDefault();
                isEditingFinished = true;
                task.textContent = taskText;
                
                editBtnEl.style.display = 'block';    // показываем старую кнопку edit
                editBtn2.remove();                    // убираем кнопку "ок"

                
            }
        });

        // на клик по "ок"
        editBtn2.addEventListener('click', finishEditing);
}


// делегирование событий. Обработчик на контейнер taskBox
taskBox.addEventListener('click', (event) => {

    if (event.target.classList.contains('checkbox')) {
        handleCheckbox(event);
        return;
    }

    if (event.target.closest('.delete-btn')) {
        handleDelete(event);
        return;
    }

    if (event.target.closest('.edit-btn')) {
        handleEdit(event);
    }
})