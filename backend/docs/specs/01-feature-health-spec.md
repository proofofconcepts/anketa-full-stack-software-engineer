# 01 - Feature Spec: Health

## Feature Goal
Provide a lightweight health endpoint for API and database readiness checks.

## Endpoint
- `GET /v1/health`

## Behavior
- Executes DB probe query.
- Returns service status and current timestamp.

## Response Shape
- `status`
- `timestamp`

## BDD
```gherkin
Feature: Health check
  Scenario: API and database are available
    Given the backend service is running
    When a client sends GET /v1/health
    Then the response status should be 200
    And the response body should contain status "ok"
    And the response body should contain timestamp
```
