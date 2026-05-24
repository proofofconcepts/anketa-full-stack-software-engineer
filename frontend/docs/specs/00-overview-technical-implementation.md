# 00 - Overview Technical Implementation

## Purpose
Document the current web implementation and how it integrates with backend API contracts.

## Runtime
- Framework: React + TypeScript
- Build/dev server: Vite
- Backend dependency: `/v1` API contract from backend service

## Current frontend architecture
- `src/App.tsx`: page composition and state orchestration.
- `src/api/client.ts`: API request wrapper and endpoint calls.
- `src/components/PollCard.tsx`: reusable poll presentation and vote action UI.
- `src/types/poll.ts`: contract types used by UI and API client.

## API integration currently implemented
- Poll list: `GET /v1/polls`
- Vote action: `POST /v1/votes` with Bearer token

## Technical constraints
- Access token is currently entered manually in UI for testing.
- No persistent auth/session state yet.
- Error handling is user-visible via lightweight UI messages.
