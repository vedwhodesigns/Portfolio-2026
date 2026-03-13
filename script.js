/* ============================================
   Portfolio 2026 — script.js
   Motion Design: Apple-grade toggle interactions
   ============================================ */

(() => {
    'use strict';

    /* -- SVG Icon Paths -- */
    const MOON_PATH = 'M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.14 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05z';
    const SUN_PATH  = 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-4a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1zm0 18a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1zM5.64 5.64a1 1 0 0 0 0-1.41l-.71-.71a1 1 0 1 0-1.41 1.41l.71.71a1 1 0 0 0 1.41 0zM18.36 18.36a1 1 0 0 0 0 1.41l.71.71a1 1 0 0 0 1.41-1.41l-.71-.71a1 1 0 0 0-1.41 0zM3 12a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1zm18 0a1 1 0 0 0 1 1h1a1 1 0 0 0 0-2h-1a1 1 0 0 0-1 1zM5.64 18.36l-.71.71a1 1 0 0 0 1.41 1.41l.71-.71a1 1 0 0 0-1.41-1.41zM18.36 5.64a1 1 0 0 0 .71.29 1 1 0 0 0 .7-.29l.71-.71a1 1 0 0 0-1.41-1.41l-.71.71a1 1 0 0 0 0 1.41z';

    /* -- Motion Timing Constants -- */
    const TIMING = {
        press:       80,
        morphOut:    180,
        morphSwap:   180,
        morphIn:     400,
        slideSettle: 500,
        labelFade:   120,
        loadDelay:   300,
        recovery:    150,
    };

    /* -- State -- */
    let isNight = false;
    let isAnimating = false;

    /* -- DOM References -- */
    const toggle   = document.getElementById('theme-toggle');
    const iconBtn  = document.getElementById('toggle-icon-wrap');
    const icon     = document.getElementById('toggle-icon');
    const iconPath = document.getElementById('icon-path');
    const dayText  = document.getElementById('label-day');
    const nightText = document.getElementById('label-night');

    /* ============================================
       CORE: Set Theme with Slide Animation
       ============================================ */
    function setTheme(night, animate) {
        if (animate === undefined) animate = true;
        if (isAnimating) return;
        if (night === isNight && animate) return;

        isNight = night;

        if (!animate) {
            document.body.classList.add('no-transitions');
            applyThemeState(night);
            void document.body.offsetHeight;
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    document.body.classList.remove('no-transitions');
                });
            });
            return;
        }

        // -- Animated toggle sequence --
        isAnimating = true;

        // Phase 1: Tactile press (80ms)
        toggle.classList.add('pressing');

        setTimeout(function() {
            toggle.classList.remove('pressing');

            // Phase 2: Start icon morph-out (shrink + spin)
            icon.classList.remove('morphing-in');
            icon.classList.add('morphing-out');

            // Phase 3: At morph peak, swap SVG path + slide positions
            setTimeout(function() {
                // Swap icon
                iconPath.setAttribute('d', night ? SUN_PATH : MOON_PATH);
                icon.setAttribute('width', night ? '18' : '16');
                icon.setAttribute('height', night ? '18' : '16');

                // Crossfade label text
                if (night) {
                    dayText.className = 'toggle-label-text hidden';
                    nightText.className = 'toggle-label-text visible';
                } else {
                    nightText.className = 'toggle-label-text hidden';
                    dayText.className = 'toggle-label-text visible';
                }

                // Apply slide (CSS handles the transform transition)
                applyThemeState(night);

                // Phase 4: Icon springs back in
                requestAnimationFrame(function() {
                    icon.classList.remove('morphing-out');
                    icon.classList.add('morphing-in');
                });

                // Phase 5: Settle
                setTimeout(function() {
                    isAnimating = false;
                    icon.classList.remove('morphing-in');
                }, TIMING.slideSettle);

            }, TIMING.morphSwap);

        }, TIMING.press);
    }

    function applyThemeState(night) {
        if (night) {
            document.body.classList.add('night');
        } else {
            document.body.classList.remove('night');
        }
    }

    /* ============================================
       CLICK HANDLER
       ============================================ */
    function toggleTheme() {
        setTheme(!isNight, true);
    }

    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleTheme();
    });

    /* ============================================
       KEYBOARD SUPPORT
       ============================================ */
    toggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
        }
    });

    /* ============================================
       GESTURE SUPPORT — Swipe to Toggle
       ============================================ */
    var touchStartX = 0;
    var touchStartY = 0;
    var isSwiping = false;
    var SWIPE_THRESHOLD = 30;

    toggle.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = true;
        toggle.classList.add('swiping');
    }, { passive: true });

    toggle.addEventListener('touchmove', function(e) {
        if (!isSwiping) return;
        var dx = e.touches[0].clientX - touchStartX;
        var progress = Math.max(-1, Math.min(1, dx / 80));
        var dragOffset = progress * 6;
        iconBtn.style.transform = isNight
            ? 'translateX(calc(var(--slide-distance) + ' + dragOffset + 'px))'
            : 'translateX(' + dragOffset + 'px)';
    }, { passive: true });

    toggle.addEventListener('touchend', function(e) {
        if (!isSwiping) return;
        isSwiping = false;
        toggle.classList.remove('swiping');
        iconBtn.style.transform = '';

        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;
        var absDx = Math.abs(dx);
        var absDy = Math.abs(dy);

        if (absDx > SWIPE_THRESHOLD && absDx > absDy) {
            if (dx > 0 && !isNight) {
                setTheme(true, true);
            } else if (dx < 0 && isNight) {
                setTheme(false, true);
            }
        }
    }, { passive: true });

    /* ============================================
       PAGE LOAD SEQUENCE — Staggered Entrance
       ============================================ */
    function pageLoadSequence() {
        var hour = new Date().getHours();
        var autoNight = hour >= 19 || hour < 7;

        setTheme(autoNight, false);

        if (autoNight) {
            dayText.className = 'toggle-label-text hidden';
            nightText.className = 'toggle-label-text visible';
            iconPath.setAttribute('d', SUN_PATH);
            icon.setAttribute('width', '18');
            icon.setAttribute('height', '18');
        } else {
            dayText.className = 'toggle-label-text visible';
            nightText.className = 'toggle-label-text hidden';
            iconPath.setAttribute('d', MOON_PATH);
            icon.setAttribute('width', '16');
            icon.setAttribute('height', '16');
        }

        setTimeout(function() {
            toggle.classList.add('entered');
        }, TIMING.loadDelay);
    }

    if (document.readyState === 'complete') {
        pageLoadSequence();
    } else {
        window.addEventListener('load', pageLoadSequence);
    }

})();/* ===== Portfolio 2026 — script.js ===== */

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
