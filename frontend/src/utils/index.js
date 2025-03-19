let faceMesh;
let videoElement = document.createElement('video');
let eyeTrackingActive = false;

async function setupFaceMesh() {
    faceMesh = new FaceMesh({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
    });

    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    faceMesh.onResults(onFaceMeshResults);
}

async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });
    videoElement.srcObject = stream;
    videoElement.play();
    
    const camera = new Camera(videoElement, {
        onFrame: async () => {
            if (eyeTrackingActive) {
                await faceMesh.send({ image: videoElement });
            }
        },
        width: 640,
        height: 480
    });
    camera.start();
}

function onFaceMeshResults(results) {
    if (!results.multiFaceLandmarks) return;

    const faceLandmarks = results.multiFaceLandmarks[0];
    // Aqui você pode pegar os pontos dos olhos, por exemplo:
    const leftEye = faceLandmarks[33]; // Ponto de referência para o olho esquerdo
    const rightEye = faceLandmarks[133]; // Ponto de referência para o olho direito

    // Exemplo de como desenhar no canvas, você pode fazer algo visual com os pontos
    drawEyes(leftEye, rightEye);
}

function drawEyes(leftEye, rightEye) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    document.body.appendChild(canvas);
    const context = canvas.getContext('2d');

    // Desenhando pontos dos olhos
    context.beginPath();
    context.arc(leftEye.x * canvas.width, leftEye.y * canvas.height, 5, 0, 2 * Math.PI);
    context.arc(rightEye.x * canvas.width, rightEye.y * canvas.height, 5, 0, 2 * Math.PI);
    context.fill();
}

function toggleEyeTracking() {
    if (eyeTrackingActive) {
        eyeTrackingActive = false;
        document.getElementById('eye-modal').style.display = 'block';
    } else {
        document.getElementById('eye-modal').style.display = 'none';
    }
}

function activateEyeTracking() {
    eyeTrackingActive = true;
    startCamera();
    document.getElementById('eye-modal').style.display = 'none';
}

function cancelEyeTracking() {
    eyeTrackingActive = false;
    document.getElementById('eye-modal').style.display = 'none';
}

setupFaceMesh();
