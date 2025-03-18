// app.js (frontend)
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        // Faz a requisição de login para o backend
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao fazer login');
        }

        // Se o login for bem-sucedido, armazena o token no localStorage
        localStorage.setItem('token', data.token);
        errorMessage.style.display = 'none';
        
        // Redireciona para uma página protegida ou mostra mensagem de sucesso
        alert('Login realizado com sucesso!');
        // window.location.href = '/pagina-protegida.html'; // Descomente e ajuste se tiver uma página específica

    } catch (error) {
        // Mostra mensagem de erro
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
});

// Função auxiliar para verificar se usuário está logado
function isLoggedIn() {
    return !!localStorage.getItem('token');
}

// Exemplo de como usar o token para uma requisição protegida
async function fetchProtectedData() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Por favor, faça login primeiro');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/protected', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao acessar dados protegidos');
        }

        console.log('Dados protegidos:', data);
    } catch (error) {
        console.error('Erro:', error.message);
    }
}