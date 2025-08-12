let token = localStorage.getItem('token') || '';

const api = 'http://localhost:3000/clients';

function showDashboard(show) {
    document.getElementById('dashboard').style.display = show ? '' : 'none';
    document.getElementById('loginBox').style.display = show ? 'none' : '';
}

async function fetchClients() {
    const res = await fetch(api, {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.status === 401) return logout();
    const clients = await res.json();
    const tbody = document.getElementById('clientTable');
    tbody.innerHTML = '';
    clients.forEach(c => {
        tbody.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editClient(${c.id},'${c.name}','${c.email}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteClient(${c.id})">Delete</button>
        </td>
      </tr>
    `;
    });
}

document.getElementById('clientForm').onsubmit = async function (e) {
    e.preventDefault();
    const id = document.getElementById('clientId').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${api}/${id}` : api;
    await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ name, email })
    });
    this.reset();
    document.getElementById('saveBtn').textContent = 'Add';
    fetchClients();
};

window.editClient = function (id, name, email) {
    document.getElementById('clientId').value = id;
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('saveBtn').textContent = 'Update';
};

window.deleteClient = async function (id) {
    if (confirm('Are you sure?')) {
        await fetch(`${api}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        fetchClients();
    }
};

document.getElementById('loginForm').onsubmit = async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (res.ok) {
        const data = await res.json();
        token = data.token;
        localStorage.setItem('token', token);
        showDashboard(true);
        fetchClients();
    } else {
        document.getElementById('loginError').textContent = 'Invalid credentials';
    }
};

window.logout = function () {
    token = '';
    localStorage.removeItem('token');
    showDashboard(false);
};

if (token) {
    showDashboard(true);
    fetchClients();
} else {
    showDashboard(false);
}