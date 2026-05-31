# Deploy to Vercel (Frontend + Backend)

Deploy the **backend** and **frontend** as **two separate Vercel projects** from this repo. You need [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier works) because Vercel cannot run a local MongoDB instance.

---

## Step 1: MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Database Access** → create a database user (username + password).
3. **Network Access** → add `0.0.0.0/0` (allow from anywhere) so Vercel can connect.
4. **Connect** → choose **Drivers** → copy the connection string.
5. Replace `<password>` with your user password and set the database name, e.g.:

   ```
   mongodb+srv://myuser:MY_PASSWORD@cluster0.xxxxx.mongodb.net/TaskManager?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy the backend

### Option A — Vercel Dashboard (recommended)

1. Push this repo to **GitHub** (if you have not already).
2. Go to [vercel.com/new](https://vercel.com/new) → **Import** your repository.
3. Configure the project:
   - **Project name:** e.g. `task-manager-api`
   - **Root Directory:** `backend` ← important
   - **Framework Preset:** Other
   - **Build Command:** leave empty (or `npm install`)
   - **Output Directory:** leave default
4. **Environment variables** (Production):

   | Name | Value |
   |------|--------|
   | `MONGODB_URI` | Your Atlas connection string |
   | `JWT_SECRET` | Long random string (e.g. from `openssl rand -base64 32`) |
   | `CLIENT_URL` | Your frontend URL (set after Step 3, or use placeholder and update) |
   | `ALLOW_VERCEL_PREVIEWS` | `true` (optional; allows `*.vercel.app` preview URLs for CORS) |

5. Click **Deploy**.
6. Copy your backend URL, e.g. `https://task-manager-api.vercel.app`.

7. Test: open `https://YOUR-BACKEND.vercel.app/api/health` — you should see `{"status":"ok",...}`.

### Option B — Vercel CLI

```bash
cd backend
npm i -g vercel
vercel login
vercel
```

Set env vars in the dashboard or with `vercel env add`.

---

## Step 3: Deploy the frontend

1. [vercel.com/new](https://vercel.com/new) → import the **same** repository again (second project).
2. Configure:
   - **Project name:** e.g. `task-manager-app`
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. **Environment variables** (Production):

   | Name | Value |
   |------|--------|
   | `VITE_API_URL` | `https://YOUR-BACKEND.vercel.app/api` |

   Use your real backend URL from Step 2. **No trailing slash** after `/api`.

4. Deploy and copy the frontend URL, e.g. `https://task-manager-app.vercel.app`.

---

## Step 4: Link backend CORS to frontend

1. Open the **backend** project on Vercel → **Settings** → **Environment Variables**.
2. Set or update:

   | Name | Value |
   |------|--------|
   | `CLIENT_URL` | `https://task-manager-app.vercel.app` (your frontend URL, no trailing slash) |

3. **Redeploy** the backend (Deployments → ⋯ → Redeploy) so CORS picks up the new value.

If you use Vercel preview deployments for the frontend, either:

- Set `ALLOW_VERCEL_PREVIEWS=true` on the backend, or  
- Add preview URLs to `CLIENT_URLS` (comma-separated):

  ```
  https://task-manager-app.vercel.app,https://task-manager-app-git-main-you.vercel.app
  ```

---

## Step 5: Verify

1. Open the frontend URL.
2. Register a new account.
3. Create and move tasks between stages.

If login fails with a network/CORS error, double-check `CLIENT_URL` and `VITE_API_URL`.

---

## Quick reference

| Project | Root directory | Key env vars |
|---------|----------------|--------------|
| Backend | `backend` | `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` |
| Frontend | `frontend` | `VITE_API_URL` |

**Order:** Deploy backend first → note URL → deploy frontend with `VITE_API_URL` → set `CLIENT_URL` on backend → redeploy backend.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error in browser | `CLIENT_URL` must exactly match frontend origin (scheme + host, no path). |
| `MONGODB_URI is not defined` | Add `MONGODB_URI` in Vercel backend env vars and redeploy. |
| MongoDB timeout | Atlas **Network Access** must allow `0.0.0.0/0` or Vercel IPs. |
| 404 on frontend routes | `frontend/vercel.json` SPA rewrite should be present; redeploy frontend. |
| API 404 | Backend **Root Directory** must be `backend`, not repo root. |
| Env change not applied | Redeploy after changing variables (`VITE_*` are baked in at **build** time for frontend). |

---

## Local development (unchanged)

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Use `backend/.env` and optional `frontend/.env` with `VITE_API_URL=http://localhost:5000/api` for production-like local API calls.
