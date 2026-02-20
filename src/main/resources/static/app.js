const API_BASE_URL = 'http://localhost:8080';

// DOM Elements
const loginBox = document.getElementById('loginBox');
const registerBox = document.getElementById('registerBox');
const dashboardBox = document.getElementById('dashboardBox');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');
const testApiBtn = document.getElementById('testApiBtn');

const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');
const apiResponse = document.getElementById('apiResponse');

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
        showDashboard(username, token);
    }
});

// Switch between login and register
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginBox.classList.add('hidden');
    registerBox.classList.remove('hidden');
    clearMessages();
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerBox.classList.add('hidden');
    loginBox.classList.remove('hidden');
    clearMessages();
});

// Register Form Submit
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.text();
        
        if (response.ok) {
            const jsonData = JSON.parse(data);
            showMessage(registerMessage, 'Registration successful! Logging you in...', 'success');
            
            // Save token and username
            localStorage.setItem('token', jsonData.token);
            localStorage.setItem('username', jsonData.username);
            
            setTimeout(() => {
                showDashboard(jsonData.username, jsonData.token);
            }, 1000);
        } else {
            showMessage(registerMessage, data || 'Registration failed', 'error');
        }
    } catch (error) {
        showMessage(registerMessage, 'Error: ' + error.message, 'error');
    }
});

// Login Form Submit
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.text();
        
        if (response.ok) {
            const jsonData = JSON.parse(data);
            showMessage(loginMessage, 'Login successful!', 'success');
            
            // Save token and username
            localStorage.setItem('token', jsonData.token);
            localStorage.setItem('username', jsonData.username);
            
            setTimeout(() => {
                showDashboard(jsonData.username, jsonData.token);
            }, 500);
        } else {
            showMessage(loginMessage, data || 'Login failed', 'error');
        }
    } catch (error) {
        showMessage(loginMessage, 'Error: ' + error.message, 'error');
    }
});

// Test Protected API
testApiBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    await fetchProtectedData(token);
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    dashboardBox.classList.add('hidden');
    loginBox.classList.remove('hidden');
    
    // Clear forms
    loginForm.reset();
    registerForm.reset();
    apiResponse.classList.remove('show');
    clearMessages();
});

// Helper Functions
function showDashboard(username, token) {
    loginBox.classList.add('hidden');
    registerBox.classList.add('hidden');
    dashboardBox.classList.remove('hidden');
    
    document.getElementById('username').textContent = username;
    document.getElementById('token').textContent = token;
    
    // Automatically fetch data when dashboard is shown
    fetchProtectedData(token);
}

async function fetchProtectedData(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/data`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        apiResponse.classList.add('show');
        apiResponse.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
        apiResponse.classList.add('show');
        apiResponse.innerHTML = `<pre style="color: red;">Error: ${error.message}</pre>`;
    }
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
}

function clearMessages() {
    loginMessage.className = 'message';
    registerMessage.className = 'message';
    apiResponse.classList.remove('show');
}
