# 03 - Feature Spec: Polls

## Feature Goal
Allow users to list polls, create polls, and delete owned polls.

## Endpoints
- `GET /v1/polls`
- `POST /v1/polls` (JWT required)
- `DELETE /v1/polls/:pollId` (JWT required)

## Behavior
### List Polls
- Returns latest polls ordered by creation date descending.
- Includes options and vote count summary.
- Limits result set to 50.

### Create Poll
- Requires valid JWT.
- Requires question and at least two options.
- Creates poll and option records.

### Delete Poll
- Requires valid JWT.
- Deletes only if requester owns poll.
- Returns `{ deleted: true }` on success.

## Error Cases
- `401` for missing/invalid token on private routes.
- `403` for delete attempts by non-owner.
- `404` if poll does not exist.

## BDD
```gherkin
Feature: Poll management
  Scenario: Authenticated user creates a poll
    Given a valid authenticated user
    When the client sends POST /v1/polls with question and options
    Then the response status should be 201
    And the poll should be persisted with owner set to the user

  Scenario: Non-owner cannot delete poll
    Given a poll created by another user
    And a valid token for a different user
    When the client sends DELETE /v1/polls/{pollId}
    Then the response status should be 403

  Scenario: Public poll list is available
    Given polls exist in the system
    When the client sends GET /v1/polls
    Then the response status should be 200
    And polls should be ordered by newest first
```
