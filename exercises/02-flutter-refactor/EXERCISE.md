# Exercise 02 — Flutter Search Page Refactor

## Starting point

See `poor_code.dart`.

## What is wrong — identify each problem

1. **No BLoC pattern** — the role explicitly requires BLoC for state management. Using `setState` mixes UI and business logic in the same class.
2. **Data hardcoded in the widget** — `users` is a plain `List<String>` inside a `StatefulWidget`. Data must come from a repository, which in turn calls an API or local data source.
3. **Timer leak** — `debounce` is reassigned on every keystroke without cancelling the previous timer first (`debounce?.cancel()`). This fires multiple callbacks and is a resource leak. The timer is also never cancelled in `dispose()`.
4. **No `dispose()` override** — `controller` and `debounce` are never disposed, causing memory leaks.
5. **No loading state** — there is no visual feedback while the search is in progress.
6. **No error state** — network or repository failures are silently swallowed.
7. **No empty state** — no UI when results are empty.
8. **Weak typing** — `users` is `List<String>` instead of a `User` model with `id`, `name`, and `role`.
9. **No Clean Architecture layers** — presentation, domain, and data are all collapsed into one widget file.
10. **No result display** — the `Scaffold` body only shows the `TextField`; results are never rendered.

## What the refactored solution must include

### Domain layer
- [ ] A `User` entity (`id`, `name`, `role`)
- [ ] A `UserRepository` abstract class with `searchUsers(String query)` returning `Future<List<User>>`
- [ ] A `SearchUsersUseCase` that delegates to the repository

### Data layer
- [ ] A `UserRepositoryImpl` that calls a REST API (or returns mock data for this exercise)
- [ ] A `UserModel` (data transfer object extending / mapping to `User`)

### Presentation layer — BLoC
- [ ] A `SearchEvent` sealed class: `SearchQueryChanged(String query)`
- [ ] A `SearchState` sealed class: `SearchInitial`, `SearchLoading`, `SearchLoaded(List<User> users)`, `SearchError(String message)`
- [ ] A `SearchBloc` that:
  - uses `EventTransformer` (e.g. `debounce`) from `bloc_concurrency` or `rxdart` instead of a manual `Timer`
  - calls `SearchUsersUseCase` on `SearchQueryChanged`
  - emits the correct states

### Presentation layer — UI
- [ ] A `SearchPage` that is a `StatelessWidget` wrapping `BlocProvider`
- [ ] A `SearchView` using `BlocBuilder<SearchBloc, SearchState>` to render:
  - Loading indicator for `SearchLoading`
  - `ListView` for `SearchLoaded`
  - Error message for `SearchError`
  - Hint text for `SearchInitial`
- [ ] `TextField` that `add`s `SearchQueryChanged` to the bloc on change

## Checklist to self-assess your solution

- [ ] Zero `setState` calls in any widget
- [ ] No hardcoded data in any widget or BLoC
- [ ] `Timer` is replaced by a proper event transformer
- [ ] `dispose()` is called for all controllers (if any remain)
- [ ] All four states are handled in the UI
- [ ] `User` is a proper typed entity, not a `String`
- [ ] Repository is injected (not instantiated with `new` inside the BLoC)
- [ ] Unit tests cover `SearchBloc` state transitions
- [ ] Widget test covers rendering each state
