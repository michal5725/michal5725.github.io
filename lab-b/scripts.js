console.debug("Hello world!");

class Todo {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.term = '';
        console.log('Loaded tasks from localStorage:', this.tasks);
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    get filteredTasks() {
        if (!this.term || this.term.length < 2) return this.tasks;
        return this.tasks.filter(task => task.text.toLowerCase().includes(this.term.toLowerCase()));
    }

    setTerm(term) {
        this.term = term;
        this.draw();
    }

    draw() {
        console.log('Drawing tasks:', this.tasks);
        const list = document.getElementById('task-list');
        console.log('Task list element:', list);
        list.innerHTML = '';
        this.filteredTasks.forEach((task, index) => {
            const originalIndex = this.tasks.indexOf(task);
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed || false;
            checkbox.onchange = () => {
                this.toggleCompleted(originalIndex);
            };
            li.appendChild(checkbox);
            const span = document.createElement('span');
            let displayText = task.text;
            if (task.deadline) {
                displayText += ` (Termin: ${new Date(task.deadline).toLocaleString('pl-PL')})`;
            }
            span.textContent = displayText;
            if (task.completed) {
                span.style.textDecoration = 'line-through';
            }
            if (this.term) {
                const regex = new RegExp(`(${this.term})`, 'gi');
                span.innerHTML = displayText.replace(regex, '<mark>$1</mark>');
            }
            li.appendChild(span);
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.onclick = () => {
                this.deleteTask(originalIndex);
            };
            li.appendChild(deleteBtn);
            li.onclick = (e) => {
                e.stopPropagation();
                if (e.target.tagName === 'BUTTON' || e.target.type === 'checkbox') return;
                const editDiv = document.createElement('div');
                editDiv.style.display = 'flex';
                editDiv.style.gap = '10px';
                editDiv.style.alignItems = 'center';
                editDiv.style.position = 'relative';
                editDiv.style.zIndex = '10';
                const textInput = document.createElement('input');
                textInput.type = 'text';
                textInput.value = task.text;
                textInput.style.flexGrow = '1';
                editDiv.appendChild(textInput);
                const deadlineInput = document.createElement('input');
                deadlineInput.type = 'datetime-local';
                deadlineInput.value = task.deadline ? task.deadline.toISOString().slice(0, 16) : '';
                deadlineInput.style.width = '200px';
                editDiv.appendChild(deadlineInput);
                const saveBtn = document.createElement('button');
                saveBtn.textContent = 'Zapisz';
                saveBtn.onclick = () => {
                    const newText = textInput.value.trim();
                    const newDeadline = deadlineInput.value;
                    this.editTask(originalIndex, newText, newDeadline);
                };
                editDiv.appendChild(saveBtn);
                li.replaceChild(editDiv, span);
                textInput.focus();
            };
            list.appendChild(li);
            console.log('Appended li for task:', task.text);
        });
    }

    addTask(text, deadline) {
        if (text.length < 3 || text.length > 255) {
            alert('Zadanie musi mieć od 3 do 255 znaków.');
            return;
        }
        if (deadline && new Date(deadline) <= new Date()) {
            alert('Termin musi być w przyszłości lub pusty.');
            return;
        }
        this.tasks.push({ text, deadline: deadline ? new Date(deadline) : null });
        this.saveTasks();
        this.draw();
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.draw();
    }

    editTask(index, newText, newDeadline) {
        this.tasks[index].text = newText;
        this.tasks[index].deadline = newDeadline ? new Date(newDeadline) : null;
        this.saveTasks();
        this.draw();
    }

    toggleCompleted(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
        this.saveTasks();
        this.draw();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const todo = new Todo();
    document.todo = todo;
    const search = document.getElementById('search');
    search.oninput = () => {
        const filter = search.value.trim();
        if (filter.length >= 2) {
            todo.setTerm(filter);
        } else {
            todo.setTerm('');
        }
    };
    const addBtn = document.getElementById('add-btn');
    addBtn.onclick = () => {
        const textInput = document.getElementById('new-task');
        const deadlineInput = document.getElementById('deadline');
        const text = textInput.value.trim();
        const deadline = deadlineInput.value;
        todo.addTask(text, deadline);
        textInput.value = '';
        deadlineInput.value = '';
    };
});
