// ============================================================
// BORROWBOX DASHBOARD — dashboard.js
// SPA navigation + placeholder data + UI interactions
// No backend integration. Replace placeholder functions with
// real API calls when backend is ready.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initSidebarCollapse();
    initSidebarTooltips();
    initNavigation();
    initSidebarToggle();
    initDashboardHome();
    initListings();
    initRequests();
    initBorrowings();
    initHistory();
    initNotifications();
    initProfile();
    initAddItemForm();
    initTopnavSearch();
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
        window.location.href = '../templates/login.html';
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
// PAGE: DASHBOARD HOME
// ============================================================
function initDashboardHome() {
    // User name in welcome
    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName) welcomeName.textContent = USER.name.split(' ')[0];

    // Animate stat numbers
    animateStatNumbers();
}

function animateStatNumbers() {
    const statEls = document.querySelectorAll('.stat-number-anim');
    statEls.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current = 0;
        const step = Math.ceil(target / 30);
        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current;
            if (current >= target) clearInterval(timer);
        }, 30);
    });
}

// PAGE: BROWSE ITEMS REMOVED (Redirection to products.html handled by topnav/search catalog button)

// ============================================================
// PAGE: MY LISTINGS
// ============================================================
function initListings() {
    const grid = document.getElementById('listings-grid');
    if (!grid) return;

    function renderListings(data) {
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
                    <div class="inventory-card-category">${item.category}</div>
                    
                    <div class="inventory-card-price-row">
                        <span class="inventory-card-rent">${item.rent}</span>
                        <span class="inventory-card-separator">•</span>
                        <span class="inventory-card-deposit">${item.deposit} Deposit</span>
                    </div>
                    
                    <div class="inventory-card-requests-row">
                        <i class="fas fa-inbox"></i>
                        <span>${item.requests} Pending Request${item.requests === 1 ? '' : 's'}</span>
                    </div>

                    <div class="inventory-card-actions">
                        <button class="btn-console-action" title="Edit listing" onclick="showToast('Edit listing — connect to backend')">
                            <i class="fas fa-pen"></i> Edit
                        </button>
                        <button class="btn-console-action" title="View requests" onclick="showToast('View requests for ${item.name.replace(/'/g, "\\\'")}')">
                            <i class="fas fa-inbox"></i> Requests (${item.requests})
                        </button>
                        <button class="btn-console-action danger" title="Delete listing" onclick="confirmDelete('${item.name.replace(/'/g, "\\\'")}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderListings(LISTINGS_DATA);
}

function confirmDelete(name) {
    if (confirm(`Remove "${name}" from your listings?`)) {
        showToast(`"${name}" removed — connect to backend to persist`);
    }
}

// ============================================================
// PAGE: BORROW REQUESTS
// ============================================================
function initRequests() {
    const list = document.getElementById('requests-list');
    if (!list) return;

    const pendingCount = document.getElementById('requests-pending-count');
    const pending = REQUESTS_DATA.filter(r => r.status === 'pending');
    if (pendingCount) pendingCount.textContent = pending.length;

    function renderRequests(data) {
        list.innerHTML = data.map(req => `
            <div class="request-card" id="req-${req.id}">
                <div class="request-card-thumb-wrap">
                    <img class="request-card-thumb" src="${req.image}" alt="${req.item}">
                    <span class="status-badge status-${req.status} request-card-status-badge">
                        ${capitalize(req.status)}
                    </span>
                </div>
                <div class="request-card-details">
                    <div class="request-card-header-row">
                        <span class="request-item-name">${req.item}</span>
                        <div class="request-card-borrower">
                            <span class="request-borrower-avatar">${req.avatar}</span>
                            <span>${req.borrower}</span>
                        </div>
                    </div>
                    <div class="request-card-meta-row">
                        <span class="request-meta-item"><i class="fas fa-calendar"></i> ${req.dates}</span>
                        <span class="request-meta-item"><i class="fas fa-clock"></i> ${req.days} days</span>
                        <span class="request-meta-item"><i class="fas fa-rupee-sign"></i> ${req.rent}</span>
                    </div>
                </div>
                <div class="request-card-actions">
                    ${req.status === 'pending' ? `
                        <button class="btn-accept" onclick="handleRequest(${req.id},'accepted')">
                            <i class="fas fa-check"></i> Accept
                        </button>
                        <button class="btn-reject" onclick="handleRequest(${req.id},'rejected')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    renderRequests(REQUESTS_DATA);

    // Filter buttons
    const filterBtns = document.querySelectorAll('[data-req-filter]');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.getAttribute('data-req-filter');
            const filtered = f === 'all' ? REQUESTS_DATA : REQUESTS_DATA.filter(r => r.status === f);
            renderRequests(filtered);
        });
    });
}

