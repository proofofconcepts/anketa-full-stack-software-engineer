# 01 - Feature Spec: Poll Feed

## Feature goal
Display available polls from backend and allow user-triggered refresh.

## Contract
- `GET /v1/polls`

## Behavior
- Requests polls on first page load.
- Allows manual refresh.
- Shows poll question, options, and vote count.
- Shows empty state if no polls exist.

## BDD
```gherkin
Feature: Poll feed
  Scenario: User opens web app and sees poll list
    Given backend is running and has polls
    When the user opens the web client
    Then the app should request GET /v1/polls
    And the app should render each poll question and options

  Scenario: No polls available
    Given backend returns an empty poll array
    When the user opens the web client
    Then the app should show an empty-state message
```
