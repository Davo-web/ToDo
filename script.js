const form = document.querySelector('.form');
let input = document.querySelector('.input')
const ToDo = document.querySelector('.todo');
let message = document.querySelector('.message');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    let taskText = input.value.trim(); // получаем значение с инпута
    // разметка отображаемой задачи
    let taskCardHtml = ` 
    <div class="task-card">
        <label class="custom-checkbox">
            <input type="checkbox" class="checkbox">
            <span class="checkmark"></span>
        </label>
        <p class="task">${taskText}</p>
        <button class="edit-btn">
            <img src="./img/Vector.png" alt="edit" class="edit-img">
        </button>
        <button class="delete-btn">
            <span class="line1"></span>
            <span class="line2"></span>
        </button>
    </div>
    `
    ToDo.insertAdjacentHTML('afterend', taskCardHtml); // вставляем задачу после контейнера

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




    let taskCard = document.querySelector('.task-card');
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
        task.insertAdjacentHTML('afterend', editInputHtml);
        task.remove(); 

        // фокус на инпут, курсор в конец текста
        let editInput = document.querySelector('.edit-input');
        editInput.focus();
        let editInputValue = editInput.value; // запоминаем текст
        editInput.value = ""; // сбрасываем инпут, чтоб курсор был в конце текста
        editInput.value = editInputValue; // возвращаем значение



        // кнопка подтверждения изменений вместо карандаша
        let edit2 = `
        <button class="edit-btn-ok">
            <img src="./img/ok.svg" alt="ok" class="edit-img">
        </button>
        `
        editBtn.insertAdjacentHTML('afterend', edit2);
        editBtn.remove(); 


        editInput.addEventListener('blur', function() {
            taskText = editInput.value;
            task = `
            <p class="task">${taskText}</p>
            `
            editInput.insertAdjacentHTML('afterend', task);
            editInput.remove();
            editBtn = `
            <button class="edit-btn">
                <img src="./img/Vector.png" alt="edit" class="edit-img">
            </button>
            `
            console.log(editBtn);
            edit2 = document.querySelector('.edit-btn-ok');
            edit2.insertAdjacentHTML('afterend', editBtn);
            edit2.remove();
        })
    })


    input.value = '';
});
