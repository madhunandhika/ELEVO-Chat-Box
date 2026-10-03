/* =========================================================
   ELEVO – all JavaScript in one file
   Part 1: dark/light mode (every page)
   Part 2: offline brain (chat page)
   Part 3: image generation (chat page)
   Part 4: registration form (register.html only)
   Part 5: chatbot (chat.html only)
   ========================================================= */

/* ---------------------------------------------------------
   PART 1 – DARK / LIGHT MODE
   --------------------------------------------------------- */
/* =========================================================
   ELEVO – dark/light mode toggle (shared by every page)
   Loaded in <head> so the saved theme applies before the
   page appears (no white flash in dark mode).
   ========================================================= */
(function () {
    const root = document.documentElement;

    function savedTheme() {
        try { return localStorage.getItem("elevo-theme"); } catch (e) { return null; }
    }

    // 1. Apply the saved theme, or follow the device setting the first time
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", savedTheme() || (prefersDark ? "dark" : "light"));

    // 2. Every button with the class "theme-toggle" switches the theme
    document.addEventListener("click", function (event) {
        const button = event.target.closest(".theme-toggle");
        if (!button) return;
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("elevo-theme", next); } catch (e) {}
    });
})();

/* ---------------------------------------------------------
   PART 2 – OFFLINE BRAIN
   --------------------------------------------------------- */
/* =========================================================
   ELEVO OFFLINE BRAIN
   Works with no internet and no API key.
   - Knowledge base with keyword scoring
   - Remembers your name
   - Maths, percentages and unit conversions
   - Time, date, jokes, quotes and small talk
   To teach ELEVO something new, add an entry to KNOWLEDGE.
   ========================================================= */

