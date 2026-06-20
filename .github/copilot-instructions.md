# Repo-specific Copilot instructions

This file gives concise, actionable guidance to coding agents working on this repository.

1) Big picture
- Backend: `backend/` — Express app started from `backend/server.js` which loads `backend/src/app.js`.
- API base path: `/api/*` (routes registered in `backend/src/app.js`).
- Frontend: static files under `frontend/app/` (no JS build step; pages are plain HTML+vanilla JS).
- Database: PostgreSQL. Connection pool in `backend/src/config/database.js`. Schema in `database/schema.sql`.

2) How the backend is organized (common pattern)
- Routes: `backend/src/api/routes/*.js` (register endpoints and map to controllers).
- Controllers: `backend/src/api/controllers/*` (HTTP layer, input validation, call services).
- Services: `backend/src/core/services/*` (business logic, orchestrates repos and rules).
- Repositories: `backend/src/db/repositories/*` (direct DB queries using the exported `pool`).
- Middlewares: `backend/src/middlewares/*` (auth, role checks, validation, error handling).

3) Common developer workflows / commands
- Run backend (dev):
  - `cd backend && npm install` (first time)
  - `cd backend && npm run dev` (requires `nodemon`) — restarts on change
  - `cd backend && npm start` (production / simple run)
- Frontend: open `frontend/app/index.html` in a browser or serve the folder via a simple static server (e.g. `npx http-server frontend/app`).

4) Environment & secrets
- Uses `.env` read by `dotenv`. Important vars used in code:
  - `PORT` — server port (defaults to 3000)
  - `JWT_SECRET` — used by `backend/src/config/auth.js`
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — DB connection

5) Conventions & patterns to follow (concrete)
- When adding an API endpoint:
  1. Add a controller in `backend/src/api/controllers/`.
  2. Add a route file in `backend/src/api/routes/` or update an existing one.
  3. Register the route in `backend/src/app.js` (`app.use('/api/your', yourRoutes)`).
  4. Put DB access in a repo (`backend/src/db/repositories/`) and call it from a service (`backend/src/core/services/`).
- Error handling: throw errors with a `statusCode` property when you want a specific HTTP status; the global handler in `backend/src/middlewares/error.middleware.js` formats responses.
- Authentication: JWT tokens (see `backend/src/config/auth.js`) — expect `Authorization: Bearer <token>` header.
- File uploads: `multer` is used; uploaded files placed in `uploads/`.

6) Integration points & important files
- `backend/server.js` — process entrypoint
- `backend/src/app.js` — route registration and global middlewares
- `backend/src/config/database.js` — Postgres pool + DB defaults
- `database/schema.sql` — canonical DB schema to setup test/dev DB
- `backend/src/utils/generateReference.js` and `backend/src/utils/constants.js` — project helpers used across services

7) Tests & CI
- Tests folder exists under `tests/` but currently empty. No CI config found — run local scripts above for validation.

8) What to avoid / known patterns
- Do not add DB queries directly in controllers; keep them in repository modules.
- Logging uses simple `console` statements (no structured logger). Keep messages clear and short.

If any part of this instruction is unclear or you want more detail (examples of adding a route, a service, or a DB migration), tell me which area to expand and I will iterate.
