# ADR-0008: Firebase for Mobile Authentication, Realtime Data, and Push Notifications

## Status
Accepted

## Context
The mobile app needs authentication, real-time data updates (live vote counts), push notifications, and analytics. Building these from scratch against the NestJS API would require significant infrastructure work.

## Decision
Use the Firebase ecosystem for the mobile layer:
- **Firebase Auth** — email/password sign-in on mobile; the resulting Firebase ID token is exchanged with the NestJS backend to obtain a JWT.
- **Firestore** — real-time vote count snapshots on the poll detail screen. Poll results are mirrored to Firestore by the backend when a vote is cast.
- **Firebase Cloud Messaging (FCM)** — push notifications for events (new comment, poll result). The backend sends notifications via Firebase Admin SDK.
- **Firebase Analytics** — event tracking (`poll_created`, `vote_cast`, `screen_view`).

## Consequences
- Firebase Auth and the NestJS JWT system are decoupled: mobile authenticates with Firebase, then exchanges the Firebase token for an app JWT.
- Firestore real-time listeners eliminate polling for vote count updates.
- FCM requires platform-specific setup (APNs on iOS, Google Services on Android).
- Using Firebase ties the mobile app to Google's ecosystem; adding a non-Firebase mobile client later would require a separate push notification strategy.
