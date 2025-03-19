let eyeTrackingActive = false;

// Função para alternar entre olho fechado e aberto
function toggleEyeTracking() {
    let eyeIcon = document.querySelector("#eye-icon");
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
    document.getElementById("eye-modal").style.display = "flex";
}

// Fecha o modal
function closeModal() {
    document.getElementById("eye-modal").style.display = "none";
}

// Ativa o rastreamento ocular simulado pelo cursor do mouse
function activateEyeTracking() {
    alert("Rastreamento ativado! Passe o cursor sobre um item e clique para selecionar.");
    eyeTrackingActive = true;
    closeModal();
    startEyeTracking();
}

// Cancela o rastreamento ocular e reseta os estados
function cancelEyeTracking() {
    let eyeIcon = document.querySelector("#eye-icon");
    eyeIcon.textContent = "🙈"; // Olho fechado
    eyeTrackingActive = false;
    stopEyeTracking();
    closeModal();
}

// Fecha o modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById("eye-modal");
    if (event.target === modal) {
        cancelEyeTracking();
    }
};

// Simulação do rastreamento com o cursor
document.addEventListener("mousemove", (event) => {
    if (eyeTrackingActive) {
        let elements = document.querySelectorAll("#menu ul li a:not(#eye-icon)");
        elements.forEach((item) => {
            const rect = item.getBoundingClientRect();
            if (
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom
            ) {
                item.classList.add("tracked");
            } else {
                item.classList.remove("tracked");
            }
        });
    }
});

// Simulação de clique ao piscar (pressionar espaço)
document.addEventListener("keydown", (event) => {
    if (eyeTrackingActive && event.code === "Space") {
        let activeElement = document.querySelector(".tracked");
        if (activeElement) {
            window.location.href = activeElement.href;
        }
    }
});
