console.debug("Hello world!");
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filter = '') {
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    tasks.forEach((task, index) => {
        if (filter && !task.text.toLowerCase().includes(filter.toLowerCase())) return;
        const li = document.createElement('li');
        const span = document.createElement('span');
        let displayText = task.text;
        if (task.deadline) {
            displayText += ` (Termin: ${new Date(task.deadline).toLocaleString('pl-PL')})`;
        }
        span.textContent = displayText;
        if (filter) {
            const regex = new RegExp(`(${filter})`, 'gi');
            span.innerHTML = displayText.replace(regex, '<mark>$1</mark>');
        }
        li.appendChild(span);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.onclick = () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks(filter);
        };
        li.appendChild(deleteBtn);
        li.onclick = (e) => {
            if (e.target.tagName === 'BUTTON') return;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = task.text;
            li.replaceChild(input, span);
            input.focus();
            input.onblur = () => {
                task.text = input.value.trim();
                saveTasks();
                renderTasks(filter);
            };
        };
        list.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    const search = document.getElementById('search');
    search.oninput = () => {
        const filter = search.value.trim();
        if (filter.length >= 2) {
            renderTasks(filter);
        } else {
            renderTasks();
        }
    };
    const addBtn = document.getElementById('add-btn');
    addBtn.onclick = () => {
        const textInput = document.getElementById('new-task');
        const deadlineInput = document.getElementById('deadline');
        const text = textInput.value.trim();
        const deadline = deadlineInput.value;
        if (text.length < 3 || text.length > 255) {
            alert('Zadanie musi mieć od 3 do 255 znaków.');
            return;
        }
        if (deadline && new Date(deadline) <= new Date()) {
            alert('Termin musi być w przyszłości lub pusty.');
            return;
        }
         tasks.push({ text, deadline: deadline || null });
         saveTasks();
         textInput.value = '';
         deadlineInput.value = '';
         renderTasks();
    };
});
