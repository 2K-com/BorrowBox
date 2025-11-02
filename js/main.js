// --- Carousel Logic ---
document.addEventListener('DOMContentLoaded', () => {

    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    // Check if carousel elements exist on the page
    if (slides.length > 0 && dots.length > 0 && prevBtn && nextBtn) {
        
        let currentSlide = 0;
        const slideCount = slides.length;

        // Function to show a specific slide
        const showSlide = (n) => {
            // Handle wrap-around
            if (n >= slideCount) {
                currentSlide = 0;
            } else if (n < 0) {
                currentSlide = slideCount - 1;
            } else {
                currentSlide = n;
            }

            // Hide all slides and deactivate all dots
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            // Show the current slide and activate the current dot
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        };

        // Button Listeners
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });

        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });

        // Dot Listeners
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                // Get the slide number from the dot's 'data-slide' attribute
                const slideIndex = parseInt(dot.getAttribute('data-slide'));
                showSlide(slideIndex);
            });
        });

        // Show the first slide on page load
        showSlide(0);
    }
});
