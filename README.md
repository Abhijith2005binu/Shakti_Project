# Citizen Grievance & Service Request Portal

> A full-stack e-governance web application that enables citizens to submit, track, and resolve grievances with government departments — built on **ShaktiDB**, India's sovereign open-source database.

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

The **Citizen Grievance & Service Request Portal** is a mini project developed as part of the academic curriculum at **TKM College of Engineering (TKMCE)**. It is a web-based platform that bridges citizens and government officials for efficient grievance resolution.

Citizens can register, submit complaints with detailed information, and track real-time status updates. Government officials can log in, review tickets, assign them to specific departments, update resolution status with notes, and view comprehensive analytics dashboards.

The project is built entirely using **free and open-source technologies**, with **ShaktiDB** (a PostgreSQL 17.7.1.1 fork developed by IITM Pravartak / MeitY) as the primary database — deployed on Ubuntu 24.04 LTS.

---

## Features

### Citizen
- 🔐 Register and log in securely with JWT authentication
- 📝 Submit grievances with title, description, category, and location
- 📊 Track real-time status updates (Open → In Progress → Resolved → Closed)
- 📅 View full timeline of all actions taken on a ticket
- ⭐ Rate resolution satisfaction (1–5 stars)
- 🔑 Secure password recovery via forgot password flow

### Official / Admin
- 🔐 Secure login with role-based access control
- 👁️ View all incoming grievances across the system
- 📋 Assign grievances to specific departments
- ✍️ Add resolution notes and update ticket status
- 📈 View analytics dashboard (total, open, in-progress, resolved counts)
- 🏢 Create and manage departments

---

## Tech Stack

| Category | Technology | Version | License |
|---|---|---|---|
| Operating System | Ubuntu LTS | 24.04 | Free & Open Source |
| Database | ShaktiDB (PostgreSQL fork) | 17.7.1.1 | Open Source |
| Backend Language | Python | 3.12 | PSF License |
| Backend Framework | FastAPI | 0.138.0 | MIT |
| ORM | SQLAlchemy | 2.0.51 | MIT |
| DB Driver | psycopg2-binary | 2.9.12 | LGPL |
| Auth | JWT + python-jose | 3.5.0 | MIT |
| Password Hashing | bcrypt | 5.0.0 | Apache 2.0 |
| Input Validation | pydantic | 2.13.4 | MIT |
| Frontend Language | TypeScript | 6.0.2 | Apache 2.0 |
| Frontend Framework | React | 19.2.6 | MIT |
| Styling | Tailwind CSS | 3.4.17 | MIT |
| HTTP Client | Axios | 1.18.0 | MIT |
| Build Tool | Vite | 8.0.12 | MIT |
| Package Manager | npm | 10.x | Artistic 2.0 |
| Routing | React Router | 7.18.0 | MIT |
| DB GUI | pgAdmin 4 | Latest | PostgreSQL License |
| API Testing | Bruno | Latest | MIT |
| Version Control | Git | Latest | GPL v2 |

---

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│    React 19 + TypeScript + Tailwind CSS 3.4     │
│         (Vite Dev Server on :5173)              │
└──────────────────────┬──────────────────────────┘
                       │ HTTP (Axios + JWT Bearer)
                       ▼
┌─────────────────────────────────────────────────┐
│           FastAPI Backend (Python 3.12)          │
│        Uvicorn running on :8000                  │
│   /auth   /grievances   /admin   /departments   │
└──────────────────────┬──────────────────────────┘
                       │ SQLAlchemy ORM (psycopg2)
                       ▼
