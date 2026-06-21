// ============================================================
// BORROWBOX DASHBOARD — dashboard.js
// SPA navigation + placeholder data + UI interactions
// ============================================================

async function authenticatedFetch(url, options = {}) {
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        throw new Error('No access token found');
    }

    if (!options.headers) {
        options.headers = {};
    }
    options.headers['Authorization'] = `Bearer ${accessToken}`;
    if (!options.headers['Content-Type'] && !(options.body instanceof FormData)) {
        options.headers['Content-Type'] = 'application/json';
    }

    let response = await fetch(url, options);

    if (response.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            try {
                const refreshRes = await fetch('http://127.0.0.1:8000/api/auth/token/refresh/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh: refreshToken })
                });

                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    localStorage.setItem('access_token', data.access);
                    
                    // Retry original request
                    options.headers['Authorization'] = `Bearer ${data.access}`;
                    response = await fetch(url, options);
                } else {
                    handleSessionExpired();
                }
            } catch (err) {
                console.error('Token refresh error:', err);
                handleSessionExpired();
            }
        } else {
            handleSessionExpired();
        }
    }

    return response;
}

function handleSessionExpired() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

async function initDashboardAuth() {
    try {
        const response = await authenticatedFetch('http://127.0.0.1:8000/api/auth/profile/');
        if (!response.ok) {
            handleSessionExpired();
            return;
        }

        const data = await response.json();
        
        // Update global USER object
        USER.name = data.full_name || localStorage.getItem('username') || 'Student';
        USER.email = data.email || '';
        USER.phone = data.phone_number || '';
        
        // Compute Initials
        const parts = USER.name.split(' ');
        let initials = '';
        if (parts.length > 0 && parts[0]) initials += parts[0][0];
        if (parts.length > 1 && parts[parts.length - 1]) initials += parts[parts.length - 1][0];
        USER.initials = initials.toUpperCase() || 'S';

        // Update welcome banner and top nav / sidebar user info
        const welcomeName = document.getElementById('welcome-name');
        if (welcomeName) welcomeName.textContent = USER.name.split(' ')[0];

        // Avatar text
        document.querySelectorAll('.profile-avatar, .profile-avatar-lg, .sidebar-avatar-sm, .topnav-avatar').forEach(el => {
            el.textContent = USER.initials;
        });

        // User info text in sidebar
        const sidebarUserName = document.querySelector('.sidebar-user-name');
        if (sidebarUserName) sidebarUserName.textContent = USER.name;

        // Initialize profile display in settings
        initProfile();

    } catch (err) {
        console.error('initDashboardAuth error:', err);
        handleSessionExpired();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    initThemeToggle();
    initSidebarCollapse();
    initSidebarTooltips();
    initNavigation();
    initSidebarToggle();
    await initDashboardAuth();
    initDashboardHome();
    initListings();
    initRequests();
    initBorrowings();
    initHistory();
    initNotifications();
    initAddItemForm();
    initTopnavSearch();
    initRecentActivity();
});

// ============================================================
// NAVIGATION — sidebar links control which page is visible
// ============================================================
function initNavigation() {
    const navLinks = document.querySelectorAll('[data-page]');
    const pages = document.querySelectorAll('.dash-page');

    function activatePage(pageId) {
        // Hide all
        pages.forEach(p => p.classList.remove('active'));
        navLinks.forEach(l => l.classList.remove('active'));

        // Show target
        const targetPage = document.getElementById('page-' + pageId);
        if (targetPage) targetPage.classList.add('active');

        // Mark link active
        document.querySelectorAll(`[data-page="${pageId}"]`).forEach(l => l.classList.add('active'));

        // Update notification badge for notifications page
        if (pageId === 'notifications') {
            const dot = document.querySelector('.notif-dot');
            if (dot) dot.style.display = 'none';
        }

        // Close mobile sidebar
        closeSidebar();

        // Scroll content to top
        const content = document.querySelector('.dash-content');
        if (content) content.scrollTop = 0;
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            if (pageId === 'logout') {
                handleLogout();
                return;
            }
            activatePage(pageId);
        });
    });

    // Start on home
    activatePage('home');
}

function handleLogout() {
    if (confirm('Sign out of BorrowBox?')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    }
}

// ============================================================
// SIDEBAR MOBILE TOGGLE
// ============================================================
function initSidebarToggle() {
    const sidebar = document.querySelector('.dash-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const menuBtn = document.querySelector('.topnav-menu-btn');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('open');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
}

function closeSidebar() {
    document.querySelector('.dash-sidebar')?.classList.remove('open');
    document.querySelector('.sidebar-overlay')?.classList.remove('open');
}

// ============================================================
// TOP NAV SEARCH
// ============================================================
function initTopnavSearch() {
    const input = document.querySelector('.topnav-search input');
    if (!input) return;

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const q = input.value.trim();
            if (q) {
                // Redirect to catalog page (products.html) with search term
                window.location.href = `products.html?search=${encodeURIComponent(q)}`;
            }
        }
    });
}

// ============================================================
// PLACEHOLDER DATA
// ============================================================

const USER = {
    name: 'Aditya Sharma',
    initials: 'AS',
    email: 'aditya.sharma@college.edu',
    phone: '+91 98765 43210',
    rating: 4.8,
    totalListings: 7,
    totalBorrowings: 12,
    memberSince: 'January 2025',
};

const LISTINGS_DATA = [
    { id: 1, image: '../static/images/dell_Laptop.jpg', name: 'Dell Laptop (i5)', category: 'Electronics', rent: '₹200/day', deposit: '₹2000', status: 'available', requests: 3 },
    { id: 2, image: '../static/images/dslr.jpg', name: 'Canon DSLR Camera', category: 'Electronics', rent: '₹500/day', deposit: '₹5000', status: 'rented', requests: 1 },
    { id: 3, image: '../static/images/bag.jpg', name: 'Travel Backpack 45L', category: 'Accessories', rent: '₹80/day', deposit: '₹500', status: 'available', requests: 0 },
    { id: 4, image: '../static/images/books.jpg', name: 'Engineering Textbooks (Set)', category: 'Study', rent: '₹60/day', deposit: '₹300', status: 'available', requests: 5 },
    { id: 5, image: '../static/images/guitar.jpg', name: 'Acoustic Guitar', category: 'Instruments', rent: '₹150/day', deposit: '₹1500', status: 'rented', requests: 0 },
    { id: 6, image: '../static/images/projector.jpg', name: 'Portable Projector', category: 'Electronics', rent: '₹300/day', deposit: '₹3000', status: 'available', requests: 2 },
];

