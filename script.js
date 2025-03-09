const inputField = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const clearAllButton = document.getElementById('clear-all');
const itemList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');

let isEditing = false;
let currentTodoText = '';

document.addEventListener('DOMContentLoaded', () => {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        createTodoElement(todo.text, todo.completed);
    });
});

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const todoText = inputField.value.trim();

    if (todoText === '') {
        return; // Exit the function if the input is empty
    }

    if (isEditing) {
        updateTodoElement(currentTodoText, todoText);
        isEditing = false;
        currentTodoText = '';
    } else {
        createTodoElement(todoText, false);

        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.unshift({ text: todoText, completed: false });
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    inputField.value = '';
});

clearAllButton.addEventListener('click', (event) => {
    event.preventDefault();
    itemList.innerHTML = '';
    localStorage.removeItem('todos');
});

function createTodoElement(text, completed) {
    const newItem = document.createElement('li');

    const taskContent = document.createElement('div');
    taskContent.classList.add('task-content');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('click', () => {
        newItem.classList.toggle('completed', checkbox.checked);
        updateTodoInLocalStorage(text, checkbox.checked);
    });

    const todoText = document.createElement('span');
    todoText.textContent = text;
    if (completed) {
        newItem.classList.add('completed');
    }

    taskContent.appendChild(checkbox);
    taskContent.appendChild(todoText);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
        itemList.removeChild(newItem);
        removeTodoFromLocalStorage(text);
    });

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.classList.add('update-button');
    updateButton.addEventListener('click', () => {
        inputField.value = text;
        isEditing = true;
        currentTodoText = text;
    });

    newItem.appendChild(taskContent);
    newItem.appendChild(deleteButton);
    newItem.appendChild(updateButton);

    itemList.appendChild(newItem);
}

function updateTodoElement(oldText, newText) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoIndex = todos.findIndex(todo => todo.text === oldText);
    if (todoIndex > -1) {
        todos[todoIndex].text = newText;
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    itemList.innerHTML = '';
    todos.forEach(todo => {
        createTodoElement(todo.text, todo.completed);
    });
}

function updateTodoInLocalStorage(oldText, completed, newText = oldText) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoIndex = todos.findIndex(todo => todo.text === oldText);
    if (todoIndex > -1) {
        todos[todoIndex] = { text: newText, completed: completed };
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

function removeTodoFromLocalStorage(text) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const updatedTodos = todos.filter(todo => todo.text !== text);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
}