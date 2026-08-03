/**
 * ghost-hanoi-clone / assets/js/main.js
 * Lightweight vanilla JS — no framework.
 * Handles:
 *   1. Sticky header scroll shadow
 *   2. Mobile nav toggle (hamburger)
 *   3. Scroll-reveal animation (IntersectionObserver)
 *   4. Ghost native subscribe form state feedback
 */

(function () {
    'use strict';

    /* ── 1. Sticky header shadow ──────────────────────────── */
    const header = document.querySelector('.site-header');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 20);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ── 2. Mobile nav toggle ─────────────────────────────── */
    const navToggle = document.getElementById('nav-toggle');
    const primaryNav = document.getElementById('primary-nav');
    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            primaryNav.classList.toggle('is-open', !expanded);
        });

        // Close nav when a link is clicked
        primaryNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                primaryNav.classList.remove('is-open');
            });
        });

        // Close nav on outside click
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target)) {
                navToggle.setAttribute('aria-expanded', 'false');
                primaryNav.classList.remove('is-open');
            }
        });
    }

    /* ── 3. Scroll-reveal with IntersectionObserver ────────── */
    if ('IntersectionObserver' in window) {
        const revealTargets = [
            '.hanoi-hero__secondary-card',
            '.hanoi-latest__card',
            '.hanoi-brand__content',
            '.hanoi-pick__content',
            '.hanoi-pick__image-wrap',
            '.hanoi-newsletter__content',
        ];

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealTargets.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, i) => {
                el.classList.add('reveal-element');
                el.style.transitionDelay = `${i * 60}ms`;
                observer.observe(el);
            });
        });
    }

    /* ── 4. Ghost subscribe form state feedback ────────────── */
    document.querySelectorAll('[data-members-form]').forEach(form => {
        form.addEventListener('submit', () => {
            form.classList.remove('success', 'error');
        });

        // Ghost dispatches these custom events on the form element
        form.addEventListener('success', () => {
            form.classList.add('success');
            const input = form.querySelector('[data-members-email]');
            if (input) input.value = '';
        });

        form.addEventListener('error', () => {
            form.classList.add('error');
        });
    });

})();
