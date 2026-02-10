// ========== FLOATING RINGS BACKGROUND ==========
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

// Navbar scroll effect removed as per request




// ========== CATEGORY TABS - NEW! ==========
// ========== CATEGORY FILTERS (CUSTOM DROPDOWN) ==========
const allItemsBtn = document.getElementById('all-items-btn');
const categoryRadios = document.querySelectorAll('input[name="category"]');
const selectedTextSpan = document.querySelector('.selected-text');

// Helper to update displayed text
function updateSelectedText(text) {
    if (selectedTextSpan) {
        selectedTextSpan.textContent = text;
    }
}

// "All Items" Button Click
if (allItemsBtn) {
    allItemsBtn.addEventListener('click', () => {
        // Reset Radio Buttons
        categoryRadios.forEach(radio => radio.checked = false);

        // Reset Display Text
        updateSelectedText("Select Category");

        // Highlight Button
        allItemsBtn.classList.add('active');

        console.log('Filtering by category: all');
        // filterProducts('all');
    });
}

// Radio Button Change
categoryRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        const selectedLabel = e.target.nextElementSibling.getAttribute('data-txt');

        // Unhighlight "All Items" button
        if (allItemsBtn) allItemsBtn.classList.remove('active');

        // Update Display Text
        updateSelectedText(selectedLabel);

        console.log(`Filtering by category: ${selectedCategory}`);
        // filterProducts(selectedCategory);
    });
});


const productGrid = document.getElementById('productGrid');

const productData = {
    name: "Nike Airforce1 Premium",
    subtitle: "Own the Airforce",
    desc: "Step back into classic hoops style with a durable leather.",
    price: "$111",
    img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500" // High quality sneaker image
};

