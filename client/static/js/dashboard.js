// ========================================
// CLEAN MINIMALIST DASHBOARD - JAVASCRIPT
// BorrowBox | Vanilla JS with Chart.js
// ========================================

// ========== UTILITY FUNCTIONS ==========
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ========== CHART CONFIGURATION ==========
const chartColors = {
    sage: '#7A9B88',
    sageLight: '#A8C5B5',
    sageDark: '#5F7D6E',
    white: '#FFFFFF',
    charcoal: '#1A1A1A',
    offWhite: '#F5F5F3'
};

// ========== MINI TREND CHARTS ==========
function createMiniChart(canvasId, data, color) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(data.length).fill(''),
            datasets: [{
                data: data,
                borderColor: color,
                borderWidth: 2,
                tension: 0.4,
                fill: false,
                pointRadius: 0,
                pointHoverRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            interaction: {
                mode: 'nearest',
                intersect: false
            }
        }
    });
}

// ========== MAIN RENTAL ACTIVITY CHART ==========
function createMainChart(period = 'monthly') {
    const ctx = $('#mainChart');
    if (!ctx) return;
    
    // Destroy existing chart if present
    if (window.mainChartInstance) {
        window.mainChartInstance.destroy();
    }
    
    // Data based on period
    const dataConfig = {
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [30, 45, 35, 50, 40, 55, 48]
        },
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [320, 380, 350, 420, 390, 460, 440, 480, 450, 520, 490, 540]
        },
        yearly: {
            labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
            data: [3200, 4100, 4800, 5200, 5800, 6400, 6800]
        }
    };
    
    const config = dataConfig[period];
    
    window.mainChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: config.labels,
            datasets: [{
                label: 'Rental Activity',
                data: config.data,
                borderColor: chartColors.sage,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(122, 155, 136, 0.2)');
                    gradient.addColorStop(1, 'rgba(122, 155, 136, 0)');
                    return gradient;
                },
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: chartColors.sage,
                pointHoverBorderColor: chartColors.white,
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    backgroundColor: chartColors.charcoal,
                    titleColor: chartColors.white,
                    bodyColor: chartColors.white,
                    padding: 12,
                    borderRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Activity: ' + context.parsed.y;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#999999',
                        font: {
                            size: 11,
                            family: "'Plus Jakarta Sans', sans-serif"
                        }
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.03)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#999999',
                        font: {
                            size: 11,
                            family: "'Plus Jakarta Sans', sans-serif"
                        },
                        padding: 10
                    },
                    border: {
                        display: false
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
}

// ========== PROGRESS CIRCLE ANIMATION ==========
function animateProgressCircle() {
    const circle = $('#progressCircle');
    if (!circle) return;
    
    const percentage = 80;
    const circumference = 2 * Math.PI * 70; // radius = 70
    const offset = circumference - (percentage / 100) * circumference;
    
    // Start from full circle
    circle.style.strokeDashoffset = circumference;
    
    // Animate to target
    setTimeout(() => {
        circle.style.transition = 'stroke-dashoffset 2s ease-in-out';
        circle.style.strokeDashoffset = offset;
    }, 300);
}

// ========== CHART PERIOD SWITCHER ==========
function initChartPeriodSwitcher() {
    const periodSelect = $('#chartPeriod');
    if (!periodSelect) return;
    
    periodSelect.addEventListener('change', (e) => {
        const period = e.target.value;
        createMainChart(period);
        
        // Visual feedback
        periodSelect.style.transform = 'scale(0.95)';
        setTimeout(() => {
            periodSelect.style.transform = 'scale(1)';
        }, 150);
    });
}

// ========== SEARCH FUNCTIONALITY ==========
function initSearch() {
    const searchInput = $('#searchInput');
    const searchBtn = $('.search-btn');
    
    if (!searchInput || !searchBtn) return;
    
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            console.log('Searching for:', query);
            // Add your search logic here
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}

// ========== NOTIFICATIONS ==========
function initNotifications() {
    const messagesBtn = $('#messagesBtn');
    const notificationsBtn = $('#notificationsBtn');
    
    if (messagesBtn) {
        messagesBtn.addEventListener('click', () => {
            console.log('Messages clicked');
            showNotification('You have 3 new messages');
        });
    }
    
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', () => {
            console.log('Notifications clicked');
            showNotification('No new notifications');
        });
    }
}

