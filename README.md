# 🇮🇳 YojanaMitra — AI-Powered Government Scheme Matcher

> **Find every Indian government scheme you qualify for — in 2 minutes.**

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
| 🎯 **Smart Matching Engine** | Rule-based eligibility engine matches users to 3,000+ central and state schemes instantly |
| 🤖 **AI Application Guide** | Groq LLM generates personalized step-by-step application guides in Hindi and English |
| 🎤 **Voice Input** | Speak your age, income, family size in Hindi or English — form fills automatically |
| 🌐 **Bilingual** | Full Hindi + English support across form, results, and AI guides |
| 🌙 **Dark / Light Mode** | Theme toggle with localStorage persistence |
| 📱 **Mobile First** | Fully responsive — works on any screen size |
| 📄 **Document Checklist** | Know exactly what documents to bring for each scheme |
| 🪜 **Application Steps** | Step-by-step guide with tips for every scheme |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  React Frontend                  │
│         (Vite + TypeScript + Tailwind)          │
└────────────────────┬────────────────────────────┘
                     │ REST API
┌────────────────────▼────────────────────────────┐
│              Express.js Backend                  │
│                                                  │
│  ┌─────────────────┐   ┌──────────────────────┐ │
│  │  Rule Engine    │──▶│   Groq AI Layer      │ │
│  │ (Hard filters)  │   │ (Rank + Explain)     │ │
│  └─────────────────┘   └──────────────────────┘ │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│           Supabase (PostgreSQL)                  │
│   schemes · user_profiles · scheme_matches       │
└─────────────────────────────────────────────────┘
```

### Why Hybrid Rule-Based + LLM?

| | Pure LLM | Rule-Based Only | YojanaMitra (Hybrid) |
|---|---|---|---|
| Speed | 2–5s | <10ms | <50ms |
| Cost per query | ~₹4 | Free | ~₹0.4 |
| Auditable | ❌ | ✅ | ✅ |
| Personalized explanation | ✅ | ❌ | ✅ |

The rule engine does the hard eligibility filtering. The LLM only sees the ~20 schemes that pass the filter, ranks them, and writes personalized guides. This is the right division of labour.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **React Hook Form** + **Zod** for form validation
- **TanStack Query** for data fetching
- **Web Speech API** for voice input

### Backend
- **Node.js** + **Express.js**
- **TypeScript** with strict mode
- **Zod** for request validation
- **Groq SDK** for LLM integration

### Database & Services
- **Supabase** (PostgreSQL) — schemes, profiles, matches
- **Groq** (Llama 3.3 70B) — AI application guides
- **Twilio** — WhatsApp notifications (coming soon)

### DevOps
- **Vercel** — Frontend deployment
- **Render** — Backend deployment
- **GitHub** — Version control + CI

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Supabase account
- Groq API key

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

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Groq
GROQ_API_KEY=your_groq_api_key

# Twilio (optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

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

## 📊 Database Schema

```sql
schemes          — 15+ central & state schemes with eligibility JSONB
user_profiles    — citizen profiles with demographic data
scheme_matches   — matched schemes per session with scores
states           — reference table for 15 Indian states
```

### Eligibility JSONB Structure
```json
{
  "min_age": 18,
  "max_age": 40,
  "max_annual_income": 250000,
  "castes": ["sc", "st", "obc"],
  "genders": ["female"],
  "occupations": ["farmer", "daily_wage_worker"],
  "disability_required": false,
  "must_own_land": true
}
```

---

## 🗂️ Project Structure

```
yojanamitra/
├── apps/
│   ├── web/                    # React + TypeScript frontend
│   │   └── src/
│   │       ├── components/
│   │       │   ├── profile/    # ProfileWizard with voice input
│   │       │   ├── schemes/    # SchemeCard with AI guide
│   │       │   └── ui/         # VoiceInput, Button
│   │       ├── pages/          # Home (landing + form + results)
│   │       ├── lib/            # API client
│   │       └── types/          # Shared TypeScript types
│   └── api/                    # Node.js + Express backend
│       └── src/
│           ├── routes/         # match.ts, guide.ts
│           ├── services/       # matchingEngine.ts, groqService.ts
│           └── db/             # supabase.ts
├── supabase/
│   └── migrations/             # SQL schema + seed data
└── packages/
    └── shared/                 # Shared types
```

---

## 🧠 How the Matching Engine Works

```typescript
// 1. Rule engine filters all schemes (fast, deterministic)
function evaluateEligibility(profile, scheme) {
  // Hard checks: age, income, caste, gender, occupation, state
  // Returns: { eligible: boolean, score: number, reasons: string[] }
}

// 2. Groq AI ranks and explains (only for matched schemes)
// Prompt includes: profile + scheme details
// Returns: personalized step-by-step guide in Hindi/English
```

**Scoring logic:**
- Base score: 50
- Age match: +10
- Income below limit (weighted): +0–20
- Caste match (SC/ST/OBC specific): +15
- Gender-specific scheme: +10
- Occupation match: +15
- State-specific: +10
- Disability benefit: +20

---

## 📸 Screenshots

| Landing Page | Profile Wizard | Results |
|---|---|---|
| Dark mode with animated tickers | 4-step wizard with voice input | Matched schemes with AI guides |

---

## 🗺️ Roadmap

- [x] Rule-based matching engine
- [x] Groq AI personalized guides
- [x] Voice input (Hindi + English)
- [x] Dark / light theme
- [x] Bilingual (Hindi + English)
- [ ] WhatsApp Bot via Twilio
- [ ] PDF export of matched schemes
- [ ] PWA — offline support
- [ ] Phone OTP login
- [ ] 50+ more schemes

---

## 👩‍💻 Author

**Bharti Singhal**

Built to help every Indian citizen access the government benefits they deserve.

---

## 📄 License

MIT License — feel free to fork and build on top of this.

---

> *Data sourced from myscheme.gov.in and official government portals. YojanaMitra is not affiliated with the Government of India.*
