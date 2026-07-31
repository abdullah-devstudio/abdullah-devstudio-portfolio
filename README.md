<<<<<<< HEAD
# Abdullah Dev Studio — Portfolio (Static HTML Version)

Pure HTML + Tailwind CSS CDN + Vanilla JavaScript — ready to deploy on GitHub Pages or any static host.

---

## 📁 File Structure

```
portfolio-static/
├── index.html        ← Main home page (Hero, About, Services, Projects, Contact, Footer)
├── projects.html     ← Full projects listing page
├── cv.html           ← Printable CV / Resume page
├── style.css         ← Custom styles (CSS variables, animations, theming)
├── app.js            ← All JavaScript (theme, language, typing, animations, form)
├── assets/
│   ├── logo.png      ← AD logo mark (navbar + footer)
│   └── profile.jpg   ← Profile photo (hero + CV)
└── README.md
```

---

## ✨ Features

| Feature | Details |
|---|---|
| 🌙 Dark / Light theme | Persisted to `localStorage`, toggled via sun/moon button |
| 🌐 English / Urdu toggle | Full translations, RTL layout, Noto Nastaliq Urdu font |
| ⌨️ Typing animation | Professional role phrases, pure JS, no libraries |
| 📱 Responsive | Mobile-first, hamburger menu on small screens |
| 🎞️ Scroll animations | IntersectionObserver, no CSS framework dependencies |
| 📄 CV page | Clean printable resume, Ctrl+P → Save as PDF |
| 🗂️ Multi-page | Home → `index.html`, Projects → `projects.html`, CV → `cv.html` |

---

## 🚀 Deploy on GitHub Pages

1. Create a new GitHub repository (e.g. `portfolio`)
2. Upload **all files** in this folder to the **root** of the repo
3. Go to **Settings → Pages → Source → main branch / root**
4. Your site will be live at `https://your-username.github.io/portfolio/`

> ⚠️ Make sure `assets/logo.png` and `assets/profile.jpg` are uploaded — the pages reference them by relative path.

---

## 🖥️ Run Locally

Just open `index.html` in any browser — no build step, no server required.

```bash
# Optional: use a local server for best results
npx serve .
# or
python -m http.server 8080
```

---

## 🎨 Customise

### Change accent colour
Edit `style.css` — update `--primary` in `:root` (light) and `html.dark` (dark):
```css
:root     { --primary: #15803D; }
html.dark { --primary: #22C55E; }
```

### Update content / translations
Edit the `TRANSLATIONS` object at the top of `app.js`. Both `en` and `ur` keys are there.

### Add a new project
Add a new card in `projects.html` following the pattern of the existing cards.

---

Built with ❤️ by Muhammad Abdullah Khan
=======
# abdullah-devstudio-portfolio
A modern and responsive portfolio project built with HTML, CSS, JavaScript, and Firebase. It highlights my frontend development skills, clean code practices, and ability to create user-friendly interfaces with real-world project implementations.
>>>>>>> cf936123c5939c3be47b12ece2019498983ca007
