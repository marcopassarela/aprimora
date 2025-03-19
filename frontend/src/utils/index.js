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
        startEyeTracking();
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

// Ativar rastreamento ocular simulado e fechar o modal
function activateEyeTracking() {
    alert("Rastreamento ocular (simulado) ativado! Mova o cursor e clique para simular uma piscada.");
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

// Iniciar rastreamento ocular simulado com o cursor
function startEyeTracking() {
    document.addEventListener("mousemove", simulateGaze);
    document.addEventListener("click", simulateBlink);
}

// Simula o rastreamento ocular com base no cursor
function simulateGaze(event) {
    if (!eyeTrackingActive) return;

    let x = event.clientX;
    let y = event.clientY;
    console.log(`Olhar simulado em: x=${x}, y=${y}`);

    let menuItems = document.querySelectorAll("#menu ul li a:not(#eye-tracking a)");
    let itemFound = null;

    menuItems.forEach(item => {
        let rect = item.getBoundingClientRect();
        let isCursorOnItem = (
            x >= rect.left && x <= rect.right &&
            y >= rect.top && y <= rect.bottom
        );

        if (isCursorOnItem) {
            item.style.border = "2px solid #007bff";
            itemFound = item;
        } else {
            item.style.border = "";
        }
    });

    if (itemFound && itemFound !== lastItem) {
        lastItem = itemFound;

        // Aguarda 1.5 segundos antes de registrar um clique como piscada
        clearTimeout(gazeTimeout);
        gazeTimeout = setTimeout(() => {
            if (eyeTrackingActive) {
                console.log("Preparado para piscada simulada (clique)!");
            }
        }, 1500);
    }
}

// Simula uma piscada ao clicar
function simulateBlink() {
    if (!eyeTrackingActive || !lastItem) return;

    console.log("Piscada simulada! (Clique detectado)");
    if (lastItem.href && lastItem.href !== "#") {
        window.location.href = lastItem.href;
    }
}

// Parar rastreamento ocular simulado
function stopEyeTracking() {
    document.removeEventListener("mousemove", simulateGaze);
    document.removeEventListener("click", simulateBlink);
    clearTimeout(gazeTimeout);
    document.querySelectorAll("#menu ul li a").forEach(item => item.style.border = "");
    console.log("Rastreamento ocular simulado parado.");
}
