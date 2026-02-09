// DOM Elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionContainer = document.getElementById('questionContainer');
const celebrationContainer = document.getElementById('celebrationContainer');
const confettiContainer = document.getElementById('confettiContainer');
const floatingHearts = document.getElementById('floatingHearts');
const heartsBg = document.getElementById('heartsBg');
const burstContainer = document.getElementById('burstContainer');
const countdownContainer = document.getElementById('countdownContainer');
const skipCountdownBtn = document.getElementById('skipCountdown');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

// Valentine's Day 2026
const valentinesDay = new Date('February 14, 2026 00:00:00').getTime();
let countdownInterval;

// No button state
let shrinkScale = 1;
let hasStartedEvading = false;
const SHRINK_FACTOR = 0.85; // 15% smaller each time
const MIN_SCALE = 0.1;

// Evasion behaviors
const evasionBehaviors = ['jump', 'slide'];

// Convert button to absolute positioning on first evasion
function startEvading() {
    if (hasStartedEvading) return;
    hasStartedEvading = true;

    const btnRect = noBtn.getBoundingClientRect();
    const containerRect = questionContainer.getBoundingClientRect();

    // Calculate current position relative to container
    const currentLeft = btnRect.left - containerRect.left;
    const currentTop = btnRect.top - containerRect.top;

    // Switch to absolute positioning
    noBtn.classList.add('evading');
    noBtn.style.left = currentLeft + 'px';
    noBtn.style.top = currentTop + 'px';
}

// Initialize background hearts
function createBackgroundHearts() {
    const hearts = ['❤️', '💕', '💗', '💖', '💘'];
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'bg-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 6 + 's';
        heart.style.fontSize = (15 + Math.random() * 20) + 'px';
        heartsBg.appendChild(heart);
    }
}

// Get random position within viewport (accounting for button size)
function getRandomPosition() {
    const btnRect = noBtn.getBoundingClientRect();
    const containerRect = questionContainer.getBoundingClientRect();

    // Keep button within the container bounds with some padding
    const padding = 20;
    const maxX = containerRect.width - btnRect.width - padding;
    const maxY = containerRect.height - btnRect.height - padding;

    return {
        x: padding + Math.random() * Math.max(0, maxX),
        y: padding + Math.random() * Math.max(0, maxY)
    };
}

// Evasion behavior: Jump to random position
function jumpAway() {
    const pos = getRandomPosition();
    noBtn.style.transition = 'none';
    noBtn.style.left = pos.x + 'px';
    noBtn.style.top = pos.y + 'px';
}

// Evasion behavior: Slide away from cursor
function slideAway(event) {
    const btnRect = noBtn.getBoundingClientRect();
    const containerRect = questionContainer.getBoundingClientRect();

    // Get cursor position relative to button center
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    let cursorX, cursorY;
    if (event.touches) {
        cursorX = event.touches[0].clientX;
        cursorY = event.touches[0].clientY;
    } else {
        cursorX = event.clientX;
        cursorY = event.clientY;
    }

    // Calculate direction away from cursor
    const deltaX = btnCenterX - cursorX;
    const deltaY = btnCenterY - cursorY;

    // Normalize and scale
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;
    const moveDistance = 100;
    const moveX = (deltaX / distance) * moveDistance;
    const moveY = (deltaY / distance) * moveDistance;

    // Calculate new position
    let newX = (btnRect.left - containerRect.left) + moveX;
    let newY = (btnRect.top - containerRect.top) + moveY;

    // Constrain to container bounds
    const padding = 10;
    newX = Math.max(padding, Math.min(newX, containerRect.width - btnRect.width - padding));
    newY = Math.max(padding, Math.min(newY, containerRect.height - btnRect.height - padding));

    noBtn.style.transition = 'all 0.3s ease-out';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
}

// Evasion behavior: Shrink the button
function shrinkButton() {
    shrinkScale *= SHRINK_FACTOR;

    if (shrinkScale < MIN_SCALE) {
        // Button has shrunk too much, make it disappear and jump back
        noBtn.style.opacity = '0';
        setTimeout(() => {
            shrinkScale = 1;
            noBtn.style.transform = 'scale(1)';
            noBtn.style.opacity = '1';
            jumpAway();
        }, 500);
    } else {
        noBtn.classList.add('shrinking');
        noBtn.style.transform = `scale(${shrinkScale})`;
    }
}

