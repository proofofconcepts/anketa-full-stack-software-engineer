# ADR-0006: Flutter with Clean Architecture

## Status
Accepted

## Context
The Flutter mobile app needs a scalable, testable structure. Putting all logic in widgets leads to untestable spaghetti; a flat service-layer approach lacks separation between domain rules and infrastructure concerns.

## Decision
Adopt Clean Architecture with three layers per feature:

```
features/<name>/
├── data/         # Repository implementations, remote/local data sources
├── domain/       # Entities, repository interfaces, use cases (pure Dart, no Flutter deps)
└── presentation/ # Bloc, pages, widgets
```

The `domain/` layer has zero external dependencies — it defines what the feature does, not how. This makes use cases and entities trivially unit-testable without mocking Flutter or Firebase.

Dependency injection is handled by `get_it` with a single `injection_container.dart` at the app root.

## Consequences
- More files and directories per feature compared to a flat structure.
- The domain layer must be written first — it is the spec for the feature (see Spec-Driven Development principle).
- Adding a new data source (e.g. local cache) only requires a new `data/` implementation; the domain and presentation layers remain unchanged.
