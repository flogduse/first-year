const input = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('todoList');
const count = document.getElementById('itemCount');
const clearBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function render() {
  const filtered = todos.filter((t) => {
    if (currentFilter === 'active') return !t.done;
    if (currentFilter === 'completed') return t.done;
    return true;
  });

  const activeCount = todos.filter((t) => !t.done).length;
  count.textContent = activeCount + ' item' + (activeCount !== 1 ? 's' : '') + ' left';

  if (filtered.length === 0) {
    list.innerHTML = '<li class="empty-msg">' +
      (currentFilter === 'all' ? 'No tasks yet. Add one above!' :
       currentFilter === 'active' ? 'All tasks are done!' :
       'No completed tasks.') + '</li>';
    return;
  }

  list.innerHTML = filtered.map((t) => {
    const idx = todos.indexOf(t);
    const checked = t.done ? 'checked' : '';
    const done = t.done ? 'done' : '';
    return `
      <li class="todo-item" data-index="${idx}">
        <div class="todo-check ${checked}" data-action="toggle">${t.done ? '✓' : ''}</div>
        <span class="todo-text ${done}">${escapeHtml(t.text)}</span>
        <button class="todo-delete" data-action="delete">✕</button>
      </li>
    `;
  }).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function addTodo() {
  const text = input.value.trim();
  if (!text) return;
  todos.push({ text, done: false, id: Date.now() });
  input.value = '';
  save();
  render();
  input.focus();
}

function toggleTodo(index) {
  todos[index].done = !todos[index].done;
  save();
  render();
}

function deleteTodo(index) {
  const item = list.querySelector(`[data-index="${index}"]`);
  if (item) item.classList.add('removing');
  setTimeout(() => {
    todos.splice(index, 1);
    save();
    render();
  }, 200);
}

function clearCompleted() {
  todos = todos.filter((t) => !t.done);
  save();
  render();
}

function setFilter(filter) {
  currentFilter = filter;
  filterBtns.forEach((b) => b.classList.toggle('active', b.dataset.filter === filter));
  render();
}

addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

list.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const item = btn.closest('.todo-item');
  if (!item) return;
  const index = parseInt(item.dataset.index);
  if (btn.dataset.action === 'toggle') toggleTodo(index);
  if (btn.dataset.action === 'delete') deleteTodo(index);
});

filterBtns.forEach((b) => b.addEventListener('click', () => setFilter(b.dataset.filter)));

clearBtn.addEventListener('click', clearCompleted);

render();
