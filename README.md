# 🧠 DevBrain — Error Intelligence Platform

A full-stack developer tool for logging, tracking and resolving errors — powered by real AI (LLaMA 3 via Groq).

## Quick Start

### Server
```bash
cd server
npm install
npm run dev
```

### Client
```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**

## Features
- ⚡ Log errors with severity levels (Low / Medium / High / Critical)
- 🔍 Live similar error detection as you type
- 🤖 Real AI explanations and fix suggestions (LLaMA 3 via Groq)
- 💬 Multi-turn AI chat assistant
- ✓ Resolve / Reopen errors
- 📊 Analytics with severity breakdown, tag stats, trend chart
- 🌙 Full dark mode
- ⌨️ Keyboard shortcuts (N = new error, Esc = close)
- 📖 Built-in guide page

## Keyboard Shortcuts
| Key | Action |
|-----|--------|
| N | Open Log Error form |
| Esc | Close any modal/form |

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/errors | Get all errors |
| POST | /api/errors | Log a new error |
| DELETE | /api/errors/:id | Delete an error |
| POST | /api/errors/:id/resolve | Toggle resolved |
| POST | /api/errors/similar | Find similar errors |
| POST | /api/ai/explain | AI explain error |
| POST | /api/ai/fix | AI suggest fix |
| POST | /api/ai/assistant | Chat with AI |
| GET | /api/analytics | Get analytics |
