/* ========================================
   EYON DESIGN 奕云设计工作室
   高级动效交互脚本
   ======================================== */

(function() {
    'use strict';

    // ===== DOM Ready =====
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // ===== 1. Header Scroll Effect =====
    let lastScroll = 0;
    function updateHeader() {
        const scrollY = window.scrollY;
        if (scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    }

    // ===== 2. Mobile Nav Toggle =====
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ===== 3. Smooth Anchor Scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = header.offsetHeight + 20;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ===== 4. Scroll Animation (Intersection Observer) =====
    const animateElements = document.querySelectorAll('[data-animate]');
    const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => animationObserver.observe(el));

    // ===== 5. Counter Animation =====
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        counters.forEach(counter => {
            // Only animate once
            if (counter.dataset.animated === 'true') return;
            counter.dataset.animated = 'true';

            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutExpo
                const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const current = Math.floor(eased * target);
                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            }

            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(update);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.6 });

            counterObserver.observe(counter);
        });
    }

    // ===== 6. Cursor Glow Effect (desktop only) =====
    let cursorGlow = null;
    if (window.matchMedia('(pointer: fine)').matches) {
        cursorGlow = document.createElement('div');
        cursorGlow.className = 'cursor-glow';
        document.body.appendChild(cursorGlow);

        let mouseX = -500, mouseY = -500;
        let currentX = -500, currentY = -500;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            currentX += (mouseX - currentX) * 0.08;
            currentY += (mouseY - currentY) * 0.08;
            if (cursorGlow) {
                cursorGlow.style.left = currentX + 'px';
                cursorGlow.style.top = currentY + 'px';
            }
            requestAnimationFrame(animateCursor);
        }

        // Hide cursor glow on touch devices
        document.addEventListener('touchstart', () => {
            if (cursorGlow) cursorGlow.style.opacity = '0';
        }, { once: true });

        requestAnimationFrame(animateCursor);
    }

    // ===== 7. Tilt effect on hover cards =====
    document.querySelectorAll('.work-card-image, .service-card, .qr-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ===== 9. Active nav link highlight =====
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        const scrollY = window.scrollY + 100;
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollY >= top && scrollY < top + height) {
                current = section.getAttribute('id');
            }
        });
        allNavLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + current) {
                link.style.color = 'var(--accent)';
            }
        });
    }

    // ===== 10. Combined Scroll Handler =====
    function onScroll() {
        updateHeader();
        updateActiveNav();
        animateCounters();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial calls
    updateHeader();
    updateActiveNav();
    animateCounters();

    // ===== 11. Reveal on load =====
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
        // Recheck counters after fonts/images loaded
        animateCounters();
    });

    // ===== 12. Keyboard accessibility =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

})();
