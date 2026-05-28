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
    const pageTitle = document.querySelector('.topnav-title');

    function activatePage(pageId) {
        // Hide all
        pages.forEach(p => p.classList.remove('active'));
        navLinks.forEach(l => l.classList.remove('active'));

        // Show target
        const targetPage = document.getElementById('page-' + pageId);
        if (targetPage) targetPage.classList.add('active');

        // Mark link active
        document.querySelectorAll(`[data-page="${pageId}"]`).forEach(l => l.classList.add('active'));

        // Update top nav title
        const titles = {
            home: 'Dashboard',
            browse: 'Browse Items',
            listings: 'My Listings',
            'add-item': 'Add New Item',
            requests: 'Borrow Requests',
            borrowings: 'Active Borrowings',
            history: 'Transaction History',
            notifications: 'Notifications',
            profile: 'My Profile',
        };
        if (pageTitle && titles[pageId]) pageTitle.textContent = titles[pageId];

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
    { id: 1, emoji: '💻', name: 'Dell Laptop (i5)', category: 'Electronics', rent: '₹200/day', deposit: '₹2000', status: 'available', requests: 3 },
    { id: 2, emoji: '📷', name: 'Canon DSLR Camera', category: 'Electronics', rent: '₹500/day', deposit: '₹5000', status: 'rented', requests: 1 },
    { id: 3, emoji: '🎒', name: 'Travel Backpack 45L', category: 'Accessories', rent: '₹80/day', deposit: '₹500', status: 'available', requests: 0 },
    { id: 4, emoji: '📚', name: 'Engineering Textbooks (Set)', category: 'Study', rent: '₹60/day', deposit: '₹300', status: 'available', requests: 5 },
    { id: 5, emoji: '🎸', name: 'Acoustic Guitar', category: 'Instruments', rent: '₹150/day', deposit: '₹1500', status: 'rented', requests: 0 },
    { id: 6, emoji: '🖨️', name: 'Portable Projector', category: 'Electronics', rent: '₹300/day', deposit: '₹3000', status: 'available', requests: 2 },
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
    { id: 1, emoji: '💻', item: 'Dell Laptop (i5)', borrower: 'Priya Mehta', avatar: 'PM', dates: '28 May – 2 Jun 2026', days: 5, rent: '₹1,000', status: 'pending' },
    { id: 2, emoji: '📚', item: 'Engineering Textbooks (Set)', borrower: 'Rahul Singh', avatar: 'RS', dates: '30 May – 5 Jun 2026', days: 6, rent: '₹360', status: 'pending' },
    { id: 3, emoji: '🖨️', item: 'Portable Projector', borrower: 'Sneha Patil', avatar: 'SP', dates: '1 Jun – 3 Jun 2026', days: 2, rent: '₹600', status: 'accepted' },
    { id: 4, emoji: '📚', item: 'Engineering Textbooks (Set)', borrower: 'Arjun Nair', avatar: 'AN', dates: '3 Jun – 8 Jun 2026', days: 5, rent: '₹300', status: 'rejected' },
];

const BORROWINGS_DATA = [
    { id: 1, emoji: '🎧', name: 'Sony WH-1000XM5 Headphones', owner: 'Vikram Desai', pickup: '22 May 2026', returnDate: '29 May 2026', deposit: 'paid', daysLeft: 3, totalDays: 7 },
    { id: 2, emoji: '📷', name: 'Nikon D3500 Camera', owner: 'Ananya Joshi', pickup: '20 May 2026', returnDate: '27 May 2026', deposit: 'paid', daysLeft: 1, totalDays: 7 },
    { id: 3, emoji: '🏸', name: 'Yonex Badminton Set', owner: 'Karan Mishra', pickup: '24 May 2026', returnDate: '31 May 2026', deposit: 'paid', daysLeft: 5, totalDays: 7 },
];

