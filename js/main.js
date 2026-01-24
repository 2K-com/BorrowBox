// main.js - Enhanced BorrowBox functionality

document.addEventListener('DOMContentLoaded', () => {

    // ========== CAROUSEL FUNCTIONALITY ==========
    initCarousel();

    // ========== SMOOTH SCROLLING ==========
    initSmoothScroll();

    // ========== NAVBAR SCROLL EFFECT ==========
    initNavbarScroll();

    // ========== STATS COUNTER ANIMATION ==========
    initStatsCounter();

    // ========== FORM HANDLERS ==========
    initFormHandlers();
});

// Carousel functionality
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (slides.length === 0 || !prevBtn || !nextBtn) return;

    let currentSlide = 0;
    const slideCount = slides.length;
    let autoPlayInterval;

    const showSlide = (n) => {
        if (n >= slideCount) {
            currentSlide = 0;
        } else if (n < 0) {
            currentSlide = slideCount - 1;
        } else {
            currentSlide = n;
        }

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    };

    // Button controls
    nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        resetAutoPlay();
    });

    // Dot controls
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'));
            showSlide(slideIndex);
            resetAutoPlay();
        });
    });

    // Auto-play functionality
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000); // Change slide every 5 seconds
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showSlide(currentSlide - 1);
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            showSlide(currentSlide + 1);
            resetAutoPlay();
        }
    });

    // Start carousel
    showSlide(0);
    startAutoPlay();

    // Pause on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });

        carouselContainer.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    }
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
        } else {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        }

        lastScroll = currentScroll;
    });
}

// Animated stats counter
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const animateCounter = (element) => {
        const target = parseInt(element.textContent);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        };

        updateCounter();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

// Form handlers
function initFormHandlers() {
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;

            // Show success message (you can customize this)
            alert(`Thank you for subscribing with ${email}! We'll keep you updated.`);
            newsletterForm.reset();
        });
    }

    // Hero buttons
    const heroBtn = document.querySelector('.hero-btn');
    const heroBtn2 = document.querySelector('.hero-btn_2');

    if (heroBtn) {
        heroBtn.addEventListener('click', () => {
            // Navigate to browse or login page
            window.location.href = '/templates/login.html';
        });
    }

    if (heroBtn2) {
        heroBtn2.addEventListener('click', () => {
            // Scroll to products section
            const productsSection = document.getElementById('Products');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Add loading animation for product cards
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Stagger animation
            }
        });
    }, observerOptions);

    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// Initialize product cards animation
initProductCards();

// Add category card interactions
function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', function () {
            const categoryName = this.querySelector('h3').textContent;
            console.log(`Navigating to ${categoryName} category`);
            // Add your navigation logic here
        });
    });
}

initCategoryCards();