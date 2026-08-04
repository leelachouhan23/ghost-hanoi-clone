(function () {
    'use strict';

    /* ── 1. Hero Slider ──────────────────────────── */
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 0) {
        let currentSlide = 0;
        
        // Ensure first slide is visible even if handlebars logic fails
        if (!document.querySelector('.hero-slide.is-active')) {
            heroSlides[0].classList.add('is-active');
        }

        const nextBtn = document.getElementById('hero-next');
        const prevBtn = document.getElementById('hero-prev');
        const dots = document.querySelectorAll('.hero-dot');
        
        if (dots.length > 0 && !document.querySelector('.hero-dot.is-active')) {
            dots[0].classList.add('is-active');
        }

        const goToSlide = (index, direction) => {
            const currentEl = heroSlides[currentSlide];
            currentEl.classList.remove('is-active');
            
            // Add leaving direction
            if (direction === 'left') currentEl.classList.add('is-leaving-left');
            if (direction === 'right') currentEl.classList.add('is-leaving-right');
            
            // Clean up leaving classes after transition finishes
            setTimeout(() => {
                currentEl.classList.remove('is-leaving-left', 'is-leaving-right');
            }, 600);
            
            if (dots[currentSlide]) dots[currentSlide].classList.remove('is-active');
            
            currentSlide = (index + heroSlides.length) % heroSlides.length;
            const newEl = heroSlides[currentSlide];

            if (direction === 'right') {
                newEl.classList.add('is-entering-left');
                // Force reflow to apply the non-transitioned left position
                void newEl.offsetWidth;
                newEl.classList.remove('is-entering-left');
            }
            
            // Add new active element
            newEl.classList.add('is-active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('is-active');
        };
        
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1, 'left'));
        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1, 'right'));
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (index > currentSlide) goToSlide(index, 'left');
                else if (index < currentSlide) goToSlide(index, 'right');
            });
        });

        // Swipe & Drag Support
        const heroSlider = document.getElementById('hero-slider');
        let startX = 0;
        let isDragging = false;

        const handleSwipe = (endX) => {
            const threshold = 50;
            if (startX - endX > threshold) {
                goToSlide(currentSlide + 1, 'left'); // Swipe left -> Next
            } else if (endX - startX > threshold) {
                goToSlide(currentSlide - 1, 'right'); // Swipe right -> Prev
            }
        };

        if (heroSlider) {
            heroSlider.addEventListener('touchstart', e => startX = e.changedTouches[0].screenX, { passive: true });
            heroSlider.addEventListener('touchend', e => handleSwipe(e.changedTouches[0].screenX), { passive: true });

            heroSlider.addEventListener('mousedown', e => {
                isDragging = true;
                startX = e.clientX;
                heroSlider.style.cursor = 'grabbing';
            });
            heroSlider.addEventListener('mouseup', e => {
                if (!isDragging) return;
                isDragging = false;
                heroSlider.style.cursor = 'default';
                handleSwipe(e.clientX);
            });
            heroSlider.addEventListener('mouseleave', () => {
                if (isDragging) {
                    isDragging = false;
                    heroSlider.style.cursor = 'default';
                }
            });
        }
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

    /* ── 5. Dynamic Dropdown Links Filter & Image Swap ────────────── */
    // Process Archive Dropdown Links
    const archiveLinksContainer = document.querySelector('.dropdown-links-archive');
    if (archiveLinksContainer) {
        const megaImage = archiveLinksContainer.closest('.mega-menu-dropdown').querySelector('.mega-menu-image img');
        const defaultImageSrc = megaImage ? megaImage.src : '';

        archiveLinksContainer.querySelectorAll('.nav-item').forEach(item => {
            const link = item.querySelector('a');
            if (link && !link.textContent.includes('[Archive]')) {
                item.remove();
            } else if (link) {
                let text = link.textContent.replace('[Archive]', '').trim();
                let parts = text.split('|');
                link.textContent = parts[0].trim();
                
                if (parts.length > 1 && megaImage) {
                    let hoverImgUrl = parts[1].trim();
                    item.addEventListener('mouseenter', () => megaImage.src = hoverImgUrl);
                    item.addEventListener('mouseleave', () => megaImage.src = defaultImageSrc);
                }
            }
        });
        archiveLinksContainer.style.visibility = 'visible';
    }

    // Process Post Layouts Dropdown Links
    const layoutLinksContainer = document.querySelector('.dropdown-links-layout');
    if (layoutLinksContainer) {
        const megaImage = layoutLinksContainer.closest('.mega-menu-dropdown').querySelector('.mega-menu-image img');
        const defaultImageSrc = megaImage ? megaImage.src : '';

        layoutLinksContainer.querySelectorAll('.nav-item').forEach(item => {
            const link = item.querySelector('a');
            if (link && !link.textContent.includes('[Layout]')) {
                item.remove();
            } else if (link) {
                let text = link.textContent.replace('[Layout]', '').trim();
                let parts = text.split('|');
                link.textContent = parts[0].trim();
                
                if (parts.length > 1 && megaImage) {
                    let hoverImgUrl = parts[1].trim();
                    item.addEventListener('mouseenter', () => megaImage.src = hoverImgUrl);
                    item.addEventListener('mouseleave', () => megaImage.src = defaultImageSrc);
                }
            }
        });
        layoutLinksContainer.style.visibility = 'visible';
    }

})();
