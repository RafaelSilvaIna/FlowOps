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
