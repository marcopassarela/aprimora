let eyeTrackingActive = false;

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
}

// Abre o modal
function openModal() {
    const modal = document.getElementById("eye-modal");
    if (modal) modal.style.display = "flex";
}

// Fecha o modal
function closeModal() {
    const modal = document.getElementById("eye-modal");
    if (modal) {
        modal.style.display = "none";
        let eyeIcon = document.querySelector("#eye-tracking a");
        eyeIcon.textContent = eyeTrackingActive ? "🙉" : "🙈";
    }
}

// Ativa o rastreamento ocular e fecha o modal
function activateEyeTracking() {
    alert("Rastreamento ocular ativado! Olhe para um item e pisque para clicar.");
    eyeTrackingActive = true;
    closeModal();
    startEyeTracking();
}

// Cancela o rastreamento ocular, fecha o modal e retorna o ícone ao estado original
function cancelEyeTracking() {
    let eyeIcon = document.querySelector("#eye-tracking a");
    eyeIcon.textContent = "🙈"; // Olho fechado
    eyeTrackingActive = false;
    stopEyeTracking();
    closeModal();
}

// Fecha o modal ao clicar fora do conteúdo
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
    webgazer.setRegression('ridge') // Usando um algoritmo de regressão
        .setTracker('clmtrackr') // Usando o tracker CLM
        .begin();

    webgazer.setGazeListener(function(data, elapsedTime) {
        if (eyeTrackingActive && data) {
            const x = data.x;
            const y = data.y;

            console.log(`Olhar em: x=${x}, y=${y}`);

            const menuItems = document.querySelectorAll("#menu ul li a:not(#eye-tracking a)");
            let itemFound = null;

            menuItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                const isGazeOnItem = (
                    x >= rect.left && x <= rect.right &&
                    y >= rect.top && y <= rect.bottom
                );

                if (isGazeOnItem) {
                    item.style.border = "2px solid #007bff";
                    itemFound = item;
                } else {
                    item.style.border = "";
                }
            });

            if (itemFound && data.blink) {
                console.log("Piscada detectada!");
                if (itemFound.href && itemFound.href !== "#") {
                    window.location.href = itemFound.href;
                }
            }
        }
    });
}

// Função para parar o rastreamento ocular
function stopEyeTracking() {
    webgazer.pause();
    const menuItems = document.querySelectorAll("#menu ul li a:not(#eye-tracking a)");
    menuItems.forEach(item => item.style.border = "");
    console.log("WebGazer.js parado");
}
