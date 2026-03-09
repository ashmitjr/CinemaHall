# CinemaTrial — Backend

Backend service for **CinemaTrial**, providing authentication, favorites, watch history, and admin management APIs.

Built with **Node.js + Express + PostgreSQL (NeonDB) + Drizzle ORM**.

---

# 🚀 Tech Stack

* **Node.js**
* **Express**
* **PostgreSQL**
* **Drizzle ORM**
* **JWT Authentication**
* **bcrypt**
* **Rate Limiting**
* **NeonDB**

---

# 📂 Project Structure

```
backend
│
├── src
│   ├── app.js                    # Express app setup
│   │
│   ├── config
│   │   ├── db.js                 # Database connection
│   │   └── env.js                # Environment config
│   │
│   ├── db
│   │   └── schema.js             # Database schema (Drizzle)
│   │
│   ├── middlewares
│   │   ├── auth.middleware.js
│   │   ├── admin.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── modules                   # Feature modules
│   │   ├── auth
│   │   │   ├── auth.controller.js
│   │   │   └── auth.routes.js
│   │   │
│   │   ├── favorites
│   │   │   ├── favorites.controller.js
│   │   │   └── favorites.routes.js
│   │   │
│   │   ├── watchHistory
│   │   │   ├── watchHistory.controller.js
│   │   │   └── watchHistory.routes.js
│   │   │
│   │   └── admin
│   │       ├── admin.controller.js
│   │       └── admin.routes.js
│   │
│   └── utils
│       ├── jwt.js
│       ├── hash.js
│       └── apiResponse.js
│
├── drizzle.config.js
├── index.js                      # Server entry point
└── package.json
```

---

# ⚙️ Installation

```bash
cd backend
npm install
```

---

# 🧪 Development

```bash
npm run dev
```

Runs the backend server.

Default:

```
http://localhost:5000
```

---

# 🌐 Environment Variables

Create a `.env` file:

```
PORT=5000
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_secret_key
TMDB_API_KEY=your_tmdb_api_key
```

---

# 📡 API Modules

### Auth

* Register
* Login
* JWT authentication

### Favorites

* Add movie to favorites
* Remove favorite
* Get user favorites

### Watch History

* Track watched movies
* Fetch watch history

### Admin

* Manage movies
* Manage users

---

# 🛡 Security

* JWT authentication
* bcrypt password hashing
* Rate limiting
* Admin route protection

---

# 🗄 Database

Database uses **PostgreSQL with Drizzle ORM**.

Tables include:

```
users
favorites
watch_history
admin_movies
```

---

# 🚀 Deployment

Recommended stack:

* **Backend** → Railway
* **Database** → NeonDB
* **Frontend** → Vercel

---

# 👨‍💻 Author

Ashmit
