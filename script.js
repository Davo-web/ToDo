const form = document.querySelector('.form');
const input = document.querySelector('.input');
const ToDo = document.querySelector('.todo');
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
        taskCard.style.order = ischecked ? "1" : "0";
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
    savetask();

    createTask(task.id, task.tasktext, task.ischecked);
}


function savetask() {
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

// делегирование событий. Обработчик на контейнер taskBox
taskBox.addEventListener('click', (event) => {
    // если нажатие на чекбокс
    if (event.target.classList.contains('checkbox')) {
        // перечёркивание и стиль выполненных задач
        let taskCard = event.target.closest('.task-card');
        if (event.target.checked) {
            taskCard.classList.add('checked');
            taskCard.style.order = "1";
            // нахождение индекста карточки для изменения состояния ischecked у неё в массиве taskArr
            const index = getTaskIndex(taskCard);
            taskArr[index].ischecked = true;
            // снова отправляем в localStorage массив taskArr, тем самым обновляем данные
            savetask();
        }
        else {
            taskCard.classList.remove('checked');
            taskCard.style.order = "0";
            const index = getTaskIndex(taskCard);
            taskArr[index].ischecked = false;
            savetask();
        }

        changeMessage();
    }




    if (event.target.closest('.delete-btn')) {   // удаление задач
            let taskCard = event.target.closest('.task-card');
            // удаление из массива удалённое задачи в DOM
            const index = getTaskIndex(taskCard)
            taskArr.splice(index, 1);
            // отправка в localStorage обновлённый массив
            savetask();

            taskCard.classList.add('deleted');
            setTimeout(() => {
                taskCard.remove();
                changeMessage();
            },350);
    }


    // редактирование задач
    if (event.target.closest('.edit-btn')) {
        let editBtnEl = event.target.closest('.edit-btn');
        let taskCard = editBtnEl.closest('.task-card');
        let task = taskCard.querySelector('.task');


        // запрет появления инпута при редактировании одной и нажатия на кнопку редактирования другой задачи
        if (document.activeElement == taskBox.querySelector('.edit-input')) {
            return;
        }

        // вставляем поле ввода вместо текста задачи
        let editInputHtml = `
        <input type="text" value="${task.textContent}" class="edit-input" placeholder = "...">
        `;
        task.innerHTML =  editInputHtml;


        
        // фокус на инпут, курсор в конец текста
        let editInputEl = taskCard.querySelector('.edit-input');
        editInputEl.focus();
        let editInputValue = editInputEl.value.trim(); // запоминаем текст
        editInputEl.value = ""; // сбрасываем инпут, чтоб курсор был в конце текста
        editInputEl.value = editInputValue; // возвращаем значение



        // кнопка подтверждения изменений вместо карандаша
        editBtnEl.style.display = 'none';
        
        let editBtn2Html = `
        <button class="edit-btn2">
            <img src="./img/ok.svg" alt="edit" class="edit-img">
        </button>
        `
        editBtnEl.insertAdjacentHTML('afterend', editBtn2Html);
        



        let editBtn2 = taskCard.querySelector('.edit-btn2');
        function finishEditing() {
            let newText = editInputEl.value.trim();
            if (!newText) {
                editInputEl.focus();
                return;
            }

            task.textContent = newText;                // вставляем отредактированную задачу в <p>
            // находим индекс изменённой задачи. Изменяем данные в массиве и отправляем в localStorage
            const index = getTaskIndex(taskCard);
            taskArr[index].tasktext = newText;
            savetask();
            editBtnEl.style.display = 'block';    // показываем старую кнопку edit
            editBtn2.remove();                    // убираем кнопку "ок"
        }

        // на blur
        editInputEl.addEventListener('blur', finishEditing);

        // на Enter и Escape
        editInputEl.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === 'Escape') {
                e.preventDefault();
                finishEditing();
            }
        });

        // на клик по "ок"
        editBtn2.addEventListener('click', finishEditing);
    }
})