# 02 - Feature Spec: Vote Action

## Feature goal
Allow an authenticated user to submit a vote from the web app.

## Contract
- `POST /v1/votes`

## Behavior
- Requires access token input.
- Sends Bearer token in Authorization header.
- Sends `pollId` and `optionId` payload.
- On success, refreshes poll list.
- On failure, displays API error message.

## BDD
```gherkin
Feature: Vote action
  Scenario: User votes with valid token
    Given user has a valid access token
    And a poll option is visible in the UI
    When user clicks an option button
    Then app should call POST /v1/votes with pollId and optionId
    And app should refresh polls after success

  Scenario: User tries to vote without token
    Given token input is empty
    When user clicks an option button
    Then app should not call POST /v1/votes
    And app should display a token-required message
```
