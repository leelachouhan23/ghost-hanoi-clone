document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════
  // 1. Post card video preview on hover
  // ═══════════════════════════════════════════════════════════════════════
  function setupCards(cards) {
    cards.forEach(function (card) {
      let playBtn = card.querySelector('.post-card-play-button');
      let videoEl = card.querySelector('.post-card-video');
      let isLoaded = false;
      let isFetching = false;

      function ensurePlayButton() {
        if (!playBtn) {
          playBtn = document.createElement('div');
          playBtn.className = 'post-card-play-button';
          playBtn.innerHTML =
            '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">' +
            '<path d="M8 5v14l11-7z"/></svg>';
          card.appendChild(playBtn);
        }
      }

      function playVideo(v) {
        if (!v) return;
        v.play().then(function () {
          card.classList.add('is-playing');
        }).catch(function (err) {
          console.log('Video play error:', err);
        });
      }

      function pauseVideo(v) {
        if (!v) return;
        v.pause();
        try { v.currentTime = 0; } catch (e) {}
        card.classList.remove('is-playing');
      }

      function createVideoEl(src) {
        var v = document.createElement('video');
        v.className = 'post-card-video';
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.src = src;
        card.appendChild(v);
        return v;
      }

      function fetchAndSetup(autoPlay) {
        var postUrl = card.getAttribute('href');
        if (!postUrl || isLoaded || isFetching) return;

        isFetching = true;
        fetch(postUrl)
          .then(function (res) { return res.text(); })
          .then(function (html) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');

            // Try native HTML5 <video> sources (Ghost video card uploads)
            var selectors = [
              '.kg-video-card video source',
              '.kg-video-card video',
              '.post-full-body video source',
              '.post-full-body video',
              'video source',
              'video'
            ];
            var found = null;
            for (var i = 0; i < selectors.length; i++) {
              found = doc.querySelector(selectors[i]);
              if (found) break;
            }

            var src = found && (found.src || found.getAttribute('src'));

            // If no native video, check for a YouTube/Vimeo iframe
            // so we can at least show the play button
            if (!src) {
              var iframe = doc.querySelector('.kg-embed-card iframe, iframe[src*="youtube"], iframe[src*="vimeo"]');
              if (iframe) {
                // Show play button only, no hover-play for embeds
                ensurePlayButton();
                isLoaded = true;
              }
              return;
            }

            // Native video found
            ensurePlayButton();
            if (!videoEl) {
              videoEl = createVideoEl(src);
            }
            isLoaded = true;
            if (autoPlay && card.matches(':hover')) {
              playVideo(videoEl);
            }
          })
          .catch(function (err) {
            console.error('Error loading video preview:', err);
          })
          .finally(function () {
            isFetching = false;
          });
      }

      // Kick off prefetch for every card on page load
      fetchAndSetup(false);

      card.addEventListener('mouseenter', function () {
        videoEl = card.querySelector('.post-card-video');

        // Already has video element ready
        if (videoEl && videoEl.src) {
          playVideo(videoEl);
          return;
        }

        // Fallback: fetch if not yet done
        fetchAndSetup(true);
      });

      card.addEventListener('mouseleave', function () {
        videoEl = card.querySelector('.post-card-video');
        pauseVideo(videoEl);
      });
    });
  }

  // Initialize all visible cards on page load
  setupCards(document.querySelectorAll('.post-card-image-link'));

  // ═══════════════════════════════════════════════════════════════════════
  // 2. Load more (append posts without page navigation)
  // ═══════════════════════════════════════════════════════════════════════
  var grid = document.querySelector('.post-grid');
  var wrap = document.querySelector('.load-more-wrap');

  if (grid && wrap) {
    wrap.addEventListener('click', function (e) {
      var loadMoreLink = e.target.closest('.load-more');
      if (!loadMoreLink) return;
      e.preventDefault();

      var url = loadMoreLink.getAttribute('href');
      var originalText = loadMoreLink.textContent;
      loadMoreLink.textContent = 'Loading...';
      loadMoreLink.classList.add('is-loading');

      fetch(url)
        .then(function (res) { return res.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');

          // Gather new cards, append them, then set up hover-video for them
          var newCards = doc.querySelectorAll('.post-grid .post-card');
          var newImageLinks = [];
          newCards.forEach(function (post) {
            grid.appendChild(post);
            var imgLink = post.querySelector('.post-card-image-link');
            if (imgLink) newImageLinks.push(imgLink);
          });
          setupCards(newImageLinks);

          // Update or remove the load-more button
          var newLoadMore = doc.querySelector('.load-more');
          if (newLoadMore) {
            loadMoreLink.setAttribute('href', newLoadMore.getAttribute('href'));
            loadMoreLink.textContent = originalText;
            loadMoreLink.classList.remove('is-loading');
          } else {
            wrap.remove();
          }
        })
        .catch(function (err) {
          loadMoreLink.textContent = originalText;
          loadMoreLink.classList.remove('is-loading');
          console.error('Failed to load more posts:', err);
        });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 3. Hero Slider
  // ═══════════════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════════════
  // 4. Brand Image Insertion
  // ═══════════════════════════════════════════════════════════════════════
  const brandText = document.getElementById('brand-statement-text');
  if (brandText) {
    const imageUrl = brandText.getAttribute('data-image');
    const brandHtml = brandText.innerHTML;
    // Replace [IMAGE] with actual image tag
    if (brandHtml.includes('[IMAGE]')) {
      brandText.innerHTML = brandHtml.replace('[IMAGE]', `<img src="${imageUrl}" class="brand-text-image" alt="Brand Image">`);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 5. Tags Carousel Scroll
  // ═══════════════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════════════
  // 6. Ghost subscribe form state feedback
  // ═══════════════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════════════
  // 7. Dynamic Dropdown Links Filter & Image Swap
  // ═══════════════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════════════
  // 8. Mobile Menu Toggle
  // ═══════════════════════════════════════════════════════════════════════
  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      document.body.classList.toggle('is-menu-open');
    });
  }

});