┌─────────────────────────────────────────────────┐
│      ShaktiDB (PostgreSQL 17.7.1.1 fork)         │
│      Ubuntu 24.04 LTS — Port 5433               │
│      Socket: /tmp/.s.PGSQL.5433                 │
│users · grievances · departments · updates · ratings
└─────────────────────────────────────────────────┘
```

---

## Database Schema

### **users**
```sql
id               SERIAL PRIMARY KEY
name             VARCHAR(100)
email            VARCHAR(150) UNIQUE
hashed_password  VARCHAR
role             ENUM(citizen, official, admin)
created_at       TIMESTAMP
```

### **departments**
```sql
id    SERIAL PRIMARY KEY
name  VARCHAR(100) UNIQUE
```

**Pre-seeded departments:**
- Water Supply
- Roads & Infrastructure
- Electricity
- Sanitation
- Public Safety

### **grievances**
```sql
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

### **grievance_updates**
```sql
id            SERIAL PRIMARY KEY
grievance_id  FK → grievances.id
note          TEXT
status        ENUM(open, in_progress, resolved, closed)
updated_by    FK → users.id
created_at    TIMESTAMP
```

### **ratings**
```sql
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
├── backend/                         Python FastAPI application
│   ├── venv/                        Python virtual environment
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py                  JWT register/login, password hashing
│   │   ├── grievances.py            Submit, track, timeline, rate
│   │   ├── admin.py                 Dashboard, assign, status, analytics
│   │   └── dependencies.py          JWT token validation, role guards
│   ├── models.py                    SQLAlchemy ORM models
│   ├── schemas.py                   Pydantic request/response schemas
│   ├── database.py                  ShaktiDB connection (psycopg2 on :5433)
│   ├── main.py                      FastAPI app, CORS, router registration
│   ├── .env                         Environment variables (not committed)
│   ├── requirements.txt             Python dependencies
│   └── __pycache__/                 Compiled Python bytecode
│
├── frontend/                        React + TypeScript + Vite application
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts             Axios instance with JWT interceptor
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx        User login with email/password
│   │   │   ├── RegisterPage.tsx     User registration (citizen/official/admin)
│   │   │   ├── ForgotPasswordPage.tsx Password recovery flow
│   │   │   ├── DashboardPage.tsx    List own grievances (citizen view)
│   │   │   ├── SubmitPage.tsx       Submit new grievance form
│   │   │   ├── TrackPage.tsx        Grievance detail + status timeline
│   │   │   └── AdminPage.tsx        All grievances + analytics
│   │   ├── components/              Reusable UI components
│   │   ├── assets/                  Images and static files
│   │   ├── App.tsx                  Route definitions, PrivateRoute guard
│   │   ├── main.tsx                 React entry point
│   │   └── index.css                Global styles
│   ├── public/
│   ├── index.html                   HTML template
│   ├── vite.config.ts               Vite configuration
│   ├── tailwind.config.js           Tailwind CSS configuration
│   ├── postcss.config.js            PostCSS configuration
│   ├── tsconfig.json                TypeScript configuration
│   ├── eslint.config.js             ESLint configuration
│   └── package.json                 npm dependencies and scripts
│
└── README.md                        This file
```

**How it fits together:** On app load, users authenticate via FastAPI's `/auth/login` endpoint (JWT stored in localStorage). Citizens are directed to `/dashboard` to list their grievances, can click to `/track/:id` for real-time status history, or navigate to `/submit` to create new ones. Officials/admins access `/admin` to see all tickets, assign them to departments, and update status with notes. All requests from the React frontend use axios interceptors to attach the JWT Bearer token, communicating with FastAPI's `/grievances/`, `/admin/`, and `/auth/` routers, which query ShaktiDB tables via SQLAlchemy.

---

## Getting Started

### Prerequisites

- **Ubuntu 24.04 LTS** (recommended)
- **ShaktiDB** installed and running (port 5433)
- **Python 3.12** or higher
- **Node.js 20.x+** with npm
- **Git**

### 1. Clone the repository

```bash
git clone https://github.com/Abhijith2005binu/Shakti_Project.git
cd Shakti_Project
```

### 2. Start ShaktiDB

```bash
sudo systemctl start shaktidb.service
```

