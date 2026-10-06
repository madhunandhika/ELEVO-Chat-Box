ELEVO — AI Chatbot

«ELEVO is a lightweight, responsive web-based AI chatbot designed to answer study, coding, mathematics, and everyday questions. It supports offline responses through a built-in knowledge base and can provide real AI-powered answers when an AI API is configured.»

Live Demo: "https://madhunandhika.github.io/ELEVO-Chat-Box/"

Repository: "https://github.com/madhunandhika/ELEVO-Chat-Box"

---

🚀 About ELEVO

ELEVO is a web-based chatbot built to provide users with quick and interactive answers across different types of questions.

The chatbot can work in offline mode using its built-in knowledge base. For more advanced questions, users can connect an AI service such as Google Gemini to receive real AI-generated responses.

ELEVO combines a simple user interface with useful chatbot features such as:

- 🤖 AI-powered conversations
- 📚 Offline knowledge base
- 🧮 Mathematics and calculations
- 💻 Programming-related questions
- 🔄 Unit conversions
- 🖼️ Image generation
- 💬 Chat history
- 🌙 Dark/light mode
- 📱 Responsive design
- ✅ Interactive registration and validation

---

✨ Features

🤖 AI Chatbot

ELEVO is designed as a general-purpose chatbot that can respond to different categories of questions.

Offline Mode

The built-in knowledge base allows ELEVO to answer questions without requiring an AI API.

It includes support for:

- Study-related topics
- Programming concepts
- Mathematics
- Percentages
- Unit conversions
- Time and date
- Everyday questions
- 60+ predefined topics

AI Mode

For questions outside the offline knowledge base, ELEVO can connect to AI services such as:

- Google Gemini
- Anthropic Claude

The chatbot can automatically fall back to its offline knowledge base when an AI service is unavailable.

---

🖼️ Image Generation

ELEVO also supports image generation from natural-language prompts.

For example:

draw a cat astronaut

or:

draw a robot reading a book

Users can:

- Generate images
- Download generated images
- Generate another image

---

💬 Chat History

ELEVO provides a chat-history sidebar that allows users to manage their conversations.

Users can:

- Start a new chat
- Search previous chats
- Rename conversations
- Delete conversations
- View conversations grouped by date
- Continue previous conversations

The chatbot also greets the registered user by name.

---

🎨 User Interface

ELEVO uses a custom interface built entirely with HTML, CSS and JavaScript.

UI features

- Responsive navigation
- Hero section
- Interactive buttons
- Chat interface
- Sidebar
- Cards and sections
- Hover effects
- Smooth transitions
- CSS animations
- Mobile-friendly layouts

No frontend UI framework is used.

---

🌙 Dark & Light Mode

ELEVO supports both:

- ☀️ Light mode
- 🌙 Dark mode

The selected theme is saved using "localStorage", allowing the preference to remain consistent across the application pages.

The colors can be customized through CSS variables in "style.css".

---

📝 Registration Form

ELEVO includes an interactive registration page with real-time client-side validation.

Validation includes

- Name
- Email
- 10-digit phone number
- Role
- Password
- Confirm password
- Terms and conditions

Additional features

- Real-time validation
- Password strength meter
- Password rule checklist
- Show/hide password
- Form completion counter
- Error messages
- Success feedback
- Submission blocking for invalid fields

CSS Animations

The form includes custom animations such as:

- Slide-up animation
- Floating labels
- Invalid-field shake
- Success/error icons
- Strength-bar animation
- Loading spinner
- Success tick animation

«Passwords are not stored by the application.»

---

🛠️ Technology Stack

Technology| Usage
HTML5| Page structure and semantic elements
CSS3| Styling, layouts, animations and themes
JavaScript| Chatbot logic and application interactions
LocalStorage| Theme and client-side data persistence
Fetch API| API communication
Node.js| Optional backend
Express.js| Optional API server
Google Gemini| AI-generated chatbot responses
Anthropic Claude| Alternative AI provider

Frontend

The project is built using vanilla HTML, CSS and JavaScript.

It does not use:

- Bootstrap
- Tailwind CSS
- React
- Angular
- Vue
- Other UI frameworks

---

📂 Project Structure

