let eyeTrackingActive = false;
let lastItem = null;
let gazeTimeout = null;

// Alternar entre olho fechado e aberto
function toggleEyeTracking() {
    let eyeIcon = document.querySelector("#eye-tracking a");
    eyeTrackingActive = !eyeTrackingActive;

    if (eyeTrackingActive) {
        eyeIcon.textContent = "🙉"; // Olho aberto
        openModal();
    } else {
        eyeIcon.textContent = "🙈"; // Olho fechado
        stopEyeTracking();
    }
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

// Ativar rastreamento ocular e fechar o modal
function activateEyeTracking() {
    alert("Rastreamento ocular ativado! Olhe para um item e pisque para clicar.");
    eyeTrackingActive = true;
    closeModal();
    startEyeTracking();
}

// Cancelar rastreamento ocular
function cancelEyeTracking() {
    let eyeIcon = document.querySelector("#eye-tracking a");
    eyeIcon.textContent = "🙈"; // Olho fechado
    eyeTrackingActive = false;
    stopEyeTracking();
    closeModal();
}

// Fecha o modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById("eye-modal");
    if (event.target === modal) {
        cancelEyeTracking();
    }
};

// Iniciar rastreamento ocular
function startEyeTracking() {
    webgazer.setRegression('ridge')
        .setTracker('clmtrackr')
        .begin();

    webgazer.setGazeListener((data, elapsedTime) => {
        if (!eyeTrackingActive || !data) return;

        let x = data.x;
        let y = data.y;
        console.log(`Olhar em: x=${x}, y=${y}`);

        let menuItems = document.querySelectorAll("#menu ul li a:not(#eye-tracking a)");
        let itemFound = null;

        menuItems.forEach(item => {
            let rect = item.getBoundingClientRect();
            let isGazeOnItem = (
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

        if (itemFound && itemFound !== lastItem) {
            lastItem = itemFound;

            // Aguarda 1.5 segundos antes de registrar a piscada para evitar falsos positivos
            clearTimeout(gazeTimeout);
            gazeTimeout = setTimeout(() => {
                if (eyeTrackingActive) {
                    console.log("Piscada detectada!");
                    if (lastItem && lastItem.href && lastItem.href !== "#") {
                        window.location.href = lastItem.href;
                    }
                }
            }, 1500);
        }
    });
}

// Parar rastreamento ocular
function stopEyeTracking() {
    webgazer.pause();
    clearTimeout(gazeTimeout);
    document.querySelectorAll("#menu ul li a").forEach(item => item.style.border = "");
    console.log("WebGazer.js parado");
}
