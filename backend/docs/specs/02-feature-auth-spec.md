# 02 - Feature Spec: Authentication

## Feature Goal
Provide registration, login, and refresh flows for secure API access.

## Endpoints
- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/refresh`

## Behavior
### Register
- Validates email, password, and display name.
- Rejects duplicate emails.
- Creates user with hashed password.
- Returns access and refresh tokens.

### Login
- Validates credentials.
- Rejects invalid email/password.
- Returns access and refresh tokens.

### Refresh
- Validates refresh token existence, expiry, and revocation state.
- Revokes previous refresh token.
- Issues and stores new token pair.

## Error Cases
- `409` for duplicate registration.
- `401` for invalid credentials.
- `401` for invalid/expired/revoked refresh token.

## BDD
```gherkin
Feature: Authentication
  Scenario: User registers with valid data
    Given no account exists for "user@example.com"
    When the client sends POST /v1/auth/register with valid payload
    Then the response status should be 201
    And the response should include accessToken and refreshToken

  Scenario: User login fails with wrong password
    Given an account exists for "user@example.com"
    When the client sends POST /v1/auth/login with an invalid password
    Then the response status should be 401
    And the response message should indicate invalid credentials

  Scenario: Refresh rotates token
    Given a valid non-revoked refresh token exists
    When the client sends POST /v1/auth/refresh
    Then the response status should be 201
    And a new token pair should be returned
    And the previous refresh token should be marked revoked
```
