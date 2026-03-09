# 🎬 CinemaTrial — Full Stack Movie Platform

CinemaTrial is a **full-stack movie discovery platform** that allows users to explore movies and TV shows, search content in real time, watch trailers, and manage personal movie preferences such as favorites and watch history.

<img width="1604" height="907" alt="image" src="https://github.com/user-attachments/assets/77d47d4c-6c36-4f85-8bab-adfb5adb0d41" />


The platform integrates **The Movie Database (TMDB) API** for movie data and uses a **custom backend API** for authentication, favorites, watch history, and admin management.

This project was built as a **technical qualification task for the Sheryians Tech Volunteer Program**, demonstrating the ability to:

* Build real applications
* Learn technologies independently
* Integrate APIs and backend services
* Structure production-style full stack applications
* Explain technical concepts clearly

---

# 🚀 Live Features

### 🎥 Movie Discovery

* Trending movies
* Popular movies
* Movies & TV Shows
* Dynamic movie data from **TMDB API**

### 🔍 Real-Time Search

Users can search for:

* Movies
* TV Shows
* Actors / People

Features:

* Debounced search
* Fast UI updates
* API optimization

---

### ▶️ Movie Trailer

Each movie includes a **YouTube trailer preview**.

If unavailable:

```
Trailer for this movie is currently unavailable.
```

Trailers open in a modal preview.

---

### ❤️ Favorites System

Authenticated users can:

* Add movies to favorites
* Remove movies from favorites
* View saved favorites

Favorites are stored in the backend database.

---

### 🕒 Watch History

When users:

* Open a movie page
* Watch a trailer

The movie is stored in **watch history**.

Users can view their recently watched movies.

---

### 🔐 Authentication

Users can:

* Sign Up
* Log In
* Log Out

Security features:

* JWT authentication
* Password hashing
* Protected routes

---

### 🛠 Admin Dashboard

Admins can:

* Add movies
* Edit movie details
* Delete movies
* View users
* Ban users
* Delete users

Admin operations use **secure backend APIs**.

---

# 🧠 Performance Features

The application includes several performance optimizations:

* Debounced search
* Lazy loading
* Infinite scrolling
* Efficient API usage
* Optimized Redux state management

---

# 🎨 UI / UX

CinemaTrial uses a **modern brutalist-inspired interface** featuring:

* smooth animations
* responsive layout
* cinematic UI
* skeleton loaders
* interactive movie cards

The design focuses on **clarity, performance, and visual impact**.

---

# 🧱 Tech Stack

## Frontend

* React
* Vite
* Redux Toolkit
* React Router
* Framer Motion
* GSAP
* Swiper.js
* Google Fonts
* TMDB API

Features implemented:

* Infinite Scroll
* Debouncing
* Responsive design
* Skeleton loaders

---

## Backend

* Node.js
* Express.js
* PostgreSQL
* Drizzle ORM
* JWT Authentication
* Rate Limiting

---

# 📂 Project Structure

```id="84312"
CinemaHall
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── db
│   │   ├── middlewares
│   │   ├── modules
│   │   └── utils
│   └── index.js
│
└── frontend
    ├── src
    │   ├── components
    │   ├── features
    │   ├── pages
    │   ├── hooks
    │   └── services
    └── vite.config.ts
```

---

# ⚙️ Installation

Clone the repository

```bash id="73111"
git clone https://github.com/yourusername/CinemaHall.git
```

---

## Install Backend

```bash id="73112"
cd backend
npm install
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## Install Frontend

```bash id="73113"
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 🌐 Environment Variables

Backend `.env`

```
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
TMDB_API_KEY=your_tmdb_api_key
```

Frontend `.env`

```
VITE_API_URL=http://localhost:5000
VITE_TMDB_API_KEY=your_tmdb_api_key
```

---

# 🧩 Error Handling

The app handles missing data gracefully.

Examples:

| Scenario            | Behavior                    |
| ------------------- | --------------------------- |
| Missing poster      | Placeholder image           |
| Missing description | "Description not available" |
| Missing trailer     | "Trailer not available"     |

The UI never crashes due to missing API data.

---

# 📈 Possible Improvements

Future enhancements may include:

* Dark / Light theme
* Movie ratings
* Genre filtering
* Bookmark system
* Watchlist
* Recommendation engine

---

# 👨‍💻 Author

Ashmit

---

# 📜 License

This project is licensed under the MIT License.

See the **LICENSE** file for details.