const BROWSE_DATA = [
    { emoji: '🎧', name: 'Premium Noise-Cancelling Headphones', category: 'Electronics', rent: '₹150/day', deposit: '₹1500', available: true },
    { emoji: '🧳', name: 'Cabin Trolley Bag', category: 'Accessories', rent: '₹120/day', deposit: '₹800', available: true },
    { emoji: '📖', name: 'Data Structures & Algorithms Book', category: 'Study', rent: '₹30/day', deposit: '₹150', available: false },
    { emoji: '🏸', name: 'Badminton Racket Set', category: 'Sports', rent: '₹50/day', deposit: '₹300', available: true },
    { emoji: '☕', name: 'Portable Coffee Maker', category: 'Appliances', rent: '₹60/day', deposit: '₹400', available: true },
    { emoji: '📐', name: 'Drafting Board & Kit', category: 'Study', rent: '₹80/day', deposit: '₹600', available: true },
    { emoji: '🎮', name: 'Gaming Controller (PS5)', category: 'Electronics', rent: '₹100/day', deposit: '₹800', available: false },
    { emoji: '💡', name: 'LED Study Lamp', category: 'Appliances', rent: '₹30/day', deposit: '₹200', available: true },
    { emoji: '🎒', name: 'Hiking Backpack 60L', category: 'Accessories', rent: '₹90/day', deposit: '₹600', available: true },
    { emoji: '🔊', name: 'Bluetooth Party Speaker', category: 'Electronics', rent: '₹70/day', deposit: '₹500', available: true },
    { emoji: '🌡️', name: 'Digital Thermometer', category: 'Appliances', rent: '₹25/day', deposit: '₹150', available: true },
    { emoji: '📹', name: 'Webcam HD 1080p', category: 'Electronics', rent: '₹50/day', deposit: '₹300', available: true },
];

const REQUESTS_DATA = [
    { id: 1, image: '../static/images/dell_Laptop.jpg', item: 'Dell Laptop (i5)', borrower: 'Priya Mehta', avatar: 'PM', dates: '28 May – 2 Jun 2026', days: 5, rent: '₹1,000', status: 'pending' },
    { id: 2, image: '../static/images/books.jpg', item: 'Engineering Textbooks (Set)', borrower: 'Rahul Singh', avatar: 'RS', dates: '30 May – 5 Jun 2026', days: 6, rent: '₹360', status: 'pending' },
    { id: 3, image: '../static/images/projector.jpg', item: 'Portable Projector', borrower: 'Sneha Patil', avatar: 'SP', dates: '1 Jun – 3 Jun 2026', days: 2, rent: '₹600', status: 'accepted' },
    { id: 4, image: '../static/images/books.jpg', item: 'Engineering Textbooks (Set)', borrower: 'Arjun Nair', avatar: 'AN', dates: '3 Jun – 8 Jun 2026', days: 5, rent: '₹300', status: 'rejected' },
];

const BORROWINGS_DATA = [
    { id: 1, image: '../static/images/headphone.png', name: 'Sony WH-1000XM5 Headphones', owner: 'Vikram Desai', pickup: '22 May 2026', returnDate: '29 May 2026', deposit: 'paid', daysLeft: 3, totalDays: 7 },
    { id: 2, image: '../static/images/dslr.jpg', name: 'Nikon D3500 Camera', owner: 'Ananya Joshi', pickup: '20 May 2026', returnDate: '27 May 2026', deposit: 'paid', daysLeft: 1, totalDays: 7 },
    { id: 3, image: '../static/images/accessories.png', name: 'Yonex Badminton Set', owner: 'Karan Mishra', pickup: '24 May 2026', returnDate: '31 May 2026', deposit: 'paid', daysLeft: 5, totalDays: 7 },
];

const HISTORY_DATA = [
    { id: 1, image: '../static/images/headphone.png', name: 'Wireless Headphones', date: '14 May 2026', type: 'Borrow', rent: '₹300', deposit: '₹1,500', status: 'returned' },
    { id: 2, image: '../static/images/books.jpg', name: 'Linear Algebra Textbook', date: '8 May 2026', type: 'Borrow', rent: '₹150', deposit: '₹500', status: 'returned' },
    { id: 3, image: '../static/images/dell_Laptop.jpg', name: 'Dell Laptop (i5)', date: '5 May 2026', type: 'Lend', rent: '₹800', deposit: '₹2,000', status: 'returned' },
    { id: 4, image: '../static/images/controller.png', name: 'PS5 Controller', date: '28 Apr 2026', type: 'Borrow', rent: '₹200', deposit: '₹800', status: 'returned' },
    { id: 5, image: '../static/images/dslr.jpg', name: 'Canon DSLR Camera', date: '20 Apr 2026', type: 'Lend', rent: '₹1,500', deposit: '₹5,000', status: 'returned' },
    { id: 6, image: '../static/images/electronics.png', name: 'Bluetooth Speaker', date: '12 Apr 2026', type: 'Borrow', rent: '₹140', deposit: '₹500', status: 'returned' },
];

const NOTIFICATIONS_DATA = [
    { id: 1, type: 'accepted', iconClass: 'green', icon: 'fa-check-circle', title: 'Request Approved', desc: 'Your borrow request for "Sony WH-1000XM5 Headphones" has been approved by Vikram Desai.', time: '2 hours ago', unread: true },
    { id: 2, type: 'request', iconClass: 'blue', icon: 'fa-hand-holding', title: 'New Borrow Request', desc: 'Priya Mehta has requested your Dell Laptop (i5) from 28 May to 2 Jun 2026.', time: '5 hours ago', unread: true },
    { id: 3, type: 'request', iconClass: 'blue', icon: 'fa-hand-holding', title: 'New Borrow Request', desc: 'Rahul Singh wants to borrow your Engineering Textbooks from 30 May to 5 Jun 2026.', time: '8 hours ago', unread: true },
    { id: 4, type: 'returned', iconClass: 'amber', icon: 'fa-rotate-left', title: 'Item Returned', desc: 'You have successfully returned "Linear Algebra Textbook" to Ananya Joshi. Deposit refund due.', time: '2 days ago', unread: false },
    { id: 5, type: 'rejected', iconClass: 'red', icon: 'fa-times-circle', title: 'Request Rejected', desc: 'Your borrow request for "MacBook Pro" was not accepted by Kabir Sharma.', time: '3 days ago', unread: false },
    { id: 6, type: 'returned', iconClass: 'green', icon: 'fa-rotate-left', title: 'Item Returned', desc: 'Sneha Patil has returned your Portable Projector in good condition.', time: '4 days ago', unread: false },
    { id: 7, type: 'accepted', iconClass: 'green', icon: 'fa-check-circle', title: 'Request Approved', desc: 'Your borrow request for "Gaming Controller (PS5)" has been approved. Pick up by 1 Jun 2026.', time: '5 days ago', unread: false },
];