function createCards() {
    for (let i = 0; i < 20; i++) {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
      <div class="image-container">
        <span class="badge">Best Seller</span>
        <img src="${productData.img}" alt="Product Image">
      </div>
      <div class="product-info">
        <h3>${productData.name}</h3>
        <p class="subtitle">${productData.subtitle}</p>
        <p class="description">${productData.desc}</p>
      </div>
      <div class="card-footer">
        <div class="price-tag">${productData.price}</div>
        <button class="rent-btn">
          Rent Now <i class="fas fa-external-link-alt"></i>
        </button>
      </div>
    `;
        productGrid.appendChild(card);
    }
}

createCards();

// ========================================
// PAGINATION COMPONENT - BORROWBOX
// Clean version - Component only
// ========================================

class Pagination {
    constructor(options = {}) {
        // Configuration
        this.currentPage = options.currentPage || 1;
        this.totalPages = options.totalPages || 10;
        this.itemsPerPage = options.itemsPerPage || 10;
        this.totalItems = options.totalItems || 100;
        this.maxVisiblePages = options.maxVisiblePages || 5;
        this.onPageChange = options.onPageChange || null;

        // DOM Elements
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.numbersContainer = document.getElementById('pagination-numbers');
        this.paginationText = document.getElementById('pagination-text');

        // Initialize
        this.init();
    }

    init() {
        // Attach event listeners safely (elements may be missing)
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.goToPrevious());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.goToNext());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Render initial state
        this.render();

        console.log('✓ Pagination initialized');
        console.log(`- Total pages: ${this.totalPages}`);
        console.log(`- Current page: ${this.currentPage}`);
        console.log('- Use Arrow Left/Right keys to navigate');
    }

    // Render pagination UI
    render() {
        this.renderPageNumbers();
        this.updateButtons();
        this.updateInfo();
    }

    // Render page number buttons
    renderPageNumbers() {
        this.numbersContainer.innerHTML = '';

        const pages = this.getPageNumbers();

        pages.forEach((page) => {
            if (page === '...') {
                // Create ellipsis
                const ellipsis = document.createElement('span');
                ellipsis.className = 'page-ellipsis';
                ellipsis.textContent = '...';
                this.numbersContainer.appendChild(ellipsis);
            } else {
                // Create page button
                const button = document.createElement('button');
                button.className = 'page-number';
                button.textContent = page;
                button.setAttribute('aria-label', `Go to page ${page}`);

                if (page === this.currentPage) {
                    button.classList.add('active');
                    button.setAttribute('aria-current', 'page');
                }

                button.addEventListener('click', () => this.goToPage(page));
                this.numbersContainer.appendChild(button);
            }
        });
    }

    // Calculate which page numbers to show with ellipsis
    getPageNumbers() {
        const pages = [];
        const totalPages = this.totalPages;
        const current = this.currentPage;
        const maxVisible = this.maxVisiblePages;

        if (totalPages <= maxVisible + 2) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            let startPage, endPage;

            if (current <= 3) {
                // Near the start
                startPage = 2;
                endPage = maxVisible;
                for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                }
                pages.push('...');
            } else if (current >= totalPages - 2) {
                // Near the end
                pages.push('...');
                startPage = totalPages - maxVisible + 1;
                endPage = totalPages - 1;
                for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                }
            } else {
                // In the middle
                pages.push('...');
                startPage = current - 1;
                endPage = current + 1;
                for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                }
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    }

    // Update Previous/Next buttons (Freeze when needed)
    updateButtons() {
        // FREEZE Previous button on first page
        if (this.currentPage === 1) {
            this.prevBtn.disabled = true;
            this.prevBtn.setAttribute('aria-disabled', 'true');
        } else {
            this.prevBtn.disabled = false;
            this.prevBtn.setAttribute('aria-disabled', 'false');
        }

        // FREEZE Next button on last page
        if (this.currentPage === this.totalPages) {
            this.nextBtn.disabled = true;
            this.nextBtn.setAttribute('aria-disabled', 'true');
        } else {
            this.nextBtn.disabled = false;
            this.nextBtn.setAttribute('aria-disabled', 'false');
        }
    }

    // Update pagination info text
    updateInfo() {
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
        // Guard in case the info container isn't present in the DOM
        if (this.paginationText) {
            this.paginationText.textContent = `Showing ${start}-${end} of ${this.totalItems} items`;
        }
    }

    // Navigate to specific page
    goToPage(pageNumber) {
        if (pageNumber === this.currentPage) return;
        if (pageNumber < 1 || pageNumber > this.totalPages) return;

        this.currentPage = pageNumber;
        this.render();

        // Callback
        if (this.onPageChange) {
            this.onPageChange(this.currentPage);
        }

        // Show notification
        this.showNotification(`Page ${pageNumber}`);

        // Log to console
        console.log(`✓ Navigated to page ${pageNumber}`);
    }

    // Go to previous page
    goToPrevious() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    // Go to next page
    goToNext() {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }

    // Keyboard navigation
    handleKeyboard(e) {
        if (e.key === 'ArrowLeft') {
            this.goToPrevious();
        } else if (e.key === 'ArrowRight') {
            this.goToNext();
        }
    }

    // Show notification
    showNotification(message) {
        // Remove existing notification
        const existing = document.querySelector('.pagination-notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'pagination-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto remove after 2 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Public methods to update pagination
    setTotalItems(total) {
        this.totalItems = total;
        this.totalPages = Math.ceil(total / this.itemsPerPage);

        // Reset to page 1 if current page exceeds new total
        if (this.currentPage > this.totalPages) {
            this.currentPage = 1;
        }

        this.render();
    }

    setItemsPerPage(perPage) {
        this.itemsPerPage = perPage;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = 1;

        this.render();
    }

    getCurrentPage() {
        return this.currentPage;
    }
}

// ========================================
// INITIALIZE PAGINATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Create pagination instance
    const pagination = new Pagination({
        currentPage: 1,           // Starting page
        totalPages: 10,           // Total number of pages
        itemsPerPage: 10,         // Items per page
        totalItems: 100,          // Total items
        maxVisiblePages: 5,       // Max page numbers visible
        onPageChange: (page) => {
            // Your custom logic when page changes
            console.log(`Page changed to: ${page}`);

            // Example: Fetch data for new page
            // fetchData(page);

            // Example: Update URL
            // window.history.pushState({}, '', `?page=${page}`);

            // Example: Scroll to top
            // window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Make pagination accessible globally
    window.paginationInstance = pagination;

    // Example usage in console:
    // paginationInstance.goToPage(5)
    // paginationInstance.setTotalItems(150)
    // paginationInstance.getCurrentPage()
});

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .pagination-notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        transform: translateY(150px);
        transition: transform 0.3s ease;
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        border-left: 4px solid #6D90B9;
    }

    .pagination-notification.show {
        transform: translateY(0);
    }

    .pagination-notification i {
        font-size: 1.25rem;
        color: #6D90B9;
    }

    @media (max-width: 480px) {
        .pagination-notification {
            right: 10px;
            left: 10px;
            bottom: 20px;
        }
    }
`;
document.head.appendChild(notificationStyles);

// ========== SEARCH FUNCTIONALITY ==========
const searchInput = document.getElementById('searchInput');

if (searchInput) {
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
}