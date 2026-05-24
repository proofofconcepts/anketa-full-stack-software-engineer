# 04 - Feature Spec: Votes

## Feature Goal
Allow authenticated users to vote on polls with strict one-vote-per-user-per-poll integrity.

## Endpoint
- `POST /v1/votes` (JWT required)

## Behavior
- Requires valid JWT.
- Validates poll existence.
- Validates selected option belongs to poll.
- Creates vote record.
- Enforces unique vote by user and poll via DB constraint.

## Error Cases
- `401` for missing/invalid token.
- `404` when poll does not exist.
- `404` when option is not in poll.
- `409` when user already voted in poll.

## Data Integrity Rule
- Unique constraint: `Vote @@unique([userId, pollId])`.

## BDD
```gherkin
Feature: Vote submission
  Scenario: Authenticated user votes once on a valid poll option
    Given a poll exists with valid options
    And a valid authenticated user
    When the client sends POST /v1/votes with pollId and optionId
    Then the response status should be 201
    And the vote should be persisted

  Scenario: User cannot vote twice on the same poll
    Given the user has already voted on the poll
    When the client sends POST /v1/votes again for the same poll
    Then the response status should be 409

  Scenario: Vote fails when option does not belong to poll
    Given a poll exists
    And an option id from a different poll
    When the client sends POST /v1/votes
    Then the response status should be 404
```
