# Scribo Backend Architecture Audit and Refactor Plan

## 1) High severity findings

- Secrets are committed to source in `.env` (Mongo URI, Redis password, JWT secrets, email password).
- Worker callback endpoint previously accepted unauthenticated requests, allowing forged submission results.
- Inconsistent import casing (`Auth.middleware.js` vs `auth.middleware.js`, `redis.config.js` vs `Redis.config.js`) risks runtime breakage on Linux containers.
- Business logic and DB access were concentrated in controllers, violating separation of concerns.
- Sandbox execution lacked stronger isolation settings such as `ReadonlyRootfs`, `PidsLimit`, and `no-new-privileges`.

## 2) Medium severity findings

- Validation was missing on most request payloads.
- Logging was ad-hoc using `console.log` without structured context.
- Problem creation route lacked auth/authorization protection.
- Queue jobs had no retention controls (`removeOnComplete/removeOnFail`) and could accumulate indefinitely.

## 3) Refactor implemented in this pass

- Added environment schema validation in `src/config/env.js`.
- Added structured logger in `src/config/logger.js`.
- Added centralized `notFoundHandler` and `errorHandler` in `src/middlewares/error.middleware.js`.
- Added generic request validation middleware in `src/middlewares/validation.middleware.js`.
- Added validators:
  - `src/validators/auth.validator.js`
  - `src/validators/problem.validator.js`
  - `src/validators/submission.validator.js`
- Added repositories/services:
  - `src/repositories/problem.repository.js`
  - `src/repositories/submission.repository.js`
  - `src/services/problem.service.js`
  - `src/services/submission.service.js`
- Refactored `Problem.controllers.js` and `modules/submission/submission.controller.js` to thin transport handlers.
- Secured worker callback route using `validateWorkerSecret` middleware.
- Hardened sandbox host config with tighter constraints.
- Added baseline Jest + Supertest integration tests.

## 4) Target production architecture

```text
backend/
  src/
    config/
      db.js
      env.js
      logger.js
    controllers/
    services/
    repositories/
    models/
    routes/
    middlewares/
      auth.middleware.js
      error.middleware.js
      validation.middleware.js
    validators/
    execution-engine/
    utils/
    constants/
    jobs/
    tests/
    app.js
  docker/
  scripts/
  docs/
  server.js
```

## 5) Why each layer exists

- `controllers`: HTTP adapters only (status codes, request/response mapping).
- `services`: business rules and orchestration.
- `repositories`: persistence abstraction and query centralization.
- `validators`: schema-first input contracts.
- `middlewares`: reusable request pipeline behaviors.
- `config`: environment, infrastructure clients, logger setup.
- `jobs` and `execution-engine`: asynchronous processing and isolated code execution.
- `tests`: contract and integration validation for change safety.

## 6) API audit checklist summary

- Auth APIs: add refresh-token rotation telemetry, brute-force rate limits per email/IP, password reset flow with OTP purpose segregation.
- Problem APIs: role guard create/update/delete, schema validation for test-case constraints, tenant ownership checks for PRIVATE problems.
- Submission APIs: authenticate callback, enforce language allowlist, payload-size limits, idempotent callback handling.
- Test assignment APIs: currently not present as dedicated domain routes; introduce `/tests` bounded context with service/repository split.

## 7) Execution engine recommendations

- Run worker in separate network namespace from API.
- Sign callback payloads with HMAC plus timestamp to prevent replay.
- Add per-language image pinning and vulnerability scanning in CI.
- Add circuit breaker around Docker daemon calls.
- Store raw execution artifacts in object storage with retention policies.

## 8) Technical debt cleanup recommendations

- Rename typo path `heathcheck.routes.js` to `healthcheck.routes.js` and remove compatibility shim after migration.
- Normalize file naming convention (lowercase middleware/config names).
- Remove duplicate queue helper exported from worker file to avoid drift with canonical queue module.
- Remove `crypto` package dependency (Node built-in already used).

## 9) Next milestones

1. Move Auth + Institution into service/repository pattern fully.
2. Add Swagger/OpenAPI generation and route-level examples.
3. Add Redis caching abstraction with TTL policy registry.
4. Add CI pipeline (lint, tests, Docker image scan, migration checks).
5. Add metrics (Prometheus) and alerting for worker queue lag, judge errors, and auth failures.
