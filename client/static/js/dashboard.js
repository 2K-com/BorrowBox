// ============================================================
// BORROWBOX DASHBOARD — dashboard.js
// SPA navigation + placeholder data + UI interactions
// ============================================================

function getEmptyStateHtml(icon, title, message, buttonText = '', buttonOnclick = '') {
    const btnHtml = buttonText
        ? `<button class="btn-primary" onclick="${buttonOnclick}" style="margin-top: 16px; padding: 10px 20px; width: auto; font-size: 0.9rem; border-radius: 8px;">${buttonText}</button>`
        : '';
    return `
        <div class="empty-state-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px 20px; background: var(--surface-card); border-radius: 16px; border: 1px dashed var(--border-clean); margin: 20px 0; width: 100%; box-sizing: border-box;">
            <div class="empty-state-icon-wrap" style="width: 80px; height: 80px; border-radius: 50%; background: var(--bg-hover); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: var(--text-muted);">
                <i class="fas ${icon}" style="font-size: 2.2rem; color: var(--accent-primary);"></i>
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">${title}</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 320px; line-height: 1.5; margin: 0 auto;">${message}</p>
            ${btnHtml}
        </div>
    `;
}

function getSkeletonHtml(type) {
    if (type === 'listing' || type === 'borrowing') {
        return `
            <div class="skeleton-card" style="background: var(--surface-card); border: 1px solid var(--border-clean); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 12px; height: 100%; min-height: 250px; box-sizing: border-box;">
                <div class="skeleton-shimmer" style="height: 140px; background: var(--bg-hover); border-radius: 12px; position: relative; overflow: hidden;"></div>
                <div class="skeleton-shimmer" style="height: 20px; width: 60%; background: var(--bg-hover); border-radius: 4px; position: relative; overflow: hidden;"></div>
                <div class="skeleton-shimmer" style="height: 16px; width: 40%; background: var(--bg-hover); border-radius: 4px; position: relative; overflow: hidden;"></div>
                <div class="skeleton-shimmer" style="height: 36px; background: var(--bg-hover); border-radius: 8px; margin-top: auto; position: relative; overflow: hidden;"></div>
            </div>
        `;
    }
    if (type === 'row') {
        return `
            <tr class="skeleton-row">
                <td colspan="7" style="padding: 20px;">
                    <div class="skeleton-shimmer" style="height: 24px; background: var(--bg-hover); border-radius: 4px; position: relative; overflow: hidden; width: 100%;"></div>
                </td>
            </tr>
        `;
    }
    if (type === 'notification' || type === 'request') {
        return `
            <div class="skeleton-notif" style="display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: var(--surface-card); border: 1px solid var(--border-clean); border-radius: 12px; margin-bottom: 12px; box-sizing: border-box; width: 100%;">
                <div class="skeleton-shimmer" style="width: 40px; height: 40px; border-radius: 50%; background: var(--bg-hover); position: relative; overflow: hidden; flex-shrink: 0;"></div>
                <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                    <div class="skeleton-shimmer" style="height: 16px; width: 30%; background: var(--bg-hover); border-radius: 4px; position: relative; overflow: hidden;"></div>
                    <div class="skeleton-shimmer" style="height: 14px; width: 80%; background: var(--bg-hover); border-radius: 4px; position: relative; overflow: hidden;"></div>
                </div>
            </div>
        `;
    }
    if (type === 'stats') {
        return `
            <div class="skeleton-stat" style="background: var(--surface-card); border: 1px solid var(--border-clean); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 12px; box-sizing: border-box;">
                <div class="skeleton-shimmer" style="height: 32px; width: 40%; background: var(--bg-hover); border-radius: 4px; position: relative; overflow: hidden;"></div>
                <div class="skeleton-shimmer" style="height: 16px; width: 60%; background: var(--bg-hover); border-radius: 4px; position: relative; overflow: hidden;"></div>
            </div>
        `;
    }
    if (type === 'profile') {
        return `
            <div class="skeleton-profile" style="display: flex; flex-direction: column; gap: 20px; padding: 20px; box-sizing: border-box; width: 100%;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <div class="skeleton-shimmer" style="height: 16px; width: 40%; background: var(--bg-hover); border-radius: 4px; margin-bottom: 8px; position: relative; overflow: hidden;"></div>
                        <div class="skeleton-shimmer" style="height: 40px; background: var(--bg-hover); border-radius: 8px; position: relative; overflow: hidden;"></div>
                    </div>
                    <div>
                        <div class="skeleton-shimmer" style="height: 16px; width: 40%; background: var(--bg-hover); border-radius: 4px; margin-bottom: 8px; position: relative; overflow: hidden;"></div>
                        <div class="skeleton-shimmer" style="height: 40px; background: var(--bg-hover); border-radius: 8px; position: relative; overflow: hidden;"></div>
                    </div>
                </div>
                <div>
                    <div class="skeleton-shimmer" style="height: 16px; width: 30%; background: var(--bg-hover); border-radius: 4px; margin-bottom: 8px; position: relative; overflow: hidden;"></div>
                    <div class="skeleton-shimmer" style="height: 40px; background: var(--bg-hover); border-radius: 8px; position: relative; overflow: hidden;"></div>
                </div>
                <div>
                    <div class="skeleton-shimmer" style="height: 16px; width: 30%; background: var(--bg-hover); border-radius: 4px; margin-bottom: 8px; position: relative; overflow: hidden;"></div>
                    <div class="skeleton-shimmer" style="height: 40px; background: var(--bg-hover); border-radius: 8px; position: relative; overflow: hidden;"></div>
                </div>
                <div>
                    <div class="skeleton-shimmer" style="height: 16px; width: 20%; background: var(--bg-hover); border-radius: 4px; margin-bottom: 8px; position: relative; overflow: hidden;"></div>
                    <div class="skeleton-shimmer" style="height: 90px; background: var(--bg-hover); border-radius: 8px; position: relative; overflow: hidden;"></div>
                </div>
            </div>
        `;
    }
    return '';
}

function getErrorStateHtml(message, retryCallbackName) {
    return `
        <div class="error-state" style="text-align: center; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; background: var(--surface-card); border: 1px solid var(--border-clean); border-radius: 12px; width: 100%; box-sizing: border-box; margin: 20px 0;">
            <div style="font-size: 2.5rem; color: var(--secondary-color);">
                <i class="fas fa-circle-exclamation"></i>
            </div>
            <h4 style="margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-main);">${message}</h4>
            <button class="btn-console btn-console-primary" onclick="${retryCallbackName}()" style="padding: 8px 20px; font-size: 0.9rem; cursor: pointer; border-radius: 8px;">
                <i class="fas fa-arrows-rotate"></i> Retry
            </button>
        </div>
    `;
}

