<<<<<<< HEAD
// ========== PRODUCTS PAGE FUNCTIONALITY ==========

document.addEventListener('DOMContentLoaded', () => {
    initFilterToggle();
    initSearch();
    initFilters();
    initWishlist();
    initSort();
    initLoadMore();
    initProductCards();
});

// ========== FILTER TOGGLE ==========
function initFilterToggle() {
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterDropdown = document.getElementById('filterDropdown');

    if (!filterToggleBtn || !filterDropdown) return;

    filterToggleBtn.addEventListener('click', () => {
        filterToggleBtn.classList.toggle('active');
        filterDropdown.classList.toggle('active');
    });
}

// ========== SEARCH FUNCTIONALITY ==========
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const productCards = document.querySelectorAll('.product-card');

    if (!searchInput || !searchBtn) return;

    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        productCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('.card-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'flex';
                card.style.animation = 'fadeInUp 0.6s ease';
            } else {
                card.style.display = 'none';
            }
        });

        // Show no results message if needed
        const visibleCards = Array.from(productCards).filter(card => 
            card.style.display !== 'none'
        );

        if (visibleCards.length === 0 && searchTerm !== '') {
            showNoResults();
        } else {
            hideNoResults();
        }
    };

    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Real-time search (optional)
    searchInput.addEventListener('input', () => {
        if (searchInput.value === '') {
            productCards.forEach(card => {
                card.style.display = 'flex';
            });
            hideNoResults();
        }
    });
}

function showNoResults() {
    const grid = document.getElementById('productsGrid');
    let noResultsEl = document.getElementById('noResults');
    
    if (!noResultsEl) {
        noResultsEl = document.createElement('div');
        noResultsEl.id = 'noResults';
        noResultsEl.className = 'no-results';
        noResultsEl.innerHTML = `
            <i class="fas fa-search" style="font-size: 3rem; color: var(--gray); margin-bottom: 1rem;"></i>
            <h3 style="color: var(--text-primary); font-family: var(--font-main); margin-bottom: 0.5rem;">No products found</h3>
            <p style="color: var(--text-secondary);">Try adjusting your search or filters</p>
        `;
        noResultsEl.style.cssText = `
            grid-column: 1 / -1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
            text-align: center;
        `;
        grid.appendChild(noResultsEl);
    } else {
        noResultsEl.style.display = 'flex';
    }
}

function hideNoResults() {
    const noResultsEl = document.getElementById('noResults');
    if (noResultsEl) {
        noResultsEl.style.display = 'none';
    }
}

// ========== FILTER FUNCTIONALITY ==========
function initFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const activeFiltersContainer = document.getElementById('activeFilters');

    if (!applyFiltersBtn || !clearFiltersBtn) return;

    let activeFilters = {
        category: [],
        price: [],
        availability: [],
        rating: []
    };

    // Apply Filters
    applyFiltersBtn.addEventListener('click', () => {
        // Collect active filters
        activeFilters = {
            category: [],
            price: [],
            availability: [],
            rating: []
        };

        filterCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const filterType = checkbox.name;
                const filterValue = checkbox.value;
                activeFilters[filterType].push(filterValue);
            }
        });

        // Apply filters to products
        filterProducts(activeFilters);

        // Update active filters display
        updateActiveFiltersDisplay(activeFilters);

        // Close filter dropdown
        document.getElementById('filterDropdown').classList.remove('active');
        document.getElementById('filterToggleBtn').classList.remove('active');
    });

    // Clear Filters
    clearFiltersBtn.addEventListener('click', () => {
        filterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        activeFilters = {
            category: [],
            price: [],
            availability: [],
            rating: []
        };

        filterProducts(activeFilters);
        updateActiveFiltersDisplay(activeFilters);
    });
}

