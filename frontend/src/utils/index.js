document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".animated");

    function checkScroll() {
        elements.forEach((element) => {
            const position = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (position < windowHeight - 100) { // Ajuste fino para ativar antes
                element.classList.add("show");
            }
        });
    }

    // Verifica o scroll ao carregar e ao rolar a página
    window.addEventListener("scroll", checkScroll);
    checkScroll(); // Garante que elementos visíveis de cara já apareçam
});


// Seleção dos elementos com tradução
const modal = document.getElementById("languageModal");
        const openModal = document.getElementById("openModal");
        const closeModal = document.getElementById("closeModal");

        openModal.onclick = function(event) {
            event.preventDefault();
            modal.style.display = "block";
        };

        closeModal.onclick = function() {
            modal.style.display = "none";
        };

        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };

        function changeLanguage(language) {
            const languageMap = {
                'en': { file: 'en.json', urlCode: 'en' },              // Inglês
                'pt-BR': { file: 'pt_BR.json', urlCode: 'pt' },        // Português (Brasil)
                'pt-PT': { file: 'pt_PT.json', urlCode: 'pt-pt' },     // Português (Portugal)
                'es': { file: 'es.json', urlCode: 'es' },              // Espanhol
                'it': { file: 'it.json', urlCode: 'it' },              // Italiano
                'fr': { file: 'fr.json', urlCode: 'fr' },              // Francês
                'ar-MA': { file: 'ar_MA.json', urlCode: 'ar-ma' },     // Árabe (Marrocos)
                'ar-SA': { file: 'ar_SA.json', urlCode: 'ar-sa' },     // Árabe (Arábia Saudita)
                'ar-EG': { file: 'ar_EG.json', urlCode: 'ar-eg' },     // Árabe (Egito)
                'ja': { file: 'ja.json', urlCode: 'ja' },              // Japonês
                'zh': { file: 'zh.json', urlCode: 'zh' },              // Chinês (simplificado)
                'ru': { file: 'ru.json', urlCode: 'ru' }               // Russo
            };

            const langConfig = languageMap[language] || { file: `${language}.json`, urlCode: language };
            const fileName = langConfig.file;
            const urlCode = langConfig.urlCode;

            const url = `/frontend/src/locales/${language}/${fileName}`;
            console.log("Carregando:", url);

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Erro na requisição: " + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    document.querySelectorAll('[data-i18n]').forEach(element => {
                        const key = element.getAttribute('data-i18n');
                        if (data[key]) {
                            element.textContent = data[key];
                        }
                    });
                    modal.style.display = "none";
                    const newUrl = `/intl-${urlCode}`;
                    window.history.pushState({ language: language }, '', newUrl);
                    console.log("URL atualizada para:", newUrl);
                })
                .catch(error => console.error("Erro ao carregar o idioma: ", error));
        }

        window.onload = function() {
            const path = window.location.pathname;
            if (path.startsWith('/intl-')) {
                const langCode = path.replace('/intl-', '');
                const languageMap = {
                    'pt': 'pt-BR',
                    'pt-pt': 'pt-PT',
                    'es': 'es',
                    'en': 'en',
                    'it': 'it',
                    'fr': 'fr',
                    'ar-ma': 'ar-MA',
                    'ar-sa': 'ar-SA',
                    'ar-eg': 'ar-EG',
                    'ja': 'ja',
                    'zh': 'zh',
                    'ru': 'ru'
                };
                const language = languageMap[langCode] || 'pt-BR';
                changeLanguage(language);
            }
        };