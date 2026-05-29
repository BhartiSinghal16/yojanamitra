# 🇮🇳 YojanaMitra — AI-Powered Government Scheme Matcher

> **Find every Indian government scheme you qualify for — in seconds.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-yojanamitra--neon.vercel.app-f5c842?style=for-the-badge&logo=vercel&logoColor=black)](https://yojanamitra-neon.vercel.app)
[![Backend](https://img.shields.io/badge/API-Render-purple?style=for-the-badge&logo=render&logoColor=white)](https://yojanamitra-7i7h.onrender.com/health)
[![GitHub](https://img.shields.io/badge/GitHub-BhartiSinghal16-black?style=for-the-badge&logo=github)](https://github.com/BhartiSinghal16/yojanamitra)

---

## 📌 Problem

Millions of Indian citizens miss out on government welfare benefits they are entitled to — simply because no one tells them these schemes exist. The information is scattered across hundreds of portals in bureaucratic language.

**YojanaMitra solves this.**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Groq AI Matching** | Llama 3.3 70B finds 8–20 matching schemes dynamically — no fixed database needed, always up to date |
| 🔍 **Smart Keyword Search** | Type one word — "kheti", "padhai", "mahila", "pension" — get all relevant schemes instantly |
| 🎤 **Voice Input** | Speak your age, income, family size in Hindi or English — form fills automatically |
| 🌐 **Bilingual** | Full Hindi + English support across form, results, search, and AI guides |
| 🌙 **Dark / Light Mode** | Theme toggle with localStorage persistence |
| 📱 **Mobile First** | Fully responsive — works perfectly on any screen size |
| 📄 **Document Checklist** | Know exactly what documents to bring for each scheme |
| 🪜 **Application Steps** | Step-by-step guide with tips for every scheme |
| 🎯 **Pro Tips** | Personalized insider advice for each scheme based on user profile |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              React Frontend (Vite)               │
│         TypeScript + Inline Styles              │
│                                                  │
│  ProfileWizard → matchSchemes() → SchemeCard    │
│  Search Component → /api/search → Results       │
└────────────────────┬────────────────────────────┘
                     │ REST API (axios)
┌────────────────────▼────────────────────────────┐
│           Express.js Backend (Node.js)           │
│                                                  │
│  POST /api/smartmatch  →  Groq AI (profile)     │
│  POST /api/search      →  Groq AI (keyword)     │
│  GET  /health          →  Status check          │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│         Groq API — Llama 3.3 70B                │
│   Finds schemes + generates guides dynamically  │
└─────────────────────────────────────────────────┘
```

### Why 100% Groq-Powered?

| | Fixed Database | 100% Groq (YojanaMitra) |
|---|---|---|
| Schemes up to date | ❌ Manual updates needed | ✅ Always current |
| State schemes | ❌ Hard to maintain | ✅ Included automatically |
| New scheme launched | ❌ Miss it | ✅ Found instantly |
| Personalized guides | ❌ Generic text | ✅ Tailored to profile |
| Setup complexity | High | Zero — just one API key |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- Pure inline styles — no CSS framework dependency
- **Web Speech API** — built-in browser voice input (no library)
- **Axios** for API calls

### Backend
- **Node.js** + **Express.js** + **TypeScript**
- **Groq SDK** — Llama 3.3 70B for dynamic scheme matching
- **Zod** for request validation
- **Helmet** + **CORS** for security

### DevOps
- **Vercel** — Frontend hosting (auto-deploys on git push)
- **Render** — Backend hosting (auto-deploys on git push)
- **GitHub** — Version control

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Groq API key (free at console.groq.com)

### Installation

```bash
# Clone the repo
git clone https://github.com/BhartiSinghal16/yojanamitra.git
cd yojanamitra

# Install all dependencies
npm install
```

### Environment Variables

Create `apps/api/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=your_groq_api_key_here
```

That's it — no database needed!

### Run Locally

```bash
# Terminal 1 — Backend
cd apps/api
npm run dev
# API running at http://localhost:5000

# Terminal 2 — Frontend
cd apps/web
npm run dev
# App running at http://localhost:5173
```

---

## 🗂️ Project Structure

```
yojanamitra/
├── apps/
│   ├── web/                          # React + TypeScript frontend
│   │   └── src/
│   │       ├── components/
│   │       │   ├── profile/
│   │       │   │   └── ProfileWizard.tsx   # 4-step form with voice input
│   │       │   ├── schemes/
│   │       │   │   └── SchemeCard.tsx      # Scheme cards with details
│   │       │   ├── ui/
│   │       │   │   └── VoiceInput.tsx      # Web Speech API component
│   │       │   └── Search.tsx              # Keyword search component
│   │       ├── pages/
│   │       │   └── Home.tsx               # Landing + Form + Results pages
│   │       ├── lib/
│   │       │   └── api.ts                 # API client (axios)
│   │       └── types/
│   │           └── index.ts               # Shared TypeScript types
│   └── api/                          # Node.js + Express backend
│       └── src/
│           ├── routes/
│           │   ├── smartmatch.ts          # Profile-based AI matching
│           │   └── search.ts              # Keyword search route
│           └── index.ts                   # Express server entry point
└── README.md
```

---

## 🧠 How It Works

### Profile-Based Matching (`/api/smartmatch`)
```
User fills 4-step profile form
        ↓
Profile sent to Express backend
        ↓
Groq Llama 3.3 70B analyzes profile
(age, gender, caste, income, state, occupation)
        ↓
AI finds 8–20 matching central + state schemes
        ↓
Returns scheme name, benefit, documents,
application steps, pro tip — all personalized
        ↓
Frontend renders scheme cards sorted by match score
```

### Keyword Search (`/api/search`)
```
User types "kheti" / "किसान" / "farmer"
        ↓
Query + language sent to backend
        ↓
Groq understands intent (Hindi or English)
        ↓
Returns all schemes for that category
with eligibility, documents, steps
        ↓
Results shown in Hindi or English
based on user's language preference
```

---

## 🎤 Voice Input

Uses browser's built-in **Web Speech API** — zero external libraries:

```
User clicks mic button → Browser starts listening
        ↓
User speaks: "twenty five" or "पच्चीस"
        ↓
Browser converts speech to text
        ↓
Code extracts number from text
(handles "lakh", "thousand" for income)
        ↓
Value fills the form field automatically
```

Works in `hi-IN` (Hindi) and `en-IN` (English). Best support in Chrome.

---

## 🌐 Bilingual Support

Every piece of text has two versions — Hindi and English. Language is controlled by a single `lang` variable. When switched:

- Form labels switch language
- Scheme names and benefits switch language  
- AI search prompt switches to Hindi/English
- Documents and steps switch language
- All UI labels switch language

---

## 📸 Screenshots

| Landing Page | Search | Results |
|---|---|---|
| Animated tickers + keyword search in hero | One-word search with suggestion pills | AI-matched schemes with documents + steps |

---

## 🗺️ Roadmap

- [x] Groq AI dynamic scheme matching
- [x] Smart keyword search (Hindi + English)
- [x] Voice input (Hindi + English)
- [x] Dark / light theme
- [x] Fully bilingual
- [x] Mobile responsive
- [ ] WhatsApp share results
- [ ] PDF export
- [ ] Phone OTP login
- [ ] PWA offline support

---

## 👩‍💻 Author

**Bharti Singhal**

Built to help every Indian citizen access the government benefits they deserve.

---

## 📄 License

MIT License — feel free to fork and build on top of this.

---

> *YojanaMitra uses Groq AI to find schemes dynamically. It is not affiliated with the Government of India.*