Connect to ShaktiDB and create the database:

```bash
sudo -u postgres /usr/lib/postgresql/17.7.1.1/bin/psql -p 5433
```

Then execute:

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
DATABASE_URL=postgresql://portal_user:securepassword123@localhost:5433/grievance_portal
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Run the backend:

```bash
uvicorn main:app --reload
```

The backend will be available at:
- **API**: `http://localhost:8000`
- **Interactive API Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### 4. Set up the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: `http://localhost:5173`

### 5. Seed departments

Connect to the database and run:

```sql
INSERT INTO departments (name) VALUES
  ('Water Supply'),
  ('Roads & Infrastructure'),
  ('Electricity'),
  ('Sanitation'),
  ('Public Safety');
```

You can also use pgAdmin 4 for this step.

---

## API Endpoints

### Authentication (`/auth`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register a new user with email, password, and role | Public |
| POST | `/auth/login` | Login and receive JWT access token | Public |

### Grievances (`/grievances`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/grievances/` | Submit a new grievance | Citizen |
| GET | `/grievances/my` | List all grievances submitted by logged-in citizen | Citizen |
| GET | `/grievances/{id}` | Get grievance details by ID | Citizen |
| GET | `/grievances/{id}/timeline` | Get status update history for a grievance | Citizen |
| POST | `/grievances/{id}/rate` | Rate a resolved grievance (1–5 stars) | Citizen |

### Admin (`/admin`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/admin/grievances` | List all grievances in the system | Official/Admin |
| PUT | `/admin/grievances/{id}/assign` | Assign grievance to a department | Official/Admin |
| PUT | `/admin/grievances/{id}/status` | Update grievance status with resolution note | Official/Admin |
| GET | `/admin/analytics` | Get dashboard analytics (counts by status) | Official/Admin |
| GET | `/admin/departments` | List all departments | Any Logged In |
| POST | `/admin/departments` | Create a new department | Official/Admin |

---

## User Roles

| Role | Access & Capabilities |
|---|---|
| **Citizen** | Register, submit grievances, track own grievances, view status timeline, rate resolved grievances, request password reset |
| **Official** | View all grievances, assign to departments, update status with notes, view analytics dashboard |
| **Admin** | Full access — all features of citizen and official plus department management |

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
| pgAdmin 4 host | Use `/tmp` socket with port `5433` |
| bcrypt version | Current: 5.0.0 (ensure compatibility with passlib) |
| Node.js version | Requires v20.x+ (Vite 8 dependency) |
| Tailwind CSS version | Using 3.4.17 (v4 has breaking changes) |
| React version | 19.2.6 with TypeScript 6.0.2 |
| FastAPI version | 0.138.0 |

---

## Screenshots

> *(Add screenshots of your running app here before submission)*

Application screens:
- Login page (`/login`)
- Registration page (`/register`)
- Password recovery (`/forgot-password`)
- Citizen dashboard (`/dashboard`)
- Submit grievance form (`/submit`)
- Grievance tracking & timeline (`/track/:id`)
- Admin dashboard with analytics (`/admin`)
- pgAdmin 4 interface showing ShaktiDB schema

---

## Team

| Name | Role | Contact |
|---|---|---|
| Abhijith B | Full Stack Developer | [@Abhijith2005binu](https://github.com/Abhijith2005binu) |

---

## Institution

**TKM College of Engineering (TKMCE)**  
Department of Computer Science & Engineering  
Mini Project — Academic Year 2024–25

> Built with **ShaktiDB** — India's sovereign open-source RDBMS developed by IITM Pravartak in collaboration with **MeitY** and **C-DAC**.

---

## License

This project is built on open-source technologies. Please refer to individual component licenses as listed in the Tech Stack section.

---

**Last Updated:** June 2026  
**Repository:** [Shakti_Project](https://github.com/Abhijith2005binu/Shakti_Project)
