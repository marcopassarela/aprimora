let eyeTrackingActive = false; // Variável para controlar o estado do rastreamento ocular
let lastSelectedItem = null; // Para rastrear o último item selecionado

// Função para alternar entre olho fechado e aberto
function toggleEyeTracking() {
    let eyeIcon = document.querySelector("#eye-tracking a");

    if (eyeTrackingActive) {
        eyeIcon.textContent = "🙈"; // Olho fechado
        closeModal(); // Fecha o modal
        stopEyeTracking(); // Para o rastreamento
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

// Fecha o modal e sincroniza o ícone
function closeModal() {
    document.getElementById("eye-modal").style.display = "none";
    
    let eyeIcon = document.querySelector("#eye-tracking a");
    if (eyeTrackingActive) {
        eyeIcon.textContent = "🙉"; // Olho aberto
    } else {
        eyeIcon.textContent = "🙈"; // Olho fechado
    }
}

// Ativa o rastreamento ocular
function activateEyeTracking() {
    alert("Rastreamento ocular ativado! Olhe para os itens do menu para destacá-los.");
    eyeTrackingActive = true;
    startEyeTracking();
    closeModal();
}

// Cancela o rastreamento ocular
function cancelEyeTracking() {
    let eyeIcon = document.querySelector("#eye-tracking a");
    eyeIcon.textContent = "🙈";
    eyeTrackingActive = false;
    stopEyeTracking();
    closeModal();
}

// Fecha o modal ao clicar fora
window.onclick = function(event) {
    let modal = document.getElementById("eye-modal");
    if (event.target === modal) {
        eyeTrackingActive = false;
        stopEyeTracking();
        closeModal();
    }
};

// Função para iniciar o rastreamento ocular
function startEyeTracking() {
    const menuItems = document.querySelectorAll("#menu ul li a:not(#eye-tracking a)");

    console.log("Iniciando rastreamento ocular...");

    webgazer.setGazeListener(function(data, elapsedTime) {
        if (data == null || !eyeTrackingActive) {
            console.log("Dados nulos ou rastreamento desativado.");
            return;
        }

        let x = data.x; // Posição horizontal do olhar
        let y = data.y; // Posição vertical do olhar

        // Log das coordenadas para depuração
        console.log(`Olhar em: x=${x}, y=${y}`);

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

            console.log(`Item: ${item.textContent}, Rect: left=${rect.left}, right=${rect.right}, top=${rect.top}, bottom=${rect.bottom}, Gaze: ${isGazeOnItem}`);

            if (isGazeOnItem) {
                itemFound = item;
            }
        });

        // Destaca o item atual e remove destaque do anterior
        if (itemFound) {
            if (lastSelectedItem !== itemFound) {
                if (lastSelectedItem) {
                    lastSelectedItem.style.border = "";
                }
                itemFound.style.border = "2px solid #007bff"; // Destaca o item
                lastSelectedItem = itemFound;
                console.log(`Item selecionado: ${itemFound.textContent}`);
            }
        } else {
            if (lastSelectedItem) {
                lastSelectedItem.style.border = "";
                lastSelectedItem = null;
                console.log("Nenhum item selecionado.");
            }
        }
    }).begin();

    // Configurações do WebGazer
    webgazer.showVideoPreview(false); // Oculta o preview
    webgazer.applyKalmanFilter(true); // Melhora a precisão
    // webgazer.showPredictionPoints(true); // Descomente para calibrar manualmente
}

// Função para parar o rastreamento ocular
function stopEyeTracking() {
    webgazer.pause();
    webgazer.clearGazeListener();
    if (lastSelectedItem) {
        lastSelectedItem.style.border = ""; // Remove destaque
        lastSelectedItem = null;
    }
    console.log("Rastreamento ocular parado.");
}