// ============================================================
// PAGE: DASHBOARD HOME (Connected to Backend)
// ============================================================
async function initDashboardHome() {
    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName) welcomeName.textContent = USER.name.split(' ')[0];

    try {
        const response = await authenticatedFetch('http://127.0.0.1:8000/api/transactions/stats/');
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const stats = await response.json();

        // 1. UPDATE STATS GRID (Bulletproof targeting by exact name)
        const cards = document.querySelectorAll('.stat-card-body');
        cards.forEach(card => {
            const labelEl = card.querySelector('.stat-card-label');
            const numberEl = card.querySelector('.stat-card-number');
            if (!labelEl || !numberEl) return;

            const label = labelEl.textContent.trim();
            if (label === 'Active Listings') numberEl.setAttribute('data-target', stats.total_listings || 0);
            if (label === 'Items Borrowed') numberEl.setAttribute('data-target', stats.active_borrowings || 0);
            if (label === 'Pending Requests') numberEl.setAttribute('data-target', stats.pending_requests || 0);
            if (label === 'Reputation Rating') numberEl.setAttribute('data-target', stats.reputation_rating || 0);

            numberEl.textContent = '0'; // Reset before animation
        });

        // Trigger the animation
        animateStatNumbers();

        // 2. UPDATE QUICK OVERVIEW
        const overviewValues = document.querySelectorAll('.quick-stat-val'); 
        if (overviewValues[0]) overviewValues[0].textContent = `${stats.available_listings || 0} of ${stats.total_listings || 0} Available`;
        if (overviewValues[1]) overviewValues[1].textContent = `${stats.active_borrowings || 0} Items`;
        
        if (overviewValues[2]) {
            overviewValues[2].textContent = `${stats.returns_due_this_week || 0} Items`;
            overviewValues[2].style.color = (stats.returns_due_this_week > 0) ? 'var(--secondary-color)' : '';
        }

        if (overviewValues[3]) overviewValues[3].textContent = `₹${(stats.total_rent_earned || 0).toLocaleString()}`;
        if (overviewValues[4]) overviewValues[4].textContent = `₹${(stats.total_rent_paid || 0).toLocaleString()}`;
        if (overviewValues[5]) overviewValues[5].textContent = `₹0`;
        if (overviewValues[6]) overviewValues[6].textContent = stats.member_since || 'January 2025';

    } catch (err) {
        console.error('Dashboard Stats Error:', err);
    }
}

// MAKE SURE THIS FUNCTION IS IN YOUR FILE:
function animateStatNumbers() {
    const statEls = document.querySelectorAll('.stat-card-number');
    statEls.forEach(el => {
        const target = parseFloat(el.getAttribute('data-target')) || 0;
        let current = 0;
        
        if (target === 0) {
            el.textContent = '0';
            return;
        }

        const isFloat = target % 1 !== 0;
        const step = isFloat ? target / 30 : Math.ceil(target / 30);

        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = isFloat ? current.toFixed(1) : Math.round(current);
            if (current >= target) clearInterval(timer);
        }, 30);
    });
}

