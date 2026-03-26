# Scribo Production Extension Blueprint

## Added Domain Models

- Institution
- Branch
- Batch
- Section
- Student
- Faculty
- Subject
- Problem (extended)
- Test
- Submission (extended)
- TestAttempt

All new models are normalized with references and indexes to support multi-tenant scale.

## Academic Hierarchy

Institution -> Branch -> Batch -> Section -> Students

Students now carry:
- institutionId
- branchId
- batchId
- sectionId
- subjects

## New REST APIs

### Admin APIs (`/api/admin`)
- POST `/branches`
- GET `/branches`
- POST `/batches`
- GET `/batches`
- POST `/sections`
- GET `/sections`
- POST `/students/import`
- GET `/students`
- POST `/faculty`
- GET `/faculty`
- POST `/subjects`
- GET `/subjects`
- POST `/problems`
- GET `/problems`
- POST `/tests`
- GET `/tests`
- GET `/analytics`

### Faculty APIs (`/api/faculty`)
- GET `/subjects`
- POST `/problems`
- POST `/tests`
- GET `/tests`
- GET `/submissions`
- GET `/performance`
- GET `/leaderboard`

### Student APIs (`/api/student`)
- GET `/tests/assigned`
- POST `/tests/attempts/start`
- POST `/tests/attempts/submit`
- GET `/tests/attempts`
- GET `/submissions`
- GET `/leaderboard`

## Queue + Execution Pipeline

Current flow:
1. Submission enters BullMQ queue (`code-submissions`)
2. Worker executes testcases through Docker sandbox
3. Callback updates submission + emits socket event

Hardening and upgrades implemented:
- Added language normalization support for C++, Java, Python, JavaScript
- Enforced container constraints in sandbox:
  - memory and memory swap cap
  - CPU cap (`NanoCpus`)
  - process count limit (`PidsLimit`)
  - no network (`NetworkMode: none`)
  - readonly root filesystem

## Docker Sandbox Images

Added Dockerfiles for:
- cpp-sandbox
- python-sandbox
- javascript-sandbox
- java-sandbox

`docker-compose.yml` now includes image build entries for all execution runtimes.

## Frontend Dashboards

Admin dashboard now includes module views:
- Dashboard
- Branches
- Batches
- Sections
- Students
- Faculty
- Subjects
- Tests
- Analytics

Faculty dashboard now includes:
- Subjects
- Problem Bank
- Tests
- Submissions
- Performance
- Leaderboard

Client APIs added:
- `client/src/api/admin.api.js`
- `client/src/api/faculty.api.js`
- `client/src/api/student.api.js`
