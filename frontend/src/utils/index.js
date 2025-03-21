// Animação ao rolar a página
document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".animated");

    function checkScroll() {
        elements.forEach((element) => {
            const position = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (position < windowHeight - 100) {
                element.classList.add("show");
            }
        });
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll();
});

// Seleção dos elementos com tradução
const modal = document.getElementById("languageModal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const menuToggle = document.getElementById("menu-toggle");
const menuLinks = document.querySelectorAll("#menu ul li a");

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

// Fechar o menu hambúrguer ao clicar em qualquer link
menuLinks.forEach(link => {
    link.addEventListener("click", function() {
        menuToggle.checked = false; // Desmarca o checkbox, fechando o menu
    });
});

function changeLanguage(language) {
    const languageMap = {
        'en': { file: 'en.json', urlCode: 'en' },
        'pt-BR': { file: 'pt_BR.json', urlCode: 'pt' },
        'pt-PT': { file: 'pt_PT.json', urlCode: 'pt-pt' },
        'es': { file: 'es.json', urlCode: 'es' },
        'it': { file: 'it.json', urlCode: 'it' },
        'fr': { file: 'fr.json', urlCode: 'fr' },
        'ar-MA': { file: 'ar_MA.json', urlCode: 'ar-ma' },
        'ar-SA': { file: 'ar_SA.json', urlCode: 'ar-sa' },
        'ar-EG': { file: 'ar_EG.json', urlCode: 'ar-eg' },
        'ja': { file: 'ja.json', urlCode: 'ja' },
        'zh': { file: 'zh.json', urlCode: 'zh' },
        'ru': { file: 'ru.json', urlCode: 'ru' }
    };

    const langConfig = languageMap[language] || { file: `${language}.json`, urlCode: language };
    const fileName = langConfig.file;
    const urlCode = langConfig.urlCode;

    // Fechar o modal de idiomas imediatamente
    modal.style.display = "none";

    const url = `/locales/${language}/${fileName}`;
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
            const newUrl = `/intl-${urlCode}`;
            window.history.pushState({ language: language }, '', newUrl);
            console.log("URL atualizada para:", newUrl);
        })
        .catch(error => console.error("Erro ao carregar o idioma: ", error));
}

window.onload = function() {
    const path = window.location.pathname;
    console.log("Caminho atual:", path);
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
        console.log("Idioma detectado:", language);
        changeLanguage(language);
    } else {
        changeLanguage('pt-BR');
    }
};