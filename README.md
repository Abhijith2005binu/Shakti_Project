# ShaktiDB
Mini Project (Citizen Grievance / Service Request Portal)
# Citizen Grievance & Service Request Portal

> A full-stack e-governance web application that enables citizens to submit, track, and resolve grievances with government departments — built on ShaktiDB, India's sovereign open-source database.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Team](#team)
- [Institution](#institution)

---

## Overview

The **Citizen Grievance & Service Request Portal** is a mini project developed as part of the academic curriculum at **TKM College of Engineering (TKMCE)**. It is a web-based platform that bridges the gap between citizens and government departments by providing a transparent, role-based grievance management system.

Citizens can register, submit complaints, upload evidence, and track real-time status updates. Government officials can log in, review tickets, assign them to departments, update resolution status, and generate analytics reports.

The project is built entirely using **free and open-source technologies**, with **ShaktiDB** (a PostgreSQL 17.4 fork developed by IITM Pravartak / MeitY) as the primary database — deployed on **Ubuntu 24.04 LTS**.

---

## Features

### Citizen
- Register and log in securely
- Submit grievances with title, description, category, and location
- Upload photo evidence with a complaint
- Track real-time status updates (Open → In Progress → Resolved)
- View full timeline of actions taken on a ticket
- Rate resolution satisfaction (1–5 stars) and close ticket

### Official / Admin
- Secure login with role-based access
- View and filter all incoming grievances (by status, department, date)
- Assign grievances to specific departments or officers
- Add resolution notes and update ticket status
- Mark tickets as resolved
- View analytics dashboard (open/closed counts, average resolution time per department)

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Operating System | Ubuntu LTS | 24.04 |
| Database | ShaktiDB (PostgreSQL fork) | 17.4 |
| Backend Language | Python | 3.12 |
| Backend Framework | FastAPI | Latest |
| ORM | SQLAlchemy | Latest |
| DB Driver | psycopg2 | Latest |
| Auth | JWT + python-jose | Latest |
| Security | bcrypt / passlib | Latest |
| Frontend Language | TypeScript | 5.x |
| Frontend Framework | React | 18 |
| Styling | Tailwind CSS | 3.x |
| HTTP Client | Axios | Latest |
| Build Tool | Vite | Latest |
| Package Manager | npm | Latest |
| DB GUI | pgAdmin 4 | Latest |
| API Testing | Bruno | Latest |
| Version Control | Git | Latest |
| Code Editor | VS Code | Latest |

---

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│         React 18 + TypeScript + Tailwind         │
│              (Vite Dev Server :5173)             │
└──────────────────────┬──────────────────────────┘
                       │ HTTP (Axios)
                       ▼
┌─────────────────────────────────────────────────┐
│              FastAPI Backend                     │
│         Python 3.12 (Uvicorn :8000)             │
│   /auth   /grievances   /admin   /departments   │
└──────────────────────┬──────────────────────────┘
                       │ SQLAlchemy ORM
                       ▼
┌─────────────────────────────────────────────────┐
│          ShaktiDB (PostgreSQL 17.4 fork)         │
│              Ubuntu 24.04 LTS                   │
│   users · grievances · departments · updates    │
└─────────────────────────────────────────────────┘
```

---

## Database Schema

### Tables

**users**
```
id            SERIAL PRIMARY KEY
name          VARCHAR(100)
email         VARCHAR(150) UNIQUE
hashed_password VARCHAR
role          ENUM(citizen, official, admin)
created_at    TIMESTAMP
```

**departments**
```
id            SERIAL PRIMARY KEY
name          VARCHAR(100) UNIQUE
```

**grievances**
```
id            SERIAL PRIMARY KEY
title         VARCHAR(200)
description   TEXT
category      VARCHAR(100)
location      VARCHAR(200)
status        ENUM(open, in_progress, resolved, closed)
citizen_id    FK → users.id
department_id FK → departments.id
created_at    TIMESTAMP
updated_at    TIMESTAMP
```

**grievance_updates**
```
id            SERIAL PRIMARY KEY
grievance_id  FK → grievances.id
note          TEXT
status        ENUM(open, in_progress, resolved, closed)
updated_by    FK → users.id
created_at    TIMESTAMP
```

**ratings**
```
id            SERIAL PRIMARY KEY
grievance_id  FK → grievances.id
citizen_id    FK → users.id
score         INTEGER (1–5)
created_at    TIMESTAMP
```

---

## Project Structure

```
grievance-portal/
│
├── backend/
│   ├── venv/                  # Python virtual environment
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py            # Register, login, JWT
│   │   ├── grievances.py      # Submit, track, update grievances
│   │   └── admin.py           # Admin dashboard, assign, analytics
│   ├── database.py            # ShaktiDB connection + session
│   ├── models.py              # SQLAlchemy table models
│   ├── schemas.py             # Pydantic request/response schemas
│   ├── main.py                # FastAPI app entry point
│   ├── .env                   # Environment variables (not committed)
│   └── requirements.txt       # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts       # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── GrievanceCard.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── SubmitPage.tsx
│   │   │   ├── TrackPage.tsx
│   │   │   └── AdminPage.tsx
│   │   ├── App.tsx            # Routes
│   │   └── main.tsx           # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Ubuntu 24.04 LTS
- ShaktiDB installed and running
- Python 3.12
- Node.js 20.x + npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/your-username/grievance-portal.git
cd grievance-portal
```

### 2. Set up the database

```bash
psql -U postgres
```

```sql
CREATE DATABASE grievance_portal;
CREATE USER portal_user WITH PASSWORD 'securepassword123';
GRANT ALL PRIVILEGES ON DATABASE grievance_portal TO portal_user;
\q
```

### 3. Set up the backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:

```env
DATABASE_URL=postgresql://portal_user:securepassword123@localhost:5432/grievance_portal
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Run the backend:

```bash
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### 4. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new citizen |
| POST | `/auth/login` | Login and receive JWT token |

### Grievances
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/grievances/` | Submit a new grievance | Citizen |
| GET | `/grievances/my` | List own grievances | Citizen |
| GET | `/grievances/{id}` | Get grievance details | Citizen |
| PUT | `/grievances/{id}/status` | Update grievance status | Official |

### Admin
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/admin/grievances` | List all grievances | Official/Admin |
| PUT | `/admin/grievances/{id}/assign` | Assign to department | Official/Admin |
| GET | `/admin/analytics` | View department analytics | Admin |

---

## User Roles

| Role | Access |
|---|---|
| **Citizen** | Register, submit grievances, track status, rate resolution |
| **Official** | View assigned grievances, update status, add notes |
| **Admin** | Full access — all grievances, assignments, analytics |

---

## Screenshots

> *(Add screenshots of your running app here before submission)*

- Login page
- Citizen dashboard
- Submit grievance form
- Grievance status timeline
- Admin dashboard
- Analytics view
- pgAdmin 4 showing ShaktiDB tables

---

## Team

| Name | Role |
|---|---|
| Abhijith | Full Stack Developer |

---

## Institution

**TKM College of Engineering (TKMCE)**
Department of Computer Science & Engineering
Mini Project — Academic Year 2024–25

> Built with ShaktiDB — India's sovereign open-source RDBMS developed by IITM Pravartak in collaboration with MeitY and C-DAC.
