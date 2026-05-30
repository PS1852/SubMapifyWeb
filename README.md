# SubMapify Web

Vite + React landing page for SubMapify.

## Vercel

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Email env vars for the built-in Vercel API:
  - `EMAIL_USER`
  - `EMAIL_PASS`
  - `RECEIVER_EMAIL`
- Optional env var: `VITE_API_BASE_URL` for an external backend URL. Leave blank when using this repo's `/api/v1/leads/*` Vercel functions.
