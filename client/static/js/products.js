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