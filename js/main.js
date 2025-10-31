// Wait for the DOM to be fully loaded before running script
document.addEventListener('DOMContentLoaded', () => {

    // --- Hamburger Menu Logic ---
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const mobileNav = document.getElementById('mobile-nav');

    // Open navigation
    menuBtn.addEventListener('click', () => {
        mobileNav.classList.add('active');
    });

    // Close navigation
    closeBtn.addEventListener('click', () => {
        mobileNav.classList.remove('active');
    });


    // --- Simple Carousel Logic ---
    const track = document.getElementById('carousel-track');
    // Get all slides as an array
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    // Check if slides exist before running carousel logic
    if (slides.length > 0) {
        let currentIndex = 0;
        const slideCount = slides.length;

        // Function to update carousel position
        const updateCarousel = () => {
            // Move the track using CSS transform. 
            // -currentIndex * 100% moves it left
            track.style.transform = 'translateX(' + (-currentIndex * 100) + '%)';
        };

        // Next button click
        nextBtn.addEventListener('click', () => {
            currentIndex++;
            // If at the end, loop back to the start
            if (currentIndex > slideCount - 1) {
                currentIndex = 0;
            }
            updateCarousel();
        });

        // Previous button click
        prevBtn.addEventListener('click', () => {
            currentIndex--;
            // If at the beginning, loop to the end
            if (currentIndex < 0) {
                currentIndex = slideCount - 1;
            }
            updateCarousel();
        });

        // Initialize carousel position
        updateCarousel();
    }
});