let eyeTrackingActive = false;
let video, faceMesh, canvas, ctx;

async function loadFaceMesh() {
    faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    faceMesh.onResults(onResults);

    video = document.createElement('video');
    video.style.display = 'none';
    document.body.appendChild(video);

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.play();
    });

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    requestAnimationFrame(detectFace);
}

async function detectFace() {
    if (!eyeTrackingActive) return;
    if (video.readyState >= 2) {
        await faceMesh.send({ image: video });
    }
    requestAnimationFrame(detectFace);
}

function onResults(results) {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;

    const faceLandmarks = results.multiFaceLandmarks[0];

    const leftEye = faceLandmarks[159];  // Ponto central do olho esquerdo
    const rightEye = faceLandmarks[386]; // Ponto central do olho direito

    let x = (leftEye.x + rightEye.x) / 2 * window.innerWidth;
    let y = (leftEye.y + rightEye.y) / 2 * window.innerHeight;

    console.log(`Olhar em: x=${x}, y=${y}`);

    let menuItems = document.querySelectorAll("#menu li a");
    let itemFound = null;

    menuItems.forEach(item => {
        let rect = item.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            item.style.border = "2px solid #007bff";
            itemFound = item;
        } else {
            item.style.border = "";
        }
    });

    if (itemFound) {
        console.log("Olho focado! Simulando clique...");
        setTimeout(() => itemFound.click(), 2000); // Espera 2 segundos antes de clicar
    }
}

function toggleEyeTracking() {
    let eyeIcon = document.querySelector("#eye-tracking");
    eyeTrackingActive = !eyeTrackingActive;

    if (eyeTrackingActive) {
        eyeIcon.textContent = "🙉"; // Ativo
        loadFaceMesh();
    } else {
        eyeIcon.textContent = "🙈"; // Desativado
        video.srcObject.getTracks().forEach(track => track.stop());
        video.remove();
        canvas.remove();
    }
}