const HISTORY_DATA = [
    { id: 1, emoji: '🎧', name: 'Wireless Headphones', date: '14 May 2026', type: 'Borrow', rent: '₹300', deposit: '₹1,500', status: 'returned' },
    { id: 2, emoji: '📖', name: 'Linear Algebra Textbook', date: '8 May 2026', type: 'Borrow', rent: '₹150', deposit: '₹500', status: 'returned' },
    { id: 3, emoji: '💻', name: 'Dell Laptop (i5)', date: '5 May 2026', type: 'Lend', rent: '₹800', deposit: '₹2,000', status: 'returned' },
    { id: 4, emoji: '🎮', name: 'PS5 Controller', date: '28 Apr 2026', type: 'Borrow', rent: '₹200', deposit: '₹800', status: 'returned' },
    { id: 5, emoji: '📷', name: 'Canon DSLR Camera', date: '20 Apr 2026', type: 'Lend', rent: '₹1,500', deposit: '₹5,000', status: 'returned' },
    { id: 6, emoji: '🔊', name: 'Bluetooth Speaker', date: '12 Apr 2026', type: 'Borrow', rent: '₹140', deposit: '₹500', status: 'returned' },
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
                <div class="inventory-card-top">
                    <div class="inventory-thumb">${item.emoji}</div>
                    <div class="inventory-meta">
                        <div class="inventory-name">${item.name}</div>
                        <div class="inventory-category">${item.category}</div>
                    </div>
                </div>
                <div class="inventory-card-body">
                    <div class="inventory-detail">
                        <span class="detail-label">Rent</span>
                        <span class="detail-value highlight-orange">${item.rent}</span>
                    </div>
                    <div class="inventory-detail">
                        <span class="detail-label">Deposit</span>
                        <span class="detail-value">${item.deposit}</span>
                    </div>
                    <div class="inventory-detail">
                        <span class="detail-label">Status</span>
                        <span class="status-badge status-${item.status}">${capitalize(item.status)}</span>
                    </div>
                    <div class="inventory-detail">
                        <span class="detail-label">Requests</span>
                        <span class="detail-value count-badge">${item.requests} pending</span>
                    </div>
                </div>
                <div class="inventory-card-actions">
                    <button class="btn-console-action" title="Edit listing" onclick="showToast('Edit listing — connect to backend')">
                        <i class="fas fa-pen"></i> Edit
                    </button>
                    <button class="btn-console-action" title="View requests" onclick="showToast('View requests for ${item.name}')">
                        <i class="fas fa-inbox"></i> Requests (${item.requests})
                    </button>
                    <button class="btn-console-action danger" title="Delete listing" onclick="confirmDelete('${item.name}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
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
                <div class="request-card-icon">${req.emoji}</div>
                <div class="request-card-body">
                    <div class="request-card-top">
                        <span class="request-item-name">${req.item}</span>
                        <span class="status-badge status-${req.status}">${capitalize(req.status)}</span>
                    </div>
                    <div class="request-card-meta">
                        <span class="request-meta-item"><i class="fas fa-user"></i> ${req.borrower}</span>
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
        return `
            <div class="borrowing-card">
                <div class="borrowing-card-header">
                    <div class="borrowing-card-icon">${b.emoji}</div>
                    <div>
                        <div class="borrowing-card-title">${b.name}</div>
                        <div class="borrowing-card-owner">Owner: ${b.owner}</div>
                    </div>
                </div>
                <div class="borrowing-card-body">
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
                    <div class="days-progress">
                        <div class="days-progress-label">
                            <span>Days remaining</span>
                            <span style="color:${pct <= 20 ? 'var(--secondary-color)' : 'var(--text-primary)'}; font-weight: var(--fw-semibold);">${b.daysLeft} / ${b.totalDays}</span>
                        </div>
                        <div class="days-progress-bar">
                            <div class="days-progress-fill ${fillClass}" style="width:${pct}%"></div>
                        </div>
                    </div>
                </div>
                <div class="borrowing-card-footer">
                    <button class="btn-secondary-dash btn-sm" style="width:100%;justify-content:center;" onclick="showToast('Return flow — connect to backend')">
                        <i class="fas fa-rotate-left"></i> Mark as Returned
                    </button>
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
                    <div class="history-thumb">${h.emoji}</div>
                    <div>
                        <div class="history-item-name">${h.name}</div>
                        <div class="history-item-date">${h.date}</div>
                    </div>
                </div>
            </td>
            <td>
                <span style="font-size:var(--fs-xs);padding:0.2rem 0.6rem;border-radius:var(--radius-full);background:${h.type === 'Borrow' ? 'rgba(109,144,185,0.1)' : 'rgba(16,185,129,0.1)'};color:${h.type === 'Borrow' ? 'var(--quaternary-color)' : '#10B981'};font-weight:var(--fw-semibold);">${h.type}</span>
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
    document.querySelectorAll('.profile-avatar').forEach(el => {
        el.textContent = USER.initials;
    });

    // Pre-fill edit form
    setInputById('edit-name', USER.name);
    setInputById('edit-email', USER.email);
    setInputById('edit-phone', USER.phone);

    // Save button
    const saveBtn = document.getElementById('save-profile-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            showToast('Profile updated — connect to backend to persist changes');
        });
    }
}

// ============================================================
// PAGE: ADD ITEM FORM
// ============================================================
function initAddItemForm() {
    const form = document.getElementById('add-item-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('#item-name')?.value?.trim();
        if (!name) { showToast('Please enter an item name', 'error'); return; }
        showToast(`"${name}" listing saved — connect to backend to persist`);
        form.reset();
    });

    // Upload zone click
    const uploadZone = document.querySelector('.upload-zone');
    const fileInput = document.getElementById('item-image-input');
    if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', () => fileInput.click());
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = 'var(--quaternary-color)';
        });
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.style.borderColor = '';
        });
        fileInput.addEventListener('change', () => {
            const f = fileInput.files[0];
            if (f) {
                uploadZone.querySelector('p').textContent = f.name;
                uploadZone.style.borderColor = 'var(--quaternary-color)';
            }
        });
    }
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