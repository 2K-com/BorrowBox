document.addEventListener('DOMContentLoaded', () => {

    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (slides.length > 0 && dots.length > 0 && prevBtn && nextBtn) {
        let currentSlide = 0;
        const slideCount = slides.length;

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
            dots[currentSlide].classList.add('active');
        };

        nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
        prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.getAttribute('data-slide'));
                showSlide(slideIndex);
            });
        });
        showSlide(0);
    }


    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');

    if (loginForm && signupForm && showSignupBtn && showLoginBtn) {
        showSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            signupForm.style.display = 'flex';
        });

        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'flex';
            signupForm.style.display = 'none';
        });
    }


    const sidebarItems = document.querySelectorAll('.menu-item');
    const dashboardContent = document.querySelector('.dashboard-content');

    const viewTemplates = {};
    document.querySelectorAll('.content-view').forEach(view => {

        viewTemplates[view.id.replace('view-', '')] = view.outerHTML; 
        view.style.display = 'none'; 
    });

    const showView = (viewId) => {
        dashboardContent.innerHTML = '';

        if (viewTemplates[viewId]) {
            dashboardContent.innerHTML = viewTemplates[viewId];
            

            const injectedView = dashboardContent.querySelector(`#view-${viewId}`);
            if (injectedView) {
                injectedView.style.display = 'block'; 
                injectedView.classList.add('active'); 
            }
            

            if (viewId === 'new-item') {
                initMultiStepForm();
            } else if (viewId === 'browse') {
                initBrowseFiltering();
            }
        } else {
            dashboardContent.innerHTML = `<section class="content-view active" style="display:block">
                <h1 class="content-header">${viewId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h1>
                <p>This feature is coming soon! Thank you for your patience.</p>
            </section>`;
        }
    };

    sidebarItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); 
            
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const viewId = item.getAttribute('data-view');
            if (viewId) {
                showView(viewId);
                window.scrollTo(0, 0);
            }
        });
    });

    const initialActiveItem = document.querySelector('.sidebar-menu .menu-item.active');
    if (initialActiveItem) {
        const initialViewId = initialActiveItem.getAttribute('data-view');
        showView(initialViewId);
    }

    
    const initMultiStepForm = () => {
        const form = document.querySelector('.listing-form');
        if (!form) return;

        const moveStep = (currentStep, nextStep) => {
            const currentElement = form.querySelector(`.form-section[data-step="${currentStep}"]`);
            const nextElement = form.querySelector(`.form-section[data-step="${nextStep}"]`);

            if (currentElement && nextElement) {
                currentElement.classList.remove('active');
                nextElement.classList.add('active');
            }
        };

        form.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-next')) {
                const nextStep = e.target.getAttribute('data-next-step');
                const currentStep = e.target.closest('.form-section').getAttribute('data-step');
                moveStep(currentStep, nextStep);
            } else if (e.target.classList.contains('btn-prev')) {
                const prevStep = e.target.getAttribute('data-prev-step');
                const currentStep = e.target.closest('.form-section').getAttribute('data-step');
                moveStep(currentStep, prevStep);
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (document.getElementById('terms-agree').checked) {
                alert('Item listing submitted successfully!');
            } else {
                alert('You must agree to the Terms & Conditions.');
            }
        });
    };

    const ALL_ITEMS_DATA = [
        { id: 1, name: 'PlayStation 5 Controller', price: 50, category: 'electronics', location: 'Mumbai', lender: 'Jane', distance: 5 },
        { id: 2, name: 'Electric Drill Kit', price: 150, category: 'tools', location: 'Navi Mumbai', lender: 'John', distance: 2 },

    ];

    const createItemCard = (item) => {

        return `
            <div class="item-card" data-category="${item.category}" data-price="${item.price}">
                <div class="item-card-image">
                    <img src="../assets/images/${item.category}_${item.id}.jpg" alt="${item.name}"> 
                    <div class="img-placeholder">Image of ${item.name}</div> 
                </div>
                <div class="card-body">
                    <h4>${item.name}</h4>
                    <p class="price">₹${item.price} / day</p>
                    <p class="location">Lender: ${item.lender} (${item.distance} km away)</p>
                    <p class="description">
                        Item description placeholder text...
                    </p>
                    <button class="btn-borrow">Borrow Now</button>
                </div>
            </div>
        `;
    };

    const renderItems = (items) => {
        const gridContainer = document.querySelector('.item-card-grid'); 
        const itemCountDisplay = document.getElementById('item-count');

        if (!gridContainer || !itemCountDisplay) {
            return;
        }


        gridContainer.innerHTML = items.map(createItemCard).join('');
        itemCountDisplay.textContent = `Showing ${items.length} items`;
    };

    const applyFilters = (e) => {
        if(e && e.preventDefault) e.preventDefault(); 
        
        // Get values from the elements in the currently loaded DOM
        const searchInput = document.getElementById('dashboard-search') ? document.getElementById('dashboard-search').value.toLowerCase() : '';
        const categoryFilter = document.getElementById('filter-category') ? document.getElementById('filter-category').value : '';
        const priceMax = document.getElementById('filter-price-range') ? parseInt(document.getElementById('filter-price-range').value) : 5000;
        
        let filteredItems = ALL_ITEMS_DATA.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchInput);
            const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
            const matchesPrice = item.price <= priceMax;
            
            return matchesSearch && matchesCategory && matchesPrice;
        });

        renderItems(filteredItems);
    };

    const initBrowseFiltering = () => {

        renderItems(ALL_ITEMS_DATA);

        const categorySelect = document.getElementById('filter-category');
        const priceRangeInput = document.getElementById('filter-price-range');
        const applyFiltersBtn = document.querySelector('.btn-apply-filters');
        const searchInput = document.getElementById('dashboard-search'); 

        if (categorySelect && priceRangeInput && applyFiltersBtn) {
            

            categorySelect.addEventListener('change', applyFilters);
            priceRangeInput.addEventListener('input', applyFilters);
            applyFiltersBtn.addEventListener('click', applyFilters);
            

            if (searchInput) {
                searchInput.addEventListener('input', applyFilters);
            }
        }
    };
});