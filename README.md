# Task Manager

A full-stack task management application built with React on the frontend and Express.js on the backend, deployed on Vercel with MongoDB as the database.

---

## Live Demo

| Service  | URL |
|----------|-----|
| Frontend | https://task-manager-qbae.vercel.app |
| Backend API | https://task-manager-eight-mauve-63.vercel.app |
| Health Check | https://task-manager-eight-mauve-63.vercel.app/api/health |

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Assumptions](#assumptions)
- [Tradeoffs](#tradeoffs)
- [Technical Decisions](#technical-decisions)

---

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete tasks
- Protected routes — only authenticated users can manage tasks
- Deployed as serverless functions on Vercel
- Supports Vercel preview deployments via dynamic CORS

---

## Tech Stack

### Frontend
- **React** — UI library
- **Vite** — Build tool and dev server
- **Vercel** — Hosting and deployment

### Backend
- **Node.js** — Runtime
- **Express.js** — Web framework
- **MongoDB** — NoSQL database
- **Mongoose** — ODM for MongoDB
- **JWT (jsonwebtoken)** — Authentication tokens
- **bcryptjs** — Password hashing
- **cors** — Cross-Origin Resource Sharing
- **dotenv** — Environment variable management
- **Vercel** — Serverless deployment

---

## Project Structure

```
backend/
├── api/
│   └── index.js          # Vercel serverless entry point
├── lib/
│   └── db.js             # MongoDB connection logic
├── middleware/
│   ├── auth.js           # JWT verification middleware
│   └── errorHandler.js   # Global error handler
├── models/
│   ├── Task.js           # Mongoose Task schema
│   └── User.js           # Mongoose User schema
├── routes/
│   ├── auth.js           # Auth routes (register, login)
│   └── tasks.js          # Task CRUD routes
├── scripts/              # Utility scripts
├── app.js                # Express app setup (CORS, routes, middleware)
├── server.js             # Local development server entry point
├── vercel.json           # Vercel deployment config
├── package.json
├── .env                  # Local environment variables (not committed)
└── .env.example          # Example env file for reference
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Fill in your values in the `.env` file (see [Environment Variables](#environment-variables) below).

### 4. Run the development server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

---

## Environment Variables

Create a `.env` file in the backend root with the following variables:

```env
# MongoDB connection string from MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager

# JWT secret key — use a long random string
JWT_SECRET=your_super_secret_jwt_key

# Primary frontend URL
CLIENT_URL=https://task-manager-qbae.vercel.app

# Comma-separated list of additional allowed frontend URLs (optional)
CLIENT_URLS=https://preview-url-1.vercel.app,https://preview-url-2.vercel.app

# Allow all *.vercel.app origins (useful for preview deployments)
ALLOW_VERCEL_PREVIEWS=true

# Environment
NODE_ENV=production
```

> **Never commit your `.env` file.** Use `.env.example` to document required variables.

---

## API Reference

### Base URL
```
https://task-manager-eight-mauve-63.vercel.app
```

---

### Auth Routes

#### Register
```
POST /api/auth/register
```
**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

#### Login
```
POST /api/auth/login
```
**Request body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Task Routes

> All task routes require the `Authorization` header:
> ```
> Authorization: Bearer <your_jwt_token>
> ```

#### Get all tasks
```
GET /api/tasks
```

#### Create a task
```
POST /api/tasks
```
**Request body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "pending"
}
```

#### Update a task
```
PUT /api/tasks/:id
```
**Request body:**
```json
{
  "title": "Buy groceries",
  "status": "completed"
}
```

#### Delete a task
```
DELETE /api/tasks/:id
```

---

### Health Check
```
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "message": "Task Manager API is running",
  "database": "connected"
}
```

---

## Deployment

### Backend — Vercel

The backend is deployed as a **serverless function** on Vercel.

**`vercel.json`:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.js"
    }
  ]
}
```

**`api/index.js`** simply exports the Express app:
```js
import app from '../app.js';
export default app;
```

### Environment Variables on Vercel

Go to your backend project on Vercel → **Settings → Environment Variables** and add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Your secret key |
| `CLIENT_URL` | Your frontend URL |
| `ALLOW_VERCEL_PREVIEWS` | `true` |
| `NODE_ENV` | `production` |

After adding variables, go to **Deployments → Redeploy** to apply them.

---

## Assumptions

- **Single user per email** — The system assumes each email address maps to exactly one account. Duplicate email registration is rejected.
- **Stateless authentication** — The API assumes clients store JWT tokens on their end (localStorage or memory). No server-side session management is used.
- **Tasks belong to users** — Each task is assumed to be private to the user who created it. There is no task sharing or collaboration.
- **MongoDB Atlas** — The project assumes a cloud-hosted MongoDB instance (Atlas). A local MongoDB URI also works but is not the primary target.
- **Vercel for both frontend and backend** — Both services are assumed to be on Vercel, which is why dynamic `.vercel.app` origin support was added to CORS.
- **Modern browsers** — The frontend assumes ES module support and a modern browser environment.

---

## Tradeoffs

### 1. Express on Vercel Serverless vs a Dedicated Server
**Decision:** Deploy Express as a Vercel serverless function via `api/index.js`.

**Tradeoff:** Serverless is cheap and scales automatically, but introduces **cold start latency** — the first request after inactivity may take 1–3 seconds. A dedicated server (e.g. Railway, Render) would have consistent response times but costs more.

---

### 2. JWT in Client Storage vs HTTP-Only Cookies
**Decision:** JWT tokens are returned in the response body and stored by the client.

**Tradeoff:** Simpler to implement and works well across different origins (frontend and backend on different Vercel domains). However, storing tokens in `localStorage` is vulnerable to XSS attacks. HTTP-only cookies are more secure but require more complex CORS and `SameSite` cookie configuration across different domains.

---

### 3. Dynamic CORS via `origin.endsWith('.vercel.app')` vs Explicit Whitelist
**Decision:** Allow all `*.vercel.app` origins in addition to an explicit `CLIENT_URL`.

**Tradeoff:** This makes it easy to test Vercel preview deployments without updating env variables every time. However, it means **any** Vercel-hosted app could technically call this API. This is acceptable for a personal/demo project but should be tightened to an explicit list in a production app.

---

### 4. Per-Request DB Connection vs Persistent Connection
**Decision:** `connectDB()` is called inside a middleware on every request, with Mongoose caching the connection internally.

**Tradeoff:** This is necessary for serverless environments where the Node.js process may be restarted between requests. Mongoose's built-in connection caching prevents opening a new connection every time, but adds a small overhead per request compared to a persistent server that connects once on startup.

---

### 5. No Refresh Tokens
**Decision:** Only access tokens (JWT) are issued, with no refresh token mechanism.

**Tradeoff:** Simpler implementation and no need for a token store. The downside is that once a token expires, the user must log in again. A refresh token system would improve UX for long sessions but requires storing refresh tokens securely (ideally in HTTP-only cookies with a database record).

---

## Technical Decisions

### Why Express instead of Next.js API Routes?
Express gives full control over middleware ordering, error handling, and routing. Since the backend is a standalone API (not part of a Next.js app), Express is a natural fit and keeps the frontend/backend concerns cleanly separated.

### Why MongoDB + Mongoose?
MongoDB's flexible schema works well for a task management app where task fields may evolve. Mongoose adds schema validation, type casting, and a clean model layer on top of the raw MongoDB driver, reducing boilerplate.

### Why Vercel for the backend?
Vercel's serverless platform allows zero-config deployment directly from GitHub with automatic preview deployments on every PR. For a project of this scale, it eliminates the need to manage a server, handle SSL, or configure CI/CD manually.

### Why bcryptjs instead of bcrypt?
`bcryptjs` is a pure JavaScript implementation that works in all environments without native bindings. `bcrypt` requires native C++ compilation which can cause issues in some deployment environments (including Vercel). The security difference is negligible for this use case.

### Why `type: "module"` in package.json?
The project uses ES module syntax (`import`/`export`) throughout for consistency with the React frontend and to use modern JavaScript without a build step on the backend.

---

## License

MIT