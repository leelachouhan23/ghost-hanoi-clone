/* Color Picker & Theme Customizer JavaScript */

(function() {
    function initColorPicker() {
        const trigger = document.getElementById('colorPickerTrigger');
        const triggerText = document.getElementById('colorTriggerText');
        const popover = document.getElementById('colorPickerPopover');
        const pickerBg = document.getElementById('pickerBg');
        const pickerText = document.getElementById('pickerText');
        const pickerAccent = document.getElementById('pickerAccent');
        const hexBg = document.getElementById('hexBg');
        const hexText = document.getElementById('hexText');
        const hexAccent = document.getElementById('hexAccent');
        const presetBtns = document.querySelectorAll('.color-preset-item');

        function applyColors(bg, text, accent, save = true) {
            document.documentElement.style.setProperty('--color-bg', bg);
            document.documentElement.style.setProperty('--color-text', text);
            document.documentElement.style.setProperty('--color-accent', accent);

            let dynamicStyle = document.getElementById('dynamic-theme-style');
            if (!dynamicStyle) {
                dynamicStyle = document.createElement('style');
                dynamicStyle.id = 'dynamic-theme-style';
                document.head.appendChild(dynamicStyle);
            }

            dynamicStyle.innerHTML = `
                :root {
                    --color-bg: ${bg} !important;
                    --color-text: ${text} !important;
                    --color-accent: ${accent} !important;
                }
                body, html {
                    background-color: ${bg} !important;
                    color: ${text} !important;
                }
                a {
                    color: ${accent} !important;
                }
                .post-card {
                    background-color: ${bg} !important;
                    border-color: rgba(128,128,128,0.2) !important;
                }
                .post-card-title, .post-card-title a, .post-card-excerpt, .post-card-content-link {
                    color: ${text} !important;
                }
                .post-card-primary-tag {
                    color: ${accent} !important;
                }
                
                /* Standard Non-Hero Header Navigation */
                body:not(.tag-template):not(.page-tag-directory):not(.custom-tag-directory):not(.page-template):not(.author-template) .logo-text,
                body:not(.tag-template):not(.page-tag-directory):not(.custom-tag-directory):not(.page-template):not(.author-template) .header-nav a,
                body:not(.tag-template):not(.page-tag-directory):not(.custom-tag-directory):not(.page-template):not(.author-template) .nav-item > a,
                body:not(.tag-template):not(.page-tag-directory):not(.custom-tag-directory):not(.page-template):not(.author-template) .search-button {
                    color: ${text} !important;
                }

                /* Hero Page Header & Overlay Text (Tag, Tag Directory, Author Pages) Always White by Default */
                .tag-template .logo-text,
                .page-tag-directory .logo-text,
                .custom-tag-directory .logo-text,
                .page-template .logo-text,
                .author-template .logo-text,
                .tag-template .header-nav a,
                .page-tag-directory .header-nav a,
                .custom-tag-directory .header-nav a,
                .page-template .header-nav a,
                .author-template .header-nav a,
                .tag-template .nav-item > a,
                .page-tag-directory .nav-item > a,
                .custom-tag-directory .nav-item > a,
                .page-template .nav-item > a,
                .author-template .nav-item > a,
                .tag-template .search-button,
                .page-tag-directory .search-button,
                .custom-tag-directory .search-button,
                .page-template .search-button,
                .author-template .search-button,
                .archive-title,
                .archive-description {
                    color: #ffffff !important;
                }

                .newsletter-title, .newsletter-option-title, .newsletter-subtitle, .newsletter-option-desc {
                    color: ${text} !important;
                }
                .newsletter-button {
                    background-color: ${accent} !important;
                    color: #ffffff !important;
                }
                .newsletter-checkbox:checked {
                    background-color: ${accent} !important;
                    border-color: ${accent} !important;
                }
                .site-footer, .footer-links a, .footer-social a, .footer-copyright {
                    color: ${text} !important;
                    background-color: ${bg} !important;
                }
            `;

            if (pickerBg) pickerBg.value = bg;
            if (pickerText) pickerText.value = text;
            if (pickerAccent) pickerAccent.value = accent;

            if (hexBg) hexBg.textContent = bg.toUpperCase();
            if (hexText) hexText.textContent = text.toUpperCase();
            if (hexAccent) hexAccent.textContent = accent.toUpperCase();

            if (save) {
                localStorage.setItem('hanoi_theme_colors', JSON.stringify({ bg, text, accent }));
            }
        }

        // Toggle popover visibility
        if (trigger && popover) {
            trigger.addEventListener('click', function(e) {
                e.stopPropagation();
                const isOpen = popover.classList.contains('active');
                if (isOpen) {
                    popover.classList.remove('active');
                    triggerText.textContent = 'Colors';
                } else {
                    popover.classList.add('active');
                    triggerText.textContent = 'Close';
                }
            });

            document.addEventListener('click', function(e) {
                if (!popover.contains(e.target) && !trigger.contains(e.target)) {
                    popover.classList.remove('active');
                    triggerText.textContent = 'Colors';
                }
            });
        }

        // Preset button click listeners
        presetBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                presetBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const bg = this.getAttribute('data-bg');
                const text = this.getAttribute('data-text');
                const accent = this.getAttribute('data-accent');
                applyColors(bg, text, accent);
            });
        });

        // Custom color pickers listeners
        [pickerBg, pickerText, pickerAccent].forEach(picker => {
            if (picker) {
                picker.addEventListener('input', function() {
                    presetBtns.forEach(b => b.classList.remove('active'));
                    const bg = pickerBg.value;
                    const text = pickerText.value;
                    const accent = pickerAccent.value;
                    applyColors(bg, text, accent);
                });
            }
        });

        // Load saved colors on startup
        const saved = localStorage.getItem('hanoi_theme_colors');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.bg && parsed.text && parsed.accent) {
                    applyColors(parsed.bg, parsed.text, parsed.accent, false);
                }
            } catch(e) {}
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initColorPicker);
    } else {
        initColorPicker();
    }
})();
