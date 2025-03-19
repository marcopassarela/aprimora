let eyeTrackingActive = false;
let detector = null;
let video = null;
let lastSelectedItem = null;
let rafId = null;

function toggleEyeTracking() {
    let eyeIcon = document.querySelector("#eye-tracking a");
    if (eyeTrackingActive) {
        eyeIcon.textContent = "🙈";
        closeModal();
        stopEyeTracking();
    } else {
        eyeIcon.textContent = "🙉";
        openModal();
    }
    eyeTrackingActive = !eyeTrackingActive;
    console.log("Estado do rastreamento:", eyeTrackingActive);
}

function openModal() {
    const modal = document.getElementById("eye-modal");
    if (modal) modal.style.display = "flex";
    console.log("Modal aberto");
}

function closeModal() {
    const modal = document.getElementById("eye-modal");
    if (modal) {
        modal.style.display = "none";
        let eyeIcon = document.querySelector("#eye-tracking a");
        eyeIcon.textContent = eyeTrackingActive ? "🙉" : "🙈";
    }
    console.log("Modal fechado");
}

function activateEyeTracking() {
    alert("Rastreamento ocular ativado! Olhe para um item e pisque para clicar.");
    eyeTrackingActive = true;
    closeModal();
    startEyeTracking();
}

function cancelEyeTracking() {
    let eyeIcon = document.querySelector("#eye-tracking a");
    eyeIcon.textContent = "🙈";
    eyeTrackingActive = false;
    stopEyeTracking();
    closeModal();
}

window.onclick = function(event) {
    const modal = document.getElementById("eye-modal");
    if (event.target === modal) {
        eyeTrackingActive = false;
        stopEyeTracking();
        closeModal();
    }
};

async function startEyeTracking() {
    console.log("Iniciando rastreamento ocular...");
    const menuItems = document.querySelectorAll("#menu ul li a:not(#eye-tracking a)");
    const highlightBox = document.getElementById("highlight-box");

    // Carrega o modelo
    console.log("Carregando modelo Face Landmarks Detection...");
    try {
        detector = await faceLandmarksDetection.load(
            faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
        );
        console.log("Modelo carregado com sucesso");
    } catch (error) {
        console.error("Erro ao carregar o modelo:", error);
        alert("Erro ao carregar o modelo de rastreamento ocular: " + error.message);
        eyeTrackingActive = false;
        closeModal();
        return;
    }

    // Configura a câmera
    video = document.createElement("video");
    video.setAttribute("playsinline", "");
    video.width = 640;
    video.height = 480;

    console.log("Solicitando acesso à câmera...");
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" }
        });
        video.srcObject = stream;
        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                resolve();
            };
        });
        console.log("Câmera iniciada com sucesso");
    } catch (error) {
        console.error("Erro ao iniciar a câmera:", error);
        alert("Não foi possível acessar a câmera: " + error.message + ". Verifique as permissões e HTTPS.");
        eyeTrackingActive = false;
        closeModal();
        return;
    }

    // Loop de detecção
    async function detectFrame() {
        if (!eyeTrackingActive || !detector || !video) {
            highlightBox.style.display = "none";
            console.log("Rastreamento parado ou componentes ausentes");
            return;
        }

        try {
            const faces = await detector.estimateFaces({ input: video });
            if (faces.length === 0) {
                console.log("Nenhum rosto detectado");
                highlightBox.style.display = "none";
                rafId = requestAnimationFrame(detectFrame);
                return;
            }

            const landmarks = faces[0].keypoints;
            const leftEye = landmarks[159]; // Ponto superior olho esquerdo
            const rightEye = landmarks[386]; // Ponto superior olho direito
            const gazeX = (leftEye.x + rightEye.x) / 2;
            const gazeY = (leftEye.y + rightEye.y) / 2;

            console.log(`Olhar em: x=${gazeX}, y=${gazeY}`);

            // Verifica o item sob o olhar
            let itemFound = null;
            menuItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                const isGazeOnItem = (
                    gazeX >= rect.left && gazeX <= rect.right &&
                    gazeY >= rect.top && gazeY <= rect.bottom
                );
                if (isGazeOnItem) {
                    itemFound = item;
                }
            });

            if (itemFound) {
                if (lastSelectedItem !== itemFound) {
                    lastSelectedItem = itemFound;
                    console.log(`Olhando para: ${itemFound.textContent}`);
                    const rect = itemFound.getBoundingClientRect();
                    highlightBox.style.display = "block";
                    highlightBox.style.left = `${rect.left - 2}px`;
                    highlightBox.style.top = `${rect.top - 2}px`;
                    highlightBox.style.width = `${rect.width + 4}px`;
                    highlightBox.style.height = `${rect.height + 4}px`;
                }
            } else {
                lastSelectedItem = null;
                highlightBox.style.display = "none";
            }

            // Detecção de piscada
            const leftEyeTop = landmarks[159].y;
            const leftEyeBottom = landmarks[145].y;
            const eyeDistance = leftEyeBottom - leftEyeTop;

            if (eyeDistance < 15) {
                console.log("Piscada detectada!");
                if (lastSelectedItem && lastSelectedItem.href && lastSelectedItem.href !== "#") {
                    window.location.href = lastSelectedItem.href;
                }
            }
        } catch (error) {
            console.error("Erro durante detecção:", error);
        }

        rafId = requestAnimationFrame(detectFrame);
    }

    detectFrame();
}

async function stopEyeTracking() {
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
    }
    detector = null;
    const highlightBox = document.getElementById("highlight-box");
    if (highlightBox) highlightBox.style.display = "none";
    console.log("Rastreamento ocular parado");
}