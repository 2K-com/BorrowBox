// ========================================
// BORROWBOX CATALOG LOGIC (Dynamic Version)
// ========================================

function formatImageUrl(url) {
    if (!url) return '../static/images/dell_Laptop.jpg';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `http://127.0.0.1:8000${url}`;
}

function getSkeletonHtml(type) {
    if (type === 'card') {
        return `
            <div class="skeleton-card" style="background: var(--surface-card, #ffffff); border: 1px solid var(--border-clean, #e2e8f0); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 12px; height: 100%; min-height: 250px;">
                <div class="skeleton-shimmer" style="height: 180px; background: var(--bg-hover, #f1f5f9); border-radius: 12px; position: relative; overflow: hidden;"></div>
                <div class="skeleton-shimmer" style="height: 20px; width: 60%; background: var(--bg-hover, #f1f5f9); border-radius: 4px; position: relative; overflow: hidden;"></div>
                <div class="skeleton-shimmer" style="height: 16px; width: 40%; background: var(--bg-hover, #f1f5f9); border-radius: 4px; position: relative; overflow: hidden;"></div>
                <div class="skeleton-shimmer" style="height: 36px; background: var(--bg-hover, #f1f5f9); border-radius: 8px; margin-top: auto; position: relative; overflow: hidden;"></div>
            </div>
        `;
    }
    return '';
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('mainNavbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    initNavbarAuth();

    // 2. Dynamic Data Array (Starts Empty)
    let products = [];

    // Core Elements
    const productGrid = document.getElementById('productGrid');
    const resultsCount = document.getElementById('resultsCount');
    const categoryItems = document.querySelectorAll('.category-list li');
    const priceSlider = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // Modal Elements
    const modal = document.getElementById('quickViewModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalOwner = document.getElementById('modalOwner');
    const modalBlock = document.getElementById('modalBlock');
    const modalCategory = document.getElementById('modalCategory');
    const mainModalIcon = document.getElementById('mainModalIcon');

    // ============================================================
    // NEW: FETCH DATA FROM DJANGO
    // ============================================================
    async function fetchProducts() {
        if (!productGrid) return;
        productGrid.innerHTML = getSkeletonHtml('card').repeat(6);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/listings/');
            if (!response.ok) throw new Error('Failed to fetch items');
            
            const listings = await response.json();
            
            // Filter: Must be AVAILABLE
            products = listings.filter(item => 
                item.availability_status === 'AVAILABLE'
            );
            
            filterProducts();
        } catch (err) {
            console.error('API Error:', err);
            productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Failed to load catalog.</p>';
        }
    }

    // 3. Render Function (Updated for API field names)
    function renderProducts(items) {
        if (!productGrid) return;
        productGrid.innerHTML = '';
        
        if (items.length === 0) {
            productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">No items found matching your filters.</p>';
            if(resultsCount) resultsCount.textContent = `0 items found`;
            return;
        }

        if(resultsCount) resultsCount.textContent = `Showing ${items.length} items`;

        const currentUser = localStorage.getItem('username');

        items.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            const isOwner = product.owner_username === currentUser;
            const badgeText = isOwner ? 'Your Listing' : 'Available';
            const badgeClass = isOwner ? 'status-badge owner' : 'status-badge';
            
            const actionButton = isOwner
                ? `<button class="btn-primary open-modal-btn" disabled style="width: 100%; background: #94a3b8; cursor: not-allowed; border-color: #94a3b8;">Your Listing</button>`
                : `<button class="btn-primary open-modal-btn" data-id="${product.id}" style="width: 100%;">Reserve Item</button>`;

            // Handle real image vs placeholder
            const imageDisplay = product.image 
                ? `<img src="${formatImageUrl(product.image)}" style="width: 100%; height: 100%; object-fit: cover;" alt="${product.title}" />` 
                : `<div style="height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0;"><i class="fas fa-camera" style="font-size: 3rem; color: #ccc;"></i></div>`;

            card.innerHTML = `
                <div class="card-image" style="height: 200px; overflow: hidden; position: relative;">
                    <span class="${badgeClass}" style="position: absolute; top: 10px; left: 10px; z-index: 2;">${badgeText}</span>
                    ${imageDisplay}
                </div>
                <div class="card-content">
                    <h3 class="card-title">${product.title}</h3>
                    <div class="card-price">₹${product.price_per_day} <span>/ day</span></div>
                    <div class="card-owner">
                        <i class="fas fa-user-circle"></i> ${product.owner_username || 'Student'} 
                    </div>
                    <div style="font-size: 0.85rem; color: #666; margin-bottom: 15px;">
                        Deposit: ₹${product.security_deposit || '0.00'}
                    </div>
                    ${actionButton}
                </div>
            `;
            productGrid.appendChild(card);
        });

        bindModalButtons();
    }

    // Unified Filtering Function (Updated for API fields)
    function filterProducts() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activeCatItem = document.querySelector('.category-list li.active');
        const selectedCat = activeCatItem ? activeCatItem.getAttribute('data-category').toLowerCase() : 'all';
        const maxPrice = priceSlider ? parseInt(priceSlider.value) : 500;

        const filtered = products.filter(p => {
            const apiCategory = (p.category_name || '').toLowerCase();
            
            let matchCat = false;
            if (selectedCat === 'all') matchCat = true;
            else if (apiCategory === selectedCat) matchCat = true;

            const matchPrice = parseFloat(p.price_per_day) <= maxPrice;
            const matchQuery = !query || p.title.toLowerCase().includes(query) || apiCategory.includes(query);
            
            return matchCat && matchPrice && matchQuery;
        });

        renderProducts(filtered);
    }

    // 4. Initial Load Trigger
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');
    if (searchParam && searchInput) {
        searchInput.value = searchParam;
    }
    
    // Call the API fetch function to kickstart everything
    fetchProducts();

    // 5. Category Filtering Logic
    categoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            categoryItems.forEach(i => i.classList.remove('active'));
            e.target.classList.add('active');
            filterProducts();
        });
    });

    // 6. Price Slider Sync Logic
    if (priceSlider) {
        priceSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            if(priceValue) priceValue.textContent = `₹${val}`;
            filterProducts();
        });
    }

    // 7. Search Input Logic
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', filterProducts);
    }

    // ========================================
    // QUICK VIEW MODAL LOGIC
    // ========================================
    
    function bindModalButtons() {
        const openBtns = document.querySelectorAll('.open-modal-btn');
        openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                openModal(productId);
            });
        });
    }

    function openModal(productId) {
        const product = products.find(p => p.id === productId);
        if(!product) return;

        // Populate Basic Data
        if(modalTitle) modalTitle.textContent = product.title;
        if(modalPrice) modalPrice.textContent = `₹${product.price_per_day}`;
        if(modalOwner) modalOwner.textContent = product.owner_username || 'Student';
        if(modalBlock) modalBlock.textContent = 'Campus Network'; 
        if(modalCategory) modalCategory.textContent = product.category_name || 'Item';
        
        // 1. Dynamic Description
        const descEl = document.getElementById('modalDescription');
        if (descEl) descEl.textContent = product.description || 'No description provided.';
        
        // 2. Dynamic Ratings
        const ratingNumber = document.querySelector('.rating-number');
        const reviewCount = document.querySelector('.review-count');
        const starIcon = document.querySelector('.review-summary i.fa-star');
        
        const ratingVal = parseFloat(product.rating);
        if (ratingVal && ratingVal > 0) {
            if (ratingNumber) ratingNumber.textContent = ratingVal.toFixed(1);
            if (reviewCount) reviewCount.textContent = product.review_count ? `(${product.review_count} reviews)` : '(1 review)';
            if (starIcon) starIcon.style.display = 'inline-block';
        } else {
            if (ratingNumber) ratingNumber.textContent = 'New User';
            if (reviewCount) reviewCount.textContent = '';
            if (starIcon) starIcon.style.display = 'none'; // Hide star for new users
        }

        // 3. Dynamic Rule List
        const ruleList = document.querySelector('.rule-list');
        if (ruleList) {
            const conditionMap = { 'NEW': 'Like New', 'GOOD': 'Good', 'USED': 'Fair' };
            const displayCondition = conditionMap[product.condition] || product.condition || 'Not specified';

            ruleList.innerHTML = `
                <li><i class="fas fa-box"></i> Condition: ${displayCondition}</li>
                <li><i class="fas fa-rupee-sign"></i> Security Deposit: ₹${product.security_deposit || '0.00'}</li>
                <li><i class="fas fa-shield-alt"></i> Security deposit required at meetup</li>
            `;
        }

        // Setup Carousel Images
        const images = [];
        if (product.image) {
            images.push(formatImageUrl(product.image));
        }
        if (product.images && Array.isArray(product.images)) {
            product.images.forEach(imgObj => {
                if (imgObj.image) {
                    images.push(formatImageUrl(imgObj.image));
                }
            });
        }

        // If no images at all, add a placeholder
        if (images.length === 0) {
            images.push('../static/images/dell_Laptop.jpg');
        }

        // Store globally for carousel actions
        currentImages = images;
        currentImageIndex = 0;
        
        // Update Thumbnails HTML dynamically
        const thumbContainer = document.querySelector('.gallery-thumbnails');
        if (thumbContainer) {
            thumbContainer.innerHTML = currentImages.map((img, idx) => `
                <div class="thumbnail ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                    <img src="${img}" style="width:100%; height:100%; object-fit:cover; border-radius:4px;" />
                </div>
            `).join('');
            
            // Re-bind thumbnail click events
            const newThumbnails = thumbContainer.querySelectorAll('.thumbnail');
            newThumbnails.forEach((thumb, index) => {
                thumb.addEventListener('click', () => {
                    currentImageIndex = index;
                    updateCarouselUI();
                });
            });
        }

        updateCarouselUI();

        const reqBtn = document.getElementById('modalRequestBtn');
        if (reqBtn) {
            reqBtn.onclick = () => {
                closeModal(); 
                window.openBorrowCheckout(product); 
            };
        }

        if(modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        }
    }

    function closeModal() {
        if(modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; 
        }
    }

    // Modal Close Triggers
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if(e.target === modal) closeModal(); 
        });
    }
    document.addEventListener('keydown', (e) => {
        if(e.key === 'Escape' && modal && modal.classList.contains('active')) closeModal();
    });

    // Modal Carousel Logic
    let currentImageIndex = 0;
    let currentImages = [];
    
    const prevBtn = document.getElementById('prevImgBtn');
    const nextBtn = document.getElementById('nextImgBtn');

    function updateCarouselUI() {
        const mainView = document.querySelector('.main-image-view');
        if (!mainView) return;
        
        let imgEl = mainView.querySelector('.main-carousel-image');
        let iconEl = document.getElementById('mainModalIcon');
        
        if (iconEl) iconEl.style.display = 'none';
        
        if (!imgEl) {
            imgEl = document.createElement('img');
            imgEl.className = 'main-carousel-image';
            imgEl.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 8px; transition: opacity 0.2s ease;';
            mainView.appendChild(imgEl);
        }
        
        imgEl.style.opacity = 0;
        setTimeout(() => {
            imgEl.src = currentImages[currentImageIndex];
            imgEl.style.opacity = 1;
        }, 150);

        const thumbs = document.querySelectorAll('.gallery-thumbnails .thumbnail');
        thumbs.forEach((thumb, idx) => {
            if(idx === currentImageIndex) thumb.classList.add('active');
            else thumb.classList.remove('active');
        });
    }

    if (prevBtn) {
        prevBtn.onclick = () => {
            currentImageIndex = (currentImageIndex === 0) ? currentImages.length - 1 : currentImageIndex - 1;
            updateCarouselUI();
        };
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
            currentImageIndex = (currentImageIndex === currentImages.length - 1) ? 0 : currentImageIndex + 1;
            updateCarouselUI();
        };
    }


    function initNavbarAuth() {
        const authBtn = document.querySelector('.btn-nav-primary');
        if (!authBtn) return;

        const token = localStorage.getItem('access_token');
        if (token) {
            authBtn.textContent = 'Sign Out';
            authBtn.href = '#';
            authBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Sign out of BorrowBox?')) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('username');
                    window.location.reload();
                }
            });
        }
    }

    // ========================================
    // BORROW CHECKOUT & MATH LOGIC
    // ========================================
    let currentCheckoutItem = null;

    window.openBorrowCheckout = function(product) {
        currentCheckoutItem = product;
        
        const checkoutTitle = document.getElementById('checkout-item-title');
        const checkoutRent = document.getElementById('checkout-item-rent');
        const checkoutDeposit = document.getElementById('checkout-item-deposit');
        const checkoutImageContainer = document.getElementById('checkout-item-image-container');
        
        if(checkoutTitle) checkoutTitle.textContent = product.title;
        if(checkoutRent) checkoutRent.textContent = product.price_per_day;
        if(checkoutDeposit) checkoutDeposit.textContent = product.security_deposit || '0.00';
        
        if (checkoutImageContainer) {
            const formatted = formatImageUrl(product.image);
            checkoutImageContainer.innerHTML = `<img src="${formatted}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;" />`;
        }
        
        // 1. Format and display the available dates
        const availText = document.getElementById('checkout-avail-dates');
        if (availText) {
            if (product.available_from && product.available_until) {
                availText.textContent = `${product.available_from} to ${product.available_until}`;
            } else {
                availText.textContent = "Dates flexible (Contact Owner)";
            }
        }

        // Reset form and math
        const reqForm = document.getElementById('borrow-request-form');
        if(reqForm) reqForm.reset();
        
        const calcDays = document.getElementById('calc-days');
        const calcRentTotal = document.getElementById('calc-rent-total');
        const calcDepositTotal = document.getElementById('calc-deposit-total');
        const calcGrandTotal = document.getElementById('calc-grand-total');

        if(calcDays) calcDays.textContent = '0';
        if(calcRentTotal) calcRentTotal.textContent = '0.00';
        if(calcDepositTotal) calcDepositTotal.textContent = '0.00';
        if(calcGrandTotal) calcGrandTotal.textContent = '0.00';

        // 2. Set strict Min and Max boundaries on the calendar inputs
        const todayStr = new Date().toISOString().split('T')[0];
        const startDateInput = document.getElementById('borrow-start-date');
        const endDateInput = document.getElementById('borrow-end-date');

        if(startDateInput && endDateInput) {
            // Absolute minimum is today OR the item's available_from date (whichever is later)
            let minAllowableDate = todayStr;
            if (product.available_from && product.available_from > todayStr) {
                minAllowableDate = product.available_from;
            }

            startDateInput.setAttribute('min', minAllowableDate);
            endDateInput.setAttribute('min', minAllowableDate);

            if (product.available_until) {
                startDateInput.setAttribute('max', product.available_until);
                endDateInput.setAttribute('max', product.available_until);
            } else {
                startDateInput.removeAttribute('max');
                endDateInput.removeAttribute('max');
            }
        }

        // Show Modal
        const borrowModal = document.getElementById('borrow-item-modal');
        if(borrowModal) {
            borrowModal.style.display = 'flex';
            setTimeout(() => borrowModal.classList.add('active'), 10);
        }
    };

    window.closeBorrowModal = function() {
        const borrowModal = document.getElementById('borrow-item-modal');
        if(borrowModal) {
            borrowModal.classList.remove('active');
            setTimeout(() => {
                borrowModal.style.display = 'none';
            }, 300);
        }
        currentCheckoutItem = null;
    };

    // Live Date Calculation
    const startDateInput = document.getElementById('borrow-start-date');
    const endDateInput = document.getElementById('borrow-end-date');

    if (startDateInput && endDateInput) {
        startDateInput.addEventListener('change', () => {
            endDateInput.setAttribute('min', startDateInput.value);
            updateCheckoutMath();
        });
        endDateInput.addEventListener('change', updateCheckoutMath);
    }

    function updateCheckoutMath() {
        if (!currentCheckoutItem || !startDateInput.value || !endDateInput.value) return;

        const start = new Date(startDateInput.value);
        const end = new Date(endDateInput.value);
        let days = 0;

        if (start <= end) {
            const diffTime = Math.abs(end - start);
            days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 includes the start day
        }

        const rentTotal = days * parseFloat(currentCheckoutItem.price_per_day);
        const deposit = parseFloat(currentCheckoutItem.security_deposit || 0);
        const grandTotal = rentTotal + deposit;

        const calcDays = document.getElementById('calc-days');
        const calcRentTotal = document.getElementById('calc-rent-total');
        const calcDepositTotal = document.getElementById('calc-deposit-total');
        const calcGrandTotal = document.getElementById('calc-grand-total');

        if(calcDays) calcDays.textContent = days;
        if(calcRentTotal) calcRentTotal.textContent = rentTotal.toFixed(2);
        if(calcDepositTotal) calcDepositTotal.textContent = deposit.toFixed(2);
        if(calcGrandTotal) calcGrandTotal.textContent = grandTotal.toFixed(2);
    }

    // 3. Submit the Request to Django
    const borrowRequestForm = document.getElementById('borrow-request-form');
    if(borrowRequestForm) {
        borrowRequestForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!currentCheckoutItem) return;

            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('You must be logged in to request an item.');
                return;
            }

            const payload = {
                listing: currentCheckoutItem.id, 
                start_date: startDateInput.value,
                end_date: endDateInput.value
            };

            const submitBtn = borrowRequestForm.querySelector('button[type="submit"]');
            if(submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/api/borrow_requests/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (response.status === 201 || response.ok) {
                    alert(`Success! Request sent to ${currentCheckoutItem.owner_username}.`);
                    window.closeBorrowModal();
                } else {
                    // Fix: Safely check if response is JSON before parsing
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await response.json();
                        alert(`Failed: ${JSON.stringify(errorData)}`); 
                    } else {
                        alert(`Server Error (${response.status}). Check your Django terminal for the Python traceback.`);
                    }
                }
            } catch (err) {
                console.error('Submit error:', err);
                alert('Network error. Check if your Django server is running and CORS is configured.');
            } finally {
                if(submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Request to Owner';
                }
            }
        });
    }
});