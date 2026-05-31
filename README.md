# Loan Management System (LMS)
DEMO LINK - https://drive.google.com/file/d/1kF0Rl9cFWwSaDx2r1agnLT22cjIcJC07/view?usp=sharing


A production-ready full-stack Loan Management System with a **Borrower Portal** and **Operations Dashboard**, built per the LMS assignment specification.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn-style UI, React Hook Form, Zod, Axios, TanStack Query, Zustand |
| Backend | Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Multer |
| DevOps | Docker, Docker Compose, ESLint, Prettier, Husky |

## Project Structure

```
LMS_Raman/
├── backend/                 # Express API
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── modules/         # auth, borrower, sales, sanction, etc.
│       ├── routes/
│       ├── scripts/seed.ts
│       └── utils/
├── frontend/                # Next.js app
│   └── src/
│       ├── app/             # pages (App Router)
│       ├── components/
│       ├── hooks/
│       ├── providers/
│       ├── services/
│       ├── store/
│       └── types/
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js 20+
- MongoDB 7+ (local or Docker)
- npm

## Installation

```bash
# From project root
npm run install:all

# Or manually
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/lms` |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `UPLOAD_DIR` | File upload directory | `uploads` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:3000` |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (`http://localhost:5000/api`) |
| `NEXT_PUBLIC_UPLOAD_URL` | Static uploads base (`http://localhost:5000`) |

## Quick Start

```bash
# 1. Start MongoDB (Docker)
docker compose up -d mongo

# 2. Seed demo users
npm run seed

# 3. Run backend + frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/health

## Docker Setup

Run the full stack:

```bash
docker compose up --build
```

Then seed the database (from host, with Mongo exposed on 27017):

```bash
cd backend && npm run seed
```

Volumes:

- `mongo_data` — MongoDB persistence
- `uploads_data` — Uploaded salary slips

## Role Credentials

All seeded accounts use password: **`Password@123`**

| Email | Role | Access |
|-------|------|--------|
| admin@test.com | ADMIN | All modules |
| sales@test.com | SALES | Sales leads |
| sanction@test.com | SANCTION | Loan sanction |
| disbursement@test.com | DISBURSEMENT | Disbursement |
| collection@test.com | COLLECTION | Payment collection |
| borrower@test.com | BORROWER | Borrower portal |

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register borrower |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Current user (auth required) |

### Borrower

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/borrower/profile` | Save profile + BRE |
| GET | `/borrower/profile` | Get profile |
| POST | `/borrower/upload` | Upload salary slip |
| POST | `/borrower/apply` | Apply for loan |
| GET | `/borrower/loan` | Get loan |

### Operations

| Module | Endpoints |
|--------|-----------|
| Sales | `GET /sales/leads` |
| Sanction | `GET /sanction/loans`, `PATCH /sanction/:loanId/approve`, `PATCH /sanction/:loanId/reject` |
| Disbursement | `GET /disbursement/loans`, `PATCH /disbursement/:loanId/disburse` |
| Collection | `GET /collection/loans`, `POST /collection/payment` |
| Admin | `GET /admin/dashboard`, `GET /admin/users`, `GET /admin/loans` |

**Auth:** `Authorization: Bearer <token>`

**Errors:** `401` unauthenticated, `403` forbidden, `400` validation/state machine, `409` duplicate UTR

## Testing Steps

### BRE Pass Scenario

1. Register or login as `borrower@test.com`
2. Profile: DOB age 23–50, salary ≥ ₹25,000, valid PAN (e.g. `ABCDE1234F`), employment ≠ UNEMPLOYED
3. Upload PDF/JPEG/PNG salary slip (≤ 5 MB)
4. Apply loan with sliders → status **PENDING**

### BRE Failure Scenarios

| Case | Expected error |
|------|----------------|
| Age &lt; 23 or &gt; 50 | Applicant age must be between 23 and 50 years |
| Salary &lt; 25000 | Applicant salary must be at least 25000 |
| Invalid PAN | Invalid PAN format |
| UNEMPLOYED | Unemployed applicants are not eligible |

### Loan Lifecycle Flow

```
PENDING → SANCTIONED → DISBURSED → CLOSED
PENDING → REJECTED (terminal)
```

1. **Sanction** (`sanction@test.com`): Approve or reject pending loans
2. **Disbursement** (`disbursement@test.com`): Mark sanctioned loans disbursed
3. **Collection** (`collection@test.com`): Record payments (unique UTR); loan auto-closes when outstanding = 0

### Sales Leads

Login as `sales@test.com` — view borrowers registered without a loan application.

## Business Rules

- **Interest:** 12% p.a. simple interest: `SI = (P × R × T) / (365 × 100)`
- **Loan amount:** ₹50,000 – ₹5,00,000
- **Tenure:** 30 – 365 days
- **PAN regex:** `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`
- **BRE runs server-side** (client validation for UX only)

## Screenshots

<!-- Add screenshots here -->
| Page | Screenshot |
|------|------------|
| Home | `./docs/screenshots/home.png` |
| Borrower Apply | `./docs/screenshots/borrower-apply.png` |
| Sanction Dashboard | `./docs/screenshots/sanction.png` |
| Admin Dashboard | `./docs/screenshots/admin.png` |

