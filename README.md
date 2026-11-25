# ScamShield AI 🛡️

An AI-powered web application that analyzes suspicious SMS messages, emails, WhatsApp messages, and job offers to identify potential scam indicators.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Tech Stack](https://img.shields.io/badge/Node.js-18+-green) ![Tech Stack](https://img.shields.io/badge/Gemini_AI-Powered-purple) ![Tech Stack](https://img.shields.io/badge/Tailwind_CSS-3-cyan)

## Features

- **AI-Powered Analysis** — Uses Google Gemini AI to intelligently detect scam patterns
- **Rule-Based Fallback** — Works offline with deterministic pattern matching when API is unavailable
- **Multi-Language** — Supports English, Hindi (हिंदी), and Telugu (తెలుగు)
- **Risk Scoring** — Provides risk level (Low/Medium/High) with a 0-100 score
- **Warning Signs** — Lists specific scam indicators found in the message
- **Safety Recommendations** — Actionable advice based on threat level
- **Scan History** — Stores past analyses in browser localStorage
- **Sample Messages** — Built-in examples to demonstrate the tool
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Privacy First** — No data stored on the server; history stays in your browser

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| AI | Google Gemini 1.5 Flash |
| Validation | Zod |
| Security | Helmet, CORS, Rate Limiting |
| Testing | Node.js built-in test runner |

## Quick Start

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key ([get one free](https://aistudio.google.com/app/apikey))

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ScamSheild-ai
```

### 2. Install dependencies

```bash
# Install both server and client dependencies
cd server && npm install && cd ../client && npm install && cd ..
```

### 3. Configure environment

```bash
cp .env.example server/.env
```

Edit `server/.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
```

> **Note:** The app works without an API key using the rule-based fallback analyzer, but Gemini AI provides much better analysis.

### 4. Run in development mode

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API requests to the backend at `http://localhost:3001`.

### 5. Run tests

```bash
cd server
npm test
```

## Production Build & Deployment

### Build for production

```bash
cd client && npm run build && cd ..
```

### Run production server

```bash
cd server
NODE_ENV=production node index.js
```

The Express server serves both the API and the built React frontend on port 3001 (or `PORT` env variable).

### Deploy to Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your repository
3. Set the following:
   - **Build Command:** `cd client && npm install && npm run build && cd ../server && npm install`
   - **Start Command:** `cd server && node index.js`
   - **Environment Variables:** Add `GEMINI_API_KEY` and set `NODE_ENV=production`

## Project Structure

```
ScamSheild-ai/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # Language context provider
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # API client & translations
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                  # Express backend
│   ├── routes/              # API routes
│   ├── services/            # Gemini & fallback analyzers
│   ├── middleware/          # Security & rate limiting
│   ├── validation/          # Zod schemas
│   ├── tests/               # Backend tests
│   ├── index.js             # Server entry point
│   └── package.json
├── .env.example
├── .gitignore
├── package.json             # Root scripts
└── README.md
```

## API Reference

### `POST /api/analyze`

Analyze a message for scam indicators.

**Request Body:**
```json
{
  "message": "Suspicious message text here...",
  "type": "sms",
  "language": "en"
}
```

| Field | Type | Required | Values |
|-------|------|----------|--------|
| `message` | string | Yes | 5-5000 characters |
| `type` | string | No | `sms`, `email`, `whatsapp`, `job_offer`, `other` |
| `language` | string | No | `en`, `hi`, `te` |

**Response:**
```json
{
  "risk_level": "high",
  "risk_score": 85,
  "warning_signs": ["Creates artificial urgency", "Requests sensitive financial information"],
  "explanation": "This message exhibits multiple strong indicators of a scam...",
  "recommendations": ["Do NOT respond to this message", "Block the sender"],
  "analysis_method": "gemini_ai",
  "disclaimer": "This AI analysis is advisory only..."
}
```

### `GET /api/health`

Health check endpoint. Returns `{ "status": "ok" }`.

## Security

- API keys stored in environment variables only
- Request body limited to 50KB
- Rate limited to 15 requests per minute
- Security headers via Helmet
- Input validation with Zod
- User messages treated as untrusted data, never as instructions
- No secrets exposed in frontend code or logs

## License

MIT

