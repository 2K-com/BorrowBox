//-------navbar------
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
        navbar.classList.add("navbar-scrolled");
    } else {
        navbar.classList.remove("navbar-scrolled");
    }
});


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

    // ==========HOW IT WORKS ==============
    initHowItWorks();
});

// How It Works Section - Enhanced Interactions
function initHowItWorks() {
    const steps = document.querySelectorAll('.step');
    const connectionLine = document.getElementById('connectionLine');

    if (!connectionLine) return;

    // Observer for scroll animation
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate connection line
                connectionLine.classList.add('active');

                // Stagger step animations
                steps.forEach((step, index) => {
                    setTimeout(() => {
                        step.style.opacity = '1';
                    }, index * 200);
                });
            }
        });
    }, observerOptions);

    // Initial setup
    steps.forEach(step => {
        step.style.opacity = '0';
        step.style.transition = 'opacity 0.6s ease';
    });

    // Observe the workflow container
    const workflowContainer = document.querySelector('.workflow-container');
    if (workflowContainer) {
        observer.observe(workflowContainer);
    }

    // Progressive line fill on step hover
    let currentHoveredIndex = -1;

    steps.forEach((step, index) => {
        step.addEventListener('mouseenter', () => {
            currentHoveredIndex = index;
            updateLineFill(index);

            // Add glow effect to previous steps
            steps.forEach((s, i) => {
                if (i <= index) {
                    s.style.borderColor = 'var(--tertiary-color)';
                } else {
                    s.style.borderColor = 'transparent';
                }
            });
        });

        step.addEventListener('mouseleave', () => {
            currentHoveredIndex = -1;
            // Reset to full line after a delay
            setTimeout(() => {
                if (currentHoveredIndex === -1) {
                    updateLineFill(steps.length - 1);
                    steps.forEach(s => {
                        s.style.borderColor = 'transparent';
                    });
                }
            }, 300);
        });
    });

    function updateLineFill(stepIndex) {
        const lineFill = connectionLine.querySelector('.connection-line-fill');
        const percentage = ((stepIndex + 1) / steps.length) * 100;
        lineFill.style.width = `${percentage}%`;
    }

    // Keyboard navigation
    let currentFocusIndex = -1;

    document.addEventListener('keydown', (e) => {
        const workflowInView = isElementInViewport(workflowContainer);
        if (!workflowInView) return;

        if (e.key === 'ArrowRight') {
            e.preventDefault();
            currentFocusIndex = Math.min(currentFocusIndex + 1, steps.length - 1);
            focusStep(currentFocusIndex);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            currentFocusIndex = Math.max(currentFocusIndex - 1, 0);
            focusStep(currentFocusIndex);
        }
    });

    function focusStep(index) {
        steps.forEach(s => s.classList.remove('focused'));
        if (index >= 0 && index < steps.length) {
            steps[index].classList.add('focused');
            steps[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            updateLineFill(index);
        }
    }

    function isElementInViewport(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Click handler for steps
    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            const stepNumber = step.getAttribute('data-step');
            console.log(`Clicked on step ${stepNumber}`);
            // Add your navigation or detailed view logic here
        });
    });

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        if (!workflowContainer) return;

        const rect = workflowContainer.getBoundingClientRect();
        const scrollPercent = Math.max(0, Math.min(1,
            (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
        ));

        steps.forEach((step, index) => {
            const delay = index * 0.1;
        });
    });
}

// Enhanced Carousel functionality with improved animations
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

    // Button controls with haptic feedback
    nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        resetAutoPlay();
        // Add visual feedback
        nextBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            nextBtn.style.transform = 'scale(1)';
        }, 100);
    });

    prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        resetAutoPlay();
        // Add visual feedback
        prevBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            prevBtn.style.transform = 'scale(1)';
        }, 100);
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
        }, 5000);
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

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const carouselContainer = document.querySelector('.carousel-container');

    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                showSlide(currentSlide + 1);
                resetAutoPlay();
            }
            if (touchEndX > touchStartX + 50) {
                showSlide(currentSlide - 1);
                resetAutoPlay();
            }
        }

        // Pause on hover
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });

        carouselContainer.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    }

    // Start carousel
    showSlide(0);
    startAutoPlay();
}

// Enhanced product card interactions
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 80); // Stagger animation
            }
        });
    }, observerOptions);

    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);

        // Add click handler for View Details button
        const viewBtn = card.querySelector('.card-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productName = card.querySelector('h4').textContent;
                console.log(`Viewing details for: ${productName}`);
                // Add your navigation or modal logic here
            });
        }

        // Add hover effect for card
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });
    });
}

// Add smooth parallax effect to carousel images
function initParallaxEffect() {
    const slides = document.querySelectorAll('.carousel-slide');

    slides.forEach(slide => {
        slide.addEventListener('mousemove', (e) => {
            if (!slide.classList.contains('active')) return;

            const image = slide.querySelector('.slide-image');
            if (!image) return;

            const rect = slide.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            const moveX = deltaX * 10;
            const moveY = deltaY * 10;

            image.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        });

        slide.addEventListener('mouseleave', () => {
            const image = slide.querySelector('.slide-image');
            if (image) {
                image.style.transform = 'translate(0, 0) scale(1)';
            }
        });
    });
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initProductCards();
    initParallaxEffect();
});


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

const container = document.getElementById('ring-container');

function createRing() {
    const ring = document.createElement('div');
    ring.className = 'floating-ring';

    // Randomize Size (between 50px and 200px)
    const size = Math.random() * 150 + 50;
    ring.style.width = `${size}px`;
    ring.style.height = `${size}px`;

    // Randomize Position
    ring.style.left = `${Math.random() * 100}%`;
    ring.style.top = `${Math.random() * 100}%`;

    // Randomize Animation Speed
    const duration = Math.random() * 15 + 10;
    ring.style.animationDuration = `${duration}s`;

    // Randomize Opacity (makes some look further away)
    ring.style.opacity = Math.random() * 0.4 + 0.1;

    container.appendChild(ring);
}

// Generate 8 random rings
for (let i = 0; i < 8; i++) {
    createRing();
}

document.addEventListener('mousemove', (e) => {
    const ripples = document.querySelectorAll('.ripple');
    const card = document.querySelector('.cta-card');

    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if mouse is inside the card
    if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
        ripples.forEach((ripple, index) => {
            // Each layer moves at a slightly different speed for depth
            const depth = (index + 1) * 10;
            const moveX = (x - rect.width / 2) / depth;
            const moveY = (y - rect.height / 2) / depth;

            ripple.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }
});