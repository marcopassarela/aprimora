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
    const menuItems = document.querySelectorAll("#menu ul li a:not(#eye-tracking a)");

    // Inicializa o Face Mesh
    faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
    faceMesh.setOptions({
        maxNumFaces: 1, // Apenas um rosto
        refineLandmarks: true, // Mais precisão nos olhos
        selfieMode: true // Inverte para câmera frontal
    });

    faceMesh.onResults((results) => {
        if (!eyeTrackingActive || !results.multiFaceLandmarks) return;

        const landmarks = results.multiFaceLandmarks[0];
        if (!landmarks) return;

        // Calcula a posição média dos olhos para determinar o olhar
        const leftEye = landmarks[159]; // Ponto superior do olho esquerdo
        const rightEye = landmarks[386]; // Ponto superior do olho direito
        const gazeX = (leftEye.x + rightEye.x) / 2 * window.innerWidth;
        const gazeY = (leftEye.y + rightEye.y) / 2 * window.innerHeight;

        console.log(`Olhar em: x=${gazeX}, y=${gazeY}`);

        // Verifica se o olhar está sobre um item do menu
        let itemFound = null;
        menuItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isGazeOnItem = (
                gazeX >= rect.left && gazeX <= rect.right &&
                gazeY >= rect.top && gazeY <= rect.bottom
            );
            if (isGazeOnItem) {
                itemFound = item;
                item.style.border = "2px solid #007bff";
            } else {
                item.style.border = "";
            }
        });

        if (itemFound && itemFound !== lastSelectedItem) {
            lastSelectedItem = itemFound;
            console.log(`Olhando para: ${itemFound.textContent}`);
        } else if (!itemFound) {
            lastSelectedItem = null;
        }

        // Detecção de piscada (distância entre pontos superior e inferior do olho)
        const leftEyeTop = landmarks[159].y; // Topo olho esquerdo
        const leftEyeBottom = landmarks[145].y; // Base olho esquerdo
        const eyeDistance = leftEyeBottom - leftEyeTop;

        // Threshold ajustável para detectar piscada
        if (eyeDistance < 0.02) { // Olho fechado (piscada)
            console.log("Piscada detectada!");
            if (lastSelectedItem && lastSelectedItem.href && lastSelectedItem.href !== "#") {
                window.location.href = lastSelectedItem.href;
            }
        }
    });

    // Configura a câmera
    camera = new Camera(document.createElement("video"), {
        onFrame: async () => {
            await faceMesh.send({ image: camera.video });
        },
        width: 640,
        height: 480
    });
    await camera.start(); // Pede permissão para a câmera
    console.log("Rastreamento ocular iniciado");
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
    const menuItems = document.querySelectorAll("#menu ul li a:not(#eye-tracking a)");
    menuItems.forEach(item => item.style.border = "");
    console.log("Rastreamento ocular parado");
}