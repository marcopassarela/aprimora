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
    link.addEventListener("click", function(event) {
        const href = link.getAttribute("href");

        // Se o link for âncora, rola até a seção correspondente
        if (href.startsWith("#")) {
            event.preventDefault(); // Impede o comportamento padrão
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        }

        // Fecha o menu mesmo assim
        menuToggle.checked = false;
    });
});


// Redirecionamento após envio 
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#form form'); // Seleciona o formulário
    const submitButton = form.querySelector('.btnSubmit'); // Botão de envio
    const loadingMessage = form.querySelector('#loading'); // Mensagem de carregamento
    const thankYouMessage = form.querySelector('#thankYouMessage'); // Mensagem de agradecimento

    form.addEventListener('submit', function(event) {
        event.preventDefault();  // Impede o envio imediato do formulário

        // Exibe o loading e esconde o botão de envio
        submitButton.style.display = 'none';
        loadingMessage.style.display = 'block';
        loadingMessage.style.fontSize = '15px';

        // Simula um tempo de espera (3 segundos) para demonstrar a troca de mensagens
        setTimeout(function() {
            loadingMessage.style.display = 'none';  // Esconde a mensagem de "Processando..."
            
            // Exibe a mensagem de "Obrigado" e define o tamanho da fonte
            thankYouMessage.style.display = 'block';
            thankYouMessage.style.fontSize = '15px';

            // Após 4 segundos, volta ao estado normal
            setTimeout(function() {
                thankYouMessage.style.display = 'none';  // Esconde a mensagem de "Obrigado"
                submitButton.style.display = 'inline-block';  // Exibe o botão novamente
            }, 4000);  // Fica exposta por 4 segundos
        }, 3000);  // Aguarda 3 segundos para simular o processamento

        // Envia o formulário real para o FormSubmit após a simulação
        setTimeout(function() {
            form.submit();  // Envia o formulário
        }, 3000);  // Envia o formulário após 3 segundos
    });
});
