# Hackathon Full-Stack App

React + Redux Toolkit frontend, Express + MongoDB/Mongoose backend, JWT auth,
a protected Dashboard, and a full CRUD example — wired together end to end
(no mock backend, this talks to a real MongoDB).

## Stack
**Client:** React 18, Vite, Redux Toolkit, React Router v6, Tailwind CSS,
Axios, react-toastify
**Server:** Node, Express, Mongoose, JWT (jsonwebtoken), bcryptjs, cors

## Project structure
```
hackathon-fullstack/
  client/     React app (Vite)
  server/     Express API + MongoDB/Mongoose
```

## Getting started

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
```
Edit `.env`:
- `MONGO_URI` — a local MongoDB (`mongodb://127.0.0.1:27017/hackathon`) or an
  Atlas connection string
- `JWT_SECRET` — any long random string

```bash
npm run dev
```
Runs on http://localhost:5000. Check http://localhost:5000/api/health.

### 2. Frontend
In a second terminal:
```bash
cd client
npm install
cp .env.example .env   # VITE_API_BASE_URL defaults to http://localhost:5000/api
npm run dev
```
Runs on http://localhost:5173.

## What's included
**Server**
- `models/User.js` — schema with bcrypt password hashing (`pre('save')` hook)
  and a `comparePassword` method
- `models/Item.js` — example CRUD resource, scoped to its owning user
- `controllers/authController.js` — register/login, issues JWTs
- `controllers/itemController.js` — full CRUD, always scoped to `req.user._id`
- `middleware/authMiddleware.js` — verifies the `Authorization: Bearer <token>`
  header and attaches `req.user`
- `middleware/errorMiddleware.js` — centralized 404 + error handling
- `config/db.js` — Mongoose connection

**Client**
- `features/auth/authSlice.js` — register/login via `createAsyncThunk`,
  persists `{ user, token }` to localStorage
- `features/items/itemsSlice.js` — fetch/create/update/delete thunks for the
  CRUD example — copy this pattern for your real hackathon resource
- `utils/axiosInstance.js` — attaches the JWT to every request, clears storage
  on a 401
- `routes/ProtectedRoute.jsx` / `PublicOnlyRoute.jsx` — route guards
- `pages/` — Home, Register, Login, Dashboard, NotFound
- `components/` — Navbar, FormInput, Loader

## Swapping the CRUD resource for your real one
1. Duplicate `server/models/Item.js`, `controllers/itemController.js`, and
   `routes/itemRoutes.js` for your real resource (rename `Item` → whatever
   you're building — tasks, posts, submissions, etc.), then mount the new
   route in `server.js`.
2. On the client, duplicate `features/items/itemsSlice.js` the same way and
   add the new reducer to `app/store.js`.
3. Update `Dashboard.jsx` (or add a new page) to use the new slice.

Auth (register/login/protected routes) needs no changes — it's independent
of whatever resource you build on top of it.

## Notes
- Passwords are hashed with bcrypt before saving — never stored in plaintext.
- JWTs expire after `JWT_EXPIRES_IN` (default 7 days, set in `server/.env`).
- Items are scoped per-user: one user can never see or edit another's items.
- Toasts are wired up globally via `<ToastContainer />` in `main.jsx`.
