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
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // ... (Your other JS for smooth scroll & hamburger menu) ...


    // --- LOGIN/SIGNUP TOGGLE LOGIC ---
    
    // Find all the elements we need
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');

    // IMPORTANT: Check if these elements exist before adding listeners
    // This stops errors from appearing on your index.html page
    if (loginForm && signupForm && showSignupBtn && showLoginBtn) {

        // When user clicks "Sign Up" link...
        showSignupBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop the link from jumping
            loginForm.style.display = 'none';
            signupForm.style.display = 'flex'; // Show the signup form
        });

        // When user clicks "Login" link...
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop the link from jumping
            loginForm.style.display = 'flex'; // Show the login form
            signupForm.style.display = 'none';
        });
    }

});


document.addEventListener('DOMContentLoaded', () => {
    const sidebarItems = document.querySelectorAll('.menu-item');
    const contentViews = document.querySelectorAll('.content-view');
    const dashboardContent = document.querySelector('.dashboard-content');

    // Function to show the selected view and hide others
    const showView = (viewId) => {
        // Hide all views
        contentViews.forEach(view => {
            view.classList.remove('active');
        });
        
        // Show the requested view
        const activeView = document.getElementById(`view-${viewId}`);
        if (activeView) {
            activeView.classList.add('active');
        }
        
    };

    // Function to handle sidebar clicks
    sidebarItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // Prevent the default link behavior
            event.preventDefault(); 
            
            // Remove active class from all sidebar items
            sidebarItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to the clicked item
            item.classList.add('active');
            
            // Get the data-view attribute to know which content to load
            const viewId = item.getAttribute('data-view');
            
            if (viewId) {
                showView(viewId);
            }
        });
    });

    // Initial check: Ensure the default dashboard view is active on load
    // The HTML already sets the 'dashboard' view to active, but this ensures JS consistency.
    // We don't need to call showView('dashboard') here unless we want to dynamically generate it.
});