// ============================================================
// RECENT ACTIVITY (With on-screen error reporting)
// ============================================================
async function initRecentActivity() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;

    try {
        const response = await authenticatedFetch('http://127.0.0.1:8000/api/notifications/');
        if (!response.ok) throw new Error(`Notifications API failed with status: ${response.status}`);
        
        const notifications = await response.json();
        const recentActivities = notifications.slice(0, 4);
        
        if (recentActivities.length === 0) {
            activityList.innerHTML = '<div style="color: gray; padding: 20px; text-align: center;">No recent activity yet.</div>';
            return;
        }

        const iconMap = {
            'REQUEST_RECEIVED': { class: 'blue', icon: 'fa-hand-holding' },
            'REQUEST_ACCEPTED': { class: 'green', icon: 'fa-check' },
            'REQUEST_REJECTED': { class: 'red', icon: 'fa-times' },
            'TRANSACTION_COMPLETED': { class: 'amber', icon: 'fa-rotate-left' },
            'DEFAULT': { class: 'green', icon: 'fa-plus' }
        };

        activityList.innerHTML = recentActivities.map(activity => {
            const style = iconMap[activity.notification_type] || iconMap['DEFAULT'];
            const hours = Math.floor((new Date() - new Date(activity.created_at)) / (1000 * 60 * 60));
            const timeStr = hours > 24 ? `${Math.floor(hours / 24)} days ago` : hours > 0 ? `${hours} hours ago` : 'Just now';

            return `
                <div class="activity-item">
                    <div class="activity-icon ${style.class}">
                        <i class="fas ${style.icon}"></i>
                    </div>
                    <div class="activity-text">
                        <p>${activity.message}</p>
                        <div class="activity-time">${timeStr}</div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error('Recent Activity Error:', err);
        // Inject the exact error directly into your HTML panel so we can see what broke
        activityList.innerHTML = `<div style="color: #ef4444; padding: 15px; border: 1px solid #ef4444; border-radius: 8px; margin: 10px;">
            <strong>Data Fetch Failed:</strong> ${err.message}
        </div>`;
    }
}

// PAGE: BROWSE ITEMS REMOVED (Redirection to products.html handled by topnav/search catalog button)

// ============================================================
// PAGE: MY LISTINGS (Connected to Backend)
// ============================================================
async function initListings() {
    const grid = document.getElementById('listings-grid');
    if (!grid) return;

    try {
        const response = await authenticatedFetch('http://127.0.0.1:8000/api/listings/');
        if (!response.ok) throw new Error('Failed to fetch listings');
        
        const dbData = await response.json();
        
        // Map Django database keys to match your frontend HTML template
        const mappedData = dbData.map(item => ({
            id: item.id,
            image: '../static/images/dell_Laptop.jpg', // Fallback until media upload is wired
            name: item.title,
            category: item.category, // Ensure your serializer returns category name, or map ID here
            rent: `₹${item.price_per_day}/day`,
            security_deposit: item.security_deposit,
            status: 'available', 
            requests: 0 // Placeholder until request counts are serialized
        }));

        renderListings(mappedData, grid);
    } catch (err) {
        console.error(err);
        grid.innerHTML = '<p>Error loading listings.</p>';
    }
}

function renderListings(data, grid) {
    if (data.length === 0) {
        grid.innerHTML = '<p>You have no active listings.</p>';
        return;
    }


    grid.innerHTML = data.map(item => `
        <div class="inventory-card">
            <div class="inventory-card-image-wrap">
                <img class="inventory-card-image" src="${item.image}" alt="${item.name}">
                <span class="status-badge status-${item.status} inventory-card-status-badge">
                    ${capitalize(item.status)}
                </span>
            </div>
            <div class="inventory-card-details">
                <h3 class="inventory-card-name">${item.name}</h3>
                <div class="inventory-card-category">Category ID: ${item.category}</div>
                
                <div class="inventory-card-price-row">
                    <span class="inventory-card-rent">${item.rent}</span>
                    <span class="inventory-card-separator">•</span>
                    <span class="inventory-card-deposit">₹${item.security_deposit || '0.00'} Deposit</span>
                </div>
                
                <div class="inventory-card-actions" style="margin-top: 15px;">
                    <button class="btn-edit" onclick="openEditListing(${item.id})" style="flex: 1;">Edit</button>
                    <button class="btn-console-action danger" title="Delete listing" onclick="confirmDelete(${item.id}, '${item.name.replace(/'/g, "\\\'")}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

window.confirmDelete = async function(id, name) {
    if (confirm(`Remove "${name}" from your listings?`)) {
        try {
            const response = await authenticatedFetch(`http://127.0.0.1:8000/api/listings/${id}/`, {
                method: 'DELETE'
            });
            
            if (response.ok || response.status === 204) {
                showToast(`"${name}" deleted successfully.`);
                initListings(); // Refresh grid from database
            } else {
                showToast('Failed to delete item.', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Network error during deletion.', 'error');
        }
    }
};

// ============================================================
// EDIT LISTING LOGIC
// ============================================================

window.openEditListing = async function(id) {
    try {
        const response = await authenticatedFetch(`http://127.0.0.1:8000/api/listings/${id}/`);
        if (!response.ok) throw new Error('Failed to fetch listing');
        
        const item = await response.json();
        
        // Populate modal fields
        document.getElementById('edit-item-id').value = item.id;
        document.getElementById('edit-item-title').value = item.title;
        document.getElementById('edit-item-rent').value = item.price_per_day;
        document.getElementById('edit-item-deposit').value = item.security_deposit || 0;
        document.getElementById('edit-item-condition').value = item.condition;
        
        // Show modal
        document.getElementById('edit-item-modal').style.display = 'flex';
    } catch (err) {
        console.error('Error fetching listing:', err);
        showToast('Could not load listing data.', 'error');
    }
};

window.closeEditModal = function() {
    document.getElementById('edit-item-modal').style.display = 'none';
    document.getElementById('edit-item-form').reset();
};

document.getElementById('edit-item-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('edit-item-id').value;
    const payload = {
        title: document.getElementById('edit-item-title').value.trim(),
        price_per_day: document.getElementById('edit-item-rent').value,
        security_deposit: document.getElementById('edit-item-deposit').value,
        condition: document.getElementById('edit-item-condition').value
    };

    try {
        const response = await authenticatedFetch(`http://127.0.0.1:8000/api/listings/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showToast('Listing updated successfully!');
            closeEditModal();
            initListings(); // Refresh inventory grid
        } else {
            const errorData = await response.json();
            console.error('Update errors:', errorData);
            showToast('Failed to update listing.', 'error');
        }
    } catch (err) {
        console.error('Submit error:', err);
        showToast('Network error while updating.', 'error');
    }
});
// ============================================================
// PAGE: BORROW REQUESTS (Connected to Backend)
// ============================================================
let CURRENT_REQUESTS = []; // Store globally for filtering

async function initRequests() {
    const list = document.getElementById('requests-list');
    if (!list) return;

    try {
        // Fetch incoming requests (where the current user is the owner)
        // Adjust the URL if your routing differs (e.g., /api/requests/incoming/)
        const response = await authenticatedFetch('http://127.0.0.1:8000/api/requests/incoming/');
        if (!response.ok) throw new Error('Failed to fetch requests');
        
        CURRENT_REQUESTS = await response.json();
        
        updatePendingCount(CURRENT_REQUESTS);
        renderRequests(CURRENT_REQUESTS, list);
        setupRequestFilters(list);
    } catch (err) {
        console.error('Error loading requests:', err);
        list.innerHTML = '<p>Error loading requests. Ensure your backend is running.</p>';
    }
}

function updatePendingCount(data) {
    const pendingCount = document.getElementById('requests-pending-count');
    const pending = data.filter(r => r.status === 'PENDING');
    if (pendingCount) pendingCount.textContent = pending.length;
}

function renderRequests(data, listElement) {
    if (data.length === 0) {
        listElement.innerHTML = '<p style="color: gray; padding: 20px;">No requests found.</p>';
        return;
    }

    listElement.innerHTML = data.map(req => {
        // Calculate days between dates securely
        const start = new Date(req.start_date);
        const end = new Date(req.end_date);
        const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        
        // Formatting dates
        const dateStr = `${start.toLocaleDateString('en-IN', {day:'numeric', month:'short'})} – ${end.toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}`;
        
        // Extract borrower name safely
        const borrowerName = req.borrower_username || `User #${req.borrower}`;
        const avatarStr = borrowerName.substring(0, 2).toUpperCase();

        return `
            <div class="request-card" id="req-${req.id}">
                <div class="request-card-thumb-wrap">
                    <img class="request-card-thumb" src="../static/images/dell_Laptop.jpg" alt="Item Image">
                    <span class="status-badge status-${req.status.toLowerCase()} request-card-status-badge">
                        ${capitalize(req.status)}
                    </span>
                </div>
                <div class="request-card-details">
                    <div class="request-card-header-row">
                        <span class="request-item-name">Listing #${req.listing}</span>
                        <div class="request-card-borrower">
                            <span class="request-borrower-avatar">${avatarStr}</span>
                            <span>${borrowerName}</span>
                        </div>
                    </div>
                    <div class="request-card-meta-row">
                        <span class="request-meta-item"><i class="fas fa-calendar"></i> ${dateStr}</span>
                        <span class="request-meta-item"><i class="fas fa-clock"></i> ${days} days</span>
                    </div>
                </div>
                <div class="request-card-actions">
                    ${req.status === 'PENDING' ? `
                        <button class="btn-accept" onclick="handleRequest(${req.id}, 'accept')">
                            <i class="fas fa-check"></i> Accept
                        </button>
                        <button class="btn-reject" onclick="handleRequest(${req.id}, 'reject')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function setupRequestFilters(listElement) {
    const filterBtns = document.querySelectorAll('[data-req-filter]');
    // Remove old listeners by cloning
    filterBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', () => {
            document.querySelectorAll('[data-req-filter]').forEach(b => b.classList.remove('active'));
            newBtn.classList.add('active');
            
            const f = newBtn.getAttribute('data-req-filter').toUpperCase();
            const filtered = f === 'ALL' ? CURRENT_REQUESTS : CURRENT_REQUESTS.filter(r => r.status === f);
            renderRequests(filtered, listElement);
        });
    });
}

// Global function to handle Accept/Reject API calls
window.handleRequest = async function(id, action) {
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;

    try {
        const response = await authenticatedFetch(`http://127.0.0.1:8000/api/requests/${id}/${action}/`, {
            method: 'PATCH'
        });

        if (response.ok) {
            showToast(`Request successfully ${action}ed!`);
            initRequests(); // Refresh the list from the database
        } else {
            const errData = await response.json();
            showToast(errData.error || `Failed to ${action} request`, 'error');
        }
    } catch (err) {
        console.error('Action error:', err);
        showToast('Network error while processing request.', 'error');
    }
};

// ============================================================
// PAGE: ACTIVE BORROWINGS & RENTALS (Connected to Backend)
// ============================================================
async function initBorrowings() {
    const grid = document.getElementById('borrowings-grid');
    if (!grid) return;

    try {
        // Fetch all transactions for this user
        const response = await authenticatedFetch('http://127.0.0.1:8000/api/transactions/');
        if (!response.ok) throw new Error('Failed to fetch transactions');
        
        const allTransactions = await response.json();
        
        // Filter only the ACTIVE transactions
        const activeTransactions = allTransactions.filter(t => t.status === 'ACTIVE');
        
        renderBorrowings(activeTransactions, grid);
    } catch (err) {
        console.error('Error loading active transactions:', err);
        grid.innerHTML = '<p style="color: gray; padding: 20px;">Error loading active rentals. Ensure your backend is running.</p>';
    }
}

function renderBorrowings(data, grid) {
    if (data.length === 0) {
        grid.innerHTML = '<p style="color: gray; padding: 20px;">You have no active borrowings or rentals right now.</p>';
        return;
    }

    // Get current username to determine if they are the borrower or the owner
    const currentUsername = USER.name.split(' ')[0]; // Fallback to local username

    grid.innerHTML = data.map(b => {
        // Calculate days safely
        const start = new Date(b.start_date);
        const end = new Date(b.end_date);
        const today = new Date();
        
        const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        const daysLeft = Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));
        
        const pct = Math.round(((totalDays - daysLeft) / totalDays) * 100);
        const fillClass = daysLeft <= 2 ? 'danger' : daysLeft <= 4 ? 'warning' : '';
        const daysClass = daysLeft <= 2 ? 'danger' : daysLeft <= 4 ? 'warning' : '';

        // Safely extract item name and owner (adjust based on your API's JSON response keys)
        const itemName = b.listing_title || `Listing #${b.listing}`;
        const ownerName = b.owner_username || `User #${b.owner}`;

        return `
            <div class="borrowing-card" id="transaction-${b.id}">
                <div class="borrowing-card-image-wrap">
                    <img class="borrowing-card-image" src="../static/images/dell_Laptop.jpg" alt="${itemName}">
                    <span class="borrowing-card-days-badge ${daysClass}">
                        ${daysLeft} Day${daysLeft === 1 ? '' : 's'} Left
                    </span>
                </div>
                <div class="borrowing-card-details">
                    <h3 class="borrowing-card-title">${itemName}</h3>
                    <div class="borrowing-card-owner">Owner: ${ownerName}</div>
                    
                    <div class="borrowing-card-meta">
                        <div class="borrowing-detail-row">
                            <span class="borrowing-detail-label"><i class="fas fa-calendar-check"></i> Pickup</span>
                            <span class="borrowing-detail-value">${start.toLocaleDateString('en-IN', {day:'numeric', month:'short'})}</span>
                        </div>
                        <div class="borrowing-detail-row">
                            <span class="borrowing-detail-label"><i class="fas fa-calendar-times"></i> Return By</span>
                            <span class="borrowing-detail-value">${end.toLocaleDateString('en-IN', {day:'numeric', month:'short'})}</span>
                        </div>
                        <div class="borrowing-detail-row">
                            <span class="borrowing-detail-label"><i class="fas fa-rupee-sign"></i> Rate</span>
                            <span class="borrowing-detail-value">₹${b.price_per_day}/day</span>
                        </div>
                    </div>
                    
                    <div class="days-progress">
                        <div class="days-progress-label">
                            <span>Days remaining</span>
                            <span style="color:${daysLeft <= 2 ? 'var(--secondary-color)' : daysLeft <= 4 ? '#D97706' : 'var(--text-main)'}; font-weight: var(--fw-semibold);">${daysLeft} / ${totalDays}</span>
                        </div>
                        <div class="days-progress-bar">
                            <div class="days-progress-fill ${fillClass}" style="width:${pct}%"></div>
                        </div>
                    </div>
                    
                    <div class="borrowing-card-footer">
                        <button class="btn-secondary-dash btn-sm" style="width:100%;justify-content:center;" onclick="markAsReturned(${b.id})">
                            <i class="fas fa-rotate-left"></i> Mark as Returned
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Global function to trigger the Complete Transaction API
// Replace your existing markAsReturned function with this:
window.markAsReturned = async function(transactionId) {
    // 1. Ask the user for a rating
    let ratingInput = prompt("Transaction complete! Please rate the borrower from 1 to 5:");
    
    if (!ratingInput) return; // Cancelled
    
    let rating = parseInt(ratingInput);
    if (isNaN(rating) || rating < 1 || rating > 5) {
        alert("Invalid rating. Must be a number between 1 and 5.");
        return;
    }

    try {
        // 2. Send the transaction ID and the rating to the backend
        const response = await authenticatedFetch(`http://127.0.0.1:8000/api/transactions/${transactionId}/complete/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rating: rating }) 
        });

        if (response.ok) {
            showToast('Item returned and user rated!');
            initBorrowings(); 
            initDashboardHome(); // Refresh the top grid to show the new average!
        } else {
            const errData = await response.json();
            showToast(errData.error || 'Failed to complete transaction', 'error');
        }
    } catch (err) {
        console.error('Return item error:', err);
        showToast('Network error while processing return.', 'error');
    }
};

