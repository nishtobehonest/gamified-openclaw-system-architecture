# Build the Brain. Run the Company.

Interactive single-page React app for MBA students to learn openClaw System Prompt Architecture through a business strategy simulation.

## Folder Structure

```
.
├── index.html
├── package.json
├── vite.config.js
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

- No backend is used.
- No external API calls are made.
- Outcomes are simulated with deterministic mock scoring logic based on user configuration choices.
