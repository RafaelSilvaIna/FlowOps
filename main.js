document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown');
    const mainContent = document.querySelector('.main-content');
    const logoImg = document.getElementById('logo-img');

    
    function toggleMobileMenu() {
        navMenu.classList.toggle('show');
        mobileMenuBtn.classList.toggle('active');
    }

    
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnMenuBtn = mobileMenuBtn.contains(event.target);

        if (!isClickInsideMenu && !isClickOnMenuBtn && navMenu.classList.contains('show')) {
            toggleMobileMenu();
        }
    });

   
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    });

   
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    
    setTimeout(() => {
        mainContent.classList.add('show');
    }, 100);

    
    logoImg.addEventListener('mouseover', function() {
        this.style.transform = 'rotate(15deg)';
    });

    logoImg.addEventListener('mouseout', function() {
        this.style.transform = 'rotate(0deg)';
    });

    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            
            if (navMenu.classList.contains('show')) {
                toggleMobileMenu();
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    const parallaxEffect = () => {
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach((card, index) => {
            const speed = 1 + (index * 0.1);
            const yPos = -(window.pageYOffset * speed / 10);
            card.style.transform = `translateY(${yPos}px)`;
        });
    };

    window.addEventListener('scroll', parallaxEffect);
});


// secao de apresentacao inical - rafael silva inacio

document.querySelector('.get-started-btn').addEventListener('mousemove', function(e) {
    const x = e.pageX - this.offsetLeft;
    const y = e.pageY - this.offsetTop;
    
    this.style.setProperty('--x', x + 'px');
    this.style.setProperty('--y', y + 'px');
});

// secao de explicacao mais um puco resumida do app e tambem com o menu de mause
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    var customMenu = document.querySelector('.custom-menu');
    customMenu.style.display = 'block';
    customMenu.style.left = e.pageX + 'px';
    customMenu.style.top = e.pageY + 'px';
});

document.addEventListener('click', function() {
    document.querySelector('.custom-menu').style.display = 'none';
});

document.querySelector('.custom-menu').addEventListener('click', function(e) {
    if (e.target.tagName === 'LI') {
        var action = e.target.getAttribute('data-action');
        switch (action) {
            case 'source':
                window.open('https://github.com/flowops/repo', '_blank');
                break;
            case 'version':
                alert('Versão atual: 1.0.0');
                break;
            case 'docs':
                window.open('https://docs.flowops.com', '_blank');
                break;
            case 'dev':
                window.open('https://flowops.com/team', '_blank');
                break;
        }
    }
});

window.addEventListener('scroll', function() {
    var scrolled = window.pageYOffset;
    var parallax = document.querySelector('.parallax-bg');
    parallax.style.transform = 'translateY(' + (scrolled * 0.5) + 'px)';
});

// secao nova de apresentacao e o codigo acima esta em ajuste 
const sliderContent = document.querySelector('.slider-content');
const sliderItems = document.querySelectorAll('.slider-item');
let currentIndex = 0;

function nextSlide() {
    currentIndex = (currentIndex + 1) % sliderItems.length;
    updateSlider();
}

function updateSlider() {
    sliderContent.style.transform = `translateY(-${currentIndex * 60}px)`;
}

setInterval(nextSlide, 3000);



// secao nova - 25/11/2024
gsap.from(".section", {
    duration: 1,
    opacity: 0,
    y: 50,
    stagger: 0.3,
    ease: "power3.out",
  });

  // Animações específicas para elementos
  gsap.from(".icon", {
    duration: 1,
    scale: 0,
    rotation: 360,
    ease: "elastic.out(1, 0.5)",
  });

  gsap.from("h1", {
    duration: 1,
    opacity: 0,
    x: -100,
    ease: "power2.out",
    delay: 0.5,
  });

  gsap.from("p", {
    duration: 1,
    opacity: 0,
    x: 100,
    ease: "power2.out",
    delay: 0.7,
  });

  gsap.from(".btn", {
    duration: 1,
    opacity: 0,
    scale: 0.8,
    ease: "bounce.out",
    delay: 1,
  });

  // secao de contato com a api
  document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');

    function showNotification(message, isSuccess) {
        notificationMessage.textContent = message;
        notification.classList.add(isSuccess ? 'success' : 'error');
        notification.style.display = 'block';
        notification.style.opacity = '1';

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.display = 'none';
                notification.classList.remove('success', 'error');
            }, 500);
        }, 3000);
    }

    async function sendFormData() {
        const name = document.getElementById('name').value;
        const subject = document.getElementById('subject').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        const data = { name, subject, email, message };

        try {
            const response = await fetch('https://checkered-root-rhinoceros.glitch.me/submit-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Dados enviados com sucesso:', result);
                showNotification('Sua mensagem foi enviada com sucesso!', true);
                contactForm.reset();
            } else {
                const error = await response.json();
                console.error('Erro ao enviar dados:', error);
                showNotification('Ocorreu um erro ao enviar sua mensagem. Tente novamente.', false);
            }
        } catch (error) {
            console.error('Erro na comunicação com a API:', error);
            showNotification('Ocorreu um erro. Verifique sua conexão e tente novamente.', false);
        }
    }

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        sendFormData();
    });
});

