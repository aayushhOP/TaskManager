# Task Manager (MERN)

A full-stack task manager with user authentication and a three-stage Kanban board: **To Do**, **In Progress**, and **Done**.

## Project structure

```
TM/
├── backend/     # Express + MongoDB API
└── frontend/    # React (Vite) SPA
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/TaskManager
JWT_SECRET=change_this_to_a_long_random_string
CLIENT_URL=http://localhost:5173
```

Start the API:

```bash
npm run dev
```

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

The default `VITE_API_URL` is optional in development — Vite proxies `/api` to the backend. For production builds, set:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the app:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Sign in |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/tasks` | Yes | List tasks |
| POST | `/api/tasks` | Yes | Create task |
| PATCH | `/api/tasks/:id` | Yes | Update task / stage |
| DELETE | `/api/tasks/:id` | Yes | Delete task |

Task `stage` values: `todo`, `in_progress`, `done`.

## Features

- Register and login with JWT
- Create, edit, and delete tasks
- Move tasks between three stages via dropdown or column view
- Responsive layout (stacked columns on mobile)
- Loading spinners and dismissible error alerts

## Production build

```bash
cd frontend && npm run build
```

Serve the `frontend/dist` folder with any static host and point `VITE_API_URL` at your deployed API. Ensure `CLIENT_URL` on the backend matches your frontend origin for CORS.

## Deploy to Vercel

Deploy **backend** and **frontend** as two Vercel projects (root directories `backend` and `frontend`). Use MongoDB Atlas for the database.

**Full step-by-step guide:** [DEPLOY.md](./DEPLOY.md)