// Expose globally so inline onclick works
window.handleRequest = function (id, action) {
    const req = REQUESTS_DATA.find(r => r.id === id);
    if (!req) return;
    req.status = action;
    showToast(`Request from ${req.borrower} ${action}. Connect to backend to notify.`);
    // Re-render
    const list = document.getElementById('requests-list');
    if (list) initRequests();
};

// ============================================================
// PAGE: ACTIVE BORROWINGS
// ============================================================
function initBorrowings() {
    const grid = document.getElementById('borrowings-grid');
    if (!grid) return;

    grid.innerHTML = BORROWINGS_DATA.map(b => {
        const pct = Math.round((b.daysLeft / b.totalDays) * 100);
        const fillClass = pct <= 20 ? 'danger' : pct <= 40 ? 'warning' : '';
        const daysClass = pct <= 20 ? 'danger' : pct <= 40 ? 'warning' : '';
        return `
            <div class="borrowing-card">
                <div class="borrowing-card-image-wrap">
                    <img class="borrowing-card-image" src="${b.image}" alt="${b.name}">
                    <span class="borrowing-card-days-badge ${daysClass}">
                        ${b.daysLeft} Day${b.daysLeft === 1 ? '' : 's'} Left
                    </span>
                </div>
                <div class="borrowing-card-details">
                    <h3 class="borrowing-card-title">${b.name}</h3>
                    <div class="borrowing-card-owner">Owner: ${b.owner}</div>
                    
                    <div class="borrowing-card-meta">
                        <div class="borrowing-detail-row">
                            <span class="borrowing-detail-label"><i class="fas fa-calendar-check"></i> Pickup</span>
                            <span class="borrowing-detail-value">${b.pickup}</span>
                        </div>
                        <div class="borrowing-detail-row">
                            <span class="borrowing-detail-label"><i class="fas fa-calendar-times"></i> Return By</span>
                            <span class="borrowing-detail-value">${b.returnDate}</span>
                        </div>
                        <div class="borrowing-detail-row">
                            <span class="borrowing-detail-label"><i class="fas fa-shield-alt"></i> Deposit</span>
                            <span class="borrowing-detail-value">
                                <span class="status-badge status-${b.deposit}">${capitalize(b.deposit)}</span>
                            </span>
                        </div>
                    </div>
                    
                    <div class="days-progress">
                        <div class="days-progress-label">
                            <span>Days remaining</span>
                            <span style="color:${pct <= 20 ? 'var(--secondary-color)' : pct <= 40 ? '#D97706' : 'var(--text-main)'}; font-weight: var(--fw-semibold);">${b.daysLeft} / ${b.totalDays}</span>
                        </div>
                        <div class="days-progress-bar">
                            <div class="days-progress-fill ${fillClass}" style="width:${pct}%"></div>
                        </div>
                    </div>
                    
                    <div class="borrowing-card-footer">
                        <button class="btn-secondary-dash btn-sm" style="width:100%;justify-content:center;" onclick="showToast('Return flow — connect to backend')">
                            <i class="fas fa-rotate-left"></i> Mark as Returned
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================================
// PAGE: TRANSACTION HISTORY
// ============================================================
function initHistory() {
    const tbody = document.getElementById('history-tbody');
    if (!tbody) return;

    tbody.innerHTML = HISTORY_DATA.map(h => `
        <tr>
            <td>
                <div class="history-item-info">
                    <div class="history-thumb-wrap">
                        <img class="history-thumb-image" src="${h.image}" alt="${h.name}">
                    </div>
                    <div>
                        <div class="history-item-name">${h.name}</div>
                        <div class="history-item-date">${h.date}</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="history-type-badge type-${h.type.toLowerCase()}">${h.type}</span>
            </td>
            <td class="amount-positive">${h.rent}</td>
            <td class="amount-neutral">${h.deposit}</td>
            <td><span class="status-badge status-returned">${capitalize(h.status)}</span></td>
        </tr>
    `).join('');
}

// ============================================================
// PAGE: NOTIFICATIONS
// ============================================================
function initNotifications() {
    const list = document.getElementById('notif-list');
    if (!list) return;

    const colorMap = { green: '#10B981', blue: 'var(--quaternary-color)', amber: '#F59E0B', red: 'var(--secondary-color)' };

    list.innerHTML = NOTIFICATIONS_DATA.map(n => `
        <div class="notif-item ${n.unread ? 'unread' : ''}" id="notif-${n.id}">
            <div class="notif-icon ${n.iconClass}" style="background:rgba(0,0,0,0.04);">
                <i class="fas ${n.icon}" style="color:${colorMap[n.iconClass]};"></i>
            </div>
            <div class="notif-content">
                <div class="notif-title">${n.title}</div>
                <div class="notif-desc">${n.desc}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.4rem;flex-shrink:0;">
                <span class="notif-time">${n.time}</span>
                ${n.unread ? '<span class="notif-unread-dot"></span>' : ''}
            </div>
        </div>
    `).join('');

    // Mark read on click
    list.querySelectorAll('.notif-item').forEach(el => {
        el.addEventListener('click', () => {
            el.classList.remove('unread');
            const dot = el.querySelector('.notif-unread-dot');
            if (dot) dot.remove();
        });
    });

    // Mark all read button
    const markAllBtn = document.getElementById('mark-all-read');
    if (markAllBtn) {
        markAllBtn.addEventListener('click', () => {
            list.querySelectorAll('.notif-item').forEach(el => {
                el.classList.remove('unread');
                el.querySelector('.notif-unread-dot')?.remove();
            });
            showToast('All notifications marked as read');
        });
    }

    // Update top nav badge
    const unreadCount = NOTIFICATIONS_DATA.filter(n => n.unread).length;
    const badge = document.getElementById('notif-badge');
    if (badge) badge.textContent = unreadCount;
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
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nameInput?.value?.trim();
        const category = categorySelect?.value;
        const condition = document.getElementById('item-condition')?.value;
        const rent = rentInput?.value;
        const deposit = depositInput?.value;

        if (!name || !category || !rent || !deposit) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        // Add to global LISTINGS_DATA
        const newItem = {
            id: LISTINGS_DATA.length + 1,
            // Fallback default image if none uploaded
            image: uploadedImageSrc || '../static/images/dell_Laptop.jpg',
            name: name,
            category: category,
            rent: `₹${rent}/day`,
            deposit: `₹${deposit}`,
            status: 'available',
            requests: 0
        };

        LISTINGS_DATA.unshift(newItem); // Add new listing to front of array

        // Re-initialize Listings grid to show the new card instantly
        initListings();

        showToast(`"${name}" listing created successfully!`);
        
        // Reset form and preview states
        form.reset();
        resetPreview();

        // Redirect back to Listings page
        document.querySelector('.sidebar-link[data-page="listings"]')?.click();
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