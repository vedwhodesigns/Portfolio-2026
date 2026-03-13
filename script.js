/* ===== Portfolio 2026 — script.js ===== */

(() => {
    'use strict';

    // ─── SVG Paths ───
    const MOON_PATH = 'M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.14 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05z';
    const SUN_PATH  = 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-4a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1zm0 18a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1zM5.64 5.64a1 1 0 0 0 0-1.41l-.71-.71a1 1 0 1 0-1.41 1.41l.71.71a1 1 0 0 0 1.41 0zM18.36 18.36a1 1 0 0 0 0 1.41l.71.71a1 1 0 0 0 1.41-1.41l-.71-.71a1 1 0 0 0-1.41 0zM3 12a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1zm18 0a1 1 0 0 0 1 1h1a1 1 0 0 0 0-2h-1a1 1 0 0 0-1 1zM5.64 18.36l-.71.71a1 1 0 0 0 1.41 1.41l.71-.71a1 1 0 0 0-1.41-1.41zM18.36 5.64a1 1 0 0 0 .71.29 1 1 0 0 0 .7-.29l.71-.71a1 1 0 0 0-1.41-1.41l-.71.71a1 1 0 0 0 0 1.41z';

    // ─── State ───
    let isNight = false;

    // ─── DOM ───
    const toggle    = document.getElementById('theme-toggle');
    const iconPath  = document.getElementById('icon-path');
    const iconWrap  = document.getElementById('toggle-icon-wrap');
    const label     = document.getElementById('toggle-label');
    const content   = toggle.querySelector('.glass-content');

    // ─── Toggle Logic ───
    function setTheme(night, animate = true) {
        isNight = night;

        if (!animate) {
            document.documentElement.style.setProperty('--toggle-duration', '0s');
        }

        // Swap icon + label order with spring animation
        if (night) {
            document.body.classList.add('night');
            // Night: label first, then icon
            content.style.flexDirection = 'row-reverse';
            label.textContent = 'Night';
            animateIconMorph(SUN_PATH);
        } else {
            document.body.classList.remove('night');
            // Day: icon first, then label
            content.style.flexDirection = 'row';
            label.textContent = 'Day';
            animateIconMorph(MOON_PATH);
        }

        if (!animate) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    document.documentElement.style.removeProperty('--toggle-duration');
                });
            });
        }
    }

    function animateIconMorph(targetPath) {
        // Spring pop on icon
        const icon = document.getElementById('toggle-icon');
        icon.style.transform = 'scale(0.6) rotate(90deg)';

        // Swap path mid-animation
        setTimeout(() => {
            iconPath.setAttribute('d', targetPath);
            icon.style.transform = 'scale(1.15) rotate(-10deg)';
        }, 150);

        setTimeout(() => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }, 350);
    }

    function toggleTheme() {
        // Spring press feedback
        toggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            toggle.style.transform = '';
        }, 120);

        setTheme(!isNight, true);
    }

    // ─── Event Listeners ───
    toggle.addEventListener('click', toggleTheme);
    toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
        }
    });

    // ─── Auto-detect time (7PM - 7AM = night) ───
    const hour = new Date().getHours();
    const autoNight = hour >= 19 || hour < 7;
    setTheme(autoNight, false);

})();
