<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $captcha = $_POST['g-recaptcha-response'];
    $secretKey = "6LfH4_wqAAAAALAK4dl9AJivjWiOuNzTUebBu5T0"; // Sua chave secreta

    // Verifica a resposta do Google
    $url = "https://www.google.com/recaptcha/api/siteverify";
    $data = [
        'secret' => $secretKey,
        'response' => $captcha
    ];

    $options = [
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded",
            'method'  => 'POST',
            'content' => http_build_query($data)
        ]
    ];
    $context  = stream_context_create($options);
    $verify = file_get_contents($url, false, $context);
    $captchaSuccess = json_decode($verify);

    if ($captchaSuccess->success) {
        echo "reCAPTCHA validado com sucesso! 🛡️";
        // Continuar o processamento do formulário
    } else {
        echo "Falha no reCAPTCHA. Tente novamente.";
    }
}
?>