// Handle No button evasion
function evadeButton(event) {
    // Convert to absolute positioning on first evasion
    startEvading();

    const behavior = evasionBehaviors[Math.floor(Math.random() * evasionBehaviors.length)];

    switch (behavior) {
        case 'jump':
            jumpAway();
            break;
        case 'slide':
            slideAway(event);
            break;
        case 'shrink':
            shrinkButton();
            break;
    }
}

// Create confetti particle
function createConfetti() {
    const colors = ['#FF69B4', '#E31B5F', '#FFB6C1', '#FF1493', '#DB7093', '#FFD700', '#FF6B6B'];
    const shapes = ['square', 'circle'];

    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 2 + 's';
    confetti.style.animationDuration = (2 + Math.random() * 2) + 's';

    if (shapes[Math.floor(Math.random() * shapes.length)] === 'circle') {
        confetti.style.borderRadius = '50%';
    }

    confetti.style.width = (5 + Math.random() * 10) + 'px';
    confetti.style.height = (5 + Math.random() * 10) + 'px';

    confettiContainer.appendChild(confetti);

    // Remove after animation
    setTimeout(() => confetti.remove(), 5000);
}

// Create celebration heart
function createCelebrationHeart() {
    const hearts = ['❤️', '💕', '💗', '💖', '💘', '💝', '💞'];

    const heart = document.createElement('div');
    heart.className = 'celebration-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heart.style.fontSize = (20 + Math.random() * 30) + 'px';

    floatingHearts.appendChild(heart);

    // Remove after animation
    setTimeout(() => heart.remove(), 6000);
}

// Create burst confetti from button
function createBurstConfetti(x, y) {
    const colors = ['#FF69B4', '#E31B5F', '#FFB6C1', '#FF1493', '#DB7093', '#FFD700', '#FF6B6B'];

    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'burst-confetti';
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Random direction for burst
        const angle = (Math.PI * 2 * i) / 80 + (Math.random() - 0.5);
        const velocity = 100 + Math.random() * 200;
        const endX = Math.cos(angle) * velocity;
        const endY = Math.sin(angle) * velocity;
        const rotation = Math.random() * 720;

        confetti.style.width = (5 + Math.random() * 10) + 'px';
        confetti.style.height = (5 + Math.random() * 10) + 'px';

        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }

        // Set custom animation end point
        confetti.animate([
            { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
            { transform: `translate(${endX}px, ${endY}px) rotate(${rotation}deg) scale(0)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'ease-out',
            fill: 'forwards'
        });

        burstContainer.appendChild(confetti);

        // Remove after animation
        setTimeout(() => confetti.remove(), 1500);
    }
}

// Trigger celebration
function celebrate() {
    // Get button position for burst
    const btnRect = yesBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    // Create burst from button
    createBurstConfetti(btnCenterX, btnCenterY);

    // Delay showing celebration to let burst be visible
    setTimeout(() => {
        // Hide question, show celebration
        questionContainer.style.display = 'none';
        celebrationContainer.classList.add('active');

        // Generate 150 confetti particles (staggered)
        for (let i = 0; i < 150; i++) {
            setTimeout(() => createConfetti(), i * 20);
        }

        // Create 30 floating hearts
        for (let i = 0; i < 30; i++) {
            setTimeout(() => createCelebrationHeart(), i * 100);
        }

        // Continue adding confetti and hearts periodically
        setInterval(() => {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => createConfetti(), i * 50);
            }
        }, 3000);

        setInterval(() => {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => createCelebrationHeart(), i * 200);
            }
        }, 4000);
    }, 600);
}

// Event listeners
// Desktop events
noBtn.addEventListener('mouseenter', evadeButton);
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    evadeButton(e);
});

// Mobile events
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    evadeButton(e);
}, { passive: false });

// Yes button
yesBtn.addEventListener('click', celebrate);
yesBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    celebrate();
}, { passive: false });

// Update countdown
function updateCountdown() {
    const now = new Date().getTime();
    const distance = valentinesDay - now;

    if (distance <= 0) {
        // Countdown finished, show question
        clearInterval(countdownInterval);
        showQuestion();
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
}

// Show question page
function showQuestion() {
    countdownContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
}

// Skip countdown button
skipCountdownBtn.addEventListener('click', () => {
    clearInterval(countdownInterval);
    showQuestion();
});

// Initialize
createBackgroundHearts();
updateCountdown();
countdownInterval = setInterval(updateCountdown, 1000);
