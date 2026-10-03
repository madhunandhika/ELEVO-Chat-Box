# ELEVO – AI Chatbot

## Introduction
ELEVO is a web-based AI chatbot that answers study, coding and everyday questions. It works **offline** using a built-in knowledge base, and gives **real AI answers** when a free Google Gemini key is added. The project has three pages: a product landing page, a registration form with real-time validation, and the chat app with saved chat history.

It is built with raw HTML, CSS and JavaScript only. No Bootstrap, Tailwind or any other UI framework is used.

**Live demo:** `https://YOUR-USERNAME.github.io/elevo-chatbot/` (replace with your GitHub Pages link)

**Full documentation:** see [DOCUMENTATION.md](DOCUMENTATION.md) for how every part works, test results and the requirements checklist.

## Screenshots

### 1. Product landing page (Flexbox + Grid + dark/light mode)
| Light mode | Dark mode | Mobile |
| --- | --- | --- |
| ![Landing page light](screenshots/landing-light.png) | ![Landing page dark](screenshots/landing-dark.png) | ![Landing page mobile](screenshots/landing-mobile.png) |

### 2. Registration form (CSS animations + real-time validation)
| Errors on submit | Checking while typing | Success |
| --- | --- | --- |
| ![Form errors](screenshots/register-errors.png) | ![Real-time validation](screenshots/register-typing.png) | ![Registration success](screenshots/register-success.png) |

### 3. Chat app
| Desktop | Dark mode | Mobile |
| --- | --- | --- |
| ![Chat desktop](screenshots/chat-desktop.png) | ![Chat dark](screenshots/chat-dark.png) | ![Chat mobile](screenshots/chat-mobile.png) |

## Features

**Product landing page (`index.html`)**
- Navbar, hero section, buttons and footer built with **CSS Flexbox**
- Features, "How it works" and "Modes" sections built with **CSS Grid**
- **Dark/light mode toggle** using CSS variables and JavaScript, remembered on every page
- Mobile-first layout with media queries at 600px, 768px and 1024px
- Hover transitions on cards and buttons

**Registration form (`register.html`)**
- **Real-time client-side validation** on every keystroke (`input` event)
- Checks name, email, 10-digit phone, role, password rules, matching passwords and the terms box
- Password strength meter and live rule checklist
- Show/hide password button and a "fields complete" counter
- **CSS animations:** form slide-up, floating labels, shake on invalid fields, pop-in ✓/! icons, growing strength bar, loading spinner, and a self-drawing success tick
- The password is never stored

**Chat app (`chat.html`)**
- Offline mode with 60+ topics, maths, percentages, unit conversions, time and date
- AI mode with Google Gemini (free key) or Anthropic Claude, with automatic offline fallback
- **Image generation:** type "draw a cat astronaut" or turn on the **Image** button to create pictures, with download and "make another" buttons. Uses a free service with no key, or Google Gemini with your key (needs internet)
- Chat history sidebar: chats grouped by date, with search, rename and delete
- Greets the registered user by name
- Typing animation, stop button, new chat button, dark/light mode

## Technologies Used
- HTML5 (semantic tags: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`)
- CSS3 (Flexbox, Grid, CSS variables, media queries, transitions, `@keyframes` animations)
- JavaScript (DOM, events, regular expressions, `fetch`, `async/await`, `localStorage`)
- Node.js + Express (optional server that hides the API key)

## Project Structure
```
elevo-chatbot/
├── index.html          # Product landing page
├── register.html       # Registration form
├── chat.html           # ELEVO chatbot
├── style.css           # All styles: colours, dark mode, landing, form, chat
├── script.js           # All JavaScript: dark mode, validation, chatbot, images
├── server.js           # Optional Node.js server (keeps the API key secret)
├── package.json        # Server dependencies
├── .env.example        # Template for the server API key
├── .gitignore          # Keeps .env and node_modules off GitHub
├── .nojekyll           # Tells GitHub Pages to publish files as they are
├── screenshots/        # Screenshots used in the README
├── README.md           # Project overview
└── DOCUMENTATION.md    # Full project documentation
```

### How the files work together
- Every page links the same `style.css` and `script.js`.
- Each page's `<body>` has a class (`page-landing`, `page-register`, `page-chat`), and the CSS for that page starts with that class, so styles never mix between pages.
- `script.js` is split into 5 parts. Each part checks which page it is on and only runs where it's needed.

## Installation
1. Download or clone this repository.
2. Open the project folder.
3. Open `index.html` in Chrome or Edge.

No installation is needed for the website. The server is optional:
1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and add your API key.
4. Run `npm start` and open http://localhost:3000

## Usage
1. Open the landing page and click **Create free account**.
2. Fill in the registration form. Fix any red fields, then click **Create account**.
3. Click **Start chatting**. ELEVO greets you by name.
4. Ask a question, for example "flexbox vs grid", "15% of 2000" or "10 km to miles".
5. For answers on any topic, click the gear icon, choose **Google Gemini**, and paste a free key from https://aistudio.google.com/apikey
6. To create a picture, type something like "draw a robot reading a book", or click the **Image** button and describe what you want.
7. Use the sidebar to open, search, rename or delete old chats.
8. Use the moon/sun button on any page to switch between dark and light mode.

## Changing Dark Mode
- **Switch theme:** click the moon/sun button at the top right of any page. The choice is saved and used on every page.
- **Change the dark colours:** open `style.css` and edit the values under `:root[data-theme="dark"]` near the top. For example, change `--bg` for the page background or `--brand` for the button colour.
- **Change the light colours:** edit the values under `:root` just above it.
- **How it works:** Part 1 of `script.js` sets `data-theme="dark"` or `"light"` on the page and saves it in `localStorage`.

## Activity Requirements Checklist

**Question 1: Product landing page using CSS3 Flexbox and Grid with dark/light mode toggle**
- [x] Product landing page for ELEVO (`index.html`)
- [x] Flexbox: navbar, hero, buttons, preview chat, footer
- [x] Grid: features (1 → 2 → 3 columns), steps and modes (1 → 3 columns)
- [x] Dark/light mode toggle with CSS variables, saved in `localStorage`

**Question 2: Interactive registration form with CSS animations and real-time client-side validation**
- [x] Registration form (`register.html`) with 7 validated fields
- [x] Real-time validation using the `input` event and regular expressions
- [x] 7 CSS animations using `@keyframes` and transitions
- [x] Submission blocked until every field is valid

**Unit 2 manual rules**
- [x] Raw HTML, CSS and JavaScript; no Bootstrap, Tailwind or other UI framework
- [x] Mobile layout written first, then `min-width` media queries for larger screens
- [x] Tested at 320px, 375px, 425px, 768px, 1024px and 1440px with no horizontal scrolling
- [x] README with Introduction, Features, Technologies Used, Installation, Usage and Future Enhancements
- [x] Ready for GitHub Pages (`index.html` in the root folder)

## Future Enhancements
- Save accounts and chats in a cloud database so they sync across devices
- Login page with secure server-side password storage
- Voice input and spoken replies
- Mobile app version
- More topics in the offline knowledge base
