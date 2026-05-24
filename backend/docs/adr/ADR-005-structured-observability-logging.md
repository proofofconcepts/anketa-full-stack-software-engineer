# ADR-005: Structured Logging for Observability

## Status
Accepted

## Decision
Emit JSON logs to terminal with request ID, status, method, route, and latency through a global interceptor and exception filter.

## Consequences
- Logs can be ingested by centralized observability platforms.
- Easier request tracing and incident triage.
