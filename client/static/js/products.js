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

document.addEventListener('mousemove', (e) => {
    const ripples = document.querySelectorAll('.ripple');
    const card = document.querySelector('.cta-card');

    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if mouse is inside the card
    if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
        ripples.forEach((ripple, index) => {
            // Each layer moves at a slightly different speed for depth
            const depth = (index + 1) * 10;
            const moveX = (x - rect.width / 2) / depth;
            const moveY = (y - rect.height / 2) / depth;

            ripple.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }
});