function filterProducts(filters) {
    const productCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;

    productCards.forEach(card => {
        let shouldShow = true;

        // Category filter
        if (filters.category.length > 0) {
            const cardCategory = card.getAttribute('data-category');
            if (!filters.category.includes(cardCategory)) {
                shouldShow = false;
            }
        }

        // Price filter
        if (filters.price.length > 0) {
            const cardPrice = parseInt(card.getAttribute('data-price'));
            let priceMatch = false;

            filters.price.forEach(range => {
                if (range === '0-50' && cardPrice >= 0 && cardPrice <= 50) priceMatch = true;
                if (range === '51-100' && cardPrice >= 51 && cardPrice <= 100) priceMatch = true;
                if (range === '101-200' && cardPrice >= 101 && cardPrice <= 200) priceMatch = true;
                if (range === '201+' && cardPrice >= 201) priceMatch = true;
            });

            if (!priceMatch) shouldShow = false;
        }

        // Show/hide card
        if (shouldShow) {
            card.style.display = 'flex';
            card.style.animation = 'fadeInUp 0.6s ease';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show no results if needed
    if (visibleCount === 0) {
        showNoResults();
    } else {
        hideNoResults();
    }
}

function updateActiveFiltersDisplay(filters) {
    const container = document.getElementById('activeFilters');
    container.innerHTML = '';

    const filterLabels = {
        category: {
            electronics: 'Electronics',
            appliances: 'Appliances',
            study: 'Study Essentials',
            accessories: 'Accessories',
            furniture: 'Furniture',
            clothing: 'Clothing'
        },
        price: {
            '0-50': '₹0-50',
            '51-100': '₹51-100',
            '101-200': '₹101-200',
            '201+': '₹201+'
        },
        availability: {
            today: 'Available Today',
            week: 'This Week',
            month: 'This Month'
        },
        rating: {
            '4+': '4+ Stars',
            '3+': '3+ Stars'
        }
    };

    Object.keys(filters).forEach(filterType => {
        filters[filterType].forEach(value => {
            const chip = document.createElement('div');
            chip.className = 'filter-chip';
            chip.innerHTML = `
                <span>${filterLabels[filterType][value]}</span>
                <button onclick="removeFilter('${filterType}', '${value}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            container.appendChild(chip);
        });
    });
}

// Remove individual filter
window.removeFilter = function(filterType, value) {
    const checkbox = document.querySelector(`input[name="${filterType}"][value="${value}"]`);
    if (checkbox) {
        checkbox.checked = false;
        document.getElementById('applyFiltersBtn').click();
    }
};

// ========== WISHLIST FUNCTIONALITY ==========
function initWishlist() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('active');
            
            const icon = btn.querySelector('i');
            if (btn.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                
                // Show notification (optional)
                showNotification('Added to wishlist');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                
                showNotification('Removed from wishlist');
            }
        });
    });
}

function showNotification(message) {
    // Create notification element
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            font-family: var(--font-secondary);
            font-weight: var(--fw-med);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.style.transform = 'translateY(0)';
    notification.style.opacity = '1';

    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
    }, 2000);
}

// ========== SORT FUNCTIONALITY ==========
function initSort() {
    const sortSelect = document.getElementById('sortSelect');
    const productsGrid = document.getElementById('productsGrid');

    if (!sortSelect) return;

    sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value;
        const cards = Array.from(productsGrid.querySelectorAll('.product-card'));

        let sortedCards = [...cards];

        switch (sortValue) {
            case 'price-low':
                sortedCards.sort((a, b) => {
                    const priceA = parseInt(a.getAttribute('data-price'));
                    const priceB = parseInt(b.getAttribute('data-price'));
                    return priceA - priceB;
                });
                break;

            case 'price-high':
                sortedCards.sort((a, b) => {
                    const priceA = parseInt(a.getAttribute('data-price'));
                    const priceB = parseInt(b.getAttribute('data-price'));
                    return priceB - priceA;
                });
                break;

            case 'rating':
                sortedCards.sort((a, b) => {
                    const ratingA = parseFloat(a.querySelector('.card-rating').textContent);
                    const ratingB = parseFloat(b.querySelector('.card-rating').textContent);
                    return ratingB - ratingA;
                });
                break;

            case 'newest':
                sortedCards.reverse();
                break;

            default: // featured
                // Keep original order
                break;
        }

        // Clear and re-append sorted cards
        productsGrid.innerHTML = '';
        sortedCards.forEach(card => {
            productsGrid.appendChild(card);
        });

        // Re-trigger animations
        sortedCards.forEach((card, index) => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = `fadeInUp 0.6s ease ${index * 0.05}s backwards`;
            }, 10);
        });
    });
}

// ========== LOAD MORE ==========
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', () => {
        // Simulate loading more products
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        setTimeout(() => {
            loadMoreBtn.innerHTML = '<span>Load More Products</span><i class="fas fa-chevron-down"></i>';
            showNotification('No more products to load');
        }, 1000);
    });
}

// ========== PRODUCT CARD INTERACTIONS ==========
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const viewBtn = card.querySelector('.card-btn');

        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productName = card.querySelector('h4').textContent;
                console.log(`Viewing details for: ${productName}`);
                // Add your navigation logic here
                showNotification(`Opening ${productName}...`);
            });
        }

        // Card click
        card.addEventListener('click', () => {
            const productName = card.querySelector('h4').textContent;
            console.log(`Card clicked: ${productName}`);
            // Add your navigation logic here
        });
    });
}

// ========== FLOATING RINGS (from main.js) ==========
=======
// ========== FLOATING RINGS BACKGROUND ==========
>>>>>>> e5c5e2912eb03f88ab6561ba1535db5b9865f318
const container = document.getElementById('ring-container');

if (container) {
    function createRing() {
        const ring = document.createElement('div');
        ring.className = 'floating-ring';

        const size = Math.random() * 150 + 50;
        ring.style.width = `${size}px`;
        ring.style.height = `${size}px`;

        ring.style.left = `${Math.random() * 100}%`;
        ring.style.top = `${Math.random() * 100}%`;

        const duration = Math.random() * 15 + 10;
        ring.style.animationDuration = `${duration}s`;

        ring.style.opacity = Math.random() * 0.4 + 0.1;

<<<<<<< HEAD
        container.appendChild(ring);
    }

    for (let i = 0; i < 8; i++) {
        createRing();
    }
}
=======
    container.appendChild(ring);
}

// Generate 8 random rings
for (let i = 0; i < 8; i++) {
    createRing();
}

// ========== EXPANDABLE SEARCH NAVBAR ==========
document.addEventListener('DOMContentLoaded', () => {
    const searchToggleBtn = document.getElementById('searchToggleBtn');
    const searchContainer = document.getElementById('searchContainer');
    const mainNavbar = document.getElementById('mainNavbar');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const filterBtn = document.getElementById('filterBtn');

    let isSearchExpanded = false;

    // Toggle search container
    searchToggleBtn.addEventListener('click', () => {
        isSearchExpanded = !isSearchExpanded;

        if (isSearchExpanded) {
            // Expand search
            searchContainer.classList.add('expanded');
            mainNavbar.classList.add('search-expanded');
            searchToggleBtn.classList.add('active');

            // Focus on search input after animation
            setTimeout(() => {
                searchInput.focus();
            }, 400);
        } else {
            // Retract search
            searchContainer.classList.remove('expanded');
            mainNavbar.classList.remove('search-expanded');
            searchToggleBtn.classList.remove('active');

            // Clear search input when closing
            searchInput.value = '';
            clearSearchBtn.classList.remove('visible');
        }
    });

    // Show/hide clear button based on input
    searchInput.addEventListener('input', (e) => {
        if (e.target.value.length > 0) {
            clearSearchBtn.classList.add('visible');
        } else {
            clearSearchBtn.classList.remove('visible');
        }
    });

    // Clear search input
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.classList.remove('visible');
        searchInput.focus();
    });

    // Handle search submission (Enter key)
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchQuery = searchInput.value.trim();
            if (searchQuery) {
                console.log('Searching for:', searchQuery);
                // Add your search logic here
                // Example: window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
            }
        }
    });

    // Filter button click handler
    filterBtn.addEventListener('click', () => {
        console.log('Filter button clicked');
        // Add your filter modal/dropdown logic here
        // Example: openFilterModal();
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideNavbar = mainNavbar.contains(e.target);

        if (!isClickInsideNavbar && isSearchExpanded) {
            isSearchExpanded = false;
            searchContainer.classList.remove('expanded');
            mainNavbar.classList.remove('search-expanded');
            searchToggleBtn.classList.remove('active');
            searchInput.value = '';
            clearSearchBtn.classList.remove('visible');
        }
    });

    // Prevent closing when clicking inside search container
    searchContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Escape key to close search
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isSearchExpanded) {
            isSearchExpanded = false;
            searchContainer.classList.remove('expanded');
            mainNavbar.classList.remove('search-expanded');
            searchToggleBtn.classList.remove('active');
            searchInput.value = '';
            clearSearchBtn.classList.remove('visible');
        }
    });
});
>>>>>>> e5c5e2912eb03f88ab6561ba1535db5b9865f318