const KNOWLEDGE = [
    /* ---------- Web development ---------- */
    { keys: ["html"], answer: "**HTML** (HyperText Markup Language) builds the structure of a webpage using tags.\n\n```html\n<h1>Title</h1>\n<p>A paragraph</p>\n<a href=\"https://example.com\">A link</a>\n```" },
    { keys: ["semantic", "semantic html"], answer: "**Semantic HTML** uses tags that describe their meaning: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`. It helps search engines, screen readers and other developers understand the page." },
    { keys: ["css"], answer: "**CSS** (Cascading Style Sheets) styles a webpage: colors, fonts, spacing and layout.\n\n```css\nh1 {\n  color: navy;\n  font-size: 32px;\n}\n```" },
    { keys: ["javascript", "js"], answer: "**JavaScript** makes webpages interactive: button clicks, form validation, animations and loading data.\n\n```js\ndocument.querySelector(\"button\").addEventListener(\"click\", () => {\n  alert(\"Hello!\");\n});\n```" },
    { keys: ["flexbox", "flex"], answer: "**Flexbox** arranges items in one direction, a row or a column.\n\n```css\n.container {\n  display: flex;\n  justify-content: space-between; /* main axis */\n  align-items: center;            /* cross axis */\n  gap: 20px;\n}\n```\nUse it for navbars, button groups and centering." },
    { keys: ["grid", "css grid"], answer: "**CSS Grid** arranges items in rows and columns at the same time.\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}\n```\nUse it for card layouts, galleries and full page layouts." },
    { keys: ["flexbox vs grid", "difference between flexbox and grid", "grid vs flexbox", "flex and grid"], answer: "**Flexbox vs Grid:**\n\n- Flexbox works in **one direction** (row or column). Best for navbars and small groups.\n- Grid works in **two directions** (rows and columns). Best for card layouts and page structure.\n\nMany pages use both: Grid for the overall layout, Flexbox inside each part." },
    { keys: ["media query", "media queries", "responsive"], answer: "**Responsive design** makes a page work on all screen sizes. A **media query** applies CSS only when a condition is true.\n\n```css\n@media (min-width: 768px) {\n  .cards { flex-direction: row; }\n}\n```\nMobile-first means writing phone styles first, then adding media queries for bigger screens." },
    { keys: ["box model"], answer: "The **CSS box model**: every element is a box made of **content**, **padding** (space inside the border), **border**, and **margin** (space outside the border).\n\nTip: `box-sizing: border-box;` makes width include padding and border." },
    { keys: ["position", "absolute", "relative", "fixed", "sticky"], answer: "**CSS position values:**\n\n- `static`: normal flow (default)\n- `relative`: moves from its normal place\n- `absolute`: placed inside the nearest positioned parent\n- `fixed`: stays in the same spot on screen while scrolling\n- `sticky`: scrolls normally, then sticks at a set point" },
    { keys: ["css variable", "css variables", "custom property"], answer: "**CSS variables** store values you can reuse.\n\n```css\n:root { --main-color: #2f4bff; }\nbutton { background: var(--main-color); }\n```\nThey make dark/light themes easy: change the variables, and the whole page updates." },
    { keys: ["dark mode", "light mode", "theme toggle"], answer: "**Dark/light mode** in 3 steps:\n\n1. Store colors in CSS variables in `:root`.\n2. Give them dark values under `body.dark`.\n3. Toggle the class with JavaScript: `document.body.classList.toggle(\"dark\");`" },
    { keys: ["animation", "keyframes", "transition"], answer: "**CSS transition** smoothly changes between two states (like on hover). **CSS animation** uses `@keyframes` for multi-step motion.\n\n```css\n@keyframes shake {\n  25% { transform: translateX(-5px); }\n  75% { transform: translateX(5px); }\n}\n.error { animation: shake 0.3s; }\n```" },
    { keys: ["form validation", "validation", "validate"], answer: "**Client-side form validation** checks input in the browser before submitting.\n\n```js\nemail.addEventListener(\"input\", () => {\n  const ok = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.value);\n  email.classList.toggle(\"invalid\", !ok);\n});\n```\nThe `input` event makes it run while the user types (real-time)." },
    { keys: ["dom"], answer: "The **DOM** (Document Object Model) is the page as a tree of objects that JavaScript can read and change.\n\n```js\nconst title = document.getElementById(\"title\");\ntitle.textContent = \"New title\";\n```" },
    { keys: ["event", "events", "addeventlistener", "click event"], answer: "**Events** are actions like clicks, typing and scrolling. JavaScript reacts with `addEventListener`.\n\n```js\nbutton.addEventListener(\"click\", function () {\n  console.log(\"Clicked!\");\n});\n```" },
    { keys: ["variable", "variables", "const"], answer: "**Variables in JavaScript:**\n\n- `const`: value can't be reassigned (use by default)\n- `let`: value can change\n- `var`: old style, avoid in new code\n\n```js\nconst name = \"ELEVO\";\nlet count = 0;\ncount = count + 1;\n```" },
    { keys: ["function", "functions"], answer: "A **function** is a reusable block of code.\n\n```js\nfunction add(a, b) {\n  return a + b;\n}\nconst multiply = (a, b) => a * b; // arrow function\n```" },
    { keys: ["array", "arrays"], answer: "An **array** stores a list of values.\n\n```js\nconst fruits = [\"apple\", \"mango\", \"banana\"];\nfruits.push(\"grape\");      // add\nconsole.log(fruits[0]);    // apple\nfruits.forEach(f => console.log(f));\n```" },
    { keys: ["loop", "loops", "for loop", "while loop"], answer: "**Loops** repeat code.\n\n```js\nfor (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n\nlet n = 3;\nwhile (n > 0) {\n  n--;\n}\n```" },
    { keys: ["object", "objects", "json"], answer: "A JavaScript **object** stores data as key-value pairs. **JSON** is the text format used to send that data.\n\n```js\nconst user = { name: \"Ravi\", age: 20 };\nconst text = JSON.stringify(user); // to JSON\nconst back = JSON.parse(text);     // from JSON\n```" },
    { keys: ["localstorage", "local storage"], answer: "**localStorage** saves small data in the browser, even after closing it.\n\n```js\nlocalStorage.setItem(\"theme\", \"dark\");\nconst theme = localStorage.getItem(\"theme\");\n```\nELEVO uses it to remember your chat." },
    { keys: ["fetch", "async", "await", "promise"], answer: "**fetch** loads data from a server. `async/await` makes it easy to read.\n\n```js\nasync function loadData() {\n  const res = await fetch(\"https://api.example.com/data\");\n  const data = await res.json();\n  console.log(data);\n}\n```" },
    { keys: ["api"], answer: "An **API** (Application Programming Interface) lets one program talk to another. For example, a weather app asks a weather API for today's forecast, and the API sends back data (usually JSON)." },
    { keys: ["react"], answer: "**React** is a JavaScript library for building user interfaces from reusable **components**. It updates only the parts of the page that change, which makes apps fast." },
    { keys: ["bootstrap", "tailwind", "framework"], answer: "**Bootstrap** and **Tailwind CSS** are CSS frameworks with ready-made styles. They save time, but learning raw CSS first helps you understand what they do." },
    { keys: ["node", "nodejs", "node.js", "express"], answer: "**Node.js** runs JavaScript outside the browser, on servers. **Express** is a small Node.js framework for building web servers and APIs. ELEVO's `server.js` uses both." },
    { keys: ["git"], answer: "**Git** tracks changes in your code.\n\n```\ngit init\ngit add .\ngit commit -m \"First commit\"\ngit push\n```" },
    { keys: ["github"], answer: "**GitHub** is a website for storing Git projects online, sharing code and working in teams." },
    { keys: ["github pages", "host website", "deploy", "publish website"], answer: "**GitHub Pages** hosts websites for free:\n\n1. Push your project to a GitHub repository.\n2. Go to **Settings → Pages**.\n3. Choose **Deploy from a branch**, select `main` and `/ (root)`.\n4. Save, and your site will be live in about a minute." },
    { keys: ["frontend", "front end", "backend", "back end", "full stack"], answer: "- **Frontend**: what users see (HTML, CSS, JavaScript, React)\n- **Backend**: the server, database and logic (Node.js, Python, Java, SQL)\n- **Full stack**: both frontend and backend" },
    { keys: ["website", "web page", "webpage", "how to make a website"], answer: "To make a website:\n\n1. Write the structure in **HTML**.\n2. Style it with **CSS**.\n3. Add interactivity with **JavaScript**.\n4. Test it on mobile and desktop.\n5. Publish it free with **GitHub Pages**." },

    /* ---------- Programming & CS ---------- */
    { keys: ["python"], answer: "**Python** is an easy-to-read programming language used for AI, data science, web backends and automation.\n\n```python\nname = \"ELEVO\"\nprint(\"Hello,\", name)\n```" },
    { keys: ["java"], answer: "**Java** is an object-oriented language used for Android apps, enterprise software and backends. It runs on the JVM, so the same code works on many systems." },
    { keys: ["c language", "c programming", "learn c"], answer: "**C** is a fast, low-level language used for operating systems and embedded devices. It's great for learning how memory and computers work." },
    { keys: ["oop", "object oriented", "class", "inheritance", "polymorphism", "encapsulation"], answer: "**OOP (Object-Oriented Programming)** has four main ideas:\n\n- **Encapsulation**: keep data and methods together, hide details\n- **Inheritance**: a class reuses another class's features\n- **Polymorphism**: one method name, different behaviours\n- **Abstraction**: show only what's needed" },
    { keys: ["algorithm"], answer: "An **algorithm** is a step-by-step method to solve a problem. Example, finding the largest number: start with the first number, compare each next number, and keep the bigger one." },
    { keys: ["data structure", "data structures", "stack", "queue", "linked list"], answer: "Common **data structures:**\n\n- **Array**: list with index positions\n- **Stack**: last in, first out (like plates)\n- **Queue**: first in, first out (like a line)\n- **Linked list**: items connected by pointers\n- **Tree / Graph**: connected nodes" },
    { keys: ["database", "sql", "dbms", "mysql"], answer: "A **database** stores data in an organised way. **SQL** is the language to manage it.\n\n```sql\nSELECT name, marks FROM students WHERE marks > 80;\n```" },
    { keys: ["computer", "cpu", "ram", "processor", "memory"], answer: "A **computer** has:\n\n- **CPU**: the brain that runs instructions\n- **RAM**: fast temporary memory for running programs\n- **Storage** (SSD/HDD): keeps files permanently\n- **Input/output** devices: keyboard, mouse, screen" },
    { keys: ["internet", "how does internet work", "wifi"], answer: "The **internet** is a worldwide network of computers. When you open a website, your device sends a request through your network to a server, and the server sends the page back in small packets." },
    { keys: ["artificial intelligence", "ai"], answer: "**AI (Artificial Intelligence)** lets computers do tasks that need human-like thinking: understanding language, recognising images and making decisions. Chatbots like ELEVO are an example." },
    { keys: ["machine learning", "ml", "deep learning", "neural network"], answer: "**Machine learning** is a type of AI where computers learn patterns from data instead of following fixed rules. **Deep learning** uses large **neural networks** inspired by the brain." },
    { keys: ["chatbot", "how do chatbots work"], answer: "A **chatbot** reads your message and replies. Simple chatbots (like my offline mode) match keywords. AI chatbots use large language models trained on huge amounts of text." },
    { keys: ["cloud", "cloud computing"], answer: "**Cloud computing** means using computers, storage and software over the internet instead of on your own machine. Examples: Google Drive, AWS, Microsoft Azure." },
    { keys: ["cyber security", "cybersecurity", "hacking", "password", "phishing"], answer: "**Cybersecurity tips:**\n\n- Use long, unique passwords and a password manager\n- Turn on two-factor authentication\n- Don't click unknown links (phishing)\n- Keep apps and your system updated" },
    { keys: ["operating system", "os", "windows", "linux"], answer: "An **operating system** manages the computer's hardware and runs apps. Examples: Windows, macOS, Linux, Android and iOS." },

    /* ---------- Science & general knowledge ---------- */
    { keys: ["photosynthesis"], answer: "**Photosynthesis** is how plants make food. Using sunlight, they turn carbon dioxide and water into glucose and release oxygen.\n\n6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂" },
    { keys: ["gravity"], answer: "**Gravity** is the force that pulls objects toward each other. On Earth, it pulls everything toward the ground at about **9.8 m/s²**." },
    { keys: ["water cycle"], answer: "The **water cycle:**\n\n1. **Evaporation**: sun heats water into vapour\n2. **Condensation**: vapour cools into clouds\n3. **Precipitation**: rain or snow falls\n4. **Collection**: water gathers in rivers, lakes and oceans" },
    { keys: ["solar system", "planets"], answer: "The **solar system** has 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune. Jupiter is the largest; Mercury is closest to the Sun." },
    { keys: ["sun"], answer: "The **Sun** is a star at the centre of our solar system. Its light takes about **8 minutes 20 seconds** to reach Earth." },
    { keys: ["moon"], answer: "The **Moon** is Earth's only natural satellite, about **384,400 km** away. It causes ocean tides." },
    { keys: ["newton", "laws of motion"], answer: "**Newton's laws of motion:**\n\n1. An object stays at rest or in motion unless a force acts on it.\n2. Force = mass × acceleration (F = ma).\n3. Every action has an equal and opposite reaction." },
    { keys: ["atom"], answer: "An **atom** is the smallest unit of an element. It has a nucleus (protons and neutrons) with electrons moving around it." },
    { keys: ["cell", "human cell"], answer: "A **cell** is the basic unit of life. Key parts: the **nucleus** (control centre), **mitochondria** (energy), and the **cell membrane** (boundary)." },
    { keys: ["india capital", "capital of india"], answer: "The capital of India is **New Delhi**." },
    { keys: ["largest ocean"], answer: "The **Pacific Ocean** is the largest ocean on Earth." },
    { keys: ["tallest mountain", "highest mountain", "everest"], answer: "**Mount Everest** is the highest mountain above sea level, at about **8,849 m**." },

    /* ---------- Study & career ---------- */
    { keys: ["viva"], answer: "**Viva tips:**\n\n- Know what every part of your code does\n- Practise explaining in simple words\n- Be ready for \"why\" questions (why Grid here, why this tag)\n- If you don't know, say so honestly and explain what you do know" },
    { keys: ["exam", "study", "prepare", "preparation"], answer: "**Study tips:**\n\n1. Study in short sessions (25 min focus, 5 min break)\n2. Test yourself instead of only re-reading\n3. Practise previous question papers\n4. Teach the topic to someone else\n5. Sleep well before the exam" },
    { keys: ["time management", "procrastination", "focus"], answer: "**Time management tips:**\n\n- Write a short to-do list each morning\n- Do the hardest task first\n- Keep your phone away while studying\n- Use the Pomodoro method: 25 minutes work, 5 minutes break" },
    { keys: ["interview", "job", "placement"], answer: "**Interview tips:**\n\n- Prepare a 1-minute introduction about yourself\n- Know your projects in detail\n- Revise basics: OOP, DBMS, data structures, web basics\n- Ask a question at the end to show interest" },
    { keys: ["resume", "cv"], answer: "**Resume tips:**\n\n- Keep it to one page\n- List skills, projects, education and achievements\n- Add GitHub links to your projects\n- Use action words: built, designed, improved" },
    { keys: ["project idea", "project ideas", "mini project"], answer: "**Web project ideas:**\n\n1. Personal portfolio website\n2. To-do list with localStorage\n3. Weather app using an API\n4. Quiz app with a timer\n5. Expense tracker with charts\n6. Chatbot like ELEVO" },
    { keys: ["learn coding", "start coding", "how to learn programming", "roadmap"], answer: "**Web development roadmap:**\n\n1. HTML basics\n2. CSS (Flexbox, Grid, responsive design)\n3. JavaScript (DOM, events, fetch)\n4. Git and GitHub\n5. Build 3-5 projects\n6. Learn a framework like React" }
];

