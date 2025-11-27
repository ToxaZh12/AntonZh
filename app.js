// Вставь свои ключи сюда
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_KEY = "YOUR_ANON_KEY";

const supabase = supabasejs.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadUsers() {
  const { data } = await supabase.from("users").select("*").order("id");
  return data || [];
}

async function addUser(user) {
  await supabase.from("users").insert(user);
}

async function updateUser(id, updated) {
  await supabase.from("users").update(updated).eq("id", id);
}

async function deleteUser(id) {
  await supabase.from("users").delete().eq("id", id);
}

const form = document.getElementById("userForm");
const tbody = document.getElementById("tableBody");

async function render() {
  const users = await loadUsers();
  tbody.innerHTML = "";
  users.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>
        <button onclick="editUser(${u.id})">Изменить</button>
        <button onclick="deleteUserUI(${u.id})">Удалить</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  const id = document.getElementById("userId").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  if (id) await updateUser(Number(id), { name, email });
  else await addUser({ name, email });

  form.reset();
  await render();
});

async function editUser(id) {
  const users = await loadUsers();
  const user = users.find(u => u.id === id);
  document.getElementById("userId").value = user.id;
  document.getElementById("name").value = user.name;
  document.getElementById("email").value = user.email;
}

async function deleteUserUI(id) {
  await deleteUser(id);
  await render();
}

render();