function getTableErrorStateHtml(message, retryCallbackName, colSpan = 7) {
    return `
        <tr>
            <td colspan="${colSpan}" style="padding: 40px 20px; text-align: center;">
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;">
                    <div style="font-size: 2rem; color: var(--secondary-color);">
                        <i class="fas fa-circle-exclamation"></i>
                    </div>
                    <span style="font-weight: 600; color: var(--text-main);">${message}</span>
                    <button class="btn-console btn-console-primary" onclick="${retryCallbackName}()" style="padding: 6px 16px; font-size: 0.85rem; margin-top: 5px; cursor: pointer; border-radius: 8px;">
                        <i class="fas fa-arrows-rotate"></i> Retry
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function showAllSkeletons() {
    // 1. Stat cards numbers
    const cardNumbers = document.querySelectorAll('.stat-card-number');
    cardNumbers.forEach(num => {
        num.innerHTML = `<div class="skeleton-shimmer" style="height: 28px; width: 50px; background: var(--bg-hover); border-radius: 4px; display: inline-block; position: relative; overflow: hidden;"></div>`;
    });

    // 2. Quick stats vals
    const quickVals = document.querySelectorAll('.quick-stat-val');
    quickVals.forEach(val => {
        val.innerHTML = `<div class="skeleton-shimmer" style="height: 16px; width: 30px; background: var(--bg-hover); border-radius: 4px; display: inline-block; position: relative; overflow: hidden;"></div>`;
    });

    // 3. Recent Activity list
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = `<div class="skeleton-shimmer" style="height: 50px; margin-bottom: 12px; border-radius: 8px; position: relative; overflow: hidden;"></div>`.repeat(4);
    }

    // 4. My Listings grid
    const listingsGrid = document.getElementById('listings-grid');
    if (listingsGrid) {
        listingsGrid.innerHTML = getSkeletonHtml('listing').repeat(3);
    }

    // 5. Borrow Requests list
    const requestsList = document.getElementById('requests-list');
    if (requestsList) {
        requestsList.innerHTML = getSkeletonHtml('request').repeat(3);
    }

    // 6. Active Borrowings grid
    const borrowingsGrid = document.getElementById('borrowings-grid');
    if (borrowingsGrid) {
        borrowingsGrid.innerHTML = getSkeletonHtml('borrowing').repeat(3);
    }

    // 7. Active Rentals grid
    const rentalsGrid = document.getElementById('rentals-grid');
    if (rentalsGrid) {
        rentalsGrid.innerHTML = getSkeletonHtml('borrowing').repeat(3);
    }

    // 8. Transaction History table body
    const historyTbody = document.getElementById('history-tbody');
    if (historyTbody) {
        historyTbody.innerHTML = getSkeletonHtml('row').repeat(5);
    }

    // 9. Notifications list
    const notificationsList = document.getElementById('notif-list');
    if (notificationsList) {
        notificationsList.innerHTML = getSkeletonHtml('notification').repeat(4);
    }

    // 10. Profile Settings Personal Pane body (save original HTML for restoration)
    const profilePaneBody = document.querySelector('#profile-pane-personal .pane-body');
    if (profilePaneBody && !window.originalProfileBody) {
        window.originalProfileBody = profilePaneBody.innerHTML;
        profilePaneBody.innerHTML = getSkeletonHtml('profile');
    }
}

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
        USER.bio = data.bio || '';

        // Compute Initials
        const parts = USER.name.split(' ');
        let initials = '';
        if (parts.length > 0 && parts[0]) initials += parts[0][0];
        if (parts.length > 1 && parts[parts.length - 1]) initials += parts[parts.length - 1][0];
        USER.initials = initials.toUpperCase() || 'S';

        // Fetch reputation and member since from stats API
        try {
            const statsResponse = await authenticatedFetch('http://127.0.0.1:8000/api/transactions/stats/');
            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                USER.rating = statsData.reputation_rating !== undefined ? statsData.reputation_rating : 0.0;
                USER.memberSince = statsData.member_since || 'January 2025';
            }
        } catch (statsErr) {
            console.error('Failed to fetch user stats:', statsErr);
        }

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
    
    // Show all skeleton loaders immediately to prevent any hardcoded layout flicker
    showAllSkeletons();
    
    // Expose loaders to window for retry handlers
    window.initDashboardHome = initDashboardHome;
    window.initRecentActivity = initRecentActivity;
    window.initListings = initListings;
    window.initRequests = initRequests;
    window.initBorrowings = initBorrowings;
    window.initRentals = initRentals;
    window.initHistory = initHistory;
    window.initNotifications = initNotifications;
    
    await initDashboardAuth();
    initDashboardHome();
    initListings();
    initRequests();
    initBorrowings();
    initRentals();
    initHistory();
    initNotifications();
    initAddItemForm();
    initTopnavSearch();
    initRecentActivity();
    initRatingStars();
    initReturnRatingForm();
    initEditListingForm();
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

        // Auto-refresh data on tab switch
        if (pageId === 'home') {
            initDashboardHome();
            initRecentActivity();
        } else if (pageId === 'listings') {
            initListings();
        } else if (pageId === 'requests') {
            initRequests();
        } else if (pageId === 'borrowings') {
            initBorrowings();
        } else if (pageId === 'history') {
            initHistory();
        } else if (pageId === 'notifications') {
            initNotifications();
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
// GLOBAL STATE
// ============================================================
let USER = {};

// ============================================================
// PAGE: DASHBOARD HOME (Connected to Backend)
// ============================================================
async function initDashboardHome() {
    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName) welcomeName.textContent = USER.name.split(' ')[0];

    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid && !window.originalStatsGridHtml) {
        window.originalStatsGridHtml = statsGrid.innerHTML;
    }

    try {
        const response = await authenticatedFetch('http://127.0.0.1:8000/api/transactions/stats/');
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const stats = await response.json();

        if (statsGrid && window.originalStatsGridHtml) {
            statsGrid.innerHTML = window.originalStatsGridHtml;
        }

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

            if (label === 'Reputation Rating') {
                const rep = stats.reputation_rating || 0;
                if (parseFloat(rep) === 0) {
                    numberEl.setAttribute('data-target', 'New User');
                    numberEl.classList.add('no-animate');
                    numberEl.textContent = 'New User';
                    numberEl.style.fontSize = '1.5rem';
                } else {
                    numberEl.setAttribute('data-target', rep);
                    numberEl.classList.remove('no-animate');
                    numberEl.style.fontSize = '';
                }
            } else {
                numberEl.textContent = '0'; // Reset before animation
            }
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
        if (statsGrid) {
            statsGrid.innerHTML = getErrorStateHtml('Failed to load campus stats.', 'initDashboardHome');
        }
    }
}

// MAKE SURE THIS FUNCTION IS IN YOUR FILE:
function animateStatNumbers() {
    const statEls = document.querySelectorAll('.stat-card-number');
    statEls.forEach(el => {
        if (el.classList.contains('no-animate')) return;
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
            const style = iconMap[activity.type] || iconMap['DEFAULT'];
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
        activityList.innerHTML = getErrorStateHtml('Failed to load recent activity.', 'initRecentActivity');
    }
}

// PAGE: BROWSE ITEMS REMOVED (Redirection to products.html handled by topnav/search catalog button)

// ============================================================
// PAGE: MY LISTINGS (Connected to Backend)
// ============================================================
async function initListings() {
    const grid = document.getElementById('listings-grid');
    if (!grid) return;

    grid.innerHTML = getSkeletonHtml('listing').repeat(3);

    try {
        const response = await authenticatedFetch('http://127.0.0.1:8000/api/listings/my/');
        if (!response.ok) throw new Error('Failed to fetch listings');

        const dbData = await response.json();

        // Map Django database keys to match your frontend HTML template
        const mappedData = dbData.map(item => ({
            id: item.id,
            image: formatImageUrl(item.image),
            name: item.title,
            category: item.category_name || 'Uncategorized',
            rent: `₹${item.price_per_day}/day`,
            security_deposit: item.security_deposit,
            status: (item.availability_status || 'available').toLowerCase(),
            requests: 0 // Placeholder until request counts are serialized
        }));

        renderListings(mappedData, grid);
    } catch (err) {
        console.error(err);
        grid.innerHTML = getErrorStateHtml('Failed to load listings.', 'initListings');
    }
}

function renderListings(data, grid) {
    if (data.length === 0) {
        grid.innerHTML = getEmptyStateHtml(
            'fa-boxes-packing',
            'No active listings',
            'You haven\'t listed any items for others to borrow yet.',
            'Create a Listing',
            'const modalBtn = document.getElementById("create-item-btn"); if (modalBtn) modalBtn.click(); else activatePage("listings");'
        );
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
                <div class="inventory-card-category">Category: ${item.category}</div>
                
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

window.confirmDelete = async function (id, name) {
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

window.openEditListing = async function (id) {
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

        // Populate availability status
        const statusSelect = document.getElementById('edit-item-status');
        const rentedOpt = statusSelect.querySelector('option[value="RENTED"]');
        const indefiniteCheckbox = document.getElementById('edit-item-indefinite');
        const availFromInput = document.getElementById('edit-item-avail-from');
        const availUntilInput = document.getElementById('edit-item-avail-until');
        const dateContainer = document.getElementById('edit-date-range-container');

        if (item.availability_status === 'RENTED') {
            rentedOpt.disabled = false;
            statusSelect.value = 'RENTED';
            statusSelect.disabled = true;
        } else {
            rentedOpt.disabled = true;
            statusSelect.value = item.availability_status || 'AVAILABLE';
            statusSelect.disabled = false;
        }

        // Dates
        availFromInput.value = item.available_from || '';
        availUntilInput.value = item.available_until || '';
        
        const todayStr = new Date().toISOString().split('T')[0];
        availFromInput.setAttribute('min', todayStr);
        if (availFromInput.value) {
            availUntilInput.setAttribute('min', availFromInput.value);
        } else {
            availUntilInput.setAttribute('min', todayStr);
        }

        if (!item.available_from && !item.available_until) {
            indefiniteCheckbox.checked = true;
            availFromInput.disabled = true;
            availUntilInput.disabled = true;
            dateContainer.style.display = 'none';
        } else {
            indefiniteCheckbox.checked = false;
            availFromInput.disabled = false;
            availUntilInput.disabled = false;
            dateContainer.style.display = 'grid';
        }

        // Reset inputs and previews
        document.getElementById('edit-item-image-input').value = '';
        document.getElementById('edit-item-image-input-2').value = '';
        document.getElementById('edit-item-image-input-3').value = '';

        const thumb1 = document.querySelector('#edit-thumb-slot-1 .slot-image-wrap');
        const thumb2 = document.querySelector('#edit-thumb-slot-2 .slot-image-wrap');
        const thumb3 = document.querySelector('#edit-thumb-slot-3 .slot-image-wrap');

        const editThumb2 = document.getElementById('edit-thumb-slot-2');
        const editThumb3 = document.getElementById('edit-thumb-slot-3');

        if (editThumb2) editThumb2.classList.remove('active');
        if (editThumb3) editThumb3.classList.remove('active');

        // Load primary image
        const editPreview = document.getElementById('edit-image-preview-area');
        const primaryImgUrl = formatImageUrl(item.image);
        if (editPreview) {
            editPreview.innerHTML = `<img src="${primaryImgUrl}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;" />`;
        }
        if (thumb1) {
            thumb1.innerHTML = `<img src="${primaryImgUrl}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;" />`;
        }

        // Load secondary images
        if (thumb2) thumb2.innerHTML = `<i class="fas fa-plus"></i>`;
        if (thumb3) thumb3.innerHTML = `<i class="fas fa-plus"></i>`;

        if (item.images && Array.isArray(item.images)) {
            if (item.images[0] && item.images[0].image && thumb2) {
                const url = formatImageUrl(item.images[0].image);
                thumb2.innerHTML = `<img src="${url}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;" />`;
                if (editThumb2) editThumb2.classList.add('active');
            }
            if (item.images[1] && item.images[1].image && thumb3) {
                const url = formatImageUrl(item.images[1].image);
                thumb3.innerHTML = `<img src="${url}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;" />`;
                if (editThumb3) editThumb3.classList.add('active');
            }
        }

        // Show modal
        document.getElementById('edit-item-modal').style.display = 'flex';
    } catch (err) {
        console.error('Error fetching listing:', err);
        showToast('Could not load listing data.', 'error');
    }
};

window.closeEditModal = function () {
    document.getElementById('edit-item-modal').style.display = 'none';
    document.getElementById('edit-item-form').reset();

    const input1 = document.getElementById('edit-item-image-input');
    const input2 = document.getElementById('edit-item-image-input-2');
    const input3 = document.getElementById('edit-item-image-input-3');

    if (input1) input1.value = '';
    if (input2) input2.value = '';
    if (input3) input3.value = '';

    const editPreview = document.getElementById('edit-image-preview-area');
    if (editPreview) {
        editPreview.innerHTML = `
            <i class="fas fa-cloud-arrow-up upload-icon"></i>
            <p>Click to upload primary photo</p>
            <small>JPG, PNG or WEBP · Max 5MB</small>
        `;
    }

    const thumb1 = document.querySelector('#edit-thumb-slot-1 .slot-image-wrap');
    const thumb2 = document.querySelector('#edit-thumb-slot-2 .slot-image-wrap');
    const thumb3 = document.querySelector('#edit-thumb-slot-3 .slot-image-wrap');

    if (thumb1) thumb1.innerHTML = `<i class="fas fa-plus"></i>`;
    if (thumb2) thumb2.innerHTML = `<i class="fas fa-plus"></i>`;
    if (thumb3) thumb3.innerHTML = `<i class="fas fa-plus"></i>`;

    const editThumb2 = document.getElementById('edit-thumb-slot-2');
    const editThumb3 = document.getElementById('edit-thumb-slot-3');
    if (editThumb2) editThumb2.classList.remove('active');
    if (editThumb3) editThumb3.classList.remove('active');
};

function initEditListingForm() {
    const editPreview = document.getElementById('edit-image-preview-area');
    const input1 = document.getElementById('edit-item-image-input');
    const input2 = document.getElementById('edit-item-image-input-2');
    const input3 = document.getElementById('edit-item-image-input-3');

    const editThumb1 = document.getElementById('edit-thumb-slot-1');
    const editThumb2 = document.getElementById('edit-thumb-slot-2');
    const editThumb3 = document.getElementById('edit-thumb-slot-3');

    if (editPreview && input1) {
        editPreview.addEventListener('click', () => input1.click());
        input1.addEventListener('change', () => {
            const file = input1.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    editPreview.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;" />`;
                    const wrap = editThumb1 ? editThumb1.querySelector('.slot-image-wrap') : null;
                    if (wrap) {
                        wrap.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;" />`;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (editThumb2 && input2) {
        editThumb2.addEventListener('click', () => input2.click());
        input2.addEventListener('change', () => {
            const file = input2.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const wrap = editThumb2.querySelector('.slot-image-wrap');
                    if (wrap) {
                        wrap.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;" />`;
                    }
                    editThumb2.classList.add('active');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (editThumb3 && input3) {
        editThumb3.addEventListener('click', () => input3.click());
        input3.addEventListener('change', () => {
            const file = input3.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const wrap = editThumb3.querySelector('.slot-image-wrap');
                    if (wrap) {
                        wrap.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;" />`;
                    }
                    editThumb3.classList.add('active');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Toggle logic for Indefinite Checkbox
    const indefiniteCheckbox = document.getElementById('edit-item-indefinite');
    const availFromInput = document.getElementById('edit-item-avail-from');
    const availUntilInput = document.getElementById('edit-item-avail-until');
    const dateContainer = document.getElementById('edit-date-range-container');

    if (indefiniteCheckbox) {
        indefiniteCheckbox.addEventListener('change', function () {
            if (this.checked) {
                availFromInput.disabled = true;
                availUntilInput.disabled = true;
                dateContainer.style.display = 'none';
                availFromInput.value = '';
                availUntilInput.value = '';
            } else {
                availFromInput.disabled = false;
                availUntilInput.disabled = false;
                dateContainer.style.display = 'grid';
            }
        });
    }

    if (availFromInput) {
        availFromInput.addEventListener('change', function () {
            if (availUntilInput) {
                availUntilInput.setAttribute('min', this.value);
            }
        });
    }
}

document.getElementById('edit-item-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('edit-item-id').value;
    const title = document.getElementById('edit-item-title').value.trim();
    const rent = document.getElementById('edit-item-rent').value;
    const deposit = document.getElementById('edit-item-deposit').value;
    const condition = document.getElementById('edit-item-condition').value;
    const status = document.getElementById('edit-item-status').value;
    const indefinite = document.getElementById('edit-item-indefinite').checked;

    // Date validations
    let fromVal = '';
    let untilVal = '';
    if (!indefinite) {
        fromVal = document.getElementById('edit-item-avail-from').value;
        untilVal = document.getElementById('edit-item-avail-until').value;
        if (fromVal && untilVal && untilVal < fromVal) {
            showToast('Available Until date cannot be earlier than Available From date.', 'error');
            return;
        }
    }

    const imgInput = document.getElementById('edit-item-image-input');
    const input2 = document.getElementById('edit-item-image-input-2');
    const input3 = document.getElementById('edit-item-image-input-3');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price_per_day', rent);
    formData.append('security_deposit', deposit);
    formData.append('condition', condition);
    formData.append('availability_status', status);
    formData.append('available_from', fromVal);
    formData.append('available_until', untilVal);

    if (imgInput && imgInput.files[0]) {
        formData.append('image', imgInput.files[0]);
    }
    if (input2 && input2.files[0]) {
        formData.append('secondary_images', input2.files[0]);
    }
    if (input3 && input3.files[0]) {
        formData.append('secondary_images', input3.files[0]);
    }

    try {
        const response = await authenticatedFetch(`http://127.0.0.1:8000/api/listings/${id}/`, {
            method: 'PATCH',
            body: formData
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
let ratingModalAction = 'return'; // Track if rating is for return or confirm step

async function initRequests() {
    const list = document.getElementById('requests-list');
    if (!list) return;

    list.innerHTML = getSkeletonHtml('request').repeat(3);

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
        list.innerHTML = getErrorStateHtml('Failed to load borrow requests.', 'initRequests');
    }
}

function updatePendingCount(data) {
    const pendingCount = document.getElementById('requests-pending-count');
    const pending = data.filter(r => r.status === 'PENDING');
    if (pendingCount) pendingCount.textContent = pending.length;
}

function renderRequests(data, listElement) {
    if (data.length === 0) {
        listElement.innerHTML = getEmptyStateHtml(
            'fa-hand-holding',
            'No requests found',
            'When other students request to borrow your listings, they will show up here.',
            'Explore Catalog',
            "window.location.href='products.html'"
        );
        return;
    }

    listElement.innerHTML = data.map(req => {
        // Calculate days between dates securely
        const start = new Date(req.start_date);
        const end = new Date(req.end_date);
        const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

        // Formatting dates
        const dateStr = `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;

        // Extract borrower name safely
        const borrowerName = req.borrower_username || `User #${req.borrower}`;
        const avatarStr = borrowerName.substring(0, 2).toUpperCase();
        const itemName = (req.listing_details && req.listing_details.title) || `Listing #${req.listing}`;
        const itemImage = (req.listing_details && req.listing_details.image) ? formatImageUrl(req.listing_details.image) : "../static/images/dell_Laptop.jpg";
        const pricePerDay = (req.listing_details && req.listing_details.price_per_day) || '0';
        const categoryName = (req.listing_details && req.listing_details.category_name) || 'Item';
        const depositAmount = (req.listing_details && req.listing_details.security_deposit) || '0.00';

        return `
            <div class="request-card" id="req-${req.id}">
                <div class="request-card-left">
                    <div class="request-card-thumb-wrap">
                        <img class="request-card-thumb" src="${itemImage}" alt="${itemName}">
                    </div>
                </div>
                
                <div class="request-card-center">
                    <div class="request-card-title-row">
                        <h3 class="request-item-name">${itemName}</h3>
                        <span class="category-tag-inline">${categoryName}</span>
                    </div>
                    
                    <div class="request-borrower-profile">
                        <span class="request-borrower-avatar">${avatarStr}</span>
                        <span class="request-borrower-name">${borrowerName}</span>
                    </div>

                    <div class="request-dates-info">
                        <div class="date-group">
                            <span class="date-label">Pickup:</span>
                            <span class="date-val">${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div class="date-group">
                            <span class="date-label">Return:</span>
                            <span class="date-val">${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div class="date-group">
                            <span class="date-label">Duration:</span>
                            <span class="date-val highlighted-duration">${days} Day${days === 1 ? '' : 's'}</span>
                        </div>
                    </div>

                    <div class="request-financial-info">
                        <span class="price-per-day-info">₹${pricePerDay} / day</span>
                        ${parseFloat(depositAmount) > 0 ? `<span class="deposit-info">• ₹${depositAmount} Deposit</span>` : ''}
                    </div>
                </div>
                
                <div class="request-card-right">
                    ${req.status === 'PENDING' ? `
                        <div class="request-pending-buttons">
                            <button class="btn-request-accept" onclick="handleRequest(${req.id}, 'accept')">
                                <i class="fas fa-check"></i> Accept
                            </button>
                            <button class="btn-request-reject" onclick="handleRequest(${req.id}, 'reject')">
                                <i class="fas fa-times"></i> Reject
                            </button>
                        </div>
                    ` : req.status === 'ACCEPTED' ? `
                        <div class="request-accepted-status">
                            <span class="status-indicator-accepted"><i class="fas fa-circle-check"></i> Accepted</span>
                            <span class="status-subtext">Transaction Created</span>
                            <a href="#" class="status-action-link" onclick="activatePage('borrowings'); return false;">View Transaction</a>
                        </div>
                    ` : req.status === 'RETURNED' ? `
                        <div class="request-accepted-status" style="color: #10B981;">
                            <span class="status-indicator-returned" style="color: #10B981; font-weight: 600;"><i class="fas fa-rotate-left"></i> Returned</span>
                            <span class="status-subtext">Transaction Completed</span>
                            <a href="#" class="status-action-link" onclick="activatePage('history'); return false;">View History</a>
                        </div>
                    ` : req.status === 'CANCELLED' ? `
                        <div class="request-rejected-status" style="color: var(--text-muted);">
                            <span class="status-indicator-rejected" style="color: var(--text-muted);"><i class="fas fa-circle-xmark"></i> Cancelled</span>
                            <span class="status-subtext">Request Closed</span>
                        </div>
                    ` : `
                        <div class="request-rejected-status">
                            <span class="status-indicator-rejected"><i class="fas fa-circle-xmark"></i> Rejected</span>
                            <span class="status-subtext">Request Closed</span>
                        </div>
                    `}
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
window.handleRequest = async function (id, action) {
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;

    try {
        const response = await authenticatedFetch(`http://127.0.0.1:8000/api/requests/${id}/${action}/`, {
            method: 'PATCH'
        });

        if (response.ok) {
            showToast(`Request successfully ${action}ed!`);
            initRequests(); // Refresh the list from the database
            initListings();
            initRentals();
            initBorrowings();
            initDashboardHome();
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
// PAGE: ACTIVE BORROWINGS & RENTALS
// ============================================================
async function initBorrowings() {
    const grid = document.getElementById('borrowings-grid');
    if (!grid) return;

    grid.innerHTML = getSkeletonHtml('borrowing').repeat(3);

    try {
        const response = await authenticatedFetch('http://127.0.0.1:8000/api/transactions/?role=borrower&status=ACTIVE,RETURN_PENDING');
        if (!response.ok) throw new Error('Failed to fetch transactions');

        const activeTransactions = await response.json();
        renderBorrowings(activeTransactions, grid);
    } catch (err) {
        console.error('Error loading active transactions:', err);
        grid.innerHTML = getErrorStateHtml('Failed to load borrowings.', 'initBorrowings');
    }
}

function renderBorrowings(data, grid) {
    if (data.length === 0) {
        grid.innerHTML = getEmptyStateHtml(
            'fa-handshake',
            'No active rentals',
            'You are not currently borrowing or renting any items. Find peer listings on the campus catalog.',
            'Browse Catalog',
            "window.location.href='products.html'"
        );
        return;
    }

    const currentUsername = localStorage.getItem('username') || 'User';

    // 1. Draw the HTML
    grid.innerHTML = data.map(b => {
        const start = new Date(b.start_date);
        const end = new Date(b.end_date);
        const today = new Date();

        // Remove time portion for accurate date calculations
        today.setHours(0, 0, 0, 0);
        const endCopy = new Date(end);
        endCopy.setHours(0, 0, 0, 0);

        const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        const daysLeft = Math.ceil((endCopy - today) / (1000 * 60 * 60 * 24));
        const pct = Math.round(((totalDays - Math.max(0, daysLeft)) / totalDays) * 100);

        let daysLeftText = `${daysLeft} Day${daysLeft === 1 ? '' : 's'} Left`;
        let daysClass = '';

        if (daysLeft === 0) {
            daysLeftText = 'Due Today';
            daysClass = 'due-today';
        } else if (daysLeft < 0) {
            daysLeftText = 'Overdue';
            daysClass = 'danger';
        } else if (daysLeft <= 2) {
            daysClass = 'danger';
        } else if (daysLeft <= 4) {
            daysClass = 'warning';
        }

        const fillClass = daysLeft <= 2 ? 'danger' : daysLeft <= 4 ? 'warning' : '';

        const itemName = b.listing_title || `Listing #${b.listing}`;
        const ownerName = b.owner_username || `User #${b.owner}`;
        const imgUrl = (b.listing_details && b.listing_details.image) ? formatImageUrl(b.listing_details.image) : '../static/images/dell_Laptop.jpg';

        return `
            <div class="borrowing-card" id="transaction-${b.id}">
                <div class="borrowing-card-image-wrap">
                    <img class="borrowing-card-image" src="${imgUrl}" alt="${itemName}">
                    <span class="borrowing-card-days-badge ${daysClass}">
                        ${daysLeftText}
                    </span>
                </div>
                <div class="borrowing-card-details">
                    <h3 class="borrowing-card-title">${itemName}</h3>
                    <div class="borrowing-card-owner"><i class="fas fa-user-circle" style="color: var(--accent-primary); margin-right: 4px;"></i> Owner: ${ownerName}</div>
                    
                    <div class="borrowing-card-meta">
                        <div class="borrowing-detail-row">
                            <span class="borrowing-detail-label"><i class="fas fa-calendar-check"></i> Pickup</span>
                            <span class="borrowing-detail-value">${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div class="borrowing-detail-row">
                            <span class="borrowing-detail-label"><i class="fas fa-calendar-times"></i> Return By</span>
                            <span class="borrowing-detail-value">${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div class="borrowing-detail-row">
                            <span class="borrowing-detail-label"><i class="fas fa-rupee-sign"></i> Rate</span>
                            <span class="borrowing-detail-value">₹${b.price_per_day}/day</span>
                        </div>
                    </div>
                    
                    <div class="days-progress">
                        <div class="days-progress-label">
                            <span>Days remaining</span>
                            <span style="color:${daysLeft <= 2 ? 'var(--secondary-color)' : daysLeft <= 4 ? '#D97706' : 'var(--text-main)'}; font-weight: 600;">${daysLeft} / ${totalDays}</span>
                        </div>
                        <div class="days-progress-bar">
                            <div class="days-progress-fill ${fillClass}" style="width:${pct}%"></div>
                        </div>
                    </div>
                    
                    ${(() => {
                const currentUsername = localStorage.getItem('username') || '';
                const isBorrower = b.borrower_username === currentUsername;
                const isOwner = b.owner_username === currentUsername;

                if (b.status === 'ACTIVE') {
                    if (isBorrower) {
                        return `
                                    <div class="borrowing-card-footer">
                                        <button class="btn-secondary-dash btn-sm borrower-return-btn" data-txn-id="${b.id}" style="width:100%;justify-content:center;">
                                            <i class="fas fa-rotate-left"></i> Mark as Returned
                                        </button>
                                    </div>
                                `;
                    } else {
                        return `
                                    <div class="borrowing-card-footer" style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 10px;">
                                        <span>Item is currently with the borrower.</span>
                                    </div>
                                `;
                    }
                } else if (b.status === 'RETURN_PENDING') {
                    if (isBorrower) {
                        return `
                                    <div class="borrowing-card-footer" style="text-align: center; color: #D97706; font-size: 0.9rem; font-weight: 600; padding: 10px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                        <i class="fas fa-hourglass-half"></i> Waiting for Owner Confirmation
                                    </div>
                                `;
                    } else if (isOwner) {
                        return `
                                    <div class="borrowing-card-footer">
                                        <button class="btn-primary btn-sm owner-confirm-return-btn" data-txn-id="${b.id}" style="width:100%;justify-content:center; background-color: #10B981; border-color: #10B981;">
                                            <i class="fas fa-circle-check"></i> Confirm Return
                                        </button>
                                    </div>
                                `;
                    }
                } else if (b.status === 'COMPLETED') {
                    return `
                                <div class="borrowing-card-footer" style="text-align: center; color: #10B981; font-size: 0.9rem; font-weight: 600; padding: 10px;">
                                    <i class="fas fa-circle-check"></i> Completed
                                </div>
                            `;
                }
                return '';
            })()}
                </div>
            </div>
        `;
    }).join('');

    // 2. Attach Return Button listeners to open the return-rating modal for borrower
    const returnButtons = grid.querySelectorAll('.borrower-return-btn');
    returnButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const transactionId = this.getAttribute('data-txn-id');

            ratingModalAction = 'return';

            // Set modal titles contextually
            const titleEl = document.querySelector('#return-rating-modal .card-title');
            if (titleEl) titleEl.innerHTML = '<i class="fas fa-rotate-left"></i> Mark as Returned';

            const submitBtn = document.querySelector('#return-rating-form button[type="submit"]');
            if (submitBtn) submitBtn.textContent = 'Submit Return';

            document.getElementById('return-txn-id').value = transactionId;
            document.getElementById('return-rating-val').value = 0;

            // Reset stars selection
            const stars = document.querySelectorAll('.star-rating-container .rating-star');
            stars.forEach(s => {
                s.classList.remove('fas');
                s.classList.add('far');
            });

            const modal = document.getElementById('return-rating-modal');
            if (modal) modal.style.display = 'flex';
        });
    });

    // 3. Attach Confirm Return Button listeners for owner to open rating modal
    const confirmButtons = grid.querySelectorAll('.owner-confirm-return-btn');
    confirmButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const transactionId = this.getAttribute('data-txn-id');

            ratingModalAction = 'confirm';

            // Set modal titles contextually
            const titleEl = document.querySelector('#return-rating-modal .card-title');
            if (titleEl) titleEl.innerHTML = '<i class="fas fa-circle-check"></i> Confirm Receipt';

            const submitBtn = document.querySelector('#return-rating-form button[type="submit"]');
            if (submitBtn) submitBtn.textContent = 'Confirm & Complete';

            document.getElementById('return-txn-id').value = transactionId;
            document.getElementById('return-rating-val').value = 0;

            // Reset stars selection
            const stars = document.querySelectorAll('.star-rating-container .rating-star');
            stars.forEach(s => {
                s.classList.remove('fas');
                s.classList.add('far');
            });

            const modal = document.getElementById('return-rating-modal');
            if (modal) modal.style.display = 'flex';
        });
    });
}

async function initRentals() {
    const grid = document.getElementById('rentals-grid');
    if (!grid) return;

    grid.innerHTML = getSkeletonHtml('borrowing').repeat(3);

    try {
        const response = await authenticatedFetch('http://127.0.0.1:8000/api/transactions/?role=owner&status=ACTIVE,RETURN_PENDING');
        if (!response.ok) throw new Error('Failed to fetch transactions');

        const activeRentals = await response.json();
        renderRentals(activeRentals, grid);
    } catch (err) {
        console.error('Error loading active rentals:', err);
        grid.innerHTML = getErrorStateHtml('Failed to load active rentals.', 'initRentals');
    }
}

function renderRentals(data, grid) {
    if (data.length === 0) {
        grid.innerHTML = getEmptyStateHtml(
            'fa-handshake',
            'No active rentals',
            'You are not currently lending out any items to other students.',
            'Create a Listing',
            "window.location.hash='#page-add-item'; document.querySelector('[data-page=\"add-item\"]').click();"
        );
        return;
    }

    grid.innerHTML = data.map(b => {
        const start = new Date(b.start_date);
        const end = new Date(b.end_date);
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        const endCopy = new Date(end);
        endCopy.setHours(0, 0, 0, 0);

        const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        const daysLeft = Math.ceil((endCopy - today) / (1000 * 60 * 60 * 24));
        const pct = Math.round(((totalDays - Math.max(0, daysLeft)) / totalDays) * 100);

        let daysLeftText = `${daysLeft} Day${daysLeft === 1 ? '' : 's'} Left`;
        let daysClass = '';

        if (daysLeft === 0) {
            daysLeftText = 'Due Today';
            daysClass = 'due-today';
        } else if (daysLeft < 0) {
            daysLeftText = 'Overdue';
            daysClass = 'danger';
        } else if (daysLeft <= 2) {
            daysClass = 'danger';
        } else if (daysLeft <= 4) {
            daysClass = 'warning';
        }

        const fillClass = daysLeft <= 2 ? 'danger' : daysLeft <= 4 ? 'warning' : '';

        const itemName = b.listing_title || `Listing #${b.listing}`;
        const borrowerName = b.borrower_username || `User #${b.borrower}`;
        const imgUrl = (b.listing_details && b.listing_details.image) ? formatImageUrl(b.listing_details.image) : '../static/images/dell_Laptop.jpg';

        let footerHtml = '';
        if (b.status === 'ACTIVE') {
            footerHtml = `
                <div class="borrowing-card-footer" style="text-align: center; color: var(--text-muted); font-size: 0.9rem; font-weight: 600; padding: 10px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fas fa-hourglass-half"></i> Awaiting Return
                </div>
            `;
        } else if (b.status === 'RETURN_PENDING') {
            footerHtml = `
                <div class="borrowing-card-footer" style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                    <div style="text-align: center; color: #D97706; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">
                        <i class="fas fa-exclamation-triangle"></i> Waiting for Return Confirmation
                    </div>
                    <button class="btn-primary btn-sm owner-confirm-return-btn" data-txn-id="${b.id}" style="width:100%;justify-content:center; background-color: #10B981; border-color: #10B981;">
                        <i class="fas fa-circle-check"></i> Confirm Return
                    </button>
                </div>
            `;
        }

        return `
            <div class="borrowing-card" id="transaction-${b.id}">
                <div class="borrowing-card-image-wrap">
                    <img class="borrowing-card-image" src="${imgUrl}" alt="${itemName}">
                    <span class="borrowing-card-days-badge ${daysClass}">
                        ${daysLeftText}
                    </span>
                </div>
                <div class="borrowing-card-details">
                    <h3 class="borrowing-card-title">${itemName}</h3>
                    <div class="borrowing-card-owner"><i class="fas fa-user-circle" style="color: var(--accent-primary); margin-right: 4px;"></i> Borrower: ${borrowerName}</div>
                    
                    <div class="borrowing-card-meta">
                        <div class="borrowing-detail-row">
                            <span class="borrowing-detail-label"><i class="fas fa-calendar-check"></i> Pickup</span>
                            <span class="borrowing-detail-value">${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div class="borrowing-detail-row">
                            <span class="borrowing-detail-label"><i class="fas fa-calendar-times"></i> Return By</span>
                            <span class="borrowing-detail-value">${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div class="borrowing-detail-row">
                            <span class="borrowing-detail-label"><i class="fas fa-rupee-sign"></i> Rate</span>
                            <span class="borrowing-detail-value">₹${b.price_per_day}/day</span>
                        </div>
                    </div>
                    
                    <div class="days-progress">
                        <div class="days-progress-label">
                            <span>Days remaining</span>
                            <span style="color:${daysLeft <= 2 ? 'var(--secondary-color)' : daysLeft <= 4 ? '#D97706' : 'var(--text-main)'}; font-weight: 600;">${daysLeft} / ${totalDays}</span>
                        </div>
                        <div class="days-progress-bar">
                            <div class="days-progress-fill ${fillClass}" style="width:${pct}%"></div>
                        </div>
                    </div>
                    
                    ${footerHtml}
                </div>
            </div>
        `;
    }).join('');

    // Attach Confirm Return Button listeners
    const confirmButtons = grid.querySelectorAll('.owner-confirm-return-btn');
    confirmButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const transactionId = this.getAttribute('data-txn-id');

            ratingModalAction = 'confirm';

            const titleEl = document.querySelector('#return-rating-modal .card-title');
            if (titleEl) titleEl.innerHTML = '<i class="fas fa-circle-check"></i> Confirm Receipt';

            const submitBtn = document.querySelector('#return-rating-form button[type="submit"]');
            if (submitBtn) submitBtn.textContent = 'Confirm & Complete';

            document.getElementById('return-txn-id').value = transactionId;
            document.getElementById('return-rating-val').value = 0;

            const stars = document.querySelectorAll('.star-rating-container .rating-star');
            stars.forEach(s => {
                s.classList.remove('fas');
                s.classList.add('far');
            });

            const modal = document.getElementById('return-rating-modal');
            if (modal) modal.style.display = 'flex';
        });
    });
}

