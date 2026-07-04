function formatImageUrl(url) {
    if (!url) return '../static/images/dell_Laptop.jpg';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `http://127.0.0.1:8000${url}`;
}

document.addEventListener('DOMContentLoaded', () => {
    // Execute modules safely
    initStickyNavbar();
    initHeroBackdropModule();
    initHowItWorks();
    initStructuredInventoryConsole();
    initTerminalBlock();
    initNavbarAuth();
});

// 1. STICKY NAVBAR
function initStickyNavbar() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });
}

// 2. HERO ANIMATION
function initHeroBackdropModule() {
    const heroTitle = document.querySelector('.hero-main-title');
    const heroLead = document.querySelector('.hero-context-lead');
    const heroActions = document.querySelector('.hero-action-row');
    const heroBackdrop = document.querySelector('.hero-pattern-backdrop');
    if (!heroTitle || !heroLead || !heroActions || !heroBackdrop) return;

    const heroAnimationArray = [heroTitle, heroLead, heroActions];
    heroBackdrop.style.opacity = '0';
    heroBackdrop.style.transform = 'scale(1.05)';
    heroBackdrop.style.transition = 'opacity 1.2s ease-out, transform 1.2s ease-out';

    heroAnimationArray.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    requestAnimationFrame(() => {
        heroBackdrop.style.opacity = '1';
        heroBackdrop.style.transform = 'scale(1)';
        heroAnimationArray.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 150 + (index * 100)); 
        });
    });
}

// 3. HOW IT WORKS
function initHowItWorks() {
    const steps = document.querySelectorAll('.step');
    const connectionLine = document.getElementById('connectionLine');
    const workflowContainer = document.querySelector('.workflow-container');
    if (!connectionLine || !workflowContainer || steps.length === 0) return;

    const lineFill = connectionLine.querySelector('.connection-line-fill');
    const workflowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                connectionLine.classList.add('active');
                if (lineFill) lineFill.style.width = '100%';
                steps.forEach((step, index) => {
                    setTimeout(() => {
                        step.style.opacity = '1';
                        step.style.transform = 'translateY(0)';
                    }, index * 120); 
                });
                workflowObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px' });

    steps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(24px)';
        step.style.transition = 'all 0.3s ease';
    });

    if (lineFill) lineFill.style.width = '0%';
    workflowObserver.observe(workflowContainer);

    let currentHoveredIndex = -1;
    let resetTimeout = null;

    steps.forEach((step, index) => {
        step.addEventListener('mouseenter', () => {
            if (resetTimeout) clearTimeout(resetTimeout);
            currentHoveredIndex = index;
            if (lineFill) lineFill.style.width = `${((index + 1) / steps.length) * 100}%`;
            steps.forEach((s, i) => {
                if (i <= index) s.classList.add('active-path');
                else s.classList.remove('active-path');
            });
        });
        step.addEventListener('mouseleave', () => {
            currentHoveredIndex = -1;
            resetTimeout = setTimeout(() => {
                if (currentHoveredIndex === -1 && lineFill) {
                    lineFill.style.width = '100%';
                    steps.forEach(s => s.classList.remove('active-path'));
                }
            }, 250);
        });
    });
}


// 4. STRUCTURED INVENTORY CONSOLE
document.addEventListener('DOMContentLoaded', () => {
    initStructuredInventoryConsole();
});

