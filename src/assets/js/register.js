// src/assets/js/register.js
const API_BASE_URL = 'http://localhost:3000';

const registerForm = document.getElementById('register-form');
const errorMessage = document.getElementById('error-message');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showError('Preencha todos os campos');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erro ao registrar');

        localStorage.setItem('token', data.token);
        hideError();
        registerForm.reset();
        alert('Registro concluído com sucesso! Redirecionando para o login...');
        setTimeout(() => {
            window.location.href = 'assets/pages/login.html';
        }, 1000);
    } catch (error) {
        showError(error.message);
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}