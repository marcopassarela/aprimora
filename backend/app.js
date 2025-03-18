// app.js (frontend)
const API_BASE_URL = 'http://localhost:3000';

const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Validação básica no frontend
    if (!username || !password) {
        showError('Por favor, preencha todos os campos');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao fazer login');
        }

        localStorage.setItem('token', data.token);
        hideError();
        loginForm.reset(); // Limpa o formulário
        alert('Login realizado com sucesso!');
        // Redireciona para uma página protegida (descomente se desejar)
        // window.location.href = '/pagina-protegida.html';

    } catch (error) {
        showError(error.message);
    }
});

// Funções utilitárias
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function isLoggedIn() {
    return !!localStorage.getItem('token');
}

async function fetchProtectedData() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Por favor, faça login primeiro');
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/protected`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao acessar dados protegidos');
        }

        console.log('Dados protegidos:', data);
        return data;
    } catch (error) {
        console.error('Erro:', error.message);
        return null;
    }
}

// Verifica login ao carregar a página
if (isLoggedIn()) {
    console.log('Usuário já está logado');
    // fetchProtectedData(); // Chama automaticamente se desejar
}