const SMALL_TALK = {
    greetings: ["Hello! I'm ELEVO. How can I help you today?", "Hi there! What would you like to know?", "Hey! Ask me anything about coding, study or general topics."],
    howAreYou: ["I'm doing great and ready to help. How about you?", "All good here! What can I do for you?"],
    thanks: ["You're welcome!", "Happy to help!", "Anytime! Ask me anything else."],
    bye: ["Goodbye! Come back anytime.", "See you soon! Keep learning."],
    jokes: [
        "Why do programmers prefer dark mode? Because light attracts bugs.",
        "How do you comfort a JavaScript bug? You console it.",
        "Why did the developer go broke? Because he used up all his cache.",
        "Why was the CSS file sad? It had too many issues to style.",
        "A SQL query walks into a bar, walks up to two tables and asks: \"Can I join you?\""
    ],
    quotes: [
        "Small progress every day adds up to big results.",
        "You don't have to be great to start, but you have to start to be great.",
        "Every expert was once a beginner. Keep going.",
        "Focus on learning, not on being perfect.",
        "Mistakes are proof that you are trying."
    ]
};

const ElevoBrain = (() => {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const memory = (() => {
        try { return JSON.parse(localStorage.getItem("elevo-memory")) || {}; } catch (e) { return {}; }
    })();
    const remember = () => { try { localStorage.setItem("elevo-memory", JSON.stringify(memory)); } catch (e) {} };

    function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

    /* ---------- Maths ---------- */
    function maths(raw) {
        const text = raw.toLowerCase();

        const pct = text.match(/([\d.]+)\s*%\s*of\s*([\d.]+)/);
        if (pct) return `${pct[1]}% of ${pct[2]} is **${round(pct[1] * pct[2] / 100)}**.`;

        const sq = text.match(/square root of\s*([\d.]+)/);
        if (sq) return `The square root of ${sq[1]} is **${round(Math.sqrt(sq[1]))}**.`;

        const expr = text
            .replace(/what is|what's|calculate|solve|find|=|\?/g, "")
            .replace(/(\d)\s*x\s*(\d)/g, "$1*$2")
            .replace(/×/g, "*").replace(/÷/g, "/")
            .replace(/plus/g, "+").replace(/minus/g, "-")
            .replace(/times|multiplied by/g, "*").replace(/divided by/g, "/")
            .trim();
        if (!/^[0-9+\-*/().%\s^]+$/.test(expr) || !/\d/.test(expr) || !/[+\-*/%^]/.test(expr)) return null;
        try {
            const result = calculate(expr);
            if (typeof result === "number" && isFinite(result)) return `The answer is **${round(result)}**.`;
        } catch (e) {}
        return null;
    }

    /* Safe calculator: + - * / % ^ and brackets (no eval) */
    function calculate(expr) {
        const tokens = expr.replace(/\s+/g, "").match(/\d+\.?\d*|\.\d+|[+\-*/%^()]/g) || [];
        let pos = 0;
        const peek = () => tokens[pos];
        const next = () => tokens[pos++];
        function parseExpr() {
            let v = parseTerm();
            while (peek() === "+" || peek() === "-") v = next() === "+" ? v + parseTerm() : v - parseTerm();
            return v;
        }
        function parseTerm() {
            let v = parsePower();
            while (peek() === "*" || peek() === "/" || peek() === "%") {
                const op = next(), r = parsePower();
                v = op === "*" ? v * r : op === "/" ? v / r : v % r;
            }
            return v;
        }
        function parsePower() {
            const base = parseUnary();
            if (peek() === "^") { next(); return Math.pow(base, parsePower()); }
            return base;
        }
        function parseUnary() {
            if (peek() === "-") { next(); return -parseUnary(); }
            if (peek() === "+") { next(); return parseUnary(); }
            if (peek() === "(") {
                next();
                const v = parseExpr();
                if (next() !== ")") throw new Error("Missing )");
                return v;
            }
            const t = next();
            if (t === undefined || isNaN(t)) throw new Error("Bad number");
            return parseFloat(t);
        }
        const result = parseExpr();
        if (pos !== tokens.length) throw new Error("Extra input");
        return result;
    }
    function round(n) { return Math.round(Number(n) * 1e6) / 1e6; }

    /* ---------- Unit conversions ---------- */
    const UNITS = {
        "km>miles": v => v * 0.621371, "miles>km": v => v * 1.60934,
        "kg>pounds": v => v * 2.20462, "pounds>kg": v => v / 2.20462,
        "m>feet": v => v * 3.28084, "feet>m": v => v / 3.28084,
        "cm>inches": v => v / 2.54, "inches>cm": v => v * 2.54,
        "c>f": v => v * 9 / 5 + 32, "f>c": v => (v - 32) * 5 / 9,
        "hours>minutes": v => v * 60, "minutes>seconds": v => v * 60,
        "gb>mb": v => v * 1024, "mb>gb": v => v / 1024
    };
    const ALIASES = {
        km: "km", kilometer: "km", kilometers: "km", kilometre: "km", kilometres: "km",
        mile: "miles", miles: "miles", kg: "kg", kgs: "kg", kilogram: "kg", kilograms: "kg",
        lb: "pounds", lbs: "pounds", pound: "pounds", pounds: "pounds",
        m: "m", meter: "m", meters: "m", metre: "m", metres: "m",
        ft: "feet", foot: "feet", feet: "feet", cm: "cm", centimeter: "cm", centimeters: "cm",
        inch: "inches", inches: "inches", c: "c", celsius: "c", f: "f", fahrenheit: "f",
        hour: "hours", hours: "hours", minute: "minutes", minutes: "minutes", second: "seconds", seconds: "seconds",
        gb: "gb", mb: "mb"
    };
    function convert(raw) {
        const m = raw.toLowerCase().match(/(-?[\d.]+)\s*°?\s*([a-z]+)\s+(?:to|in|into)\s+°?([a-z]+)/);
        if (!m) return null;
        const from = ALIASES[m[2]], to = ALIASES[m[3]];
        const fn = UNITS[from + ">" + to];
        if (!fn) return null;
        return `${m[1]} ${from} = **${round(fn(parseFloat(m[1])))} ${to}**.`;
    }

    /* ---------- Knowledge base scoring ---------- */
    function searchKnowledge(text) {
        let best = null, bestScore = 0;
        for (const item of KNOWLEDGE) {
            let score = 0;
            for (const key of item.keys) {
                if (new RegExp("\\b" + escapeRegex(key) + "\\b").test(text)) {
                    score += key.split(" ").length * 2 + key.length / 10;
                }
            }
            if (score > bestScore) { bestScore = score; best = item; }
        }
        return best ? best.answer : null;
    }

    /* ---------- Main reply function ---------- */
    function reply(raw) {
        const text = raw.toLowerCase().trim().replace(/\s+/g, " ");
        const has = (...w) => w.some(x => text.includes(x));
        const name = memory.name ? ", " + memory.name : "";

        const nameMatch = raw.match(/(?:my name is|i am|i'm|call me)\s+([a-z][a-z]+)\b/i);
        if (nameMatch && !/^(fine|good|ok|okay|sad|happy|tired|bored|great|not|a|an|the|from|learning|student|stressed|feeling|here|going|trying|doing|new|confused|so|very|in|at|back|done|sorry|sure|ready|interested|working|studying|looking)$/i.test(nameMatch[1])) {
            memory.name = nameMatch[1][0].toUpperCase() + nameMatch[1].slice(1);
            remember();
            return `Nice to meet you, **${memory.name}**! What would you like to talk about?`;
        }
        if (has("what is my name", "what's my name", "do you know my name"))
            return memory.name ? `Your name is **${memory.name}**.` : "I don't know your name yet. Tell me by typing \"My name is ...\"";

        const conv = convert(raw);
        if (conv) return conv;
        const math = maths(raw);
        if (math) return math;

        if (/^(hi+|hello+|hey+|hai|hola|namaste|good (morning|afternoon|evening))\b/.test(text))
            return memory.name ? `Hello again, ${memory.name}! How can I help?` : pick(SMALL_TALK.greetings);
        if (has("how are you", "how r u", "how are u")) return pick(SMALL_TALK.howAreYou);
        if (has("your name", "who are you", "what are you"))
            return "I'm **ELEVO**, your chat assistant. I can explain coding and study topics, do maths and conversions, and chat with you, even without internet.";
        if (has("who made you", "who created you", "who built you"))
            return "I was built as a web project using HTML, CSS and JavaScript.";
        if (/\btime\b/.test(text) && !has("time management"))
            return `The time now is **${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}**.`;
        if (/\b(date|today)\b/.test(text) || has("what day"))
            return `Today is **${new Date().toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}**.`;
        if (has("joke", "funny", "make me laugh")) return pick(SMALL_TALK.jokes);
        if (has("motivat", "quote", "inspire", "sad", "stressed", "tired", "depressed", "give up"))
            return pick(SMALL_TALK.quotes) + (has("sad", "stressed", "depressed") ? "\n\nIf you're feeling low for a while, talking to a friend, family member or counsellor really helps." : "");
        if (has("thank")) return pick(SMALL_TALK.thanks);
        if (/\b(bye|goodbye|see you)\b/.test(text)) return pick(SMALL_TALK.bye);
        if (/^(ok|okay|cool|nice|great|good|hmm|k)\b/.test(text)) return "Great! Ask me another question whenever you're ready.";
        if (has("what can you do", "help me", "help")  && text.split(" ").length <= 4)
            return helpText();

        const answer = searchKnowledge(text);
        if (answer) return answer;

        return "I don't know that one yet in offline mode.\n\nI can help with:\n\n- **Web development**: HTML, CSS, JavaScript, Flexbox, Grid, Git\n- **Programming**: Python, Java, OOP, data structures, SQL\n- **Science and GK**: planets, gravity, photosynthesis\n- **Study and career**: exams, viva, interviews, project ideas\n- **Tools**: maths, percentages, unit conversions, time and date\n- **Images**: type **\"draw ...\"** to create a picture (needs internet)\n\nFor answers on any topic, switch to **AI mode** in Settings.";
    }

    function helpText() {
        return "Here's what I can do offline:\n\n- Explain topics: try **\"what is flexbox\"** or **\"explain OOP\"**\n- Maths: **\"25 * 4 + 10\"**, **\"15% of 2000\"**, **\"square root of 144\"**\n- Conversions: **\"10 km to miles\"**, **\"37 c to f\"**\n- Time and date\n- Jokes and motivation\n- Remember your name: **\"My name is ...\"**\n- Create images (needs internet): **\"draw a cat astronaut\"**\n\nFor answers on any topic, switch to **AI mode** in Settings.";
    }

    return { reply };
})();

/* ---------------------------------------------------------
   PART 3 – IMAGE GENERATION
   --------------------------------------------------------- */
/* =========================================================
   ELEVO – Image generation
   Two ways to make an image from a text prompt:
     1. Free service (Pollinations) – no key needed
     2. Google Gemini image model – uses your Gemini API key
   Both need internet. Offline mode cannot create images.
   ========================================================= */

const ElevoImages = (() => {

    const DEFAULT_GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image";

    /* ---------- 1. Is this message asking for an image? ---------- */
    const IMAGE_WORDS = "image|images|picture|pic|photo|drawing|painting|illustration|logo|wallpaper|poster|art|artwork|sketch|icon|avatar|cartoon";

    function isImageRequest(text) {
        const t = text.toLowerCase().trim();
        if (/^\/(image|img|draw)\b/.test(t)) return true;
        if (/^(draw|paint|sketch|illustrate)\b/.test(t)) return true;
        if (new RegExp("\\b(generate|create|make|design|show me|give me|render)\\b.{0,40}\\b(" + IMAGE_WORDS + ")\\b").test(t)) return true;
        if (new RegExp("^(an? )?(" + IMAGE_WORDS + ") of\\b").test(t)) return true;
        return false;
    }

    /* Turns "can you draw me a cat on the moon" into "a cat on the moon" */
    function cleanPrompt(text) {
        let p = text.trim()
            .replace(/^\/(image|img|draw)\s*/i, "")
            .replace(/^(please\s+)?(can|could|would) you\s+/i, "")
            .replace(/^(please\s+)?(generate|create|make|design|draw|paint|sketch|illustrate|render|show me|give me)\s+(me\s+)?/i, "")
            .replace(new RegExp("^(an?|the)?\\s*(" + IMAGE_WORDS + ")\\s+(of|showing|with)\\s+", "i"), "")
            .replace(/[?.!]+$/, "")
            .trim();
        return p || text.trim();
    }

    /* ---------- 2. Free service (no key) ---------- */
    function freeImage(prompt, signal) {
        const seed = Math.floor(Math.random() * 1000000);
        const url = "https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt) +
            "?width=768&height=768&nologo=true&seed=" + seed;

        // Load the picture first, so we know it worked before showing it
        return new Promise((resolve, reject) => {
            const img = new Image();
            const timer = setTimeout(() => fail("timeout"), 90000);
            function cleanup() { clearTimeout(timer); img.onload = img.onerror = null; }
            function fail(code) {
                cleanup();
                img.src = "";
                const err = new Error(code);
                err.code = code;
                reject(err);
            }
            img.onload = () => { cleanup(); resolve(url); };
            img.onerror = () => fail("image_failed");
            if (signal) signal.addEventListener("abort", () => {
                const err = new Error("Stopped"); err.name = "AbortError";
                cleanup(); img.src = ""; reject(err);
            });
            img.src = url;
        });
    }

    /* ---------- 3. Google Gemini image model ---------- */
    async function geminiImage(prompt, apiKey, model, signal) {
        const url = "https://generativelanguage.googleapis.com/v1beta/models/" +
            encodeURIComponent(model || DEFAULT_GEMINI_IMAGE_MODEL) +
            ":generateContent?key=" + encodeURIComponent(apiKey);

        const res = await fetch(url, {
            method: "POST",
            signal,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: "Create an image: " + prompt }] }],
                generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
            })
        });

        let data = {};
        try { data = await res.json(); } catch (e) {}
        if (!res.ok) {
            const err = new Error(data?.error?.message || "HTTP " + res.status);
            err.status = res.status;
            throw err;
        }

        const parts = data?.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find(p => p.inlineData || p.inline_data);
        if (!imagePart) {
            const err = new Error("no_image");
            err.code = "no_image";
            throw err;
        }
        const inline = imagePart.inlineData || imagePart.inline_data;
        const dataUrl = "data:" + (inline.mimeType || inline.mime_type || "image/png") + ";base64," + inline.data;
        return shrink(dataUrl);
    }

    /* Makes a big image smaller so it fits in browser storage */
    function shrink(dataUrl, maxSize = 768, quality = 0.85) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
                const canvas = document.createElement("canvas");
                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                try { resolve(canvas.toDataURL("image/jpeg", quality)); }
                catch (e) { resolve(dataUrl); }
            };
            img.onerror = () => resolve(dataUrl);
            img.src = dataUrl;
        });
    }

    /* ---------- 4. Main function ----------
       source: "auto" | "free" | "gemini"
       Returns { src, source }                                  */
    async function generate(prompt, { source = "auto", apiKey = "", model = "", signal } = {}) {
        if (!navigator.onLine) {
            const err = new Error("offline");
            err.code = "offline";
            throw err;
        }

        const canUseGemini = Boolean(apiKey);
        if (source === "gemini" && !canUseGemini) {
            const err = new Error("needs_key");
            err.code = "needs_key";
            throw err;
        }

        if (source === "gemini" || (source === "auto" && canUseGemini)) {
            try {
                return { src: await geminiImage(prompt, apiKey, model, signal), source: "Gemini" };
            } catch (e) {
                // In auto mode, fall back to the free service if Gemini fails
                if (source === "gemini" || e.name === "AbortError") throw e;
            }
        }
        return { src: await freeImage(prompt, signal), source: "Pollinations" };
    }

    return { isImageRequest, cleanPrompt, generate, DEFAULT_GEMINI_IMAGE_MODEL };
})();

