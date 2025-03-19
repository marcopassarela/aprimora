let eyeTrackingActive = false; // Variável para controlar o estado do rastreamento ocular

// Função para alternar entre olho fechado e aberto
function toggleEyeTracking() {
    let eyeIcon = document.querySelector("#eye-tracking a");

    if (eyeTrackingActive) {
        eyeIcon.textContent = "🙈"; // Olho fechado
        closeModal();
        stopEyeTracking();
    } else {
        eyeIcon.textContent = "🙉"; // Olho aberto
        openModal();
    }

    eyeTrackingActive = !eyeTrackingActive;
    console.log("Estado do rastreamento:", eyeTrackingActive);
}

// Abre o modal
function openModal() {
    const modal = document.getElementById("eye-modal");
    if (modal) {
        modal.style.display = "flex";
        console.log("Modal aberto");
    } else {
        console.error("Modal não encontrado");
    }
}

// Fecha o modal e sincroniza o ícone
function closeModal() {
    const modal = document.getElementById("eye-modal");
    if (modal) {
        modal.style.display = "none";
        let eyeIcon = document.querySelector("#eye-tracking a");
        eyeIcon.textContent = eyeTrackingActive ? "🙉" : "🙈";
        console.log("Modal fechado");
    } else {
        console.error("Modal não encontrado");
    }
}

// Ativa o rastreamento ocular
function activateEyeTracking() {
    alert("Rastreamento ocular ativado! Olhe para um item e pisque para clicar.");
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
    const modal = document.getElementById("eye-modal");
    if (event.target === modal) {
        eyeTrackingActive = false;
        stopEyeTracking();
        closeModal();
    }
};

// Função para iniciar o rastreamento ocular
function startEyeTracking() {
    console.log("Iniciando WebGazer...");
    const menuItems = document.querySelectorAll("#menu ul li a:not(#eye-tracking a)");

    try {
        webgazer.setGazeListener(function(data, elapsedTime) {
            if (data == null || !eyeTrackingActive) {
                console.log("Dados nulos ou rastreamento desativado");
                return;
            }

            let x = data.x;
            let y = data.y;
            console.log(`Olhar em: x=${x}, y=${y}`);

            let itemFound = null;
            menuItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                const isGazeOnItem = (
                    x >= rect.left && x <= rect.right &&
                    y >= rect.top && y <= rect.bottom
                );
                if (isGazeOnItem) {
                    itemFound = item;
                    item.style.border = "2px solid #007bff"; // Destaca o item
                } else {
                    item.style.border = ""; // Remove destaque
                }
            });

            if (itemFound) {
                console.log(`Olhando para: ${itemFound.textContent}`);
            }
        }).setBlinkListener(function(blinkData) {
            if (!eyeTrackingActive || blinkData == null) return;

            if (blinkData.blink) {
                console.log("Piscada detectada!");
                menuItems.forEach(item => {
                    const rect = item.getBoundingClientRect();
                    const x = webgazer.getCurrentPrediction().x;
                    const y = webgazer.getCurrentPrediction().y;
                    if (
                        x >= rect.left && x <= rect.right &&
                        y >= rect.top && y <= rect.bottom
                    ) {
                        console.log(`Clicando em: ${item.textContent}`);
                        if (item.href && item.href !== "#") {
                            window.location.href = item.href;
                        }
                    }
                });
            }
        }).begin();

        webgazer.showVideoPreview(false);
        webgazer.applyKalmanFilter(true);
        // webgazer.showPredictionPoints(true); // Descomente para calibrar
    } catch (error) {
        console.error("Erro ao iniciar WebGazer:", error);
    }
}

// Função para parar o rastreamento ocular
function stopEyeTracking() {
    try {
        webgazer.pause();
        webgazer.clearGazeListener();
        webgazer.clearBlinkListener();
        console.log("Rastreamento ocular parado");
        const menuItems = document.querySelectorAll("#menu ul li a:not(#eye-tracking a)");
        menuItems.forEach(item => item.style.border = ""); // Remove destaques
    } catch (error) {
        console.error("Erro ao parar WebGazer:", error);
    }
}