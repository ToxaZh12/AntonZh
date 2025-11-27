const STORAGE_KEY = 'users_db';

function loadUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveUsers(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function addUser(user) {
  const list = loadUsers();
  user.id = Date.now();
  list.push(user);
  saveUsers(list);
}

function updateUser(id, updated) {
  const list = loadUsers();
  const index = list.findIndex(u => u.id === id);
  list[index] = { id, ...updated };
  saveUsers(list);
}

function deleteUser(id) {
  saveUsers(loadUsers().filter(u => u.id !== id));
}

const form = document.getElementById('userForm');
const tbody = document.getElementById('tableBody');

function render() {
  tbody.innerHTML = '';
  loadUsers().forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td class="actions">
        <button onclick="editUser(${user.id})">Изменить</button>
        <button onclick="deleteUserUI(${user.id})">Удалить</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const id = document.getElementById('userId').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  if (id) updateUser(Number(id), { name, email });
  else addUser({ name, email });

  form.reset();
  render();
});

function editUser(id) {
  const user = loadUsers().find(u => u.id === id);
  document.getElementById('userId').value = user.id;
  document.getElementById('name').value = user.name;
  document.getElementById('email').value = user.email;
}

function deleteUserUI(id) {
  deleteUser(id);
  render();
}

render();
