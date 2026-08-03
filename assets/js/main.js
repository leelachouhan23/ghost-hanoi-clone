(function () {
    'use strict';

    /* ── 1. Hero Slider ──────────────────────────── */
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 1) {
        let currentSlide = 0;
        const nextBtn = document.getElementById('hero-next');
        const prevBtn = document.getElementById('hero-prev');
        const dots = document.querySelectorAll('.hero-dot');
        
        const goToSlide = (index) => {
            heroSlides[currentSlide].classList.remove('is-active');
            if (dots[currentSlide]) dots[currentSlide].classList.remove('is-active');
            
            currentSlide = (index + heroSlides.length) % heroSlides.length;
            
            heroSlides[currentSlide].classList.add('is-active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('is-active');
        };
        
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });
    }

    /* ── 2. Brand Image Insertion ─────────────────────────────── */
    const brandText = document.getElementById('brand-statement-text');
    if (brandText) {
        const imageUrl = brandText.getAttribute('data-image');
        const html = brandText.innerHTML;
        // Replace [IMAGE] with actual image tag
        if (html.includes('[IMAGE]')) {
            brandText.innerHTML = html.replace('[IMAGE]', `<img src="${imageUrl}" class="brand-text-image" alt="Brand Image">`);
        }
    }

    /* ── 3. Tags Carousel Scroll ────────────────────────── */
    const tagsSlider = document.getElementById('tags-slider');
    const tagsNext = document.getElementById('tags-next');
    const tagsPrev = document.getElementById('tags-prev');
    if (tagsSlider && tagsNext && tagsPrev) {
        const scrollAmount = 300;
        tagsNext.addEventListener('click', () => {
            tagsSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        tagsPrev.addEventListener('click', () => {
            tagsSlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    /* ── 4. Ghost subscribe form state feedback ────────────── */
    document.querySelectorAll('[data-members-form]').forEach(form => {
        const successMsg = form.querySelector('.message-success');
        const errorMsg = form.querySelector('.message-error');
        
        if (successMsg) successMsg.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';

        form.addEventListener('submit', () => {
            if (successMsg) successMsg.style.display = 'none';
            if (errorMsg) errorMsg.style.display = 'none';
        });

        form.addEventListener('success', () => {
            if (successMsg) successMsg.style.display = 'block';
            const input = form.querySelector('[data-members-email]');
            if (input) input.value = '';
        });

        form.addEventListener('error', () => {
            if (errorMsg) errorMsg.style.display = 'block';
        });
    });

})();
