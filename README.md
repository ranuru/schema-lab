# SchemaLab

SchemaLab is a web-based learning platform for **schema matching** and **schema versioning** challenges (DAT355 semester project at HVL).
In short, it lets learners practice transforming and aligning data schemas through interactive coding challenges with automated feedback.

Users can browse and solve challenges, while authenticated users can submit solutions and create/edit challenges.

---

## Tech stack

- **Frontend:** React + Vite + Nginx
- **Backend:** Spring Boot 4 (Java 25), Spring Security, Spring Data JPA
- **Database:** PostgreSQL 17
- **Code runner:** Python (Flask service)
- **Orchestration:** Docker Compose

---

## Quick start (recommended)

### Prerequisites

- [Docker](https://www.docker.com/) with Compose plugin

### Run the full app

```bash
docker compose up --build
```

Open: [http://localhost](http://localhost)

### Stop

```bash
docker compose down
```

---

## Services and ports

- `frontend` (Nginx): `http://localhost` (port `80`)
- `backend` (Spring Boot): `http://localhost:8080`
- `postgres`: port `5432`
- `runner` (Flask): internal service used via `/runner/` through frontend proxy

---

## Authentication

- API auth uses **HTTP Basic Auth**
- Register: `POST /api/auth/register`
- Login check: `POST /api/auth/login`
- A development admin user is seeded on startup:
  - username: `dev`
  - password: `dev`

---

## API overview

### Challenges

- `GET /api/challenges` (public)
- `GET /api/challenges/{id}` (public)
- `POST /api/challenges` (authenticated)
- `PUT /api/challenges/{id}` (owner/admin)
- `DELETE /api/challenges/{id}` (owner/admin)

### Submissions

- `POST /api/submissions` (authenticated)
- `GET /api/submissions/me` (authenticated)
- `GET /api/submissions/me/passed` (authenticated)

---

## Local development without Docker (optional)

### Backend

```bash
./gradlew bootRun
```

Backend expects PostgreSQL using values from `src/main/resources/application.properties`:

- DB: `schemalab`
- User: `schemalab`
- Password: `schemalab`
- URL default: `jdbc:postgresql://localhost:5432/schemalab`

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

---

## Validation commands

### Backend

```bash
./gradlew build --no-daemon
```

### Frontend

```bash
cd frontend
npm ci
npm run lint
npm run build
```

---

## Project structure

- `src/main/java/no/hvl/schemalab` – backend code (controllers, config, models, repositories, seeding)
- `src/main/resources` – backend configuration
- `frontend/` – React app and frontend container config
- `runner/` – Python execution service for challenge code
- `docker-compose.yml` – full local stack

---

## Authors

- Runar S. Røssevold
- Fredrik Moen
