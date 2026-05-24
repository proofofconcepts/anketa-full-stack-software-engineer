# ADR-0007: Bloc Pattern for Flutter State Management

## Status
Accepted

## Context
Flutter state management options range from `setState` (too local), to Provider (lightweight but informal), to Riverpod (reactive but less structured), to Bloc (event-driven, explicit state machines).

## Decision
Use the `flutter_bloc` package with the Bloc pattern (not Cubit). Each feature has its own Bloc with explicit event and state classes. States model the full lifecycle: `Initial`, `Loading`, `Success`, `Failure`.

The `BlocObserver` is configured globally to log all events and state transitions during development.

## Consequences
- More verbose than Cubit: every interaction requires defining an event class. This verbosity is intentional — it makes the state machine explicit and auditable.
- Blocs are purely Dart classes; they can be unit-tested without a widget tree using `bloc_test`.
- The `bloc_test` `whenListen`/`expectLater` DSL makes async state sequences easy to assert.
- `BlocBuilder` rebuilds only when state changes (via `buildWhen`), enabling fine-grained render optimization.
