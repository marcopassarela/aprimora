let eyeTrackingActive = false;

        function toggleEyeTracking() {
            let eyeIcon = document.querySelector("#eye-tracking");
            eyeTrackingActive = !eyeTrackingActive;

            if (eyeTrackingActive) {
                eyeIcon.textContent = "🙉"; // Olho aberto
                startEyeTracking();
            } else {
                eyeIcon.textContent = "🙈"; // Olho fechado
                stopEyeTracking();
            }
        }

        function startEyeTracking() {
            webgazer.setRegression('ridge') // Algoritmo de rastreamento
                .setTracker('clmtrackr') // Usa modelo CLM para rastreamento facial
                .begin()
                .showPredictionPoints(true) // Mostra os pontos rastreados
                .showVideoPreview(false) // Esconde o vídeo da câmera
                .showFaceOverlay(false); // Esconde a marcação no rosto

            webgazer.setGazeListener((data) => {
                if (eyeTrackingActive && data) {
                    const x = data.x;
                    const y = data.y;
                    console.log(`Olhar detectado em: x=${x}, y=${y}`);

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

                    // Se detectar piscada, simula clique no link
                    if (data.blink && itemFound) {
                        console.log("Piscada detectada! Clicando...");
                        itemFound.click();
                    }
                }
            });

            // Ajuste para melhorar a calibração
            webgazer.showPredictionPoints(true);
        }

        function stopEyeTracking() {
            webgazer.pause();
            document.querySelectorAll("#menu li a").forEach(item => item.style.border = "");
            console.log("Rastreamento ocular pausado.");
        }
