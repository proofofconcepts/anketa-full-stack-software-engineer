# Exercise 05 — Flutter Create Poll Refactor

## Starting point

See `poor_code.dart`.

## What is wrong — identify each problem

1. **No BLoC** — all state is managed with `setState`. The role requires BLoC for every user-facing state change.
2. **Direct HTTP call in the widget** — `http.post(...)` lives inside the widget. Network calls belong in a data-layer repository accessed through a domain use case.
3. **API URL hardcoded in the widget** — `'https://api.example.com/polls'` is a magic string. URLs belong in a constants file or environment config, and HTTP calls belong in the data layer.
4. **No form validation** — empty question, duplicate options, and single-option polls are never rejected before submission.
5. **`print` for error handling** — errors are silently swallowed by `print`. The user sees no feedback when submission fails.
6. **`Navigator.pop` after `await` without mounted check** — if the widget is unmounted while the HTTP call is in flight, calling `Navigator.pop(context)` throws. Must check `if (mounted)` or use a BLoC navigation event.
7. **No `dispose()` override** — `questionController` and all `optionControllers` are never disposed, causing memory leaks.
8. **No network error handling** — if the device is offline, `http.post` throws a `SocketException` that is never caught.
9. **Loading state blocks the wrong element** — hiding the submit button during loading is confusing UX; a full-screen or overlay indicator is expected.
10. **No Clean Architecture layers** — presentation, domain, and data are all in a single file with no separation.

## What the refactored solution must include

### Domain layer
- [ ] A `Poll` entity with `question` and `List<String> options`
- [ ] A `CreatePollRepository` abstract class with `createPoll(Poll poll) → Future<void>`
- [ ] A `CreatePollUseCase` that validates and delegates to the repository

### Data layer
- [ ] A `CreatePollRepositoryImpl` that uses `Dio` or `http` to `POST /polls`
- [ ] Base URL and headers managed centrally (e.g. via a `ApiClient` singleton)
- [ ] `DioException` / `SocketException` caught and mapped to domain errors

### Presentation layer — BLoC
- [ ] `CreatePollEvent` sealed class:
  - `QuestionChanged(String value)`
  - `OptionChanged(int index, String value)`
  - `OptionAdded()`
  - `OptionRemoved(int index)`
  - `FormSubmitted()`
- [ ] `CreatePollState` with fields: `question`, `options`, `status` (`initial` / `loading` / `success` / `failure`), `errorMessage`
- [ ] `CreatePollBloc` that validates the form on `FormSubmitted` before calling `CreatePollUseCase`

### Presentation layer — UI
- [ ] `CreatePollPage` as a `StatelessWidget` that provides `BlocProvider<CreatePollBloc>`
- [ ] `BlocListener` to navigate away on `success` and show a `SnackBar` on `failure`
- [ ] `BlocBuilder` to render loading overlay and disable the submit button
- [ ] Form validation errors displayed inline below each field

### Tests
- [ ] Unit test: `CreatePollBloc` emits `loading` then `success` when use case succeeds
- [ ] Unit test: `CreatePollBloc` emits `failure` when repository throws
- [ ] Unit test: `FormSubmitted` with empty question emits validation error, not a network call
- [ ] Widget test: submit button is disabled while `status == loading`

## Checklist to self-assess your solution

- [ ] Zero `setState` calls
- [ ] Zero `http` / `Dio` imports in widget files
- [ ] No hardcoded URLs in any widget or BLoC
- [ ] All `TextEditingController`s disposed in `dispose()`
- [ ] Navigation and `SnackBar` triggered via `BlocListener`, not inside `async` widget methods
- [ ] Network errors surface as a readable message to the user
- [ ] Form prevents submission when question is empty or fewer than 2 options exist
- [ ] BLoC unit tests pass without a real network call
