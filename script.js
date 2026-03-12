const form = document.querySelector('.form');
let input = document.querySelector('.input')
const ToDo = document.querySelector('.todo');
let message = document.querySelector('.message');
let taskBox = document.querySelector('.task-box');


// обработчик формы (добавления задач)
form.addEventListener('submit', function(e) {
    e.preventDefault();

    let taskText = input.value.trim(); // получаем значение с инпута
    if (!taskText) return false // если инпут пуст, то не добавлять
    // разметка отображаемой задачи
    let taskCard = document.createElement('div');
    taskCard.className = 'task-card';

    taskCard.innerHTML = `
        <label class="custom-checkbox">
            <input type="checkbox" class="checkbox">
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
    taskCard.querySelector('.task').textContent = taskText;

    taskBox.appendChild(taskCard); // вставляем задачу после контейнера

    input.value = '';
    allChecked();
})



function allChecked() { // проверка если выделены все чекбоксы
    let checkbox = document.querySelectorAll('.checkbox');
    // если чекбоксов не 0 и выбранных = количество чекбоксов
    if (checkbox.length > 0 && document.querySelectorAll('.checkbox:checked').length == checkbox.length)
        message.textContent = 'Задачи сделаны. Отдыхай!';
    else if (!document.querySelector('.task-card')) message.textContent = 'Задач нет. Отдыхай!';
    else 
        message.textContent = 'Работаем!';
}


taskBox.addEventListener('click', (event) => {
    if (event.target.classList.contains('checkbox')) {
        // перечёркивание и стиль выполненных задач
        let taskCard = event.target.closest('.task-card');
        if (event.target.checked) taskCard.classList.add('active');
        else taskCard.classList.remove('active');
        allChecked();
        
        // if (event.target.checked) taskBox.append(taskCard);
        // if(!event.target.checked) taskBox.prepend(taskCard);

        return;
    }



    if (document.querySelector('.task-card')) { // проверяем есть ли на сайте задача
        if (event.target.closest('.delete-btn')) {   // удаление задач
                let taskCard = event.target.closest('.task-card');
                taskCard.remove();
                allChecked();
        }
    }



    if (event.target.closest('.edit-btn')) {
        let editBtnEl = event.target.closest('.edit-btn');
        let taskCard = editBtnEl.closest('.task-card');
        let task = taskCard.querySelector('.task');



        // вставляем поле ввода вместо текста задачи
        let editInputHtml = `
        <input type="text" value="${task.textContent}" class="edit-input" placeholder = "Some task...">
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

            task.textContent = newText;               // возвращаем <p>
            editInputEl.remove();                     // убираем input
            editBtnEl.style.display = 'block';        // показываем старую кнопку edit
            editBtn2.remove();                        // убираем кнопку "ок"
        }

        // на blur
        editInputEl.addEventListener('blur', finishEditing);

        // на Enter
        editInputEl.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                finishEditing();
            }
        });

        // на клик по "ок"
        editBtn2.addEventListener('click', finishEditing);

        return;
    }
})