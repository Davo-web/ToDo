const form = document.querySelector('.form');
let input = document.querySelector('.input')
form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log(input.value.trim());
    input.value = '';
});
