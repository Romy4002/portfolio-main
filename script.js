/* ============================================
   Portfolio Interactions
   ============================================ */

(function() {
    'use strict';

    /* ─── CUSTOM CURSOR ─── */
    const dot = document.getElementById('cursor-dot');
    const circle = document.getElementById('cursor-circle');
    let mouseX = 0,
        mouseY = 0;
    let dotX = 0,
        dotY = 0;
    let circleX = 0,
        circleY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        dotX += (mouseX - dotX) * 0.8;
        dotY += (mouseY - dotY) * 0.8;
        dot.style.left = dotX + 'px';
        dot.style.top = dotY + 'px';

        circleX += (dotX - circleX) * 0.15;
        circleY += (dotY - circleY) * 0.15;
        circle.style.left = circleX + 'px';
        circle.style.top = circleY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover detection for interactive elements
    const hoverTargets = document.querySelectorAll(
        'a, button:not(#back-to-top), .btn:not(#back-to-top), .project__img-wrap, .skill, .nav__link, .contact__email'
    );
    hoverTargets.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hovering');
            circle.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hovering');
            circle.classList.remove('hovering');
        });
    });



    /* ─── SCROLL REVEAL (IntersectionObserver) ─── */
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        }
    );
    reveals.forEach((el) => revealObserver.observe(el));

    /* ─── NAVBAR SCROLL EFFECT ─── */
    const nav = document.getElementById('main-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;

        // Nav style
        if (y > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }



        lastScroll = y;
    }, {
        passive: true
    });

    /* ─── SMOOTH SCROLL (LENIS) ─── */
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Update smooth scroll for nav links to use Lenis
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    lenis.scrollTo(target);
                }
            });
        });
    } else {
        // Fallback if Lenis fails to load
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /* ─── ACTIVE NAV LINK ON SCROLL ─── */
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    const linkObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    navLinks.forEach((l) => l.classList.remove('nav__link--active'));
                    const active = document.querySelector(
                        `.nav__link[href="#${entry.target.id}"]`
                    );
                    if (active) active.classList.add('nav__link--active');
                }
            });
        }, {
            threshold: 0.3
        }
    );
    sections.forEach((s) => linkObserver.observe(s));

    /* ─── HERO ORB MOUSE PARALLAX ─── */
    const heroOrbs = document.querySelectorAll('.bg-orbs__orb');
    window.addEventListener('mousemove', (e) => {
        const cx = (e.clientX / window.innerWidth - 0.5) * 2;
        const cy = (e.clientY / window.innerHeight - 0.5) * 2;
        heroOrbs.forEach((orb, i) => {
            const speed = (i + 1) * 18;
            orb.style.transform = `translate(${cx * speed}px, ${cy * speed}px)`;
        });
    }, {
        passive: true
    });



    /* ─── MAGNETIC PULL ON BUTTONS ─── */
    const magneticEls = document.querySelectorAll('.btn, .nav__link, .footer__social');
    magneticEls.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const dx = e.clientX - (rect.left + rect.width / 2);
            const dy = e.clientY - (rect.top + rect.height / 2);
            el.style.transform = `translate(${dx * 0.2}px, ${dy * 0.2}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    /* ─── SUBTLE TECHNICAL GRID BACKGROUND ─── */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let crosses = [];
        const spacing = 70;
        let time = 0;

        const SHAPES = ['circle', 'cross', 'triangle', 'square', 'diamond'];

        function initGrid() {
            crosses = [];
            for (let x = 0; x < width + spacing; x += spacing) {
                for (let y = 0; y < height + spacing; y += spacing) {
                    crosses.push({
                        base_x: x,
                        base_y: y,
                        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
                        rotation: Math.random() * Math.PI * 2,
                        rotSpeed: (Math.random() - 0.5) * 0.015
                    });
                }
            }
        }

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initGrid();
        }
        window.addEventListener('resize', resize);
        resize();

        function animateGrid() {
            ctx.clearRect(0, 0, width, height);
            time += 0.005; // Slower time step

            crosses.forEach(c => {
                let dx = mouseX - c.base_x;
                let dy = mouseY - c.base_y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                let glow = 0;
                if (dist < 200) {
                    glow = Math.pow(1 - (dist / 200), 1.5);
                }

                // Slower gentle wavy movement
                let waveX = Math.sin(c.base_y * 0.005 + time) * 8;
                let waveY = Math.cos(c.base_x * 0.005 + time) * 8;

                let finalX = c.base_x + waveX;
                let finalY = c.base_y + waveY;

                let alpha = 0.06 + (glow * 0.35);

                ctx.beginPath();
                ctx.strokeStyle = `rgba(132, 85, 239, ${alpha})`;
                ctx.lineWidth = 1.2;

                let size = 4 + (glow * 2);
                c.rotation += c.rotSpeed;

                ctx.save();
                ctx.translate(finalX, finalY);
                ctx.rotate(c.rotation);

                switch (c.shape) {
                    case 'circle':
                        ctx.arc(0, 0, size, 0, Math.PI * 2);
                        break;
                    case 'cross': // X shape
                        ctx.moveTo(-size, -size);
                        ctx.lineTo(size, size);
                        ctx.moveTo(size, -size);
                        ctx.lineTo(-size, size);
                        break;
                    case 'triangle':
                        ctx.moveTo(0, -size);
                        ctx.lineTo(size, size);
                        ctx.lineTo(-size, size);
                        ctx.closePath();
                        break;
                    case 'square':
                        ctx.rect(-size, -size, size * 2, size * 2);
                        break;
                    case 'diamond':
                        ctx.moveTo(0, -size * 1.2);
                        ctx.lineTo(size * 1.2, 0);
                        ctx.lineTo(0, size * 1.2);
                        ctx.lineTo(-size * 1.2, 0);
                        ctx.closePath();
                        break;
                }

                ctx.stroke();
                ctx.restore();
            });
            requestAnimationFrame(animateGrid);
        }
        animateGrid();
    }





    /* ─── BACK TO TOP BUTTON ─── */
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTop.style.opacity = '1';
                backToTop.style.pointerEvents = 'all';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.pointerEvents = 'none';
            }
        }, {
            passive: true
        });

        backToTop.addEventListener('click', () => {
            if (lenis) {
                lenis.scrollTo(0);
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

})();
    /* --- THEME TOGGLE --- */
    const themeToggle = document.querySelector('.nav__logo');
    const navLogoImg = document.querySelector('.nav__logo-img');
    
    // Check local storage for theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.documentElement.classList.add('dark-theme');
        if (navLogoImg) navLogoImg.src = 'assets/logo_dark.svg';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('dark-theme');
            document.documentElement.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
                if (navLogoImg) navLogoImg.src = 'assets/logo_dark.svg';
            } else {
                localStorage.setItem('theme', 'light');
                if (navLogoImg) navLogoImg.src = 'assets/logo.svg';
            }
        });
    }
