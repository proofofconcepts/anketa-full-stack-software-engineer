# Exercise 04 — NestJS Auth Module Refactor

## Starting point

See `poor-code.ts`.

## What is wrong — identify each problem

1. **Passwords stored in plain text** — `password: 'admin123'` and `password: body.password` are never hashed. Any database leak exposes every user's password directly.
2. **Hardcoded JWT secret** — `'secret123'` is in the source code. Secrets must come from environment variables via `ConfigService`.
3. **Auth logic in the controller** — token signing, password comparison, and user lookup belong in a service, not a controller.
4. **No password hashing** — missing `bcrypt`/`argon2` for hashing on register and comparison on login.
5. **No DTOs or validation** — `body: any` accepts any shape. Missing `class-validator` decorators (`@IsEmail()`, `@MinLength()`).
6. **Wrong HTTP status codes** — errors return `200 OK` with an `{ error: '...' }` body instead of `401 Unauthorized` / `409 Conflict` / `HttpException`.
7. **Password exposed in register response** — `return { user: newUser }` includes the plain-text password.
8. **No Prisma** — hardcoded in-memory array; no persistence.
9. **No Passport.js / JWT guard** — there is no `@UseGuards(JwtAuthGuard)` infrastructure to protect other routes.
10. **No Swagger** — missing `@ApiTags`, `@ApiBody`, `@ApiCreatedResponse`, `@ApiUnauthorizedResponse`.
11. **No refresh token** — a single short-lived access token with no rotation strategy.
12. **Mutable singleton state** — `private users` is mutated across requests on the same singleton instance (same race-condition problem as exercise 01).

## What the refactored solution must include

### Module structure
- [ ] `AuthModule` importing `UsersModule`, `JwtModule`, `PassportModule`
- [ ] `AuthService` with `register(dto)` and `login(dto)` methods
- [ ] `AuthController` delegating entirely to `AuthService`
- [ ] `JwtStrategy` extending `PassportStrategy` for bearer token validation
- [ ] `JwtAuthGuard` extending `AuthGuard('jwt')`

### Security
- [ ] Passwords hashed with `bcrypt` (minimum 10 salt rounds) on register
- [ ] `bcrypt.compare` used on login (no plain-text comparison)
- [ ] JWT secret read from `ConfigService` (`process.env.JWT_SECRET`)
- [ ] Access token + refresh token returned on login
- [ ] Password field excluded from all response DTOs

### DTOs & validation
- [ ] `RegisterDto`: `@IsEmail()`, `@MinLength(8)` on password
- [ ] `LoginDto`: same fields
- [ ] `AuthResponseDto`: `accessToken`, `refreshToken` only — no user password

### Error handling
- [ ] `login` throws `UnauthorizedException` on bad credentials
- [ ] `register` throws `ConflictException` when email is taken
- [ ] Global `ValidationPipe` applied in `main.ts`

### Swagger
- [ ] `@ApiTags('auth')` on the controller
- [ ] `@ApiBody`, `@ApiCreatedResponse`, `@ApiUnauthorizedResponse` on each endpoint

### Tests
- [ ] Unit test: `AuthService.register` hashes the password before saving
- [ ] Unit test: `AuthService.login` returns tokens on valid credentials
- [ ] Unit test: `AuthService.login` throws `UnauthorizedException` on wrong password
- [ ] e2e test: `POST /auth/register` → 201 with no password in body
- [ ] e2e test: `POST /auth/login` → 401 on wrong credentials

## Checklist to self-assess your solution

- [ ] No plain-text password anywhere in the codebase
- [ ] JWT secret is never a string literal — always from `ConfigService`
- [ ] Controller has zero business logic
- [ ] All endpoints return correct HTTP status codes
- [ ] Register response never includes the password field
- [ ] `JwtAuthGuard` exists and can be applied to any route
- [ ] All DTOs validated with `class-validator`
- [ ] Swagger documents both endpoints fully
- [ ] Unit tests cover all three AuthService methods
