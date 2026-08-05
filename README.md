| Member   | Branch                      | Files                                                                                                            |
| -------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Member 1 | `feature/header`            | `partials/header.hbs`, `assets/css/header.css`                                                                   |
| Member 2 | `feature/hero-slider`       | `partials/hero.hbs`, `assets/css/hero.css`, `assets/js/hero-slider.js`                                           |
| Member 3 | `feature/tags-section`      | `partials/tags-section.hbs`, `assets/css/tags.css`, `assets/js/tags-slider.js`                                   |
| Member 4 | `feature/latest-posts`      | `partials/latest-posts.hbs`, `partials/post-card.hbs`, `assets/css/latest-posts.css`                             |
| Member 5 | `feature/editor-newsletter` | `partials/editor-pick.hbs`, `partials/newsletter.hbs`, `assets/css/editor-pick.css`, `assets/css/newsletter.css` |
| **Me**  | `main`                      | `default.hbs`, `home.hbs`, `latest-post.css`, `variables.css`, merge PRs, testing, responsive fixes                   |



hanoi-clone/
│
├── assets/
│   │
│   ├── css/
│   │   ├── latest-post.css            # Main CSS (imports all CSS files)
│   │   ├── variables.css         # Colors, fonts, spacing
│   │   ├── base.css              # Reset & global styles
│   │   ├── utilities.css         # Common utility classes
│   │   ├── header.css            # Header styles
│   │   ├── hero.css              # Hero slider styles
│   │   ├── tags.css              # Tags section
│   │   ├── latest-posts.css      # Latest stories
│   │   ├── editor-pick.css       # Featured banner
│   │   ├── newsletter.css        # Subscribe section
│   │   ├── footer.css            # Footer
│   │   └── post-card.css         # Reusable post cards
│   │
│   ├── js/
│   │   ├── main.js               # Common JS
│   │   ├── hero-slider.js        # Hero slider
│   │   ├── tag-slider.js         # Tags slider
│   │   ├── search.js             # Search popup
│   │   └── menu.js               # Mobile menu
│   │
│   ├── images/
│   │
│   └── fonts/
│
├── partials/
│   ├── header.hbs
│   ├── hero.hbs
│   ├── tags-section.hbs
│   ├── latest-posts.hbs
│   ├── post-card.hbs
│   ├── editor-pick.hbs
│   ├── newsletter.hbs
│   ├── footer.hbs
│   ├── navigation.hbs
│   └── search-modal.hbs
│
├── default.hbs
├── home.hbs
├── index.hbs
├── post.hbs
├── page.hbs
├── tag.hbs
├── author.hbs
├── error-404.hbs
│
├── package.json
├── routes.yaml
├── README.md
└── LICENSE
