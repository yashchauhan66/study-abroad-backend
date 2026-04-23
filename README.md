# Study Abroad Platform API

A full-stack project for a study-abroad platform where students can discover universities, get recommendations, apply to programs, and track application status.

This repository contains:
- `backend`: Node.js + Express + MongoDB API
- `frontend`: React + Vite client

## Features

- **JWT Authentication**
  - Register and login
  - Protected routes with token validation
  - Password hashing with `bcryptjs`

- **University Discovery**
  - List universities
  - Filtering, pagination, and sorting
  - Popular universities endpoint

- **Recommendation System**
  - MongoDB aggregation based scoring
  - Country, field, budget, intake, and IELTS score matching

- **Application Workflow**
  - Apply to a program
  - Duplicate application prevention
  - Status transitions with timeline tracking

- **Rate Limiting (Implemented)**
  - Global API protection via `express-rate-limit`
  - Current config: max `100` requests per `15 minutes` per IP

- **Testing**
  - Beginner-friendly API tests using `Jest` + `Supertest`

- **Dockerized Deployment**
  - Dockerfiles for frontend and backend
  - `docker-compose.yml` with frontend + backend + MongoDB

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- React + Vite
- JWT
- Jest + Supertest
- Docker + Docker Compose

## Project Structure

```text
.
|-- backend
|   |-- src
|   |   |-- config
|   |   |-- controllers
|   |   |-- middleware
|   |   |-- models
|   |   |-- routes
|   |   |-- services
|   |   `-- utils
|   |-- tests
|   `-- Dockerfile
|-- frontend
|   |-- src
|   |-- nginx.conf
|   `-- Dockerfile
`-- docker-compose.yml
```

## Local Setup (Without Docker)

### 1) Backend

```bash
cd backend
npm install
```

Create `.env` in `backend`:

```env
PORT=4000
MONGODB_URI=your MONGO_URI
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
CACHE_TTL_SECONDS=300
```

Run backend:

```bash
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

## Docker Setup (Frontend + Backend + MongoDB)

Make sure Docker Desktop is running, then from project root:

```bash
docker compose up --build -d
```

Useful commands:

```bash
docker compose logs -f
docker compose down
docker compose down -v
```

Service URLs:
- Frontend: `http://localhost:8081`
- Backend: `http://localhost:4000`
- MongoDB: `mongodb://localhost:27017`

## API Endpoints (Core)

- **Auth**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`

- **Universities**
  - `GET /api/universities`
  - `GET /api/universities/popular`

- **Applications**
  - `POST /api/applications`
  - `GET /api/applications`
  - `PATCH /api/applications/:id/status`

- **Recommendations**
  - `GET /api/recommendations/:studentId`

## Testing

From `backend`:

```bash
npm test
```

## Notes

- Rate limiting is enabled globally in `backend/src/app.js`.
- Recommendation logic uses MongoDB aggregation for better performance and scoring flexibility.

## Author

- Yash Chauhan
- Email: `yashchauhan6660@gmail.com`
- Portfolio: [https://portfolio-two-orpin-43.vercel.app/](https://portfolio-two-orpin-43.vercel.app/)
- GitHub: [https://github.com/yashchauhan66](https://github.com/yashchauhan66)