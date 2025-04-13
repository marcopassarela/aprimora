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
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const menuToggle = document.getElementById("menu-toggle");
const menuLinks = document.querySelectorAll("#menu ul li a");

if (openModal) {
    openModal.onclick = function(event) {
        event.preventDefault();
        modal.style.display = "block";
    };
}

if (closeModal) {
    closeModal.onclick = function() {
        modal.style.display = "none";
    };
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// Fechar o menu hambúrguer ao clicar em qualquer link
menuLinks.forEach(link => {
    link.addEventListener("click", function(event) {
        const href = link.getAttribute("href");

        // Fecha o menu sempre, se estiver aberto
        if (menuToggle && menuToggle.checked) {
            menuToggle.checked = false; // Desmarca o checkbox para fechar o menu
        }

        // Se for link interno (âncora), faz scroll suave
        if (href.startsWith("#")) {
            event.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        }
        // Links normais (como "/cadastro", "/login", "/") seguem o comportamento padrão
    });
});