function initStructuredInventoryConsole() {
    const tabs = document.querySelectorAll('.structured-tab');
    const productGridContainer = document.getElementById('structuredProductGrid');
    if (tabs.length === 0 || !productGridContainer) return;

    let allLiveListings = []; // Will store the fetched data in memory for quick tab switching

    // 1. Fetch Live Data from Django
    async function fetchCatalogData() {
        productGridContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Syncing campus network...</p>';
        
        try {
            const response = await fetch('http://127.0.0.1:8000/api/listings/');
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            const currentUser = localStorage.getItem('username');
            
            // Store only AVAILABLE items that the user doesn't own
            allLiveListings = data.filter(item => 
                item.availability_status === 'AVAILABLE' && 
                item.owner_username !== currentUser
            );

            updateTabCounts(); // Update the numbers in the sidebar

            // Render the initially active tab
            const activeTab = document.querySelector('.structured-tab.active');
            if (activeTab) {
                renderActiveProductGroup(activeTab.getAttribute('data-target'));
            } else {
                renderActiveProductGroup('electronics');
            }

        } catch (error) {
            console.error("[BorrowBox] Fetch error:", error);
            productGridContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Failed to connect to the campus network.</p>';
        }
    }

    // 2. Helper to dynamically update the numbers in the sidebar tabs
    function updateTabCounts() {
        tabs.forEach(tab => {
            const target = tab.getAttribute('data-target');
            const countSpan = tab.querySelector('.tab-count');
            if (countSpan) {
                const count = filterItemsByCategory(target).length;
                countSpan.textContent = count === 1 ? '1 item' : `${count} items`;
            }
        });
    }

    // 3. Helper to map tab targets to actual API category names
    function filterItemsByCategory(categoryKey) {
        return allLiveListings.filter(item => {
            const cat = (item.category_name || '').toLowerCase();
            if (categoryKey === 'electronics') return cat === 'electronics';
            if (categoryKey === 'textbooks') return cat === 'books';
            if (categoryKey === 'clothing') return cat === 'accessories';
            if (categoryKey === 'sports') return cat === 'sports';
            if (categoryKey === 'appliances') return cat === 'tools';
            return false;
        });
    }

    // 4. Render function preserving your exact HTML structure and animations
    function renderActiveProductGroup(categoryKey) {
        // Filter and limit to max 6 featured items per tab
        const activeItems = filterItemsByCategory(categoryKey).slice(0, 6);
        
        productGridContainer.innerHTML = '';

        if (activeItems.length === 0) {
            productGridContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">No items available in this category yet.</p>`;
            return;
        }

        activeItems.forEach((product, idx) => {
            const cardNode = document.createElement('div');
            cardNode.className = 'sc-card';
            
            // Animation Styles
            cardNode.style.opacity = '0';
            cardNode.style.transform = 'translateY(16px)';
            cardNode.style.transition = `opacity 0.4s ease-out ${idx * 0.05}s, transform 0.4s ease-out ${idx * 0.05}s, border-color 0.2s, box-shadow 0.2s`;

            // Data Mapping
            const badgeText = product.condition === 'NEW' ? 'HIGH PERF' : 'VERIFIED';
            const imageHtml = product.image 
                ? `<img src="${formatImageUrl(product.image)}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;">`
                : `<div style="height: 100%; display: flex; align-items: center; justify-content: center; background: #e0e0e0;"><i class="fas fa-camera" style="font-size: 2rem; color: #9e9e9e;"></i></div>`;

            cardNode.innerHTML = `
                <div class="sc-image-box" style="height: 180px; position: relative;">
                    <span class="sc-badge" style="position: absolute; top: 12px; left: 12px; z-index: 2; background: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">${badgeText}</span>
                    ${imageHtml}
                </div>
                <div class="sc-content">
                    <div class="sc-header-row">
                        <h3>${product.title}</h3>
                        <div class="sc-price">₹${product.price_per_day}<span>/day</span></div>
                    </div>
                    <div class="sc-meta-row">
                        <span class="sc-owner"><i class="fas fa-user-circle"></i> ${product.owner_username || 'Student'}</span>
                        <span class="sc-status">Verified <i class="fas fa-check-circle" style="color:var(--accent-secure, #28a745);"></i></span>
                    </div>
                    <button class="sc-action-btn">Reserve Item</button>
                </div>
            `;

            productGridContainer.appendChild(cardNode);

            // Bind Event: Primary Action (Redirects to the catalog page to handle the real checkout modal)
            const reserveBtn = cardNode.querySelector('.sc-action-btn');
            if (reserveBtn) {
                reserveBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    reserveBtn.textContent = "Redirecting...";
                    reserveBtn.style.backgroundColor = "var(--accent-secure, #28a745)";
                    reserveBtn.style.borderColor = "var(--accent-secure, #28a745)";
                    reserveBtn.style.color = "#fff";
                    setTimeout(() => {
                        window.location.href = `products.html?search=${encodeURIComponent(product.title)}`;
                    }, 400);
                });
            }

            // Trigger stagger animation
            requestAnimationFrame(() => {
                cardNode.style.opacity = '1';
                cardNode.style.transform = 'translateY(0)';
            });
        });
    }

    // 5. Setup Tab Listeners
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const selectedTarget = tab.getAttribute('data-target');
            renderActiveProductGroup(selectedTarget);
        });
    });

    // 6. Kickoff the fetch!
    fetchCatalogData();
}

// 5. TERMINAL BLOCK (Manifesto + Marquee)
function initTerminalBlock() {
    const terminalBlock = document.querySelector('.merged-terminal-block');
    const animateElements = document.querySelectorAll('.manifesto-pill, .manifesto-headline, .manifesto-divider, .manifesto-lead, .manifesto-metric');
    
    const marqueeTrack = document.getElementById('marqueeTrack');
    if (marqueeTrack) {
        const marqueeContent = marqueeTrack.innerHTML;
        marqueeTrack.innerHTML = marqueeContent + marqueeContent + marqueeContent + marqueeContent;
    }

    if (!terminalBlock || animateElements.length === 0) return;

    const terminalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                        const counter = el.querySelector('.counter-number');
                        if (counter) runNumberCounter(counter);
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px' });

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    terminalObserver.observe(terminalBlock);

    function runNumberCounter(counterElement) {
        const target = parseInt(counterElement.getAttribute('data-target'));
        const duration = 1500; 
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const counterInterval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const easeOutProgress = 1 - Math.pow(1 - progress, 3); 
            counterElement.textContent = Math.round(target * easeOutProgress);

            if (frame === totalFrames) {
                clearInterval(counterInterval);
                counterElement.textContent = target; 
            }
        }, frameRate);
    }
}

function initNavbarAuth() {
    const authBtn = document.querySelector('.btn-nav-action');
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