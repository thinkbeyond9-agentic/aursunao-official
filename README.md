# Aur Sunao — Multi-Page Website

**aur sunao. / और सुनाओ।** — Voice-first, anonymous emotional venting platform with a brand-side market intelligence suite. Every module lives on its own page.

## Pages (React Router)

| Route | Module | What's on it |
|---|---|---|
| `/` | **Home** | Hero, benefits, why-people-record starters |
| `/booth` | **Voice Booth** | Anonymous voice/text venting, live transcription, mood auto-detect, biometric sync, WhatsApp voice booth |
| `/stories` | **Stories Library** | Structured story vault, filters, Story Knowledge Graph, 8 life-tension categories, ICP community dashboard, Resilience AI search |
| `/bounties` | **Vent Bounties** | Brand-sponsored vent bounties with loyalty-point payouts |
| `/pricing` | **Pricing** | Subscription tiers & billing |
| `/brands` | **Brand Intelligence Suite** | Market intelligence, synthetic ICP avatars, ad reaction lab, cost estimator, research workspaces |
| `/faq` | **Help & FAQ** | SEO knowledge hub, cognitive-science explainer, 14-question FAQ center |

Shared on every page: sticky header with active-page nav (dropdown menu on smaller screens), language toggle (EN/हिंदी), trust strip, footer, and all modals.

## Run Locally

1. Install dependencies: `npm install`
2. (Optional) Set `GEMINI_API_KEY` in `.env.local` for live AI structuring — without it, all AI endpoints gracefully fall back to built-in responses
3. Run the app: `npm run dev` → http://localhost:3000
4. Production build: `npm run build` then `npm start`

## Tech

React 19 + TypeScript + Vite + Tailwind v4 + React Router 7 + Express (API server) + Firebase/Gemini integrations.
