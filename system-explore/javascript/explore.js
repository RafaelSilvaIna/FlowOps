document.addEventListener('DOMContentLoaded', function() {
    VANTA.NET({
        el: "#background-animation",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x3b82f6,
        backgroundColor: 0xf3f4f6,
        points: 10.00,
        maxDistance: 20.00,
        spacing: 17.00
    })

    // Lidar com o envio do formulário de contato
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = contactForm.elements['name'].value;
        const email = contactForm.elements['email'].value;
        const message = contactForm.elements['message'].value;

    //futuramente a api
        console.log('Formulário enviado:', { name, email, message });

        // Limpar o formulário
        contactForm.reset();

        // Mostrar uma mensagem de sucesso
        alert('Obrigado por entrar em contato! Retornaremos em breve.');
    });
});

