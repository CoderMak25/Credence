<h1 align="center">Academic Risk Advisor</h1>

<p align="center">
  A full-stack dashboard for tracking and identifying <strong>Student Academic Risk</strong>.<br />
  <strong>Automated Risk Scoring</strong> · Attendance & Performance Tracking · Actionable Insights
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/Vite-5-purple?logo=vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Express-4-green?logo=express" />
  <img src="https://img.shields.io/badge/Mongoose-8-red?logo=mongoose" />
  <img src="https://img.shields.io/badge/MongoDB_Memory_Server-11-blueviolet?logo=mongodb" />
</p>

---

## 📌 Overview

**Academic Risk Advisor** is an educational dashboard tool that helps educators and administrators monitor student performance, identify at-risk students, and proactively intervene. 

The platform aggregates weekly student data—including attendance, quiz scores, assignment completion, and LMS logins—into a unified **risk score**. It provides a detailed breakdown of factors contributing to a student's risk profile, alongside confidence scores based on data completeness.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Automated Risk Scoring** | Calculates risk levels (High/Medium/Low) based on weighted academic factors. |
| **Interactive Dashboard** | Live metrics—total students tracked, high-risk count, and students needing intervention. |
| **Students Hub** | Filterable and sortable table of all students with risk badges and confidence scores. |
| **Detailed Student Profiles** | Deep-dive into individual student data: attendance rates, assignment completion, quiz averages, and peer interaction. |
| **Data Quality & Confidence** | Evaluates the reliability of risk predictions based on missing data and grades the overall data quality. |
| **Interactive Demo Controls** | Built-in tools to simulate missing data (e.g., hiding attendance or quizzes) to demonstrate dynamic risk recalculation in real-time. |
| **In-Memory Database Fallback** | Automatically falls back to `mongodb-memory-server` for seamless local development if a standard MongoDB instance is unavailable. |

---

## 🏗️ Architecture

The system uses a **Node.js/Express** backend for API handling and data aggregation, communicating with a **React** frontend for visualizing student risk profiles.

```
┌──────────────────────────────────────────────────────────┐
│                      Frontend (Vite + React)             │
│  Dashboard · Students Hub · Stats Cards · Demo Controls  │
│             Tailwind CSS · Recharts                      │
└────────────────────────┬─────────────────────────────────┘
                         │  REST API (port 5173 → 5000)
┌────────────────────────▼─────────────────────────────────┐
│                   Backend (Express + Node.js)            │
│  ┌──────────┐  ┌──────────────┐                          │
│  │ API      │  │ Risk Service │                          │
│  │ Routes   │  │ Logic        │                          │
│  │ /students│  │ Aggregation  │                          │
│  └──────────┘  └──────┬───────┘                          │
└───────────────────────┬──────────────────────────────────┘
                        │  Mongoose ORM
┌───────────────────────▼──────────────────────────────────┐
│                  Database (MongoDB)                      │
│  Standard MongoDB or fallback to In-Memory MongoDB       │
└──────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI |
| **Vite 5** | Dev server & production bundler |
| **Tailwind CSS** | Utility-first styling with custom design tokens |
| **Recharts** | Data visualization for student metrics |

### Backend & Database
| Technology | Purpose |
|---|---|
| **Express 4.18** | REST API framework |
| **Mongoose 8** | Object Data Modeling (ODM) library for MongoDB |
| **MongoDB Memory Server** | Seamless in-memory testing and development DB |

---

## 📂 Project Structure

```
Academic-Risk-Advisor/
├── client/
│   ├── index.html              # Main HTML file
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── vite.config.js          # Vite configuration
│   └── src/
│       ├── App.jsx             # Main React component
│       ├── components/         # Reusable UI components (Sidebar, StatsCards, etc.)
│       ├── services/           # API client services
│       └── utils/              # Risk calculation and utility logic
│
├── server/
│   ├── package.json            # Backend dependencies
│   ├── server.js               # Express app entry point (port 5000)
│   ├── controllers/            # Route controllers
│   ├── data/                   # Initial seed data (students.json) and seed scripts
│   ├── models/                 # Mongoose schemas (Student.js)
│   ├── routes/                 # API Routes Definition
│   └── services/               # Risk scoring and aggregation business logic
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (Optional, will fall back to an in-memory database automatically)

### 1. Clone & Install

```bash
git clone <repository-url>
cd <repository-directory>

# Install Backend dependencies
cd server
npm install

# Install Frontend dependencies (in a new terminal)
cd ../client
npm install
```

### 2. Configure Environment

Create a `.env` file in the `server` directory.

```bash
# Example .env file mapping
PORT=5000
MONGODB_URI=mongodb://localhost:27017/academic-risk-advisor # Optional
```

### 3. Seed Data (Optional, Automatic Setup Included)

*If using the fallback memory server, seeding runs automatically.*
To manually seed a standard MongoDB instance:
```bash
cd server
npm run seed
```

### 4. Run the Application

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

Access:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000/api/health`

---

## ⚙️ Automated Risk Scoring

The platform uses a weighted algorithmic approach to assess academic risk dynamically:

1. **Calculated Field Weights:**
   - Attendance Rate: `15%`
   - Assignment Completion Rate: `25%`
   - Quiz Average: `25%`
   - LMS Logins Per Week: `15%`
   - Late Submissions Count: `20%`
2. **Confidence Penalties:** Missing data reduces the statistical confidence of the risk assessment, prompting the user to collect more real-world data points.

**Final Determination:**
- **HIGH Risk:** Score ≥ 65 (Immediate intervention recommended).
- **MEDIUM Risk:** Score 35-64 (Proactive check-in advised).
- **LOW Risk:** Score < 35.

---

<p align="center">
  Built with ❤️ for Educational Administration
</p>
