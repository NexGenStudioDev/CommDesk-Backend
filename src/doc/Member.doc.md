# 🚀 MEMBER ONBOARDING SYSTEM (PRODUCTION A→Z)

> A **unified, secure, scalable onboarding system** to create, invite, and activate members across communities.

---

# 🧠 SYSTEM MODEL

```txt
Auth → User → Member → Role → Permission
```

### Key Principles

- **User** = global identity
- **Member** = community-specific identity
- One user → multiple communities
- Unique constraint → `(communityId, email)`

---

# 🎯 OBJECTIVES

- Multi-tenant safe
- Idempotent APIs
- High scalability (10K+ imports)
- Secure onboarding (no password exposure)
- Fully observable (logs + metrics)
- Failure-resilient (queues + retries)

---

# 🧱 API CONTRACT

---

## 🔹 1. Create / Invite Member

```http
POST /api/v1/members
```

---

### 🔐 Authentication Modes

```txt
JWT → dashboard/internal
API KEY → external integrations
```

---

### 📥 Headers

```http
Authorization: Bearer <JWT | API_KEY>
Idempotency-Key: <uuid>   // REQUIRED for external API
X-Community-Id: <communityId> // REQUIRED
```

---

### 📦 Request Body

```json
{
  "firstName": "Aarav",
  "lastName": "Mehta",
  "email": "aarav.mehta4827@protonmail.com",
  "publicProfileUrl": "https://github.com/aaravmehta",
  "imageUrl": "https://img.freepik.com/free-vector/young-man-glasses-avatar_1308-174676.jpg",
  "membershipStatus": "Active",
  "onboardingSource": "website",
  "primaryRole": "mentor",
  "location": "Toronto",
  "skills": ["TypeScript", "GraphQL", "Docker"],
  "areaOfInterest": ["OPEN_SOURCE", "AI"],
  "internalNotes": "Active contributor, prefers backend-heavy tasks"
}
```

---

### ✅ Success Response

```json
{
  "success": true,
  "message": "Member invited successfully",
  "data": {
    "memberId": "64fa...",
    "status": "ON_BOARDING"
  }
}
```

---

### ❌ Error Responses

```json
{
  "success": false,
  "code": "MEMBER_DUPLICATE",
  "message": "Member already exists in this community"
}
```

```json
{
  "success": false,
  "code": "UNAUTHORIZED",
  "message": "Permission denied"
}
```

---

# 🔄 CORE FLOW (PRODUCTION PIPELINE)

```txt
Request
 ↓
Validate (Zod)
 ↓
Resolve community (JWT/API key)
 ↓
Authorization check (RBAC)
 ↓
Idempotency check
 ↓
Duplicate check (communityId + email)
 ↓
User upsert
 ↓
Auth creation (if new user)
 ↓
Member creation (ON_BOARDING)
 ↓
Activation token (hashed + expiry)
 ↓
Email job enqueue
 ↓
Audit log
 ↓
Response
```

---

# 🔐 AUTH + ACTIVATION FLOW

---

## On Member Creation

```ts
{
  email,
  passwordHash: null,
  activationTokenHash,
  emailVerified: false,
  expiresAt: +24h
}
```

---

## 🔹 Activation API

```http
POST /api/v1/auth/activate-member
```

### Request

```json
{
  "token": "abc123",
  "password": "StrongPassword@123"
}
```

---

### Flow

```txt
validate token
 ↓
check expiry
 ↓
hash password
 ↓
emailVerified = true
 ↓
membershipStatus → ACTIVE
```

---

# 📥 BULK IMPORT SYSTEM

---

## 🔹 Upload CSV

```http
POST /api/v1/members/import
Content-Type: multipart/form-data
```

---

### Response

```json
{
  "success": true,
  "jobId": "import_123"
}
```

---

## 🔹 Job Status

```http
GET /api/v1/members/import/:jobId
```

---

### Processing Flow

```txt
upload CSV
 ↓
validate schema
 ↓
create job
 ↓
split batches (500 rows)
 ↓
queue workers
 ↓
per-row validation
 ↓
idempotency check
 ↓
success/failure tracking
 ↓
store report
 ↓
notify user
```

---

# 🔁 IDEMPOTENCY SYSTEM

---

## Why?

Prevent:

- duplicate members
- retry issues
- race conditions

---

## Storage Model

```ts
Idempotency {
  key
  requestHash
  response
  status
  expiresAt
}
```

---

## Behavior

- Same key + same request → return cached response
- Same key + different request → reject

---

# 🔐 SECURITY LAYER

---

## Rate Limiting

```txt
JWT → 60 req/min
API KEY → 100 req/hour
Import → 5 jobs/hour
```

---

## Token Security

- SHA-256 hash stored
- TTL index (expiry)
- single-use tokens

---

## Input Validation

- Zod schema
- strict enums
- sanitize strings

---

## Data Protection

- no password in email
- no sensitive logs
- minimal PII exposure

---

# 🧾 DATABASE DESIGN

---

## 🔥 Critical Indexes

```ts
Member → { communityId, email } UNIQUE
User → { email } UNIQUE
ActivationToken → TTL index
ApiKey → unique hash
```

---

## Member Core Fields

```ts
Member {
  userId
  communityId
  email

  firstName
  lastName

  primaryRole
  accessLevel

  membershipStatus
  onboardingSource

  createdBy
  createdAt
}
```

---

# 🧠 RBAC (PERMISSION SYSTEM)

---

## Allowed Roles

```txt
ORGANIZER
ADMIN
```

---

## Middleware

```ts
requirePermission("MANAGE_MEMBERS");
```

---

# 📧 EMAIL SYSTEM (MANDATORY)

---

## Queue

- BullMQ + Redis

---

## Templates

```txt
member_invitation
account_activation
import_summary
```

---

## Reliability

- retry (exponential)
- dead letter queue
- deduplication key

---

# 📊 OBSERVABILITY

---

## Logs

- structured logs (Pino)
- correlationId per request

---

## Metrics

```txt
members_created_total
activation_success_rate
import_success_rate
api_usage
```

---

## Alerts

- high failure rate
- queue backlog
- email failures

---

# 🧾 AUDIT SYSTEM

---

## Events

```txt
member_created
member_invited
member_activated
member_import_started
member_import_completed
member_role_updated
```

---

# ⚠️ ERROR HANDLING

---

## Standard Format

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Invalid input"
}
```

---

## HTTP Mapping

| Code | Meaning      |
| ---- | ------------ |
| 400  | validation   |
| 401  | unauthorized |
| 403  | forbidden    |
| 409  | conflict     |
| 500  | server       |

---

# 🧨 EDGE CASES (HANDLED)

```txt
duplicate email race
retry storm (idempotency)
expired token
token reuse
partial import failure
email service down
invalid CSV
```

---

# ⚙️ PERFORMANCE

---

- batch processing
- streaming CSV (no memory overload)
- horizontal worker scaling

---

# 🌍 ENVIRONMENT

```txt
DEV
STAGING
PROD
```

- separate API keys
- feature flags (import limits)

---

# 🛡️ COMPLIANCE

---

- data deletion support
- minimal logging
- consent-based email sending

---

# ✅ ACCEPTANCE CRITERIA

✔ Member invite works (JWT & API)
✔ Idempotent API behavior
✔ Duplicate prevention guaranteed
✔ Activation flow secure
✔ Bulk import handles 10K+
✔ RBAC enforced
✔ Email system reliable
✔ Observability implemented
✔ Edge cases covered
✔ Fully tested
