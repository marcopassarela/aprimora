let eyeTrackingActive = false; // Variável para controlar o estado do rastreamento ocular
let gazeTimeout = null; // Para controlar o tempo de foco
let lastSelectedItem = null; // Para rastrear o último item selecionado

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
    alert("Rastreamento ocular ativado! Olhe para um item do menu por 2 segundos para selecioná-lo.");
    eyeTrackingActive = true;
    startEyeTracking();
    closeModal();
}

// Cancela o rastreamento ocular, fecha o modal e retorna o ícone ao estado original
function cancelEyeTracking() {
    let eyeIcon = document.querySelector("#eye-tracking a");
    eyeIcon.textContent = "🙈";
    eyeTrackingActive = false;
    stopEyeTracking();
    closeModal();
}

// Fecha o modal ao clicar fora do conteúdo e desativa o rastreamento
window.onclick = function(event) {
    let modal = document.getElementById("eye-modal");
    if (event.target === modal) {
        eyeTrackingActive = false;
        stopEyeTracking();
        closeModal();
    }
};

// Função para iniciar o rastreamento ocular com WebGazer
function startEyeTracking() {
    const menuItems = document.querySelectorAll("#menu ul li a:not(#eye-tracking a)");

    webgazer.setGazeListener(function(data, elapsedTime) {
        if (data == null || !eyeTrackingActive) return;

        let x = data.x; // Posição horizontal do olhar
        let y = data.y; // Posição vertical do olhar

        let itemFound = null;

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
                itemFound = item;
            }
        });

        // Lógica de seleção e clique
        if (itemFound) {
            if (lastSelectedItem !== itemFound) {
                // Remove destaque do item anterior, se houver
                if (lastSelectedItem) {
                    lastSelectedItem.style.border = "";
                }
                // Destaca o item atual
                itemFound.style.border = "2px solid #007bff"; // Borda azul para feedback
                lastSelectedItem = itemFound;

                // Cancela qualquer timeout anterior
                if (gazeTimeout) {
                    clearTimeout(gazeTimeout);
                }

                // Define um timeout de 2 segundos para disparar o clique
                gazeTimeout = setTimeout(() => {
                    if (itemFound.href && itemFound.href !== "#") {
                        window.location.href = itemFound.href; // Navega para o link
                    }
                }, 2000); // 2 segundos
            }
        } else {
            // Remove destaque e cancela o timeout se o olhar sair do item
            if (lastSelectedItem) {
                lastSelectedItem.style.border = "";
                lastSelectedItem = null;
            }
            if (gazeTimeout) {
                clearTimeout(gazeTimeout);
            }
        }
    }).begin();

    // Configurações do WebGazer
    webgazer.showVideoPreview(false); // Oculta o preview de vídeo
    webgazer.applyKalmanFilter(true); // Melhora a precisão
}

// Função para parar o rastreamento ocular
function stopEyeTracking() {
    webgazer.pause();
    webgazer.clearGazeListener();
    if (lastSelectedItem) {
        lastSelectedItem.style.border = ""; // Remove destaque ao parar
        lastSelectedItem = null;
    }
    if (gazeTimeout) {
        clearTimeout(gazeTimeout); // Cancela qualquer timeout pendente
    }
}