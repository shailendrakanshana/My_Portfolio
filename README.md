# shailendrakanshana.github.io/My_Portfolio

Personal site of Shailendra Kanshana: AI engineer, founding engineer, product builder.

**Live:** https://shailendrakanshana.github.io/My_Portfolio/

## Stack
React 18, TypeScript, Vite, Framer Motion. Hand-written CSS, no UI kit. Fonts are self-hosted through Fontsource (Instrument Serif, Geist, JetBrains Mono).

## Ideas worth knowing about
- **One data layer, two interfaces.** All content lives in `src/data.ts`. The page renders it, and the in-page console (§06) serves the same data through simulated JSON-RPC tool calls. That's the same pattern as Auramiq's REST + MCP architecture, on a small scale. `public/llms.txt` is a plain-text version for agents.
- **fig. 01, attention field** (`src/components/AttentionField.tsx`): a canvas in which the cursor acts as a query and keywords from the work are keys. A softmax over distance picks which keys get weighted links. It pauses when it's off screen and respects `prefers-reduced-motion`.
- **Experience as a trace waterfall**, **stack with provenance** (each tool is mapped to where it was used), **animated architecture diagrams** per project, and a **⌘K / Ctrl+K command menu**.

## Develop
```bash
npm install
npm run dev      # http://localhost:5173/My_Portfolio/
npm run build    # outputs to dist/
```

## Deploy
Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Editing content
Change `src/data.ts` (and `public/llms.txt` if facts change). To replace the résumé, swap `public/Shailendra_Kanshana_Resume.pdf`.
