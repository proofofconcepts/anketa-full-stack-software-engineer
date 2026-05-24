# Health Endpoint - Spec

> **Status:** Approved
> **Author:** @team
> **Created:** 2026-05-24
> **Last updated:** 2026-05-24
> **Related ADRs:** [ADR-001-nestjs-modular-architecture](../adr/ADR-001-nestjs-modular-architecture.md), [ADR-005-structured-observability-logging](../adr/ADR-005-structured-observability-logging.md)

---

## 1. Overview

This feature provides a lightweight health endpoint to confirm API availability and database connectivity, enabling runtime checks for local development, debugging workflows, and operational readiness validation.

---

## 2. Goals

- Provide a fast API health probe for service status checks.
- Verify database connectivity through a minimal query.
- Return a simple and consistent response contract for monitoring and diagnostics.

## 3. Non-Goals

- Implementing a full production monitoring dashboard.
- Returning deep subsystem diagnostics beyond API and database readiness.
- Defining autoscaling or infrastructure orchestration behavior.

---

## 4. Background & Context

The backend is delivered in a backend-first phase and requires a deterministic endpoint to verify service boot and data-layer readiness. The health endpoint supports local setup validation and early troubleshooting before calling feature-specific routes.

---

## 5. Functional Requirements

Use MUST, SHOULD, and MAY as defined by RFC 2119.

### 5.1 Health Probe Flow

- REQ-01 (P0): The system MUST expose `GET /v1/health` as a public endpoint.
- REQ-02 (P0): The endpoint MUST execute a database probe query before returning success.
- REQ-03 (P0): The endpoint MUST return HTTP 200 when API and database checks pass.
- REQ-04 (P1): The endpoint SHOULD return a stable response shape with `status` and `timestamp`.

### 5.2 Failure Behavior

- REQ-05 (P0): If the database probe fails, the endpoint MUST return an error response via global exception handling.
- REQ-06 (P1): Failure responses SHOULD follow the shared backend error contract.

---

## 6. Non-Functional Requirements

- Performance: The endpoint should complete quickly under normal local load.
- Availability: The route should be reachable whenever the API process is running.
- Security: No sensitive internal data should be exposed in the health response.
- Observability: Health calls should be captured by structured request and error logs.
- Scalability: The probe should remain lightweight and safe for frequent checks.

---

## 7. User Stories / Scenarios

```text
As a developer or operator,
I want a simple health endpoint,
So that I can quickly validate API and database readiness.
```

### Acceptance Criteria

- [ ] Given the backend service is running, when a client sends `GET /v1/health`, then status code 200 is returned.
- [ ] Given the endpoint succeeds, when the response is returned, then it includes `status: "ok"`.
- [ ] Given the endpoint succeeds, when the response is returned, then it includes a `timestamp` field.

---

## 8. Technical Design

### 8.1 High-Level Architecture

```text
[Client] -> [GET /v1/health Controller] -> [Prisma Service Probe] -> [Database]
```

### 8.2 Data Model

No new persistent data model is introduced for this feature.

Response contract shape:

```ts
interface HealthResponse {
  status: 'ok';
  timestamp: string;
}
```

### 8.3 API Contract

Endpoint:

- `GET /v1/health`

Example response:

```json
{
  "status": "ok",
  "timestamp": "2026-05-24T00:00:00.000Z"
}
```

### 8.4 Key Flows

Happy path:

1. Client requests `GET /v1/health`.
2. Controller executes database probe query.
3. Service returns status and timestamp.
4. API returns HTTP 200.

Edge cases:

- Database unavailable: request fails and error contract is returned.
- Unexpected runtime exception: global exception filter normalizes response.

---

## 9. Error Handling

- Invalid route method: framework returns standard method-not-allowed behavior.
- Database probe failure: return normalized server error through global exception filter.
- Unexpected runtime error: return normalized backend error contract with request context.

---

## 10. Open Questions

1. Should health checks evolve into readiness and liveness endpoints separately?
Owner: @team
Status: Open

2. Should database probe depth remain minimal (`SELECT 1`) or include additional checks?
Owner: @team
Status: Open

---

## 11. Out of Scope / Future Work

- Advanced health dimensions (cache, queue, third-party dependencies).
- Historical health analytics and trend visualization.
- Dedicated production SLA/SLO monitoring integrations.

---

## 12. References

- [Backend overview spec](00-overview-technical-implementation.md)
- [Backend OpenAPI contract](../../openapi/anketa-social-vote.openapi.yaml)
- [Health controller implementation](../../src/health.controller.ts)
