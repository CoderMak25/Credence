<p align="center">
  <h1 align="center">🍦 Dahiyo Demo — Interactive Frozen Yogurt Experience</h1>
</p>

<p align="center">
  A vibrant, full-stack web application for <strong>Dahiyo</strong>, a premium frozen yogurt shop.<br />
  <strong>Scroll-Triggered Canvas Animation</strong> · Dynamic UI/UX · Framer Motion · Bento Grid Layouts
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/Vite-5-purple?logo=vite" />
  <img src="https://img.shields.io/badge/Express-4-green?logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-8-green?logo=mongodb" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Node.js-18-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Framer_Motion-11-ff0055?logo=framer" />
</p>

---

## 📌 Overview

**Dahiyo Demo** is a promotional showcase platform that helps visualize the brand identity of Dahiyo, a fictional premium frozen yogurt store.

The platform combines an **optimized frame-by-frame canvas animation** tied to scroll behavior, a **responsive bento grid system**, and a **Node.js/Express backend** to serve dynamic product data. It supports smooth fade-ups, persistent floating elements, and spring physics-based scroll tracking for a highly interactive user experience.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Scroll Canvas Animation** | Highly optimized frame-by-frame canvas animation tied directly to the user's scroll position. |
| **Physics-based Tracking** | Uses Framer Motion's `useSpring` and `useVelocity` for smooth scroll tracking and floating effects. |
| **Dynamic UI/UX** | Modern, fun, and clean interface with smooth fade-ups and ambient gradient blobs. |
| **Flavor Bento Grid** | Beautifully structured `MenuSection` to showcase frozen yogurt flavors and offerings. |
| **Full-Stack Integration** | Client communicates seamlessly with the Express backend to fetch dynamic products. |
| **Mobile Responsive** | Completely adaptive layouts built utility-first with Tailwind CSS. |
| **Vercel Ready** | Configured `vercel.json` for seamless zero-config deployment of the frontend. |

---

## 🏗️ Architecture

The system uses a **Node.js/Express** backend for API handling, communicating with a **MongoDB** database, and serves data to a highly interactive **React/Vite** frontend.

```text
┌──────────────────────────────────────────────────────────┐
│                      Frontend (Vite + React)             │
│   Hero Cover · Story · Menu Grid · Testimonials · Footer │
│          Tailwind CSS · Framer Motion · Iconify          │
└────────────────────────┬─────────────────────────────────┘
                         │  REST API (port 5173 → 5000)
┌────────────────────────▼─────────────────────────────────┐
│                   Backend (Express)                      │
│                                                          │
│  ┌──────────┐  ┌──────────────┐                          │
│  │ API      │  │ Mongoose     │                          │
│  │ Routes   │  │ Models       │                          │
│  │ /products│  │ (Product.js) │                          │
│  └──────────┘  └──────┬───────┘                          │
│                       │                                  │
└────────────────────────┬─────────────────────────────────┘
                         │  Mongoose ODM
┌────────────────────────▼─────────────────────────────────┐
│                   MongoDB Database                       │
│  Collection: products                                    │
└──────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI Library |
| **Vite 5** | Dev server & production bundler |
| **Tailwind CSS** | Utility-first styling framework |
| **Framer Motion** | Physics-based animations and scroll tracking |
| **Iconify** | Lightweight, scalable vector icons (Solar set) |

### Backend
| Technology | Purpose |
|---|---|
| **Express 4** | REST API framework |
| **Node.js** | Server environment |
| **Mongoose 8** | MongoDB object modeling |
| **CORS** | Cross-origin resource sharing middleware |

### Infrastructure
| Technology | Purpose |
|---|---|
| **MongoDB** | NoSQL database |
| **Vercel** | Frontend deployment platform (via `vercel.json`) |

---

## 📂 Project Structure

```text
dahiyoDemo/
├── client/                 # React frontend
│   ├── public/             # Static assets (images, canvas animation frames)
│   ├── src/
│   │   ├── components/     # Reusable React components (Hero, Navbar, Menu, etc.)
│   │   ├── App.jsx         # Main application layout
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Global styles & Tailwind directives
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                 # Express backend
│   ├── models/             # Mongoose data models
│   ├── routes/             # API routes
│   ├── seed.js             # Initial database population
│   ├── server.js           # Server application logic
│   └── package.json
│
└── vercel.json             # Deployment configuration focusing on the client
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 16
- **MongoDB** (Local instance or Atlas URI)

### 1. Clone & Install

```bash
git clone <repository-url>
cd dahiyoDemo

# Install Client dependencies
cd client
npm install

# Install Server dependencies
cd ../server
npm install
```

### 2. Configure Environment

*Optional:* Create a `.env` file in the `server` directory.

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dahiyo
```

### 3. Database Setup

Populate the MongoDB database with initial flavor data:

```bash
cd server
npm run seed
```

### 4. Run the Application

```bash
# Terminal 1: Frontend
cd client
npm run dev

# Terminal 2: Backend
cd server
npm run dev
```

Access:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## ⚙️ Animation Engine

Dahiyo Demo utilizes a sophisticated approach to handle immersive scroll experiences without compromising performance:

1.  **Frame Preloading**: Fetches 192 highly optimized JPG frames into memory silently on load, displaying a custom animated loader.
2.  **Spring-Physics Scroll**: Instead of tying frames directly to pixels scrolled, `useSpring` calculates a smoothed progression value based on wheel/touch deltas.
3.  **Canvas Drawing**: `requestAnimationFrame` and React's `useCallback` ensure frames are drawn optimally to a full-screen `<canvas>`, using a "cover" fit calculation for responsive aspect ratios.
4.  **Anti-Gravity Float**: `useVelocity` combined with `useTransform` creates persistent, subtle Y-axis translations on background elements when scrolling at speeds.

---

## 📄 License

This project is open-source under the ISC License.

<p align="center">
  Built with ❤️ for <strong>Dahiyo</strong>
</p>
