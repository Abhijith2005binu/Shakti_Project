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
- [Known Setup Notes](#known-setup-notes)
- [Screenshots](#screenshots)
- [Team](#team)
- [Institution](#institution)

---

## Overview

The **Citizen Grievance & Service Request Portal** is a mini project developed as part of the academic curriculum at **TKM College of Engineering (TKMCE)**. It is a web-based platform that bridges the gap between citizens and government departments by providing a transparent, role-based grievance management system.

Citizens can register, submit complaints, and track real-time status updates. Government officials can log in, review tickets, assign them to departments, update resolution status, and view analytics reports.

The project is built entirely using **free and open-source technologies**, with **ShaktiDB** (a PostgreSQL 17.7.1.1 fork developed by IITM Pravartak / MeitY) as the primary database — deployed on **Ubuntu 24.04 LTS**.

---

## Features

### Citizen
- Register and log in securely with JWT authentication
- Submit grievances with title, description, category, and location
- Track real-time status updates (Open → In Progress → Resolved → Closed)
- View full timeline of all actions taken on a ticket
- Rate resolution satisfaction (1–5 stars)

### Official / Admin
- Secure login with role-based access control
- View all incoming grievances
- Assign grievances to specific departments
- Add resolution notes and update ticket status
- View analytics dashboard (total, open, in-progress, resolved counts)
- Create and manage departments

---

## Tech Stack

| Category | Technology | Version | License |
|---|---|---|---|
| Operating System | Ubuntu LTS | 24.04 | Free & Open Source |
| Database | ShaktiDB (PostgreSQL fork) | 17.7.1.1 | Open Source |
| Backend Language | Python | 3.12 | PSF License |
| Backend Framework | FastAPI | Latest | MIT |
| ORM | SQLAlchemy | Latest | MIT |
| DB Driver | psycopg2-binary | Latest | LGPL |
| Auth | JWT + python-jose | Latest | MIT |
| Password Hashing | bcrypt | 4.0.1 | Apache 2.0 |
| Input Validation | pydantic[email] | Latest | MIT |
| Frontend Language | TypeScript | 5.x | Apache 2.0 |
| Frontend Framework | React | 18 | MIT |
| Styling | Tailwind CSS | 3.4.17 | MIT |
| HTTP Client | Axios | Latest | MIT |
| Build Tool | Vite | 8.x | MIT |
| Package Manager | npm | 10.x | Artistic 2.0 |
| DB GUI | pgAdmin 4 | Latest | PostgreSQL License |
| API Testing | Bruno | Latest | MIT |
| Version Control | Git | Latest | GPL v2 |
| Code Editor | VS Code | Latest | MIT |

---

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│         React 18 + TypeScript + Tailwind         │
│              (Vite Dev Server :5173)             │
└──────────────────────┬──────────────────────────┘
                       │ HTTP (Axios + JWT Bearer)
                       ▼
┌─────────────────────────────────────────────────┐
│              FastAPI Backend                     │
│         Python 3.12 (Uvicorn :8000)             │
│   /auth   /grievances   /admin   /departments   │
└──────────────────────┬──────────────────────────┘
                       │ SQLAlchemy ORM (psycopg2)
                       ▼
┌─────────────────────────────────────────────────┐
│       ShaktiDB (PostgreSQL 17.7.1.1 fork)        │
│         Ubuntu 24.04 LTS — Port 5433            │
│         Socket: /tmp/.s.PGSQL.5433              │
│   users · grievances · departments · updates    │
└─────────────────────────────────────────────────┘
```

---

## Database Schema

**users**
```
id               SERIAL PRIMARY KEY
name             VARCHAR(100)
email            VARCHAR(150) UNIQUE
hashed_password  VARCHAR
role             ENUM(citizen, official, admin)
created_at       TIMESTAMP
```

**departments**
```
id    SERIAL PRIMARY KEY
name  VARCHAR(100) UNIQUE
```

Seeded departments:
- Water Supply
- Roads & Infrastructure
- Electricity
- Sanitation
- Public Safety

**grievances**
```
id             SERIAL PRIMARY KEY
title          VARCHAR(200)
description    TEXT
category       VARCHAR(100)
location       VARCHAR(200)
status         ENUM(open, in_progress, resolved, closed)
citizen_id     FK → users.id
department_id  FK → departments.id  (nullable)
created_at     TIMESTAMP
updated_at     TIMESTAMP
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
Shakti_Project/
│
├── backend/
│   ├── venv/                    # Python virtual environment
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py              # Register, login, JWT token
│   │   ├── grievances.py        # Submit, track, timeline, rate
│   │   ├── admin.py             # Dashboard, assign, status, analytics
│   │   └── dependencies.py      # JWT guard, role checks
│   ├── database.py              # ShaktiDB connection + session
│   ├── models.py                # SQLAlchemy ORM models
│   ├── schemas.py               # Pydantic request/response schemas
│   ├── main.py                  # FastAPI app + CORS + router registration
│   ├── .env                     # Environment variables (not committed)
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts         # Axios instance with JWT interceptor
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx    # Login form
│   │   │   ├── RegisterPage.tsx # Registration form
│   │   │   ├── DashboardPage.tsx# Citizen grievance list
│   │   │   ├── SubmitPage.tsx   # Submit new grievance
│   │   │   ├── TrackPage.tsx    # Grievance detail + timeline
│   │   │   └── AdminPage.tsx    # Admin dashboard + analytics
│   │   ├── components/          # Reusable UI components
│   │   ├── App.tsx              # Routes + PrivateRoute guard
│   │   └── main.tsx             # React entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Ubuntu 24.04 LTS
- ShaktiDB installed and running (port 5433)
- Python 3.12
- Node.js 20.x + npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Shakti_Project.git
cd Shakti_Project
```

### 2. Start ShaktiDB

```bash
sudo systemctl start shaktidb.service
sudo -u postgres /usr/lib/postgresql/17.7.1.1/bin/psql -p 5433
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

Create `.env` in the `backend/` folder:

```env
DATABASE_URL=postgresql://portal_user:securepassword123@localhost:5433/grievance_portal
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Run the backend:

```bash
uvicorn main:app --reload
```

Backend: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### 4. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

### 5. Seed departments (run in pgAdmin 4 or psql)

```sql
INSERT INTO departments (name) VALUES
  ('Water Supply'),
  ('Roads & Infrastructure'),
  ('Electricity'),
  ('Sanitation'),
  ('Public Safety');
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Login and receive JWT token | Public |

### Grievances
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/grievances/` | Submit a new grievance | Citizen |
| GET | `/grievances/my` | List own grievances | Citizen |
| GET | `/grievances/{id}` | Get grievance details | Citizen |
| GET | `/grievances/{id}/timeline` | Get status update history | Citizen |
| POST | `/grievances/{id}/rate` | Rate a resolved grievance | Citizen |

### Admin
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/admin/grievances` | List all grievances | Official/Admin |
| PUT | `/admin/grievances/{id}/assign` | Assign to department | Official/Admin |
| PUT | `/admin/grievances/{id}/status` | Update status with note | Official/Admin |
| GET | `/admin/analytics` | View counts by status | Official/Admin |
| GET | `/admin/departments` | List all departments | Any logged in |
| POST | `/admin/departments` | Create a department | Official/Admin |

---

## User Roles

| Role | Access |
|---|---|
| **Citizen** | Register, submit grievances, track status, view timeline, rate resolution |
| **Official** | View all grievances, assign to departments, update status with notes |
| **Admin** | Full access — all of the above plus analytics and department management |

---

## Known Setup Notes

> Important differences from a standard PostgreSQL setup discovered during deployment:

| Item | Detail |
|---|---|
| ShaktiDB service name | `shaktidb.service` (not `postgresql`) |
| ShaktiDB version | 17.7.1.1 |
| Default port | **5433** (not 5432) |
| Socket location | `/tmp/.s.PGSQL.5433` |
| Data directory | `/data/sdb` |
| Connect command | `sudo -u postgres /usr/lib/postgresql/17.7.1.1/bin/psql -p 5433` |
| pgAdmin host | `/tmp` with port `5433` |
| bcrypt version | Must use `bcrypt==4.0.1` (passlib incompatible with newer versions) |
| Node.js version | Must be v20.x+ (Vite 8 requires it) |
| Tailwind version | Must use `tailwindcss@3.4.17` (v4 has breaking changes) |

---

## Screenshots

> *(Add screenshots of your running app here before submission)*

- Login page (`/login`)
- Register page (`/register`)
- Citizen dashboard (`/dashboard`)
- Submit grievance form (`/submit`)
- Grievance status timeline (`/track/:id`)
- Admin dashboard with analytics (`/admin`)
- pgAdmin 4 connected to ShaktiDB showing all tables

---

## Team

| Name | Role |
|---|---|
| Abhijith B | Full Stack Developer |

---

## Institution

**TKM College of Engineering (TKMCE)**
Department of Computer Science & Engineering
Mini Project — Academic Year 2024–25

> Built with ShaktiDB — India's sovereign open-source RDBMS developed by IITM Pravartak in collaboration with MeitY and C-DAC.
Department of Computer Science & Engineering
Mini Project — Academic Year 2024–25

> Built with ShaktiDB — India's sovereign open-source RDBMS developed by IITM Pravartak in collaboration with MeitY and C-DAC.
