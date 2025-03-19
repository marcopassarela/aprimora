let eyeTrackingActive = false;
let faceMesh = null;
let camera = null;
let lastSelectedItem = null;

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
}

function openModal() {
    const modal = document.getElementById("eye-modal");
    if (modal) modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById("eye-modal");
    if (modal) {
        modal.style.display = "none";
        let eyeIcon = document.querySelector("#eye-tracking a");
        eyeIcon.textContent = eyeTrackingActive ? "🙉" : "🙈";
    }
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

    // Inicializa o Face Mesh
    faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        selfieMode: true
    });

    faceMesh.onResults((results) => {
        if (!eyeTrackingActive || !results.multiFaceLandmarks) {
            console.log("Nenhum rosto detectado ou rastreamento desativado");
            highlightBox.style.display = "none";
            return;
        }

        const landmarks = results.multiFaceLandmarks[0];
        const leftEye = landmarks[159]; // Ponto superior olho esquerdo
        const rightEye = landmarks[386]; // Ponto superior olho direito
        const gazeX = (leftEye.x + rightEye.x) / 2 * window.innerWidth;
        const gazeY = (leftEye.y + rightEye.y) / 2 * window.innerHeight;

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
                // Posiciona o quadrado de destaque
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

        if (eyeDistance < 0.02) { // Piscada detectada
            console.log("Piscada detectada!");
            if (lastSelectedItem && lastSelectedItem.href && lastSelectedItem.href !== "#") {
                window.location.href = lastSelectedItem.href;
            }
        }
    });

    // Configura a câmera
    const videoElement = document.createElement("video");
    camera = new Camera(videoElement, {
        onFrame: async () => {
            await faceMesh.send({ image: videoElement });
        },
        width: 640,
        height: 480
    });

    try {
        await camera.start();
        console.log("Câmera iniciada com sucesso");
    } catch (error) {
        console.error("Erro ao iniciar a câmera:", error);
        alert("Não foi possível acessar a câmera. Verifique as permissões.");
        eyeTrackingActive = false;
        closeModal();
    }
}

async function stopEyeTracking() {
    if (camera) {
        camera.stop();
        camera = null;
    }
    if (faceMesh) {
        faceMesh.close();
        faceMesh = null;
    }
    const highlightBox = document.getElementById("highlight-box");
    if (highlightBox) highlightBox.style.display = "none";
    console.log("Rastreamento ocular parado");
}