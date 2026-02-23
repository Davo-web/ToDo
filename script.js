const form = document.querySelector('.form');
let input = document.querySelector('.input')
const ToDo = document.querySelector('.todo');
let message = document.querySelector('.message');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    let taskText = input.value.trim(); // получаем значение с инпута
    // разметка отображаемой задачи
    let taskCard = document.createElement('div');
    taskCard.className = 'task-card';

    taskCard.innerHTML = `
        <label class="custom-checkbox">
            <input type="checkbox" class="checkbox">
            <span class="checkmark"></span>
        </label>
        <p class="task"></p>
        <button class="edit-btn">
            <img src="./img/Vector.png" alt="edit" class="edit-img">
        </button>
        <button class="delete-btn">
            <span class="line1"></span>
            <span class="line2"></span>
        </button>
    `;

    taskCard.querySelector('.task').textContent = taskText;

    ToDo.insertAdjacentElement('afterend',taskCard); // вставляем задачу после контейнера




    let task = document.querySelector('.task');
    let checkbox = document.querySelector('.checkbox');
    function allChecked() { // проверка если выделены все чекбоксы
            let checkboxes = document.querySelectorAll('.checkbox');
            return checkboxes.length > 0 &&  // если чекбоксов не 0 и выбранных = количество чекбоксов
                document.querySelectorAll('.checkbox:checked').length === checkboxes.length;
        }
    checkbox.addEventListener('change', function(){
        if (checkbox.checked) task.classList.add('active'); // перечё1ркивание
        else task.classList.remove('active');

        
        if (allChecked()) message.textContent = 'Задачи сделаны. Отдыхай!';
        if (!allChecked()) message.textContent = 'Работаем!';
    }) 




    taskCard = document.querySelector('.task-card');
    let deleteBtn = document.querySelector('.delete-btn');
    if (document.querySelector('.task-card')) { // проверяем есть ли на сайте задача
        message.textContent = 'Работаем!';
        deleteBtn.addEventListener('click', function() { // удаление задач
            taskCard.remove();
            if (allChecked()) message.textContent = 'Задачи сделаны. Отдыхай!';
            if (!allChecked()) message.textContent = 'Работаем!';
            if (!document.querySelector('.task-card')) message.textContent = 'Задач нет. Отдыхай!';
        })
    }




    let editBtn = document.querySelector('.edit-btn');
    editBtn.addEventListener('click', function() {
        // вставляем поле ввода вместо текста задачи
        let editInputHtml = `
        <input type="text" value="${task.textContent}" class="edit-input">
        `
        task.innerHTML =  editInputHtml;

        // фокус на инпут, курсор в конец текста
        let editInput = document.querySelector('.edit-input');
        editInput.focus();
        let editInputValue = editInput.value; // запоминаем текст
        editInput.value = ""; // сбрасываем инпут, чтоб курсор был в конце текста
        editInput.value = editInputValue; // возвращаем значение



        // кнопка подтверждения изменений вместо карандаша
        let editBtn2Html = `
        <button class="edit-btn2">
            <img src="./img/ok.svg" alt="edit" class="edit-img">
        </button>
        `
        editBtn.insertAdjacentHTML('afterend', editBtn2Html);
        editBtn.style.display = 'none';

        let editBtn2 = document.querySelector('.edit-btn2');
        editBtn2.addEventListener('click', function(){
            editBtn.style.display = 'block';
            editBtn2.remove();
        })



        editInput.addEventListener('blur', function() {
            taskText = editInput.value;
            taskCard.querySelector('.task').textContent = taskText;
            editInput.remove();
            editBtn.style.display = 'block';
            editBtn2.remove();
        })

        editInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                this.blur();
                editBtn.style.display = 'block';
                editBtn2.remove();
            }
        })
    })


    input.value = '';
});