function showNotification(message) {
    // Remove existing notification
    const existing = $('.toast-notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== SIDEBAR NAVIGATION ==========
function initSidebarNav() {
    const navItems = $$('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active to clicked
            item.classList.add('active');
            
            console.log('Navigated to:', item.getAttribute('data-tooltip'));
        });
    });
}

// ========== CARD INTERACTIONS ==========
function initCardInteractions() {
    // Add hover effects to stat cards
    const statCards = $$('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add New Card button
    const addCardBtn = $('.add-card-btn');
    if (addCardBtn) {
        addCardBtn.addEventListener('click', () => {
            showNotification('Add Card feature coming soon!');
        });
    }
    
    // Security button
    const securityBtn = $('.security-btn');
    if (securityBtn) {
        securityBtn.addEventListener('click', () => {
            showNotification('Security update initiated');
        });
    }
}

// ========== CREDIT CARD STACK INTERACTION ==========
function initCreditCardStack() {
    const cards = $$('.credit-card');
    
    cards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            // Bring hovered card to front
            card.style.zIndex = 10;
            card.style.transform = `translateY(-${index * 30 + 16}px) rotate(0deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset position
            card.style.zIndex = 3 - index;
            const rotations = [-2, 2, -1];
            card.style.transform = `translateY(0) rotate(${rotations[index]}deg) scale(1)`;
        });
    });
}

// ========== TRANSACTION ITEMS ANIMATION ==========
function animateTransactions() {
    const items = $$('.transaction-item');
    
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 * index);
    });
}

// ========== RESPONSIVE HANDLING ==========
function handleResponsive() {
    const handleResize = () => {
        const width = window.innerWidth;
        
        if (width <= 768) {
            console.log('Mobile view');
        } else if (width <= 1024) {
            console.log('Tablet view');
        } else {
            console.log('Desktop view');
        }
        
        // Redraw charts on resize
        if (window.mainChartInstance) {
            window.mainChartInstance.resize();
        }
    };
    
    window.addEventListener('resize', debounce(handleResize, 250));
}

// ========== DEBOUNCE UTILITY ==========
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing BorrowBox Dashboard...');
    
    // Initialize all mini charts
    createMiniChart('miniChart1', [20, 35, 25, 40, 32, 48, 45], chartColors.sage);
    createMiniChart('miniChart2', [15, 25, 20, 30, 28, 35, 32], chartColors.gold);
    createMiniChart('miniChart3', [180, 220, 200, 260, 240, 280, 270], chartColors.sage);
    createMiniChart('miniChart4', [150, 180, 170, 200, 190, 220, 210], chartColors.white);
    
    // Initialize main chart
    createMainChart('monthly');
    
    // Initialize progress circle
    animateProgressCircle();
    
    // Initialize chart period switcher
    initChartPeriodSwitcher();
    
    // Initialize search
    initSearch();
    
    // Initialize notifications
    initNotifications();
    
    // Initialize sidebar navigation
    initSidebarNav();
    
    // Initialize card interactions
    initCardInteractions();
    
    // Initialize credit card stack
    initCreditCardStack();
    
    // Animate transactions
    setTimeout(animateTransactions, 500);
    
    // Handle responsive
    handleResponsive();
    
    console.log('✅ Dashboard initialized successfully!');
});

// ========== TOAST NOTIFICATION STYLES ==========
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast-notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #1A1A1A;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 14px;
        font-weight: 500;
    }

    .toast-notification.show {
        transform: translateX(0);
    }

    .toast-notification i {
        font-size: 18px;
        color: #7A9B88;
    }

    @media (max-width: 480px) {
        .toast-notification {
            right: 16px;
            left: 16px;
            bottom: 20px;
        }
    }
`;
document.head.appendChild(toastStyles);

// ========== EXPORT FOR CONSOLE ACCESS ==========
window.BorrowBoxDashboard = {
    createMainChart,
    animateProgressCircle,
    showNotification
};