ELEVO-Chat-Box/
│
├── index.html          # Product landing page
├── register.html       # Registration page
├── chat.html           # ELEVO chatbot
│
├── style.css           # Complete application styling
├── script.js           # Chatbot and UI functionality
│
├── server.js           # Optional Node.js server
├── package.json        # Server dependencies
├── .env.example        # Environment variable template
├── .gitignore          # Ignored files
├── .nojekyll           # GitHub Pages configuration
│
├── README.md           # Project overview
└── DOCUMENTATION.md    # Detailed documentation

---

🏗️ How ELEVO Works

                    ┌───────────────────┐
                    │    ELEVO UI       │
                    └─────────┬─────────┘
                              │
                     User enters a query
                              │
                    ┌─────────▼─────────┐
                    │   Chatbot Logic   │
                    └─────────┬─────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
         Offline Knowledge             AI Service
                │                           │
        ┌───────▼───────┐          ┌────────▼────────┐
        │ Local Answers │          │ Gemini / Claude │
        └───────┬───────┘          └────────┬────────┘
                │                           │
                └─────────────┬─────────────┘
                              │
                       Chatbot Response

This hybrid approach allows ELEVO to remain useful even when an external AI service is unavailable.

---

📱 Responsive Design

ELEVO follows a mobile-first approach.

The interface adapts to:

- Mobile phones
- Tablets
- Laptops
- Desktop screens

Responsive breakpoints include:

600px
768px
1024px

The application was tested across:

320px
375px
425px
768px
1024px
1440px

---

🔐 API Security

ELEVO provides an optional Node.js + Express server for handling API requests.

API credentials can be stored using environment variables rather than directly exposing them in frontend code.

Example:

.env

A template is provided:

.env.example

«Never commit a real API key to GitHub.»

---

⚙️ Getting Started

Clone the Repository

git clone https://github.com/madhunandhika/ELEVO-Chat-Box.git

cd ELEVO-Chat-Box

Run the Frontend

No installation is required for the basic frontend.

Open:

index.html

in Chrome, Edge, or another modern browser.

---

Optional Node.js Server

Install Node.js 18 or newer.

Then run:

npm install

Configure your environment variables and start the server:

npm start

Open:

http://localhost:3000

---

🧪 Testing

ELEVO has been tested for:

- Registration validation
- Password validation
- Password matching
- Theme switching
- Theme persistence
- Chat interactions
- Offline chatbot responses
- AI integration
- Chat history
- Image generation
- Responsive layouts
- Mobile compatibility
- Invalid form submissions

---

🌐 GitHub Pages

ELEVO is compatible with GitHub Pages because the frontend does not require a build system.

Live Demo

"https://madhunandhika.github.io/ELEVO-Chat-Box/"

The main entry point is:

index.html

---

🎯 Skills Demonstrated

This project demonstrates practical experience in:

- HTML5
- CSS3
- JavaScript
- Responsive web design
- Flexbox
- CSS Grid
- CSS animations
- DOM manipulation
- Event handling
- Form validation
- Regular expressions
- LocalStorage
- Fetch API
- Async/await
- AI API integration
- Chatbot development
- Node.js
- Express.js
- Git and GitHub
- GitHub Pages deployment

---

🔮 Future Enhancements

Future versions of ELEVO could include:

- 🔐 Secure user authentication
- ☁️ Cloud-based chat synchronization
- 👤 User profiles
- 🎙️ Voice input
- 🔊 Spoken chatbot responses
- 🌍 Multi-language support
- 📱 Mobile application
- 🧠 Expanded offline knowledge base
- 📤 Conversation export
- 🔄 Cross-device synchronization
- 🤖 Additional AI model integrations

---

📚 Documentation

Detailed technical documentation is available in:

DOCUMENTATION.md

It contains information about the project's:

- Implementation
- Features
- Chatbot workflow
- Validation system
- Testing
- Requirements
- Future improvements

---

👩‍💻 Developer

Madhunandhika

ELEVO was developed as a practical project to explore web development, chatbot development, responsive UI design, JavaScript, API integration, and AI-powered applications.

---

⭐ Project Highlights

«A responsive AI chatbot built from scratch using HTML, CSS and JavaScript.»

«Supports both offline knowledge-based responses and real AI-generated answers.»

«Includes chat history, image generation, responsive design, dark/light mode and interactive registration.»

---

📄 License

This project is created for educational and portfolio purposes.
