document.addEventListener('DOMContentLoaded', () => {
    // Execute modules safely
    initStickyNavbar();
    initHeroBackdropModule();
    initHowItWorks();
    initStructuredInventoryConsole();
    initTerminalBlock();
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

// 4. INVENTORY CONSOLE (Grid Fixes applied)
function initStructuredInventoryConsole() {
    const tabs = document.querySelectorAll('.structured-tab');
    const productGridContainer = document.getElementById('structuredProductGrid');
    if (tabs.length === 0 || !productGridContainer) return;

    const campusCatalogMockDatabase = {
        electronics: [
            { name: "Lenovo LOQ-15IRX9", owner: "Kashyap P.", price: "₹950", tag: "High Perf", img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500" },
            { name: "MacBook Pro M3", owner: "Design Club", price: "₹850", tag: "Verified", img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500" },
            { name: "Sony WH-1000XM4", owner: "Ritesh M.", price: "₹250", tag: "Top Rated", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
            { name: "iPad Pro 11-inch", owner: "Yash M.", price: "₹400", tag: "Verified", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500" },
            { name: "Anker PowerBank 20k", owner: "LearnIT", price: "₹80", tag: "Available", img: "https://images.unsplash.com/photo-1609592424083-d9cc38ef617c?w=500" },
            { name: "Raspberry Pi 4 Kit", owner: "Cyber Lab", price: "₹150", tag: "Hardware", img: "https://images.unsplash.com/photo-1601462904263-ce21eb6b2979?w=500" }
        ],
        textbooks: [
            { name: "Core Java: Volume I", owner: "Dr. Pratistha M.", price: "₹40", tag: "Academic", img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500" },
            { name: "Intro to Algorithms", owner: "Rahul S.", price: "₹60", tag: "IT Dept", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500" },
            { name: "Cryptography & Sec", owner: "Cyber Lab", price: "₹50", tag: "Rare", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500" },
            { name: "Calculus II", owner: "Library", price: "₹30", tag: "Available", img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500" },
            { name: "Network Principles", owner: "LearnIT", price: "₹45", tag: "Syllabus", img: "https://images.unsplash.com/photo-1555662100-6d25164bc9ba?w=500" },
            { name: "Data Structures in C", owner: "Kashyap P.", price: "₹35", tag: "Available", img: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=500" }
        ],
        photography: [
            { name: "Canon EOS R5 Body", owner: "Media Club", price: "₹1200", tag: "Premium", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500" },
            { name: "DJI Mavic 3 Drone", owner: "Yash M.", price: "₹1500", tag: "Deposit Req", img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500" },
            { name: "Sigma 24-70mm", owner: "Kashyap P.", price: "₹500", tag: "Verified", img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500" },
            { name: "Carbon Tripod", owner: "Puja M.", price: "₹150", tag: "Available", img: "https://images.unsplash.com/photo-1604347491176-5085a6a61ef7?w=500" },
            { name: "Sony A7IV Mirrorless", owner: "Ritesh M.", price: "₹1100", tag: "Premium", img: "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?w=500" },
            { name: "Rode VideoMic Pro", owner: "Media Club", price: "₹200", tag: "Audio", img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500" }
        ],
        sports: [
            { name: "Wilson Basketball", owner: "Sports Complex", price: "₹70", tag: "Indoor", img: "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=500" },
            { name: "Yonex Astrox 99", owner: "Veena M.", price: "₹120", tag: "Verified", img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500" },
            { name: "Quechua 3P Tent", owner: "LearnIT", price: "₹300", tag: "Cleaned", img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500" },
            { name: "Football Case", owner: "Rakesh M.", price: "₹60", tag: "Available", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500" },
            { name: "Ferrari Team Cap", owner: "Kashyap P.", price: "₹40", tag: "F1 Merch", img: "https://images.unsplash.com/photo-1580242453538-2321852da24a?w=500" },
            { name: "Everlast Gloves", owner: "Hostel Gym", price: "₹90", tag: "Cleaned", img: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500" }
        ],
        music: [
            { name: "Fender Strat", owner: "Music Society", price: "₹600", tag: "Studio", img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500" },
            { name: "Novation Launchkey", owner: "Kashyap P.", price: "₹250", tag: "Verified", img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500" },
            { name: "AT2020 Mic", owner: "Hostel B", price: "₹180", tag: "Mint", img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500" },
            { name: "Yamaha Acoustic", owner: "Rishit K.", price: "₹200", tag: "Available", img: "https://images.unsplash.com/photo-1550985543-f47f38aee64e?w=500" },
            { name: "Focusrite Scarlett", owner: "Music Society", price: "₹150", tag: "Interface", img: "https://images.unsplash.com/photo-1612264663673-86105f252654?w=500" },
            { name: "Roland SPD-SX", owner: "Hostel Band", price: "₹450", tag: "Available", img: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=500" }
        ]
    };

    function renderActiveProductGroup(categoryKey) {
        const activeItems = campusCatalogMockDatabase[categoryKey];
        if (!activeItems) return;

        productGridContainer.innerHTML = '';

        activeItems.forEach((product, idx) => {
            const cardNode = document.createElement('div');
            cardNode.className = 'sc-card';
            
            cardNode.style.opacity = '0';
            cardNode.style.transform = 'translateY(16px)';
            cardNode.style.transition = `opacity 0.4s ease-out ${idx * 0.05}s, transform 0.4s ease-out ${idx * 0.05}s, border-color 0.2s, box-shadow 0.2s`;

            cardNode.innerHTML = `
                <div class="sc-image-box">
                    <span class="sc-badge">${product.tag}</span>
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <div class="sc-content">
                    <div class="sc-header-row">
                        <h3>${product.name}</h3>
                        <div class="sc-price">${product.price}<span>/day</span></div>
                    </div>
                    <div class="sc-meta-row">
                        <span class="sc-owner"><i class="fas fa-user-circle"></i> ${product.owner}</span>
                        <span class="sc-status">Verified <i class="fas fa-check-circle" style="color:var(--accent-secure);"></i></span>
                    </div>
                    <button class="sc-action-btn">Reserve Item</button>
                </div>
            `;

            productGridContainer.appendChild(cardNode);

            // Bind Event: Primary Action
            const reserveBtn = cardNode.querySelector('.sc-action-btn');
            reserveBtn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                console.log(`[BorrowBox] Routing checkout: ${product.name}`);
                reserveBtn.textContent = "Processing...";
                reserveBtn.style.backgroundColor = "var(--accent-secure)";
                reserveBtn.style.borderColor = "var(--accent-secure)";
                reserveBtn.style.color = "var(--surface-card)";
                setTimeout(() => {
                    reserveBtn.textContent = "Reserve Item";
                    reserveBtn.style = "";
                }, 1000);
            });

            // Bind Event: Full Card Click
            cardNode.addEventListener('click', () => {
                console.log(`[BorrowBox] Opening details: ${product.name}`);
            });

            requestAnimationFrame(() => {
                cardNode.style.opacity = '1';
                cardNode.style.transform = 'translateY(0)';
            });
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const selectedTarget = tab.getAttribute('data-target');
            renderActiveProductGroup(selectedTarget);
        });
    });

    renderActiveProductGroup('electronics');
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