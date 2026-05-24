# Anketa Social Vote Frontend

React + TypeScript web client for the Anketa social vote backend.

## Tech
- Vite
- React
- TypeScript

## Local setup
1. Copy `.env.example` to `.env`.
2. Ensure backend API is running at `http://localhost:3000`.
3. Install dependencies:
   - `npm install`
4. Run development server:
   - `npm run dev`

## Environment
- `VITE_API_BASE_URL`: backend base URL, default `http://localhost:3000/v1`

## Current features
- Load polls from `GET /v1/polls`
- Submit vote to `POST /v1/votes` using pasted JWT access token

## Next
- Add auth pages for register/login
- Persist token securely in state layer
- Add create poll and delete poll flows
