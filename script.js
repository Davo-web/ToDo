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
            <img src="./Vector.png" alt="edit" class="edit-img">
        </button>
        <button class="delete-btn">
            <span class="line1"></span>
            <span class="line2"></span>
        </button>
    </div>
    `
    ToDo.insertAdjacentHTML('afterend', taskCardHtml); // вставляем задачу после контейнера

    let taskCard = document.querySelector('.task-card');
    let deleteBtn = document.querySelector('.delete-btn');
    if (document.querySelector('.task-card')) { // проверяем есть ли на сайте задача
        message.textContent = 'Работаем!';
        deleteBtn.addEventListener('click', function() { // удаление задач
            taskCard.remove();
            if (!document.querySelector('.task-card')) message.textContent = 'Задач нет. Отдыхай!';
        })
    }

    // зачёркивание задачи при нажатом checkbox
    let task = document.querySelector('.task');
    let checkbox = document.querySelector('.checkbox');
    checkbox.addEventListener('change', function(){
        if (checkbox.checked) task.classList.add('active');
        else task.classList.remove('active');

        function allChecked() {
            let checkboxes = document.querySelectorAll('.checkbox');
            return checkboxes.length > 0 && 
                document.querySelectorAll('.checkbox:checked').length === checkboxes.length;
        }
        if (allChecked()) message.textContent = 'Задачи сделаны. Отдыхай!';
        if (!allChecked()) message.textContent = 'Работаем!';
    }) 





    input.value = '';
});