/* ---------------------------------------------------------
   PART 4 – REGISTRATION FORM (runs only on register.html)
   --------------------------------------------------------- */
(function () {
    if (!document.getElementById("registerForm")) return;

    /* =========================================================
       ELEVO – Registration form with real-time validation
       Every field is checked on the "input" event, so errors and
       ticks appear while the user types.
       ========================================================= */

    const form = document.getElementById("registerForm");
    const submitBtn = document.getElementById("submitBtn");
    const progressEl = document.getElementById("formProgress");
    const formCard = document.getElementById("formCard");
    const successCard = document.getElementById("successCard");

    const fields = {
        name: document.getElementById("name"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        role: document.getElementById("role"),
        password: document.getElementById("password"),
        confirm: document.getElementById("confirm"),
        terms: document.getElementById("terms")
    };

    // A field shows its result only after the user has started using it
    const touched = {};

    /* ---------- 1. Password rules ---------- */
    const passwordRules = {
        length: v => v.length >= 8,
        upper: v => /[A-Z]/.test(v),
        number: v => /[0-9]/.test(v),
        symbol: v => /[^A-Za-z0-9]/.test(v)
    };

    /* ---------- 2. One check per field ----------
       Each function returns "" when the value is valid,
       or an error message when it is not.                      */
    const validators = {
        name(value) {
            const v = value.trim();
            if (v === "") return "Enter your full name.";
            if (!/^[A-Za-z][A-Za-z .'-]*$/.test(v)) return "Use letters and spaces only.";
            if (v.replace(/[^A-Za-z]/g, "").length < 3) return "Name must have at least 3 letters.";
            return "";
        },
        email(value) {
            const v = value.trim();
            if (v === "") return "Enter your email address.";
            if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v)) return "Enter a valid email, like name@example.com.";
            return "";
        },
        phone(value) {
            if (value === "") return "Enter your phone number.";
            if (value.length !== 10) return `Phone number must be 10 digits (${value.length} entered).`;
            return "";
        },
        role(value) {
            return value ? "" : "Choose the option that describes you.";
        },
        password(value) {
            if (value === "") return "Create a password.";
            const missing = [];
            if (!passwordRules.length(value)) missing.push("8 characters");
            if (!passwordRules.upper(value)) missing.push("a capital letter");
            if (!passwordRules.number(value)) missing.push("a number");
            if (!passwordRules.symbol(value)) missing.push("a symbol");
            return missing.length ? "Password needs " + missing.join(", ") + "." : "";
        },
        confirm(value) {
            if (value === "") return "Type your password again.";
            if (value !== fields.password.value) return "Passwords don't match.";
            return "";
        },
        terms(_, input) {
            return input.checked ? "" : "Tick the box to continue.";
        }
    };

    /* ---------- 3. Show the result on screen ---------- */
    function getValue(name) {
        const input = fields[name];
        return input.type === "checkbox" ? input.checked : input.value;
    }

    function validateField(name, show = true) {
        const input = fields[name];
        const message = validators[name](getValue(name), input);
        const wrapper = input.closest("[data-field]");
        const errorEl = document.getElementById(name + "Error");

        if (show) {
            wrapper.classList.toggle("valid", message === "");
            wrapper.classList.toggle("invalid", message !== "");
            if (message) errorEl.textContent = message;
            input.setAttribute("aria-invalid", message ? "true" : "false");
        }
        return message === "";
    }

    function shake(name) {
        const wrapper = fields[name].closest("[data-field]");
        wrapper.classList.remove("shake");
        void wrapper.offsetWidth;          // restart the animation
        wrapper.classList.add("shake");
    }

    function updateProgress() {
        const done = Object.keys(fields).filter(name => validateField(name, false)).length;
        progressEl.textContent = `${done} of 7 fields complete`;
    }

    /* ---------- 4. Password strength meter ---------- */
    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");
    const LEVELS = [
        { text: "Password strength", color: "var(--danger)" },
        { text: "Weak", color: "var(--danger)" },
        { text: "Fair", color: "#e67e22" },
        { text: "Good", color: "#d4a017" },
        { text: "Strong", color: "var(--success)" }
    ];

    function updateStrength() {
        const value = fields.password.value;
        let score = 0;
        document.querySelectorAll("#passwordRules li").forEach(li => {
            const met = passwordRules[li.dataset.rule](value);
            li.classList.toggle("met", met);
            if (met) score++;
        });
        const level = value === "" ? LEVELS[0] : LEVELS[Math.max(score, 1)];
        strengthBar.style.width = (value === "" ? 0 : score * 25) + "%";
        strengthBar.style.backgroundColor = level.color;
        strengthText.textContent = level.text;
    }

    /* ---------- 5. Real-time events ---------- */
    Object.keys(fields).forEach(name => {
        const input = fields[name];
        const eventName = (input.type === "checkbox" || input.tagName === "SELECT") ? "change" : "input";

        input.addEventListener(eventName, () => {
            if (name === "phone") input.value = input.value.replace(/\D/g, "").slice(0, 10);
            if (name === "password") updateStrength();

            // Start showing results once the user has typed something
            if (getValue(name) !== "" && getValue(name) !== false) touched[name] = true;
            if (touched[name]) validateField(name);

            // Changing the password re-checks "confirm password"
            if (name === "password" && touched.confirm) validateField("confirm");

            updateProgress();
        });

        // Leaving a field: show its result and shake if it is wrong
        input.addEventListener("blur", () => {
            if (input.type === "checkbox") return;
            if (getValue(name) === "" && !touched[name]) return;
            touched[name] = true;
            if (!validateField(name)) shake(name);
        });
    });

    /* Show / hide password */
    const toggleBtn = document.getElementById("togglePassword");
    toggleBtn.addEventListener("click", () => {
        const hidden = fields.password.type === "password";
        fields.password.type = hidden ? "text" : "password";
        fields.confirm.type = hidden ? "text" : "password";
        toggleBtn.textContent = hidden ? "Hide" : "Show";
        toggleBtn.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
    });

    /* ---------- 6. Submit ---------- */
    form.addEventListener("submit", event => {
        event.preventDefault();

        const invalid = [];
        Object.keys(fields).forEach(name => {
            touched[name] = true;
            if (!validateField(name)) invalid.push(name);
        });
        updateProgress();

        if (invalid.length) {
            invalid.forEach(shake);
            fields[invalid[0]].focus();
            return;
        }

        // Everything is valid: show the loading spinner, then the success card
        submitBtn.classList.add("loading");
        submitBtn.disabled = true;

        setTimeout(() => {
            const name = fields.name.value.trim().replace(/\s+/g, " ");
            const firstName = name.split(" ")[0];
            const user = {
                name,
                email: fields.email.value.trim(),
                phone: fields.phone.value,
                role: fields.role.value,
                joined: new Date().toISOString()
            };
            // The password is NOT saved. A real app sends it to a server
            // over HTTPS, where it is stored as a secure hash.
            try {
                localStorage.setItem("elevo-user", JSON.stringify(user));
                const memory = JSON.parse(localStorage.getItem("elevo-memory") || "{}");
                memory.name = firstName.charAt(0).toUpperCase() + firstName.slice(1);
                localStorage.setItem("elevo-memory", JSON.stringify(memory));
            } catch (e) {}

            document.getElementById("successTitle").textContent = `Welcome to ELEVO, ${firstName}!`;
            document.getElementById("successText").textContent = `Your account is ready. We'll use ${user.email} as your contact email.`;
            formCard.classList.add("hidden");
            document.querySelector(".intro").classList.add("hidden");
            successCard.classList.remove("hidden");
            successCard.querySelector("a").focus();
        }, 1200);
    });

    updateStrength();
    updateProgress();
})();

/* ---------------------------------------------------------
   PART 5 – CHATBOT (runs only on chat.html)
   --------------------------------------------------------- */
(function () {
    if (!document.getElementById("messages")) return;

    /* =========================================================
       ELEVO – AI Chatbot
       Modes:
         offline -> built-in replies, works with no key
         gemini  -> Google Gemini API (key from aistudio.google.com)
         claude  -> Anthropic Claude API (key from console.anthropic.com)
         server  -> your own server.js (key kept safely on the server)
       ========================================================= */

    const messagesEl = document.getElementById("messages");
    const input = document.getElementById("input");
    const sendBtn = document.getElementById("sendBtn");
    const clearBtn = document.getElementById("clearBtn");
    const settingsBtn = document.getElementById("settingsBtn");
    const statusEl = document.getElementById("status");

    const overlay = document.getElementById("overlay");
    const providerEl = document.getElementById("provider");
    const apiKeyEl = document.getElementById("apiKey");
    const modelEl = document.getElementById("model");
    const keyFields = document.getElementById("keyFields");
    const keyHelp = document.getElementById("keyHelp");
    const serverHelp = document.getElementById("serverHelp");
    const imageBtn = document.getElementById("imageBtn");
    const hintEl = document.getElementById("hint");
    const imageSourceEl = document.getElementById("imageSource");
    const imageModelEl = document.getElementById("imageModel");
    const imageModelField = document.getElementById("imageModelField");

    const SEND_ICON = sendBtn.innerHTML;
    const STOP_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
    const LOGO_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 14l7-7 7 7"/><path d="M5 20l7-7 7 7" opacity=".55"/></svg>';

    const PERSONA =
        "You are ELEVO, a friendly and helpful AI assistant. If asked your name, say you are ELEVO. " +
        "Answer clearly and simply. Keep replies short unless the user asks for detail. " +
        "Use short paragraphs, simple lists and code blocks when useful.";

    const DEFAULT_MODELS = {
        gemini: "gemini-2.5-flash",
        claude: "claude-haiku-4-5-20251001"
    };

    const KEY_HELP = {
        gemini: 'Get a free key at <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a>. The key is saved only in this browser.',
        claude: 'Get a key at <a href="https://console.anthropic.com" target="_blank" rel="noopener">console.anthropic.com</a> (billing required). The key is saved only in this browser.'
    };

    // The account created on register.html (null for guests)
    const user = load("elevo-user", null);
    function firstName(name) { return String(name || "").trim().split(" ")[0]; }

    let settings = { provider: "offline", apiKey: "", model: "", imageSource: "auto", imageModel: "" };
    let history = [];          // messages of the open chat: [{ role, content }]
    let chats = [];            // all saved chats: [{ id, title, created, updated, messages }]
    let currentId = null;      // id of the open chat (null = new, unsaved chat)
    let busy = false;
    let imageMode = false;     // true = the next messages create pictures
    let controller = null;

    /* ---------- Storage helpers (safe if storage is blocked) ---------- */
    function load(key, fallback) {
        try {
            const v = localStorage.getItem(key);
            return v ? JSON.parse(v) : fallback;
        } catch (e) { return fallback; }
    }
    function save(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
    }

    /* ---------- Safe, minimal markdown ---------- */
    function escapeHtml(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function inline(s) {
        return s
            .replace(/`([^`]+)`/g, "<code>$1</code>")
            .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
            .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    }
    function renderMarkdown(text) {
        const parts = escapeHtml(text).split(/```/);
        let html = "";
        parts.forEach((part, i) => {
            if (i % 2 === 1) {
                const code = part.replace(/^[a-zA-Z0-9]*\n/, "");
                html += "<pre><code>" + code.replace(/\n$/, "") + "</code></pre>";
                return;
            }
            let list = null, para = [];
            const flushPara = () => { if (para.length) { html += "<p>" + inline(para.join("<br>")) + "</p>"; para = []; } };
            const flushList = () => { if (list) { html += "</" + list + ">"; list = null; } };
            part.split("\n").forEach(line => {
                const ul = line.match(/^\s*[-*•]\s+(.*)/);
                const ol = line.match(/^\s*\d+[.)]\s+(.*)/);
                const h = line.match(/^#{1,4}\s+(.*)/);
                if (ul || ol) {
                    flushPara();
                    const type = ul ? "ul" : "ol";
                    if (list !== type) { flushList(); html += "<" + type + ">"; list = type; }
                    html += "<li>" + inline((ul || ol)[1]) + "</li>";
                } else if (h) {
                    flushPara(); flushList();
                    html += "<p><strong>" + inline(h[1]) + "</strong></p>";
                } else if (line.trim() === "") {
                    flushPara(); flushList();
                } else {
                    flushList(); para.push(line);
                }
            });
            flushPara(); flushList();
        });
        return html;
    }

    /* =========================================================
       OFFLINE BRAIN – lives in knowledge.js (ElevoBrain.reply)
       ========================================================= */
    function offlineReply(text) {
        return ElevoBrain.reply(text);
    }

    /* =========================================================
       REAL AI – calls the chosen API
       ========================================================= */
    async function askAI(turns, signal) {
        const { provider, apiKey } = settings;
        const model = settings.model || DEFAULT_MODELS[provider];

        if (provider === "gemini") {
            const url = "https://generativelanguage.googleapis.com/v1beta/models/" +
                encodeURIComponent(model) + ":generateContent?key=" + encodeURIComponent(apiKey);
            const res = await fetch(url, {
                method: "POST",
                signal,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: PERSONA }] },
                    contents: turns.map(t => ({
                        role: t.role === "assistant" ? "model" : "user",
                        parts: [{ text: t.content }]
                    }))
                })
            });
            const data = await readJson(res);
            const parts = data?.candidates?.[0]?.content?.parts || [];
            return parts.map(p => p.text || "").join("").trim();
        }

        if (provider === "claude") {
            const res = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                signal,
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01",
                    "anthropic-dangerous-direct-browser-access": "true"
                },
                body: JSON.stringify({
                    model,
                    max_tokens: 1024,
                    system: PERSONA,
                    messages: turns
                })
            });
            const data = await readJson(res);
            return (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
        }

        if (provider === "server") {
            const res = await fetch("/api/chat", {
                method: "POST",
                signal,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: turns })
            });
            const data = await readJson(res);
            return (data.reply || "").trim();
        }

        throw new Error("Unknown provider");
    }

    async function readJson(res) {
        let data = {};
        try { data = await res.json(); } catch (e) {}
        if (!res.ok) {
            const err = new Error(data?.error?.message || data?.error || ("HTTP " + res.status));
            err.status = res.status;
            throw err;
        }
        return data;
    }

    function friendlyError(e) {
        if (e.code === "offline") return "Creating images needs internet. Connect to the internet and try again.";
        if (e.code === "needs_key") return "Gemini images need your Gemini API key. Open **Settings**, choose **Google Gemini** as the AI service and add your key, or set the image generator to **Free service**.";
        if (e.code === "image_failed") return "The image service couldn't create that picture right now. Try again in a moment, or describe it differently.";
        if (e.code === "timeout") return "The image took too long to create. Try again, or use a shorter description.";
        if (e.code === "no_image") return "Gemini replied without an image. Try describing the picture differently, or check the image model name in **Settings**.";
        if (e.name === "AbortError") return "";
        if (e.status === 400) return "The AI service rejected the request. Check the model name in Settings.\n\nDetails: " + e.message;
        if (e.status === 401 || e.status === 403) return "Your API key was not accepted. Open **Settings** and check the key.";
        if (e.status === 404) return settings.provider === "server"
            ? "ELEVO couldn't find the server. Start it with `npm start` and open `http://localhost:3000`."
            : "That model name wasn't found. Open **Settings** and check the model name.";
        if (e.status === 429) return "The AI service limit was reached. Wait a minute and send again.";
        if (e instanceof TypeError) return "ELEVO couldn't reach the AI service. Check your internet connection.";
        return "ELEVO couldn't get a reply. Send your message again.\n\nDetails: " + e.message;
    }

    /* =========================================================
       CHAT UI
       ========================================================= */
    function scrollDown() { messagesEl.scrollTop = messagesEl.scrollHeight; }

    function addRow(role) {
        const row = document.createElement("div");
        row.className = "row " + (role === "assistant" ? "bot" : "user");
        if (role === "assistant") {
            const av = document.createElement("div");
            av.className = "avatar";
            av.setAttribute("aria-hidden", "true");
            av.innerHTML = LOGO_SVG;
            row.appendChild(av);
        }
        const bubble = document.createElement("div");
        bubble.className = "bubble";
        row.appendChild(bubble);
        messagesEl.appendChild(row);
        return bubble;
    }

    function renderMessage(msg) {
        const bubble = addRow(msg.role);
        if (msg.role === "user") bubble.textContent = msg.content;
        else if (msg.image) renderImage(bubble, msg.image);
        else bubble.innerHTML = renderMarkdown(msg.content);
    }

    /* =========================================================
       IMAGES
       ========================================================= */
    function renderImage(bubble, image) {
        bubble.classList.add("image-bubble");
        bubble.innerHTML = "";

        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = image.src;
        img.alt = image.prompt;
        img.loading = "lazy";
        img.addEventListener("load", scrollDown);
        img.addEventListener("error", () => {
            figure.innerHTML = '<p class="image-missing">This image is no longer available. Ask ELEVO to draw it again.</p>';
        });

        const caption = document.createElement("figcaption");
        const text = document.createElement("span");
        text.textContent = image.prompt;
        const actions = document.createElement("span");
        actions.className = "image-actions";

        const download = document.createElement("button");
        download.type = "button";
        download.textContent = "Download";
        download.addEventListener("click", () => downloadImage(image));

        const again = document.createElement("button");
        again.type = "button";
        again.textContent = "Make another";
        again.addEventListener("click", () => send("/image " + image.prompt));

        actions.append(download, again);
        caption.append(text, actions);
        figure.append(img, caption);
        bubble.appendChild(figure);
    }

    async function downloadImage(image) {
        const name = "elevo-" + image.prompt.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) + ".jpg";
        try {
            const blob = await (await fetch(image.src)).blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = name;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(link.href), 2000);
        } catch (e) {
            window.open(image.src, "_blank", "noopener");   // fallback: open it in a new tab
        }
    }

    function imageLoadingHtml() {
        return '<div class="image-loading"><div class="image-skeleton"></div><span>Creating your image... this can take up to a minute.</span></div>';
    }

    function setImageMode(on) {
        imageMode = on;
        imageBtn.classList.toggle("active", on);
        imageBtn.setAttribute("aria-pressed", on ? "true" : "false");
        input.placeholder = on ? "Describe the image you want..." : "Message ELEVO...";
        input.focus();
    }
    imageBtn.addEventListener("click", () => setImageMode(!imageMode));

    function showWelcome() {
        messagesEl.innerHTML = `
            <div class="welcome">
                <div class="big-logo" aria-hidden="true">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 14l7-7 7 7"/><path d="M5 20l7-7 7 7" opacity=".55"/></svg>
                </div>
                <h2>${user ? "Hi " + escapeHtml(firstName(user.name)) + ", I'm ELEVO" : "Hi, I'm ELEVO"}</h2>
                <p>Ask me anything: study help, code, ideas or quick answers.</p>
                <div class="chips">
                    <button class="chip">Flexbox vs Grid</button>
                    <button class="chip">Tips for my viva</button>
                    <button class="chip">15% of 2000</button>
                    <button class="chip">Draw a cat astronaut on the moon</button>
                </div>
            </div>`;
        messagesEl.querySelectorAll(".chip").forEach(chip =>
            chip.addEventListener("click", () => send(chip.textContent)));
    }

    function renderAll() {
        if (history.length === 0) { showWelcome(); return; }
        messagesEl.innerHTML = "";
        history.forEach(renderMessage);
        scrollDown();
    }

    function setBusy(on) {
        busy = on;
        sendBtn.innerHTML = on ? STOP_ICON : SEND_ICON;
        sendBtn.setAttribute("aria-label", on ? "Stop reply" : "Send message");
        sendBtn.disabled = on ? false : input.value.trim() === "";
    }

    function updateStatus() {
        const names = { offline: "Offline mode", gemini: "AI mode · Gemini", claude: "AI mode · Claude", server: "AI mode · Server" };
        statusEl.textContent = names[settings.provider];
        statusEl.classList.toggle("ai", settings.provider !== "offline");
    }

    /* Types the reply out word by word so it feels like a live chat */
    function typeOut(bubble, text, signal) {
        return new Promise(resolve => {
            const words = text.split(/(\s+)/);
            let i = 0, shown = "";
            const step = () => {
                if (signal.aborted) { resolve(shown); return; }
                shown += words.slice(i, i + 3).join("");
                i += 3;
                bubble.innerHTML = renderMarkdown(shown);
                scrollDown();
                if (i < words.length) setTimeout(step, 18);
                else resolve(text);
            };
            step();
        });
    }

    /* ---------- Send a message ---------- */
    async function send(text) {
        text = text.trim();
        if (!text || busy) return;

        if (messagesEl.querySelector(".welcome")) messagesEl.innerHTML = "";

        const chat = ensureChat(text);      // creates the chat on the first message
        const convo = chat.messages;
        convo.push({ role: "user", content: text });
        touchChat(chat);
        renderMessage(convo[convo.length - 1]);
        input.value = "";
        autoGrow();
        scrollDown();

        const wantImage = imageMode || ElevoImages.isImageRequest(text);
        const bubble = addRow("assistant");
        bubble.innerHTML = wantImage
            ? imageLoadingHtml()
            : '<span class="dots" aria-label="ELEVO is typing"><span></span><span></span><span></span></span>';
        scrollDown();
        setBusy(true);
        controller = new AbortController();

        try {
            if (wantImage) {
                const prompt = ElevoImages.cleanPrompt(text);
                const result = await ElevoImages.generate(prompt, {
                    source: settings.imageSource,
                    apiKey: settings.provider === "gemini" ? settings.apiKey : "",
                    model: settings.imageModel,
                    signal: controller.signal
                });
                const image = { src: result.src, prompt, source: result.source };
                renderImage(bubble, image);
                convo.push({ role: "assistant", content: "[Image created: " + prompt + "]", image });
                touchChat(chat);
                return;
            }

            let reply;
            if (settings.provider === "offline") {
                await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
                reply = offlineReply(text);
            } else {
                try {
                    reply = await askAI(convo.slice(-20), controller.signal);
                    if (!reply) reply = "I didn't get an answer for that. Try asking in a different way.";
                } catch (e) {
                    // No internet or AI not available: answer with the offline brain instead
                    const offlineCase = (e instanceof TypeError) || e.code === "unavailable" || !navigator.onLine;
                    if (!offlineCase || e.name === "AbortError") throw e;
                    reply = "*AI isn't reachable right now (no internet), so this answer is from offline mode.*\n\n" + offlineReply(text);
                }
            }
            const finalText = await typeOut(bubble, reply, controller.signal);
            convo.push({ role: "assistant", content: finalText || reply });
            touchChat(chat);
        } catch (e) {
            const msg = friendlyError(e);
            convo.pop();
            if (msg) {
                bubble.classList.add("error");
                bubble.innerHTML = renderMarkdown(msg);
            } else {
                bubble.textContent = "Stopped.";
            }
            touchChat(chat);
        } finally {
            controller = null;
            setBusy(false);
            scrollDown();
            input.focus();
        }
    }

    /* =========================================================
       CHAT HISTORY – every chat is saved, like Claude's sidebar
       ========================================================= */
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("backdrop");
    const chatListEl = document.getElementById("chatList");
    const searchEl = document.getElementById("searchChats");

    function saveChats() {
        try {
            localStorage.setItem("elevo-chats", JSON.stringify(chats));
            localStorage.setItem("elevo-current", JSON.stringify(currentId));
        } catch (e) {
            // Storage full: drop the oldest chat and try once more
            if (chats.length > 1) { chats.pop(); try { localStorage.setItem("elevo-chats", JSON.stringify(chats)); } catch (e2) {} }
        }
    }

    function loadChats() {
        chats = load("elevo-chats", []);
        // Move a chat saved by the older version of ELEVO into the new list
        const old = load("elevo-history", null);
        if (Array.isArray(old) && old.length) {
            const first = old.find(m => m.role === "user");
            chats.unshift(makeChat(first ? first.content : "Earlier chat", old));
            try { localStorage.removeItem("elevo-history"); } catch (e) {}
        }
        const saved = load("elevo-current", null);
        const chat = chats.find(c => c.id === saved);
        currentId = chat ? chat.id : null;
        history = chat ? chat.messages : [];
        saveChats();
    }

    function makeTitle(text) {
        const clean = text.replace(/\s+/g, " ").trim();
        return clean.length > 40 ? clean.slice(0, 40).trim() + "..." : clean;
    }

    function makeChat(firstText, messages) {
        const now = Date.now();
        return {
            id: now.toString(36) + Math.random().toString(36).slice(2, 6),
            title: makeTitle(firstText),
            created: now,
            updated: now,
            messages: messages || []
        };
    }

    function ensureChat(firstText) {
        let chat = chats.find(c => c.id === currentId);
        if (!chat) {
            chat = makeChat(firstText, history);
            chats.unshift(chat);
            currentId = chat.id;
        }
        return chat;
    }

    function touchChat(chat) {
        chat.updated = Date.now();
        saveChats();
        renderSidebar();
    }

    function openChat(id) {
        if (controller) controller.abort();
        const chat = chats.find(c => c.id === id);
        if (!chat) return;
        currentId = chat.id;
        history = chat.messages;
        saveChats();
        renderAll();
        renderSidebar();
        closeSidebar();
    }

    function newChat() {
        if (controller) controller.abort();
        currentId = null;
        history = [];
        saveChats();
        showWelcome();
        renderSidebar();
        closeSidebar();
        input.focus();
    }

    function deleteChat(id) {
        chats = chats.filter(c => c.id !== id);
        if (id === currentId) {
            if (controller) controller.abort();
            currentId = null;
            history = [];
            showWelcome();
        }
        saveChats();
        renderSidebar();
    }

    function renameChat(id, title) {
        const chat = chats.find(c => c.id === id);
        if (!chat || !title.trim()) return;
        chat.title = makeTitle(title);
        saveChats();
    }

    function groupLabel(time) {
        const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
        const day = 86400000;
        if (time >= startOfToday.getTime()) return "Today";
        if (time >= startOfToday.getTime() - day) return "Yesterday";
        if (time >= startOfToday.getTime() - 7 * day) return "Previous 7 days";
        if (time >= startOfToday.getTime() - 30 * day) return "Previous 30 days";
        return "Older";
    }

    const PENCIL = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
    const TRASH = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>';

    function renderSidebar() {
        const q = searchEl.value.trim().toLowerCase();
        const list = chats
            .filter(c => !q || c.title.toLowerCase().includes(q) ||
                c.messages.some(m => m.content.toLowerCase().includes(q)))
            .sort((a, b) => b.updated - a.updated);

        chatListEl.innerHTML = "";
        if (list.length === 0) {
            const empty = document.createElement("p");
            empty.className = "chat-empty";
            empty.textContent = q ? "No chats match your search." : "Your chats will appear here.";
            chatListEl.appendChild(empty);
            return;
        }

        let lastGroup = "";
        list.forEach(chat => {
            const group = groupLabel(chat.updated);
            if (group !== lastGroup) {
                const h = document.createElement("p");
                h.className = "chat-group";
                h.textContent = group;
                chatListEl.appendChild(h);
                lastGroup = group;
            }

            const item = document.createElement("div");
            item.className = "chat-item" + (chat.id === currentId ? " active" : "");

            const open = document.createElement("button");
            open.className = "chat-open";
            open.textContent = chat.title;
            open.title = chat.title;
            open.addEventListener("click", () => openChat(chat.id));

            const rename = document.createElement("button");
            rename.className = "chat-action";
            rename.innerHTML = PENCIL;
            rename.setAttribute("aria-label", "Rename chat");
            rename.title = "Rename";
            rename.addEventListener("click", () => startRename(item, chat));

            const del = document.createElement("button");
            del.className = "chat-action";
            del.innerHTML = TRASH;
            del.setAttribute("aria-label", "Delete chat");
            del.title = "Delete";
            del.addEventListener("click", () => {
                // Click once to arm, click again within 3 seconds to delete
                if (del.classList.contains("armed")) { deleteChat(chat.id); return; }
                del.classList.add("armed");
                del.textContent = "Delete";
                del.setAttribute("aria-label", "Click again to delete");
                setTimeout(() => {
                    if (!del.isConnected) return;
                    del.classList.remove("armed");
                    del.innerHTML = TRASH;
                    del.setAttribute("aria-label", "Delete chat");
                }, 3000);
            });

            item.append(open, rename, del);
            chatListEl.appendChild(item);
        });
    }

    function startRename(item, chat) {
        const field = document.createElement("input");
        field.className = "chat-rename";
        field.value = chat.title;
        field.setAttribute("aria-label", "Chat name");
        item.innerHTML = "";
        item.appendChild(field);
        field.focus();
        field.select();
        let done = false;
        const finish = save => {
            if (done) return;
            done = true;
            if (save) renameChat(chat.id, field.value);
            renderSidebar();
        };
        field.addEventListener("keydown", e => {
            if (e.key === "Enter") finish(true);
            if (e.key === "Escape") finish(false);
        });
        field.addEventListener("blur", () => finish(true));
    }

    /* Who is chatting: the registered user or a guest */
    function renderUserBox() {
        const box = document.getElementById("userBox");
        if (user) {
            const initial = escapeHtml(firstName(user.name).charAt(0).toUpperCase());
            box.innerHTML = `<span class="user-avatar" aria-hidden="true">${initial}</span>
                <span class="user-info"><strong>${escapeHtml(user.name)}</strong><small>${escapeHtml(user.role)}</small></span>`;
        } else {
            box.innerHTML = `<span class="user-avatar" aria-hidden="true">?</span>
                <span class="user-info"><strong>Guest</strong><small><a href="register.html">Create an account</a></small></span>`;
        }
    }
    renderUserBox();

    /* Sidebar open/close on mobile */
    function openSidebar() { sidebar.classList.add("open"); backdrop.classList.add("open"); }
    function closeSidebar() { sidebar.classList.remove("open"); backdrop.classList.remove("open"); }
    document.getElementById("menuBtn").addEventListener("click", openSidebar);
    document.getElementById("closeSidebarBtn").addEventListener("click", closeSidebar);
    backdrop.addEventListener("click", closeSidebar);
    document.getElementById("newChatBtn").addEventListener("click", newChat);
    searchEl.addEventListener("input", renderSidebar);

    /* =========================================================
       SETTINGS PANEL
       ========================================================= */
    function refreshPanelFields() {
        const p = providerEl.value;
        imageModelField.classList.toggle("hidden", imageSourceEl.value === "free");
        imageModelEl.placeholder = ElevoImages.DEFAULT_GEMINI_IMAGE_MODEL;
        keyFields.classList.toggle("hidden", p === "offline" || p === "server");
        serverHelp.classList.toggle("hidden", p !== "server");
        if (KEY_HELP[p]) keyHelp.innerHTML = KEY_HELP[p];
        if (DEFAULT_MODELS[p]) modelEl.placeholder = DEFAULT_MODELS[p];
    }

    function openSettings() {
        providerEl.value = settings.provider;
        apiKeyEl.value = settings.apiKey;
        modelEl.value = settings.model;
        imageSourceEl.value = settings.imageSource || "auto";
        imageModelEl.value = settings.imageModel || "";
        refreshPanelFields();
        overlay.classList.add("open");
        providerEl.focus();
    }
    function closeSettings() {
        overlay.classList.remove("open");
        settingsBtn.focus();
    }

    imageSourceEl.addEventListener("change", refreshPanelFields);
    providerEl.addEventListener("change", () => {
        if (providerEl.value !== settings.provider) { apiKeyEl.value = ""; modelEl.value = ""; }
        refreshPanelFields();
    });
    settingsBtn.addEventListener("click", openSettings);
    document.getElementById("cancelBtn").addEventListener("click", closeSettings);
    overlay.addEventListener("click", e => { if (e.target === overlay) closeSettings(); });
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && overlay.classList.contains("open")) closeSettings();
    });
    document.getElementById("saveBtn").addEventListener("click", () => {
        const p = providerEl.value;
        if ((p === "gemini" || p === "claude") && !apiKeyEl.value.trim()) {
            apiKeyEl.focus();
            keyHelp.innerHTML = "Paste your API key to use this service. " + KEY_HELP[p];
            return;
        }
        settings = {
            provider: p,
            apiKey: (p === "gemini" || p === "claude") ? apiKeyEl.value.trim() : "",
            model: modelEl.value.trim(),
            imageSource: imageSourceEl.value,
            imageModel: imageModelEl.value.trim()
        };
        save("elevo-settings", settings);
        updateStatus();
        closeSettings();
    });

    /* =========================================================
       INPUT EVENTS + START
       ========================================================= */
    function autoGrow() {
        input.style.height = "auto";
        input.style.height = Math.min(input.scrollHeight, 160) + "px";
    }
    input.addEventListener("input", () => {
        autoGrow();
        if (!busy) sendBtn.disabled = input.value.trim() === "";
    });
    input.addEventListener("keydown", e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send(input.value);
        }
    });
    sendBtn.addEventListener("click", () => {
        if (busy) { if (controller) controller.abort(); return; }
        send(input.value);
    });
    clearBtn.addEventListener("click", newChat);

    settings = Object.assign(settings, load("elevo-settings", {}));
    loadChats();
    updateStatus();
    renderAll();
    renderSidebar();
})();
