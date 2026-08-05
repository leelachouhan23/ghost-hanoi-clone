document.addEventListener('DOMContentLoaded', function () {

  // ─── Video preview on hover ───────────────────────────────────────────────
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


  // ─── Load more (append posts without page navigation) ────────────────────
  var grid = document.querySelector('.post-grid');
  var wrap = document.querySelector('.load-more-wrap');

  if (grid && wrap) {
    wrap.addEventListener('click', function (e) {
      var link = e.target.closest('.load-more');
      if (!link) return;
      e.preventDefault();

      var url = link.getAttribute('href');
      var originalText = link.textContent;
      link.textContent = 'Loading...';
      link.classList.add('is-loading');

      fetch(url)
        .then(function (res) { return res.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');

          // Gather new cards, append them, then set up hover-video for them
          var newCards = doc.querySelectorAll('.post-grid .post-card');
          var newImageLinks = [];
          newCards.forEach(function (post) {
            grid.appendChild(post);
            var link = post.querySelector('.post-card-image-link');
            if (link) newImageLinks.push(link);
          });
          setupCards(newImageLinks);

          // Update or remove the load-more button
          var newLoadMore = doc.querySelector('.load-more');
          if (newLoadMore) {
            link.setAttribute('href', newLoadMore.getAttribute('href'));
            link.textContent = originalText;
            link.classList.remove('is-loading');
          } else {
            wrap.remove();
          }
        })
        .catch(function (err) {
          link.textContent = originalText;
          link.classList.remove('is-loading');
          console.error('Failed to load more posts:', err);
        });
    });
  }

});
