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
const swiper = new Swiper('.swiper-container', {
    loop: true,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  });