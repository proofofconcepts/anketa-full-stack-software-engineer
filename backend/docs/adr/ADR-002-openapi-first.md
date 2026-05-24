# ADR-002: OpenAPI-First Spec-Driven Development

## Status
Accepted

## Decision
Use `openapi/anketa-social-vote.openapi.yaml` as the API source of truth. Endpoint changes start in the spec before controller/service implementation.

## Consequences
- API behavior is explicit and reviewable.
- Enables contract-oriented testing.
