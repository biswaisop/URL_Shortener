# URL Shortener

A minimal URL shortener built with **FastAPI**, **PostgreSQL**, and **React**.

Paste a long URL, get a short link, click it and get redirected — that's it.

🔗 **Live:** [url-shortener-1-h07j.onrender.com](https://url-shortener-1-h07j.onrender.com/)

---

## How It Works

```
User pastes URL ──▶ POST /api/v1/shorten ──▶ Generate 6-char code
                                              Store in Postgres
                                              Return short URL
                                              
Anyone visits short URL ──▶ GET /:code ──▶ Lookup code in DB
                                            Increment click count
                                            307 redirect to original
```

1. The frontend sends the long URL to the backend API.
2. The backend generates a random 6-character alphanumeric code (checking for collisions).
3. If the same URL was already shortened before, the existing short code is returned instead.
4. When someone visits the short URL, the backend looks up the code, bumps the click counter, and redirects with a `307`.

---

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, routes, CORS, lifespan
│   │   ├── config.py        # Environment variables
│   │   ├── database.py      # Async SQLAlchemy engine + session
│   │   ├── models.py        # URL table (id, short_code, original_url, click_count, created_at)
│   │   ├── schemas.py       # Pydantic request/response models
│   │   └── crud.py          # DB operations (create, lookup, increment clicks)
│   ├── Dockerfile
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── main.jsx                    # React entry point
    │   ├── App.jsx                     # Root component
    │   ├── index.css                   # Tailwind CSS + theme
    │   └── components/
    │       ├── Header.jsx              # Title + subtitle
    │       ├── ShortenForm.jsx         # URL input + submit
    │       ├── ResultCard.jsx          # Short URL display + copy button
    │       └── ErrorMessage.jsx        # Inline error banner
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## API Endpoints

| Method | Path               | Description                          |
| ------ | ------------------ | ------------------------------------ |
| POST   | `/api/v1/shorten`  | Shorten a URL → `{ short_url, ... }` |
| GET    | `/:short_code`     | Redirect to the original URL (307)   |
| GET    | `/api/v1/health`   | Health check → `{ status: "ok" }`    |

---

## Running Locally

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL (running locally or via Docker)

### 1. Backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL=postgresql+asyncpg://dev:dev@localhost:5432/urlshortener
BASE_URL=http://localhost:8000
SHORT_CODE_LENGTH=6
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
uvicorn app.main:app --reload
```

The API runs at **http://localhost:8000**. Docs are at `/docs`.

### 2. Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` (optional — defaults to `http://localhost:8000`):

```env
VITE_BACKEND_API_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
```

The app runs at **http://localhost:5173**.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable            | Required | Default                                              | Description                       |
| ------------------- | -------- | ---------------------------------------------------- | --------------------------------- |
| `DATABASE_URL`      | Yes      | `postgresql+asyncpg://dev:dev@db:5432/urlshortener`  | Async PostgreSQL connection string |
| `BASE_URL`          | No       | `http://localhost:8000`                               | Base URL used in short link output |
| `SHORT_CODE_LENGTH` | No       | `6`                                                  | Length of generated short codes    |
| `FRONTEND_URL`      | No       | `http://localhost:5173`                               | Allowed CORS origin               |

### Frontend (`frontend/.env`)

| Variable                | Required | Default                  | Description              |
| ----------------------- | -------- | ------------------------ | ------------------------ |
| `VITE_BACKEND_API_URL`  | No       | `http://localhost:8000`  | Backend API base URL     |

---

## Tech Stack

- **Backend:** FastAPI · SQLAlchemy (async) · PostgreSQL · Pydantic
- **Frontend:** React 19 · Vite · Tailwind CSS v4
- **Deployment:** Render

---

## Links

- **Live app:** https://url-shortener-1-h07j.onrender.com/
- **GitHub:** https://github.com/biswaisop/URL_Shortener