window.closeReturnModal = function () {
    const modal = document.getElementById('return-rating-modal');
    if (modal) modal.style.display = 'none';
};

function initRatingStars() {
    const stars = document.querySelectorAll('.star-rating-container .rating-star');
    const ratingInput = document.getElementById('return-rating-val');

    stars.forEach(star => {
        star.addEventListener('click', function () {
            const val = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = val;

            stars.forEach(s => {
                const sVal = parseInt(s.getAttribute('data-rating'));
                if (sVal <= val) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
    });
}

function initReturnRatingForm() {
    const form = document.getElementById('return-rating-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const transactionId = document.getElementById('return-txn-id').value;
        const rating = parseInt(document.getElementById('return-rating-val').value);

        if (!rating || rating < 1 || rating > 5) {
            showToast('Please select a star rating (1 to 5).', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const oldText = submitBtn.textContent;

        try {
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;

            const endpoint = ratingModalAction === 'confirm' ? 'confirm' : 'return';
            const response = await authenticatedFetch(`http://127.0.0.1:8000/api/transactions/${transactionId}/${endpoint}/`, {
                method: 'PATCH',
                body: JSON.stringify({ rating: rating })
            });

            if (response.ok) {
                const msg = ratingModalAction === 'confirm' ? 'Return confirmed and transaction completed!' : 'Item marked as returned successfully!';
                showToast(msg);
                closeReturnModal();
                initBorrowings(); // Refresh grid
                initRentals(); // Refresh grid
                initListings(); // Refresh listings
                initHistory(); // Refresh history
                initDashboardHome(); // Refresh statistics counts
            } else {
                const errData = await response.json();
                const failMsg = ratingModalAction === 'confirm' ? 'Failed to confirm return.' : 'Failed to mark item as returned.';
                showToast(errData.error || failMsg, 'error');
            }
        } catch (err) {
            console.error('Error handling rating submission:', err);
            const errType = ratingModalAction === 'confirm' ? 'confirming return' : 'marking item as returned';
            showToast(`Network error while ${errType}.`, 'error');
        } finally {
            submitBtn.textContent = oldText;
            submitBtn.disabled = false;
        }
    });
}

// ============================================================
// PAGE: TRANSACTION HISTORY (Connected to Backend)
// ============================================================
async function initHistory() {
    const tbody = document.getElementById('history-tbody');
    if (!tbody) return;

    tbody.innerHTML = getSkeletonHtml('row').repeat(5);

    try {
        const response = await authenticatedFetch('http://127.0.0.1:8000/api/transactions/');
        if (!response.ok) throw new Error('Failed to fetch transaction history');

        const data = await response.json();
        renderHistory(data, tbody);
    } catch (err) {
        console.error('Error loading history:', err);
        tbody.innerHTML = getTableErrorStateHtml('Failed to load transaction history.', 'initHistory');
    }
}

function renderHistory(data, tbody) {
    const tableWrap = document.querySelector('.history-table-wrap');
    if (data.length === 0) {
        if (tableWrap) {
            tableWrap.innerHTML = getEmptyStateHtml(
                'fa-receipt',
                'No transactions yet',
                'Your history is currently empty. Start borrowing or lending items to build history.',
                'Explore Catalog',
                "window.location.href='products.html'"
            );
        } else {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: gray; padding: 20px;">No transaction history found.</td></tr>';
        }
        return;
    }

    const currentUsername = localStorage.getItem('username');

    tbody.innerHTML = data.map(txn => {
        const start = new Date(txn.start_date);
        const end = new Date(txn.end_date);
        const dateStr = start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' – ' + end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

        const isBorrow = txn.borrower_username === currentUsername;
        const typeStr = isBorrow ? 'Borrow' : 'Lend';
        const typeClass = isBorrow ? 'type-borrow' : 'type-lend';

        const itemName = (txn.listing_details && txn.listing_details.title) || txn.listing_title || `Listing #${txn.listing}`;
        const amount = `₹${txn.total_amount || '0.00'}`;
        const deposit = `₹${txn.security_deposit !== undefined && txn.security_deposit !== null ? txn.security_deposit : ((txn.listing_details && txn.listing_details.security_deposit) || '0.00')}`;

        const statusClass = txn.status.toLowerCase();
        const statusText = capitalize(txn.status);

        return `
            <tr>
                <td>#${txn.id}</td>
                <td>
                    <div style="font-weight: 600; color: var(--text-main);">${itemName}</div>
                </td>
                <td>${dateStr}</td>
                <td><span class="history-type-badge ${typeClass}">${typeStr}</span></td>
                <td>${amount}</td>
                <td>${deposit}</td>
                <td><span class="status-badge status-${statusClass}">${statusText}</span></td>
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

    list.innerHTML = getSkeletonHtml('notification').repeat(4);

    try {
        const response = await authenticatedFetch('http://127.0.0.1:8000/api/notifications/');
        if (!response.ok) throw new Error('Failed to fetch notifications');

        const data = await response.json();
        renderNotifications(data, list);
        setupMarkAllRead(list);
    } catch (err) {
        console.error('Error loading notifications:', err);
        list.innerHTML = getErrorStateHtml('Failed to load notifications.', 'initNotifications');
    }
}

function renderNotifications(data, list) {
    if (data.length === 0) {
        list.innerHTML = getEmptyStateHtml(
            'fa-bell-slash',
            'No notifications yet',
            'We will alert you here when there are updates on your listings or borrow requests.',
            'Back to Dashboard',
            "activatePage('home')"
        );
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
        const style = colorMap[n.type] || colorMap['DEFAULT'];
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
                updateNotificationBadge(0);
                showToast('All notifications marked as read');
                await initNotifications(); // Dynamic instant list update
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
    // Restore pane body from original HTML to replace the skeleton
    const paneBody = document.querySelector('#profile-pane-personal .pane-body');
    if (paneBody && window.originalProfileBody) {
        paneBody.innerHTML = window.originalProfileBody;
    }

    // Populate static user info
    setTextById('profile-name', USER.name);
    setTextById('profile-email', USER.email);
    setTextById('profile-phone', USER.phone);

    // Display reputation rating nicely
    const ratingVal = parseFloat(USER.rating);
    if (!isNaN(ratingVal) && ratingVal > 0) {
        setTextById('profile-rating', ratingVal + ' ★');
    } else {
        setTextById('profile-rating', 'New User ★');
    }
    setTextById('profile-since', USER.memberSince);

    // Init avatar initials
    document.querySelectorAll('.profile-avatar, .profile-avatar-lg').forEach(el => {
        el.textContent = USER.initials;
    });

    // Pre-fill edit form
    setInputById('edit-name', USER.name);
    setInputById('edit-email', USER.email);
    setInputById('edit-phone', USER.phone);
    setInputById('edit-bio', USER.bio || '');

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
        saveBtn.addEventListener('click', async () => {
            const newBio = document.getElementById('edit-bio')?.value || '';

            try {
                // Disable button and show spinner
                saveBtn.disabled = true;
                const originalHTML = saveBtn.innerHTML;
                saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

                // Send ONLY the bio field to the profile API via PATCH
                const response = await authenticatedFetch('http://127.0.0.1:8000/api/auth/profile/', {
                    method: 'PATCH',
                    body: JSON.stringify({
                        bio: newBio
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    USER.bio = data.bio || '';
                    showToast('Profile updated successfully!');
                } else {
                    const errorData = await response.json();
                    console.error('Profile update failed:', errorData);
                    showToast('Failed to update profile.', 'error');
                }

                // Restore button
                saveBtn.disabled = false;
                saveBtn.innerHTML = originalHTML;
            } catch (err) {
                console.error('Submit error:', err);
                showToast('Network error while updating.', 'error');
                saveBtn.disabled = false;
                saveBtn.innerHTML = originalHTML;
            }
        });
    }
}

// Global Theme Sync for Preferences Tab Cards
window.setDashboardTheme = function (theme) {
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
    const fileInput2 = document.getElementById('item-image-input-2');
    const fileInput3 = document.getElementById('item-image-input-3');

    const primaryPreview = document.getElementById('image-primary-preview');
    const thumbSlot1 = document.getElementById('thumb-slot-1');
    const thumbSlot2 = document.getElementById('thumb-slot-2');
    const thumbSlot3 = document.getElementById('thumb-slot-3');

    const previewImg = document.getElementById('preview-image-actual');
    const previewPlaceholder = document.getElementById('preview-image-placeholder');

    // Reset preview to default state
    function resetPreview() {
        uploadedImageSrc = '';
        if (fileInput) fileInput.value = '';
        if (fileInput2) fileInput2.value = '';
        if (fileInput3) fileInput3.value = '';

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

        const wrap1 = thumbSlot1 ? thumbSlot1.querySelector('.slot-image-wrap') : null;
        if (wrap1) wrap1.innerHTML = `<i class="fas fa-plus"></i>`;

        const wrap2 = thumbSlot2 ? thumbSlot2.querySelector('.slot-image-wrap') : null;
        if (wrap2) wrap2.innerHTML = `<i class="fas fa-plus"></i>`;
        if (thumbSlot2) thumbSlot2.classList.remove('active');

        const wrap3 = thumbSlot3 ? thumbSlot3.querySelector('.slot-image-wrap') : null;
        if (wrap3) wrap3.innerHTML = `<i class="fas fa-plus"></i>`;
        if (thumbSlot3) thumbSlot3.classList.remove('active');

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
                    const wrap1 = thumbSlot1 ? thumbSlot1.querySelector('.slot-image-wrap') : null;
                    if (wrap1) {
                        wrap1.innerHTML = `<img src="${uploadedImageSrc}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;" />`;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (thumbSlot2 && fileInput2) {
        thumbSlot2.addEventListener('click', () => fileInput2.click());
        fileInput2.addEventListener('change', () => {
            const file = fileInput2.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const wrap = thumbSlot2.querySelector('.slot-image-wrap');
                    if (wrap) {
                        wrap.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;" />`;
                    }
                    thumbSlot2.classList.add('active');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (thumbSlot3 && fileInput3) {
        thumbSlot3.addEventListener('click', () => fileInput3.click());
        fileInput3.addEventListener('change', () => {
            const file = fileInput3.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const wrap = thumbSlot3.querySelector('.slot-image-wrap');
                    if (wrap) {
                        wrap.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;" />`;
                    }
                    thumbSlot3.classList.add('active');
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

        const categoryMap = {
            "Electronics": 1,      // Electronics (1)
            "Study Essentials": 2, // Books (2)
            "Sports": 3,           // Sports (3)
            "Appliances": 5,       // Tools (5)
            "Accessories": 6,      // Accessories (6)
            "Clothing": 6,         // Accessories (6)
            "Instruments": 5,      // Tools (5)
            "Other": 6             // Accessories (6)
        };
        const categoryId = categoryMap[categoryText] || 1;

        let conditionCode = 'GOOD';
        if (conditionText === 'Like New') conditionCode = 'NEW';
        else if (conditionText === 'Fair') conditionCode = 'USED';

        const formData = new FormData();
        formData.append('title', name);
        formData.append('description', desc);
        formData.append('price_per_day', rent);
        formData.append('security_deposit', deposit);
        formData.append('category', categoryId);
        formData.append('condition', conditionCode);

        if (fromInput?.value) {
            formData.append('available_from', fromInput.value);
        }
        if (untilInput?.value) {
            formData.append('available_until', untilInput.value);
        }
        if (fileInput && fileInput.files[0]) {
            formData.append('image', fileInput.files[0]);
        }
        if (fileInput2 && fileInput2.files[0]) {
            formData.append('secondary_images', fileInput2.files[0]);
        }
        if (fileInput3 && fileInput3.files[0]) {
            formData.append('secondary_images', fileInput3.files[0]);
        }

        try {
            const response = await authenticatedFetch('http://127.0.0.1:8000/api/listings/', {
                method: 'POST',
                body: formData
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

function formatImageUrl(url) {
    if (!url) return '../static/images/dell_Laptop.jpg';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `http://127.0.0.1:8000${url}`;
}