// ============================================================
// PAGE: TRANSACTION HISTORY (Connected to Backend)
// ============================================================
async function initHistory() {
    const tbody = document.getElementById('history-tbody');
    if (!tbody) return;

    try {
        // Fetch all transactions for this user
        const response = await authenticatedFetch('http://127.0.0.1:8000/api/transactions/');
        if (!response.ok) throw new Error('Failed to fetch transaction history');
        
        const allTransactions = await response.json();
        
        // Filter for completed or cancelled transactions (or show all based on your preference)
        // For history, we usually want to see everything, or filter to past items.
        // Let's show everything, but we will style the status.
        
        renderHistory(allTransactions, tbody);
    } catch (err) {
        console.error('Error loading history:', err);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:gray;">Error loading history. Ensure your backend is running.</td></tr>';
    }
}

function renderHistory(data, tbody) {
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:gray;">No transaction history found.</td></tr>';
        return;
    }

    // Sort by most recent start date first
    data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

    // Get current username to determine if they are the borrower or owner
    const currentUsername = USER.name.split(' ')[0] || localStorage.getItem('username');

    tbody.innerHTML = data.map(h => {
        // Format the date nicely
        const startDate = new Date(h.start_date).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        // Determine if the current user is borrowing or lending this item
        const isOwner = h.owner_username === currentUsername || h.owner === parseInt(localStorage.getItem('user_id'));
        const type = isOwner ? 'Lend' : 'Borrow';
        const typeClass = isOwner ? 'type-lend' : 'type-borrow';
        
        // Safely extract item name
        const itemName = h.listing_title || `Listing #${h.listing}`;

        // Dynamic styling for rent column based on if you earned or spent it
        const amountClass = isOwner ? 'amount-positive' : 'amount-neutral';
        const amountPrefix = isOwner ? '+₹' : '₹';

        return `
            <tr>
                <td>
                    <div class="history-item-info">
                        <div class="history-thumb-wrap">
                            <img class="history-thumb-image" src="../static/images/dell_Laptop.jpg" alt="${itemName}">
                        </div>
                        <div>
                            <div class="history-item-name">${itemName}</div>
                            <div class="history-item-date">${startDate}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="history-type-badge ${typeClass}">${type}</span>
                </td>
                <td class="${amountClass}">${amountPrefix}${h.price_per_day}/day</td>
                <td class="amount-neutral">₹0</td> <td><span class="status-badge status-${h.status.toLowerCase()}">${capitalize(h.status)}</span></td>
            </tr>
        `;
    }).join('');
}
// ============================================================
// PAGE: NOTIFICATIONS (Connected to Backend)
// ============================================================
async function initNotifications() {
    const list = document.getElementById('notif-list');
    if (!list) return;

    try {
        const response = await authenticatedFetch('http://127.0.0.1:8000/api/notifications/');
        if (!response.ok) throw new Error('Failed to fetch notifications');
        
        const data = await response.json();
        renderNotifications(data, list);
        setupMarkAllRead(list);
    } catch (err) {
        console.error('Error loading notifications:', err);
        list.innerHTML = '<div style="padding: 20px; color: gray; text-align: center;">Error loading notifications. Ensure the backend endpoint exists.</div>';
    }
}

