# Build the Brain. Run the Company.

Interactive single-page React app for MBA students to learn openClaw System Prompt Architecture through a business strategy simulation.

## Folder Structure

```
.
├── index.html
├── package.json
├── vite.config.js
├── api
│   ├── _upstash.js
│   ├── session-count.js
│   └── session-start.js
└── src
    ├── App.jsx
    ├── main.jsx
    └── styles.css
```

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Open the local URL shown in terminal (usually `http://localhost:5173`).

## Build for Production

```bash
npm run build
npm run preview
```

## Notes

- Outcomes are simulated with deterministic mock scoring logic based on user configuration choices.

## Optional: Global Session Counter (Vercel + Upstash)

This app includes optional serverless endpoints to track a global `Sessions started` counter:

- `POST /api/session-start`
- `GET /api/session-count`

Configure these environment variables in Vercel:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Behavior:

- The app creates a tab-scoped session id in `sessionStorage`.
- It calls `POST /api/session-start` once per tab session.
- It then fetches `GET /api/session-count` and displays the count in Stage 0 and Share & About.
