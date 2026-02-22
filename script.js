const form = document.querySelector('.form');
let input = document.querySelector('.input')
const ToDo = document.querySelector('.todo');
let message = document.querySelector('.message');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let task = input.value.trim();
    let taskCardHtml = `
    <div class="task-card">
        <label class="custom-checkbox">
            <input type="checkbox">
            <span class="checkmark"></span>
        </label>
        <p class="task">${task}</p>
        <button class="edit-btn">
            <img src="./Vector.png" alt="edit" class="edit-img">
        </button>
        <button class="delete-btn">
            <span class="line1"></span>
            <span class="line2"></span>
        </button>
    </div>
    `
    ToDo.insertAdjacentHTML('afterend', taskCardHtml);

    let taskCard = document.querySelector('.task-card');
    let deleteBtn = document.querySelector('.delete-btn');
    if (document.querySelector('.task-card')) {
        message.textContent = 'Работаем!';
        deleteBtn.addEventListener('click', function() {
            taskCard.remove();
        })
    }
    else message.textContent = 'Задач нет. Отдыхай!'
    input.value = '';
});