function renderNotifications(data, list) {
    if (data.length === 0) {
        list.innerHTML = '<div style="padding: 20px; color: gray; text-align: center;">No new notifications.</div>';
        updateNotificationBadge(0);
        return;
    }

    // Map backend notification types to your frontend styling
    const colorMap = {
        'REQUEST_RECEIVED': { class: 'blue', icon: 'fa-hand-holding', hex: 'var(--quaternary-color)' },
        'REQUEST_ACCEPTED': { class: 'green', icon: 'fa-check-circle', hex: '#10B981' },
        'REQUEST_REJECTED': { class: 'red', icon: 'fa-times-circle', hex: 'var(--secondary-color)' },
        'TRANSACTION_COMPLETED': { class: 'amber', icon: 'fa-rotate-left', hex: '#F59E0B' },
        'DEFAULT': { class: 'blue', icon: 'fa-bell', hex: 'var(--quaternary-color)' }
    };

    list.innerHTML = data.map(n => {
        const style = colorMap[n.notification_type] || colorMap['DEFAULT'];
        const timeStr = new Date(n.created_at).toLocaleString('en-IN', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        return `
            <div class="notif-item ${!n.is_read ? 'unread' : ''}" id="notif-${n.id}">
                <div class="notif-icon ${style.class}" style="background:rgba(0,0,0,0.04);">
                    <i class="fas ${style.icon}" style="color:${style.hex};"></i>
                </div>
                <div class="notif-content">
                    <div class="notif-title">${n.title}</div>
                    <div class="notif-desc">${n.message}</div>
                </div>
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.4rem;flex-shrink:0;">
                    <span class="notif-time">${timeStr}</span>
                    ${!n.is_read ? '<span class="notif-unread-dot"></span>' : ''}
                </div>
            </div>
        `;
    }).join('');

    // Attach click events to mark individual notifications as read
    list.querySelectorAll('.notif-item.unread').forEach(el => {
        el.addEventListener('click', async () => {
            const id = el.id.split('-')[1];
            await markNotificationRead(id, el);
        });
    });

    const unreadCount = data.filter(n => !n.is_read).length;
    updateNotificationBadge(unreadCount);
}

function updateNotificationBadge(count) {
    const badge = document.getElementById('notif-badge');
    const dot = document.querySelector('.notif-dot'); // Sidebar red dot
    
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
    if (dot) {
        dot.style.display = count > 0 ? 'block' : 'none';
    }
}

async function markNotificationRead(id, element) {
    try {
        // Assumes your backend has an endpoint to mark items as read
        const response = await authenticatedFetch(`http://127.0.0.1:8000/api/notifications/${id}/read/`, {
            method: 'PATCH' 
        });
        
        if (response.ok) {
            element.classList.remove('unread');
            const dot = element.querySelector('.notif-unread-dot');
            if (dot) dot.remove();
            
            const badge = document.getElementById('notif-badge');
            if (badge && badge.textContent) {
                const newCount = Math.max(0, parseInt(badge.textContent) - 1);
                updateNotificationBadge(newCount);
            }
        }
    } catch (err) {
        console.error('Failed to mark notification as read:', err);
    }
}

function setupMarkAllRead(list) {
    const markAllBtn = document.getElementById('mark-all-read');
    if (!markAllBtn) return;

    // Remove old listeners to prevent duplicates
    const newBtn = markAllBtn.cloneNode(true);
    markAllBtn.parentNode.replaceChild(newBtn, markAllBtn);

    newBtn.addEventListener('click', async () => {
        try {
            const response = await authenticatedFetch('http://127.0.0.1:8000/api/notifications/read-all/', {
                method: 'POST'
            });
            
            if (response.ok) {
                list.querySelectorAll('.notif-item.unread').forEach(el => {
                    el.classList.remove('unread');
                    el.querySelector('.notif-unread-dot')?.remove();
                });
                updateNotificationBadge(0);
                showToast('All notifications marked as read');
            }
        } catch (err) {
            console.error('Failed to mark all as read:', err);
            showToast('Network error', 'error');
        }
    });
}

// ============================================================
// PAGE: PROFILE
// ============================================================
function initProfile() {
    // Populate static user info
    setTextById('profile-name', USER.name);
    setTextById('profile-email', USER.email);
    setTextById('profile-phone', USER.phone);
    setTextById('profile-rating', USER.rating + ' ★');
    setTextById('profile-listings-count', USER.totalListings);
    setTextById('profile-borrowings-count', USER.totalBorrowings);
    setTextById('profile-since', USER.memberSince);

    // Init avatar initials
    document.querySelectorAll('.profile-avatar, .profile-avatar-lg').forEach(el => {
        el.textContent = USER.initials;
    });

    // Pre-fill edit form
    setInputById('edit-name', USER.name);
    setInputById('edit-email', USER.email);
    setInputById('edit-phone', USER.phone);

    // Pre-fill theme preference selectors
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const lightCard = document.getElementById('pref-theme-light');
    const darkCard = document.getElementById('pref-theme-dark');
    if (lightCard && darkCard) {
        if (currentTheme === 'light') {
            lightCard.classList.add('active');
            darkCard.classList.remove('active');
        } else {
            darkCard.classList.add('active');
            lightCard.classList.remove('active');
        }
    }

    // Tab switching logic
    const tabBtns = document.querySelectorAll('.profile-tab-btn');
    const panes = document.querySelectorAll('.profile-settings-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-profile-tab');
            
            // Remove active from all buttons & panes
            tabBtns.forEach(b => b.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            
            // Add active to current
            btn.classList.add('active');
            const targetPane = document.getElementById('profile-pane-' + targetTab);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    // Save button logic (with live mock updating)
    const saveBtn = document.getElementById('save-profile-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const newName = document.getElementById('edit-name')?.value?.trim();
            const newPhone = document.getElementById('edit-phone')?.value?.trim();
            const newBio = document.getElementById('edit-bio')?.value?.trim();

            if (!newName) {
                showToast('Please enter a valid name', 'error');
                return;
            }

            // Update USER object
            USER.name = newName;
            if (newPhone) USER.phone = newPhone;
            if (newBio) USER.bio = newBio;

            // Generate initials
            const parts = newName.split(' ');
            let initials = '';
            if (parts.length > 0 && parts[0]) initials += parts[0][0];
            if (parts.length > 1 && parts[parts.length - 1]) initials += parts[parts.length - 1][0];
            USER.initials = initials.toUpperCase() || 'AS';

            // Propagate initials to all avatars
            document.querySelectorAll('.profile-avatar, .profile-avatar-lg, .sidebar-avatar-sm, .topnav-avatar').forEach(el => {
                el.textContent = USER.initials;
            });

            // Propagate name to headers & welcome texts
            const welcomeName = document.getElementById('welcome-name');
            if (welcomeName) welcomeName.textContent = newName.split(' ')[0];
            
            const profileName = document.getElementById('profile-name');
            if (profileName) profileName.textContent = newName;

            showToast('Profile updated successfully!');
        });
    }
}

