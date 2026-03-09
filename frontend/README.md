# CinemaTrial — Frontend

Frontend for **CinemaTrial**, a brutalist-style movie discovery platform.
Built with **React + Vite**, featuring modern animations and a mobile-first UI for discovering movies and TV shows.

---

# 🚀 Tech Stack

* **React** – UI framework
* **Vite** – Fast development & build tool
* **React Router** – Client-side routing
* **Redux Toolkit** – State management
* **Framer Motion** – Page transitions and UI animations
* **GSAP** – Advanced animation effects
* **Swiper.js** – Movie sliders and carousels
* **TMDB API** – Movie data provider
* **Google Fonts** – Typography
* **CSS / Utility styling** – Layout and design system

---

# 📂 Project Structure

```
frontend
│
├── src
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│
│   ├── app
│   │   └── store.js                 # Redux store
│
│   ├── components
│   │   ├── common                   # Shared UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── SkeletonCard.jsx
│   │   │
│   │   └── ui                       # UI primitives
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Badge.jsx
│   │       └── Modal.jsx
│
│   ├── features                     # Redux slices
│   │   ├── auth
│   │   ├── favorites
│   │   └── watchHistory
│
│   ├── hooks                        # Custom React hooks
│   │   ├── useDebounce.js
│   │   ├── useGsapReveal.js
│   │   └── useInfiniteScroll.js
│
│   ├── pages                        # Application routes
│   │   ├── Home.jsx
│   │   ├── Search.jsx
│   │   ├── MovieDetail.jsx
│   │   ├── Favorites.jsx
│   │   ├── WatchHistory.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── admin
│   │       ├── AdminDashboard.jsx
│   │       ├── ManageMovies.jsx
│   │       └── ManageUsers.jsx
│
│   ├── services                     # API integrations
│   │   ├── api.js
│   │   └── tmdb.js
│
│   └── utils
│       ├── constants.js
│       └── helpers.js
│
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

# ⚙️ Installation

Install dependencies:

```bash
cd frontend
npm install
```

---

# 🧪 Development

Run the development server:

```bash
npm run dev
```

App will start at:

```
http://localhost:5173
```

---

# 📦 Production Build

```bash
npm run build
```

---

# 🌐 Environment Variables

Create a `.env` file in the root of the frontend:

```
VITE_API_URL=http://localhost:5000
VITE_TMDB_API_KEY=your_tmdb_api_key
```

---

# 🎬 Features

* Trending movies and TV shows
* Movie search with debounce
* Movie detail pages
* User authentication
* Favorites system
* Watch history tracking
* Admin dashboard
* Infinite scroll movie loading
* Smooth animations using **Framer Motion + GSAP**
* Interactive sliders with **Swiper**

---

# 👨‍💻 Author

Ashmit
