let eyeTrackingActive = false;
let lastItem = null;

function toggleEyeTracking() {
    let eyeIcon = document.querySelector("#eye-tracking a");
    eyeTrackingActive = !eyeTrackingActive;

    if (eyeTrackingActive) {
        eyeIcon.textContent = "👁️‍🗨️"; // Olho aberto (ativo)
        startEyeTracking();
    } else {
        eyeIcon.textContent = "👁️"; // Olho fechado (desativado)
        stopEyeTracking();
    }
}

function startEyeTracking() {
    document.addEventListener("mousemove", trackGaze);
    document.addEventListener("click", simulateBlink);
}

function stopEyeTracking() {
    document.removeEventListener("mousemove", trackGaze);
    document.removeEventListener("click", simulateBlink);
    clearHighlights();
}

function trackGaze(event) {
    if (!eyeTrackingActive) return;

    let x = event.clientX;
    let y = event.clientY;

    let menuItems = document.querySelectorAll("#menu ul li a:not(#eye-tracking a)");
    let itemFound = null;

    menuItems.forEach(item => {
        let rect = item.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            itemFound = item;
            item.classList.add("highlight");
        } else {
            item.classList.remove("highlight");
        }
    });

    lastItem = itemFound;
}

function simulateBlink() {
    if (!eyeTrackingActive || !lastItem) return;

    console.log("Piscada detectada! Simulando clique.");
    lastItem.click();
}

function clearHighlights() {
    document.querySelectorAll(".highlight").forEach(item => item.classList.remove("highlight"));
}