// Global Theme Sync for Preferences Tab Cards
window.setDashboardTheme = function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('borrowbox-theme', theme);
    
    // update topnav icon if exists
    const toggleIcon = document.getElementById('theme-toggle-icon');
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleIcon && toggleBtn) {
        if (theme === 'dark') {
            toggleIcon.className = 'fas fa-sun';
            toggleBtn.title = 'Switch to Light Theme';
        } else {
            toggleIcon.className = 'fas fa-moon';
            toggleBtn.title = 'Switch to Dark Theme';
        }
    }

    // Update active classes on cards
    const lightCard = document.getElementById('pref-theme-light');
    const darkCard = document.getElementById('pref-theme-dark');
    if (lightCard && darkCard) {
        if (theme === 'light') {
            lightCard.classList.add('active');
            darkCard.classList.remove('active');
        } else {
            darkCard.classList.add('active');
            lightCard.classList.remove('active');
        }
    }
    
    showToast(`Theme switched to ${theme === 'dark' ? 'Dark' : 'Light'} Mode`);
};

// ============================================================
// PAGE: ADD ITEM FORM
// ============================================================
function initAddItemForm() {
    const form = document.getElementById('add-item-form');
    if (!form) return;

    let uploadedImageSrc = '';

    const fileInput = document.getElementById('item-image-input');
    const primaryPreview = document.getElementById('image-primary-preview');
    const previewImg = document.getElementById('preview-image-actual');
    const previewPlaceholder = document.getElementById('preview-image-placeholder');

    // Reset preview to default state
    function resetPreview() {
        uploadedImageSrc = '';
        if (primaryPreview) {
            primaryPreview.innerHTML = `
                <i class="fas fa-cloud-arrow-up upload-icon"></i>
                <p>Click to upload primary photo</p>
                <small>JPG, PNG or WEBP · Max 5MB</small>
            `;
        }
        if (previewImg && previewPlaceholder) {
            previewImg.src = '';
            previewImg.style.display = 'none';
            previewPlaceholder.style.display = 'flex';
        }
        
        const thumbSlot1 = document.querySelector('#thumb-slot-1 .slot-image-wrap');
        if (thumbSlot1) {
            thumbSlot1.innerHTML = `<i class="fas fa-plus"></i>`;
        }

        setTextById('preview-name-text', 'Listing Name');
        setTextById('preview-category-text', 'Category');
        setTextById('preview-rent-text', '₹0');
        setTextById('preview-deposit-text', '₹0');
        setTextById('preview-avail-text', 'Dates not set');
    }

    // Photo Upload click & change handlers
    if (primaryPreview && fileInput) {
        primaryPreview.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    uploadedImageSrc = e.target.result;
                    
                    // Update primary preview area
                    primaryPreview.innerHTML = `<img src="${uploadedImageSrc}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;" />`;
                    
                    // Update live preview card
                    if (previewImg && previewPlaceholder) {
                        previewImg.src = uploadedImageSrc;
                        previewImg.style.display = 'block';
                        previewPlaceholder.style.display = 'none';
                    }

                    // Update thumbnail slot 1
                    const thumbSlot1 = document.querySelector('#thumb-slot-1 .slot-image-wrap');
                    if (thumbSlot1) {
                        thumbSlot1.innerHTML = `<img src="${uploadedImageSrc}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;" />`;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Live binding for form fields
    const nameInput = document.getElementById('item-name');
    const categorySelect = document.getElementById('item-category');
    const rentInput = document.getElementById('item-rent');
    const depositInput = document.getElementById('item-deposit');
    const fromInput = document.getElementById('item-from');
    const untilInput = document.getElementById('item-until');

    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            setTextById('preview-name-text', val || 'Listing Name');
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            const val = e.target.value;
            setTextById('preview-category-text', val || 'Category');
        });
    }

    if (rentInput) {
        rentInput.addEventListener('input', (e) => {
            const val = e.target.value;
            setTextById('preview-rent-text', val ? `₹${val}` : '₹0');
        });
    }

    if (depositInput) {
        depositInput.addEventListener('input', (e) => {
            const val = e.target.value;
            setTextById('preview-deposit-text', val ? `₹${val}` : '₹0');
        });
    }

    function updatePreviewDates() {
        const fromVal = fromInput?.value;
        const untilVal = untilInput?.value;
        if (fromVal && untilVal) {
            const fromDate = new Date(fromVal);
            const untilDate = new Date(untilVal);
            const options = { day: 'numeric', month: 'short' };
            const formattedFrom = fromDate.toLocaleDateString('en-IN', options);
            const formattedUntil = untilDate.toLocaleDateString('en-IN', options);
            setTextById('preview-avail-text', `${formattedFrom} – ${formattedUntil}`);
        } else {
            setTextById('preview-avail-text', 'Dates not set');
        }
    }

    if (fromInput) fromInput.addEventListener('change', updatePreviewDates);
    if (untilInput) untilInput.addEventListener('change', updatePreviewDates);

    // Cancel Button logic
    const cancelBtn = document.getElementById('cancel-listing-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            form.reset();
            resetPreview();
            document.querySelector('.sidebar-link[data-page="listings"]')?.click();
        });
    }

    // Form Submit (Creates a real mockup item in Listings Grid)
    // Form Submit (Sends POST to Django Backend)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = nameInput?.value?.trim();
        const categoryText = categorySelect?.value;
        const conditionText = document.getElementById('item-condition')?.value;
        const rent = rentInput?.value;
        const deposit = depositInput?.value || '0';
        const desc = document.getElementById('item-description')?.value;

        if (!name || !categoryText || !rent || !desc) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        // Map Category Text to Backend ID (Adjust IDs to match your DB)
        const categoryMap = {
            "Electronics": 1,
            "Study Essentials": 2,
            "Appliances": 3,
            "Clothing": 4,
            "Accessories": 5,
            "Sports": 6,
            "Instruments": 7,
            "Other": 8
        };
        const categoryId = categoryMap[categoryText] || 1;

        let conditionCode = 'GOOD';
        if (conditionText === 'Like New') conditionCode = 'NEW'; 
        else if (conditionText === 'Fair') conditionCode = 'USED';

        const payload = {
            title: name,
            description: desc,
            price_per_day: rent,
            security_deposit: deposit,
            category: categoryId,
            condition: conditionCode
        };

        try {
            const response = await authenticatedFetch('http://127.0.0.1:8000/api/listings/', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (response.status === 201) {
                showToast(`"${name}" listed successfully!`);
                form.reset();
                resetPreview();
                initListings(); // Pull fresh data from database
                document.querySelector('.sidebar-link[data-page="listings"]')?.click();
            } else {
                const errorData = await response.json();
                console.error('Validation errors:', errorData);
                showToast('Failed to create listing. Check inputs.', 'error');
            }
        } catch (err) {
            console.error('Submit error:', err);
            showToast('Network error while saving.', 'error');
        }
    });
}

