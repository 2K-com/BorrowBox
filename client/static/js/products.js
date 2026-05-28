// ========================================
// BORROWBOX CATALOG LOGIC (Full Version with Modal)
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('mainNavbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Dummy Data for Products
    const products = [
        { id: 1, title: "Scientific Calculator (Casio fx-991EX)", category: "study", price: 30, owner: "Rahul M.", block: "Block C", imageIcon: "fa-calculator" },
        { id: 2, title: "Sony WH-1000XM4 Noise Cancelling", category: "electronics", price: 150, owner: "Sneha P.", block: "Block A", imageIcon: "fa-headphones" },
        { id: 3, title: "Electric Kettle (1.5L)", category: "appliances", price: 40, owner: "Aman K.", block: "Block D", imageIcon: "fa-mug-hot" },
        { id: 4, title: "Engineering Drawing Board + Kit", category: "study", price: 50, owner: "Vikram S.", block: "Block B", imageIcon: "fa-drafting-compass" },
        { id: 5, title: "Men's Formal Blazer (Navy, Size 40)", category: "apparel", price: 200, owner: "Karan T.", block: "Block C", imageIcon: "fa-user-tie" },
        { id: 6, title: "Mechanical Keyboard (Red Switches)", category: "electronics", price: 80, owner: "Priya R.", block: "Block A", imageIcon: "fa-keyboard" },
        { id: 7, title: "Table Lamp (Adjustable LED)", category: "appliances", price: 25, owner: "Neha D.", block: "Block D", imageIcon: "fa-lightbulb" },
        { id: 8, title: "Graphic Tablet (Wacom Intuos)", category: "electronics", price: 120, owner: "Arjun V.", block: "Block B", imageIcon: "fa-pen-nib" }
    ];

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

    // 3. Render Function
    function renderProducts(items) {
        productGrid.innerHTML = '';
        
        if (items.length === 0) {
            productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">No items found matching your filters.</p>';
            resultsCount.textContent = `0 items found`;
            return;
        }

        resultsCount.textContent = `Showing ${items.length} items`;

        items.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="card-image">
                    <span class="status-badge">Available</span>
                    <i class="fas ${product.imageIcon}"></i>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${product.title}</h3>
                    <div class="card-price">₹${product.price} <span>/ day</span></div>
                    <div class="card-owner">
                        <i class="fas fa-user-circle"></i> ${product.owner} • ${product.block}
                    </div>
                    <button class="btn-primary open-modal-btn" data-id="${product.id}">Reserve Item</button>
                </div>
            `;
            productGrid.appendChild(card);
        });

        // Crucial: Bind the click events to the new buttons after they are created!
        bindModalButtons();
    }

    // Unified Filtering Function
    function filterProducts() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activeCatItem = document.querySelector('.category-list li.active');
        const selectedCat = activeCatItem ? activeCatItem.getAttribute('data-category') : 'all';
        const maxPrice = priceSlider ? parseInt(priceSlider.value) : 500;

        const filtered = products.filter(p => {
            const matchCat = selectedCat === 'all' || p.category === selectedCat;
            const matchPrice = p.price <= maxPrice;
            const matchQuery = !query || p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
            return matchCat && matchPrice && matchQuery;
        });

        renderProducts(filtered);
    }

    // 4. Initial Render on Page Load & Query Parameter check
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');
    if (searchParam && searchInput) {
        searchInput.value = searchParam;
    }
    filterProducts();

    // 5. Category Filtering Logic
    categoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            categoryItems.forEach(i => i.classList.remove('active'));
            e.target.classList.add('active');
            filterProducts();
        });
    });

    // 6. Price Slider Sync Logic
    priceSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        priceValue.textContent = `₹${val}`;
        filterProducts();
    });

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
        // Find specific product by ID
        const product = products.find(p => p.id === productId);
        if(!product) return;

        // Populate Modal Data
        modalTitle.textContent = product.title;
        modalPrice.textContent = `₹${product.price}`;
        modalOwner.textContent = product.owner;
        modalBlock.textContent = product.block;
        modalCategory.textContent = product.category;
        
        // Setup Image/Icon Carousel
        setupMockCarousel(product.imageIcon);

        // Show Modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore background scrolling
    }

    // Modal Close Triggers
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        // Close if clicking on the dark overlay background
        if(e.target === modal) closeModal(); 
    });
    document.addEventListener('keydown', (e) => {
        // Close on 'ESC' key
        if(e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // Modal Carousel Logic
    let currentImageIndex = 0;
    let currentIcons = [];
    
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.getElementById('prevImgBtn');
    const nextBtn = document.getElementById('nextImgBtn');

    function setupMockCarousel(primaryIcon) {
        currentIcons = [primaryIcon, 'fa-box-open', 'fa-tag'];
        currentImageIndex = 0;
        updateCarouselUI();
    }

    function updateCarouselUI() {
        // Fade out
        mainModalIcon.style.opacity = 0;
        
        setTimeout(() => {
            // Change icon and fade back in
            mainModalIcon.className = `fas ${currentIcons[currentImageIndex]} main-icon`;
            mainModalIcon.style.opacity = 1;
        }, 200);

        // Update thumbnails
        thumbnails.forEach((thumb, idx) => {
            if(idx === currentImageIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex === 0) ? currentIcons.length - 1 : currentImageIndex - 1;
        updateCarouselUI();
    });

    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex === currentIcons.length - 1) ? 0 : currentImageIndex + 1;
        updateCarouselUI();
    });

    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            currentImageIndex = index;
            updateCarouselUI();
        });
    });
});