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