// ============================================================
// UTILITIES
// ============================================================
function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function setTextById(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function setInputById(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}

window.showToast = function (msg, type = 'info') {
    const existing = document.querySelector('.dash-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'dash-toast';
    toast.style.cssText = `
        position: fixed; bottom: 24px; right: 24px; z-index: 9999;
        background: var(--surface-card); padding: 0.9rem 1.4rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        display: flex; align-items: center; gap: 0.75rem;
        font-family: var(--font-secondary); font-size: var(--fs-sm);
        border: 1px solid var(--border-clean);
        border-left: 4px solid ${type === 'error' ? 'var(--secondary-color)' : 'var(--accent-primary)'};
        transform: translateY(80px); transition: transform 0.3s ease;
        max-width: 360px; color: var(--text-main);
    `;
    const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
    const color = type === 'error' ? 'var(--secondary-color)' : 'var(--quaternary-color)';
    toast.innerHTML = `<i class="fas ${icon}" style="color:${color};font-size:1rem;flex-shrink:0;"></i><span>${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.style.transform = 'translateY(0)', 10);
    setTimeout(() => {
        toast.style.transform = 'translateY(80px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};

// ============================================================
// THEME TOGGLE — Light and Dark themes control
// ============================================================
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const toggleIcon = document.getElementById('theme-toggle-icon');
    if (!toggleBtn || !toggleIcon) return;

    function updateIcon(theme) {
        if (theme === 'dark') {
            toggleIcon.className = 'fas fa-sun';
            toggleBtn.title = 'Switch to Light Theme';
        } else {
            toggleIcon.className = 'fas fa-moon';
            toggleBtn.title = 'Switch to Dark Theme';
        }
    }

    // Get current theme from documentElement attribute (set by head script)
    let currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateIcon(currentTheme);

    toggleBtn.addEventListener('click', () => {
        currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('borrowbox-theme', nextTheme);
        updateIcon(nextTheme);
        showToast(`Theme switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
}

// ============================================================
// SIDEBAR COLLAPSE — Desktop expanded/collapsed toggle
// ============================================================
function initSidebarCollapse() {
    const collapseBtn = document.getElementById('sidebar-collapse-btn');
    const collapseIcon = document.getElementById('sidebar-collapse-icon');
    if (!collapseBtn || !collapseIcon) return;

    function updateCollapseIcon(state) {
        if (state === 'collapsed') {
            collapseIcon.className = 'fas fa-chevron-right';
            collapseBtn.title = 'Expand Sidebar';
        } else {
            collapseIcon.className = 'fas fa-chevron-left';
            collapseBtn.title = 'Collapse Sidebar';
        }
    }

    let currentState = document.documentElement.getAttribute('data-sidebar') || 'expanded';
    updateCollapseIcon(currentState);

    collapseBtn.addEventListener('click', () => {
        currentState = document.documentElement.getAttribute('data-sidebar') || 'expanded';
        const nextState = currentState === 'collapsed' ? 'expanded' : 'collapsed';

        document.documentElement.setAttribute('data-sidebar', nextState);
        localStorage.setItem('sidebar-state', nextState);
        updateCollapseIcon(nextState);

        // Hide any active tooltips to prevent layout residue
        const activeTooltip = document.querySelector('.sidebar-tooltip');
        if (activeTooltip) activeTooltip.style.opacity = '0';
    });
}

// ============================================================
// SIDEBAR TOOLTIPS — Custom positioning for collapsed icons
// ============================================================
function initSidebarTooltips() {
    let tooltip = document.querySelector('.sidebar-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'sidebar-tooltip';
        tooltip.style.cssText = `
            position: fixed; z-index: 9999;
            background: var(--text-main); color: var(--bg-panel);
            padding: 6px 12px; border-radius: var(--radius-sm);
            font-family: var(--font-secondary); font-size: var(--fs-xs);
            font-weight: var(--fw-semibold); border: 1px solid var(--border-clean);
            box-shadow: var(--shadow-md); pointer-events: none;
            opacity: 0; transition: opacity 0.15s ease;
        `;
        document.body.appendChild(tooltip);
    }

    document.querySelectorAll('.dash-sidebar [data-tooltip]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            const isCollapsed = document.documentElement.getAttribute('data-sidebar') === 'collapsed';
            const isDesktop = window.innerWidth > 768;
            
            if (!isCollapsed || !isDesktop) return;

            const text = el.getAttribute('data-tooltip');
            tooltip.textContent = text;

            const rect = el.getBoundingClientRect();
            tooltip.style.top = '0px'; // reset temp layout
            
            const tooltipHeight = tooltip.offsetHeight || 28;

            tooltip.style.left = `${rect.right + 10}px`;
            tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltipHeight / 2)}px`;
            tooltip.style.opacity = '1';
        });

        el.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
}