let eyeTrackingActive = false; // Variável para controlar o estado do rastreamento ocular

// Função para alternar entre olho fechado e aberto
function toggleEyeTracking() {
    let eyeIcon = document.querySelector("#eye-tracking a");

    if (eyeTrackingActive) {
        eyeIcon.textContent = "🙈"; // Olho fechado
        closeModal(); // Fecha o modal se já estiver aberto
        stopEyeTracking(); // Para o rastreamento ocular
    } else {
        eyeIcon.textContent = "🙉"; // Olho aberto
        openModal(); // Abre o modal
    }

    // Alterna o estado do rastreamento ocular
    eyeTrackingActive = !eyeTrackingActive;
}

// Abre o modal
function openModal() {
    document.getElementById("eye-modal").style.display = "flex";
}

// Fecha o modal e sincroniza o ícone com o estado
function closeModal() {
    document.getElementById("eye-modal").style.display = "none";
    
    let eyeIcon = document.querySelector("#eye-tracking a");
    if (eyeTrackingActive) {
        eyeIcon.textContent = "🙉"; // Olho aberto (rastreamento ativo)
    } else {
        eyeIcon.textContent = "🙈"; // Olho fechado (rastreamento desativado)
    }
}

// Ativa o rastreamento ocular e fecha o modal
function activateEyeTracking() {
    alert("Rastreamento ocular ativado!");
    eyeTrackingActive = true; // Define o estado como ativo
    startEyeTracking(); // Inicia o rastreamento ocular
    closeModal(); // Fecha o modal mantendo o ícone "🙉"
}

// Cancela o rastreamento ocular, fecha o modal e retorna o ícone ao estado original
function cancelEyeTracking() {
    let eyeIcon = document.querySelector("#eye-tracking a");
    eyeIcon.textContent = "🙈"; // Olho fechado
    eyeTrackingActive = false; // Reseta o estado
    stopEyeTracking(); // Para o rastreamento ocular
    closeModal();
}

// Fecha o modal ao clicar fora do conteúdo e desativa o rastreamento
window.onclick = function(event) {
    let modal = document.getElementById("eye-modal");
    if (event.target === modal) {
        eyeTrackingActive = false; // Desativa o rastreamento ao clicar fora
        stopEyeTracking(); // Para o rastreamento ocular
        closeModal(); // Fecha o modal e atualiza o ícone
    }
};

// Função para iniciar o rastreamento ocular com WebGazer
function startEyeTracking() {
    // Seleciona todos os links do menu
    const menuItems = document.querySelectorAll("#menu ul li a:not(#eye-tracking a)");

    webgazer.setGazeListener(function(data, elapsedTime) {
        if (data == null || !eyeTrackingActive) return; // Só processa se ativado

        let x = data.x; // Posição horizontal do olhar
        let y = data.y; // Posição vertical do olhar

        // Verifica se o olhar está sobre algum item do menu
        menuItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isGazeOnItem = (
                x >= rect.left &&
                x <= rect.right &&
                y >= rect.top &&
                y <= rect.bottom
            );

            if (isGazeOnItem) {
                // Adiciona um destaque visual temporário (opcional)
                item.style.backgroundColor = "#ffff99"; // Amarelo claro
                setTimeout(() => {
                    item.style.backgroundColor = ""; // Remove o destaque
                    // Simula o clique no item
                    if (item.href && item.href !== "#") {
                        window.location.href = item.href; // Navega para o link
                    }
                }, 1000); // Aguarda 1 segundo antes de clicar (ajuste conforme necessário)
            }
        });

        // Rolar a página (mantido do código anterior)
        if (y < 100) {
            window.scrollBy(0, -10); // Rola para cima
        } else if (y > window.innerHeight - 100) {
            window.scrollBy(0, 10); // Rola para baixo
        }
    }).begin();

    // Configurações opcionais do WebGazer
    webgazer.showVideoPreview(false); // Oculta o preview de vídeo
    webgazer.applyKalmanFilter(true); // Melhora a precisão com filtro
}

// Função para parar o rastreamento ocular
function stopEyeTracking() {
    webgazer.pause(); // Pausa o rastreamento
    webgazer.clearGazeListener(); // Remove o listener
}