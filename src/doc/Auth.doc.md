# 🚀 CommDesk Auth System (FAANG-Level Architecture)

> This document defines the **complete Authentication + Identity + Role + Security system** for CommDesk.
> It is designed to be **production-ready, scalable, multi-tenant, and enterprise-grade**.

---

# 🧠 Core Philosophy

```text
Auth = Security + Identity
User = Global Identity
Member = Community Context
Role = Behavior inside community
BuilderProfile = Developer Identity
BuilderStats = Reputation Engine
```

---

# 🏗️ System Architecture

```text
Auth
 ↓
User
 ↓
Member (multi-community)
 ↓
Role Layer (Organizer / Mentor / Judge / Participant)
 ↓
Permission Layer
 ↓
BuilderProfile (participants only)
 ↓
BuilderStats (async reputation)
```

---

# 📦 Modules Overview

```text
/api/v1
 ├── auth
 ├── user
 ├── member
 ├── organization
 ├── permission
 ├── audit
 ├── builder
```

---

# 🔐 Auth Schema (Security Core)

## Fields

- email
- passwordHash
- emailVerified
- systemRole
- failedLoginAttempts
- loginAttemptsWindow
- banExpiresAt
- isBanned
- refreshTokens[]
- deviceSessions[]
- mfaEnabled
- userId

---

## ✅ TODO (Auth Schema)

- [ ] Add refresh token rotation support
- [ ] Add device session tracking
- [ ] Add MFA (TOTP)
- [ ] Add login anomaly detection
- [ ] Add token blacklist system

---

# 🧑‍🤝‍🧑 Member Creation

# 🚀 Endpoint

```http
POST /api/v1/members
```

# 🧠 Purpose

Create a **new member inside a community** with:

- role assignment (Mentor / Judge / Organizer / Participant)
- onboarding (activation-based, no password yet)
- optional user + auth creation
- audit + security logging

---

# 📥 Request Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "primaryRole": "MENTOR",
  "location": "Berlin",
  "skills": ["React", "Node"],
  "areaOfInterest": ["MENTORSHIP"],
  "internalNotes": "Speaker for React workshops",
  "accessLevel": {
    "internalDashboard": true,
    "comunityForum": true,
    "adminControls": false,
    "superAdmin": false
  }
}
```

---

# 🔍 FIELD VALIDATION (STRICT)

---

## Required Fields

- `firstName` → string (min 2, trim)
- `lastName` → string (min 2, trim)
- `email` → valid email (lowercase, unique globally)
- `primaryRole` → enum

```ts
"PARTICIPANT" | "MENTOR" | "JUDGE" | "ORGANIZER";
```

---

## Optional Fields

- `location` → string
- `skills[]` → max 20 strings
- `areaOfInterest[]` → enum values
- `internalNotes` → max 500 chars
- `accessLevel` → object (default false)

---

## AccessLevel Defaults

```ts
{
  internalDashboard: false,
  comunityForum: true,
  adminControls: false,
  superAdmin: false
}
```

---

# ⚠️ PRE-CONDITIONS (MUST PASS)

---

## 1. 🔐 Authentication

- requester must be logged in
- extract `userId` from JWT

---

## 2. 🏢 Community Context

- `communityId` must be resolved from:
  - route param OR
  - auth context

---

## 3. 🔑 Authorization

Only allow if:

```txt
role = ORGANIZER OR permission = MANAGE_MEMBERS
```

---

## 4. 🚫 Duplicate Check

```ts
Member.findOne({ email, communityId });
```

👉 If exists → reject

---

# 🔥 CORE FLOW (STEP BY STEP)

---

## 🟢 STEP 1: Validate Input

- validate via Zod
- sanitize all strings

---

## 🟢 STEP 2: Resolve User

```ts
let user = await User.findOne({ email });
```

---

### CASE A: User EXISTS

✔ reuse existing `userId`

---

### CASE B: User DOES NOT EXIST

```txt
create User
create Auth (inactive)
```

Auth state:

```ts
{
  email,
  passwordHash: null,
  emailVerified: false,
  activationToken: generated
}
```

---

## 🟢 STEP 3: Create Member

```ts
Member.create({
  userId,
  communityId,

  firstName,
  lastName,
  email,

  primaryRole,

  location,
  skills,
  areaOfInterest,

  internalNotes,
  accessLevel,

  membershipStatus: "ON_BOARDING",

  invitedBy: requesterId,
});
```

---

## 🟢 STEP 4: Role-Specific Hook

---

### PARTICIPANT

- create `BuilderProfile`
- create empty `BuilderStats`

---

### MENTOR

- create `MentorMeta`

---

### JUDGE

- create `JudgeMeta`

---

### ORGANIZER

- create `OrganizerMeta`

---

## 🟢 STEP 5: Generate Activation Token

```ts
crypto.randomBytes(32).toString("hex");
```

Store in Auth:

```ts
activationToken;
emailVerificationToken;
```

---

## 🟢 STEP 6: Send Onboarding Email

Email contains:

```txt
https://commdesk.app/activate?token=xyz
```

---

## 🟢 STEP 7: Audit Log

```ts
AuditLog.create({
  actorId: requesterId,
  action: "MEMBER_CREATED",
  metadata: { email, role },
});
```

---

## 🟢 STEP 8: Response

```json
{
  "success": true,
  "message": "Member invited successfully",
  "data": {
    "email": "john@example.com",
    "status": "ON_BOARDING"
  }
}
```

---

# 🔐 AUTH CONNECTION (IMPORTANT)

---

## When Member is created

Auth:

```ts
{
  email,
  passwordHash: null,
  activationToken,
  emailVerified: false
}
```

---

## Activation Flow (later)

```http
POST /api/v1/auth/activate-member
```

---

# ⚡ EDGE CASES

---

## Case 1: User exists globally

✔ reuse
❌ do NOT create new Auth

---

## Case 2: User exists in another community

✔ allow
✔ create new Member

---

## Case 3: Already member in same community

❌ reject

---

# 🛡️ SECURITY RULES

---

- only authorized users can create members
- never expose `internalNotes` publicly
- never send password via email
- always hash tokens before storing

---

# 📊 STATUS FLOW

```txt
ON_BOARDING → ACTIVE → SUSPENDED → BANNED
```

---

# ⚡ PERFORMANCE NOTES

---

- index on `(email, communityId)`
- index on `userId`
- avoid duplicate queries

---

# 📦 FINAL DATA FLOW

```txt
Request
 ↓
Validate
 ↓
Check User
 ↓
Create User/Auth (if needed)
 ↓
Create Member
 ↓
Create Role Meta
 ↓
Send Email
 ↓
Audit Log
 ↓
Response
```

---

# ✅ TODO (STRICT IMPLEMENTATION)

- [ ] Zod validation schema
- [ ] Permission middleware (MANAGE_MEMBERS)
- [ ] Duplicate member protection
- [ ] Activation token system (secure + hashed)
- [ ] Email service integration
- [ ] Audit logging system
- [ ] Role-specific hooks (Participant/Mentor/Judge/Organizer)
- [ ] Member status lifecycle handling
- [ ] Resend invite endpoint
- [ ] Expired token handling
- [ ] Bulk member invite support

# 🏢 Organizer Signup (Community Creation)

> This document defines the **full backend contract for Organizer → Community Signup** in CommDesk.
> It includes **validation, flows, Auth integration, status lifecycle, security, and audit**.

---

# 🚀 Endpoint

```http
POST /api/v1/auth/signup-community
```

---

# 🧠 Purpose

Create:

- a **Community (workspace)**
- an **Organizer (Owner) account**
- initialize **Member (Owner role)**
- start **email verification + admin approval flow**

---

# 📥 Request Body

```json
{
  "communityName": "Apex Circle",
  "communityBio": "Developer community focused on open source and hackathons",
  "communityLogo": "https://cdn.com/logo.png",
  "communityWebsite": "https://apexcircle.dev",
  "country": "India",
  "city": "Ranchi",

  "officialEmail": "team@apexcircle.dev",
  "contactPhone": "+91XXXXXXXXXX",

  "socialLinks": {
    "github": "https://github.com/apexcircle",
    "discord": "https://discord.gg/apexcircle",
    "twitter": "https://twitter.com/apexcircle"
  },

  "owner": {
    "fullName": "Abhishek Gupta",
    "email": "abhishek@example.com",
    "password": "securePassword"
  }
}
```

---

# 🔍 FIELD VALIDATION (STRICT)

---

## 🟢 Community Info

- `communityName` → required, unique, min 3 chars
- `communityBio` → required, max 500 chars
- `communityWebsite` → valid URL
- `country`, `city` → required

---

## 🟢 Contact Info

- `officialEmail` → required, valid, unique
- `contactPhone` → required, valid format

---

## 🟢 Social Links (optional but validated)

- must be valid URLs
- used for **trust scoring (future)**

---

## 🟢 Owner

- `fullName` → required
- `email` → required, unique (global Auth)
- `password` → min 8 chars

---

# ⚠️ PRE-CHECKS

---

## 1. 🔁 Duplicate Community

```ts
Community.findOne({ name });
```

❌ if exists → reject

---

## 2. 🔁 Duplicate Owner Email

```ts
Auth.findOne({ email });
```

❌ if exists → reject OR reuse (decision-based)

---

## 3. 🌐 Domain Validation (Recommended)

- check: `officialEmail` domain matches `website`

---

# 🔥 CORE FLOW (STEP BY STEP)



## 🟢 STEP 1: Validate Input

- Zod validation
- sanitize all strings

---

## 🟢 STEP 2: Generate Slug

```ts
slug = communityName.toLowerCase().replace(/\s+/g, "-");
```

Ensure unique.

---

## 🟢 STEP 3: Create Community

```ts
Community.create({
  name,
  slug,
  bio,
  logo,
  website,

  officialEmail,
  contactPhone,

  country,
  city,

  socialLinks,

  status: "pending",
});
```

---

## 🟢 STEP 4: Create User

```ts
User.create({
  fullName,
  email,
});
```

---

## 🟢 STEP 5: Create Auth

```ts
Auth.create({
  email,
  passwordHash,
  emailVerificationToken,
  emailVerified: false,
  userId,
});
```

---

## 🟢 STEP 6: Create Member (Owner Role)

```ts
Member.create({
  userId,
  communityId,

  firstName,
  lastName,
  email,

  primaryRole: "ORGANIZER",

  accessLevel: {
    internalDashboard: true,
    comunityForum: true,
    adminControls: true,
    superAdmin: true,
  },

  membershipStatus: "ACTIVE",
});
```

---

## 🟢 STEP 7: Create OrganizerMeta

```ts
OrganizerMeta.create({
  memberId,
  roleLevel: "OWNER",
  canCreateEvents: true,
  canManageMembers: true,
  canViewAnalytics: true,
});
```

---

## 🟢 STEP 8: Generate Email Verification Token

```ts
token = crypto.randomBytes(32).toString("hex");
```

---

## 🟢 STEP 9: Send Verification Email

```txt
https://commdesk.app/verify-email?token=abc123
```

---

## 🟢 STEP 10: Audit Log

```ts
AuditLog.create({
  action: "COMMUNITY_CREATED",
  metadata: { communityName, ownerEmail },
});
```

---

## 🟢 STEP 11: Response

```json
{
  "success": true,
  "message": "Community created successfully. Verification required.",
  "data": {
    "status": "pending"
  }
}
```

---

# 📊 COMMUNITY STATUS LIFECYCLE

```txt
pending → under_review → approved → active
                         ↓
                      rejected
                         ↓
                      suspended
```

---

## Status Meaning

| Status       | Meaning                 |
| ------------ | ----------------------- |
| pending      | created, not reviewed   |
| under_review | admin reviewing         |
| approved     | approved but not active |
| active       | full access             |
| rejected     | denied                  |
| suspended    | temporarily disabled    |

---

# 🔐 EMAIL VERIFICATION FLOW

---

## Endpoint

```http
POST /api/v1/auth/verify-email
```

---

## Request

```json
{
  "token": "abc123"
}
```

---

## Flow

```txt
verify token
 ↓
emailVerified = true
 ↓
allow login
```

---

# 🛡️ SECURITY RULES

---

- password must be hashed (bcrypt)
- never expose tokens
- validate all inputs
- rate limit signup endpoint
- prevent spam communities

---

# ⚡ EDGE CASES

---

## Case 1: Owner already exists

👉 Option:

- reuse user
- OR reject signup

---

## Case 2: Same community name

❌ reject

---

## Case 3: Invalid domain

👉 mark as **low trust** (future feature)

---

# ⚡ PERFORMANCE NOTES

---

- index on `communityName`
- index on `officialEmail`
- index on `slug`

---

# 📦 FINAL FLOW

```txt
Request
 ↓
Validate
 ↓
Check duplicates
 ↓
Create Community
 ↓
Create User
 ↓
Create Auth
 ↓
Create Member (Owner)
 ↓
Create OrganizerMeta
 ↓
Send Email
 ↓
Audit Log
 ↓
Response
```

---

# ✅ TODO (Organizer System)

- [ ] Owner/Admin hierarchy (OWNER, ADMIN, MODERATOR)
- [ ] Organization approval system (admin panel)
- [ ] Event creation permissions system
- [ ] Admin dashboard APIs
- [ ] Community analytics system
- [ ] Trust scoring (based on links + activity)
- [ ] Slug uniqueness enforcement
- [ ] Community update APIs
- [ ] Suspend / reactivate community
- [ ] Bulk member onboarding for organizers

---

# 🧑‍🏫 Mentor System

## Fields

- expertise[]
- availability
- assignedEvents[]

---

## ✅ TODO (Mentor)

- [ ] Mentor assignment to events
- [ ] Mentor availability scheduling
- [ ] Mentor feedback system

---

# ⚖️ Judge System

## Fields

- expertise[]
- assignedEvents[]
- scoringHistory[]

---

## ✅ TODO (Judge)

- [ ] Judge assignment API
- [ ] Score submission system
- [ ] Transparent judging integration
- [ ] Judge audit logs

---

# 🧑‍💻 Participant (Builder System)

## BuilderProfile

- username (unique)
- bio, skills
- github, linkedin
- openToHiring

## BuilderStats

- hackathonsJoined
- projectsSubmitted
- wins
- reputationPoints

---

## ✅ TODO (Builder)

- [ ] Profile visibility control
- [ ] Portfolio system
- [ ] Skill endorsement system
- [ ] Social graph (followers)
- [ ] Reputation calculation worker

---

# 🔥 Auth Flows

---

## 🟣 Organization Signup

```text
Signup → Auth → User → Organization → Member (Owner) → Email Verification
```

### TODO

- [ ] Email verification
- [ ] Organization approval workflow
- [ ] Slug generation

---

## 🟢 Member Invite + Activation

```text
Invite → Member(OnBoarding) → Email → Activation → Password Set → Active
```

### TODO

- [ ] Activation token system
- [ ] Expiry handling
- [ ] Resend invite

---

## 🔵 Login Flow

```text
Login → Check Ban → Validate Password → Issue Tokens → Create Session
```

### TODO

- [ ] Login attempt limiter
- [ ] Account blocking logic
- [ ] Suspicious login alerts

---

# 🔐 Security System

---

## Rules

- 5 failed attempts → block
- 10 min window
- 40 min ban

---

## ✅ TODO (Security)

- [ ] IP tracking
- [ ] Device fingerprinting
- [ ] Geo-location alerts
- [ ] Session revocation
- [ ] Brute-force detection

---

# 🔑 Token System

---

## Types

- Access Token (15 min)
- Refresh Token (7 days)

---

## Flow

```text
Login → Access + Refresh
Refresh → New tokens
Logout → revoke refresh
```

---

## ✅ TODO (Token System)

- [ ] Token rotation
- [ ] Token blacklist
- [ ] Multi-device support

---

# 📧 Email System (Nodemailer)

---

## Required Emails

- verify email
- activation email
- reset password
- login alert

---

## ✅ TODO (Email)

- [ ] Email queue (BullMQ)
- [ ] Template system
- [ ] Retry mechanism

---

# 📱 OTP System (Fast2SMS)

---

## Flow

```text
Generate OTP → Store → Send → Verify
```

---

## ✅ TODO (OTP)

- [ ] OTP expiration
- [ ] Rate limit OTP
- [ ] Hash OTP storage

---

# 🔐 Password System

---

## Flow

```text
Forgot → Token → Email → Reset
```

---

## ✅ TODO (Password)

- [ ] Password strength validation
- [ ] Token hashing
- [ ] Expiry handling

---

# 📊 Audit Log System

---

## Events

- LOGIN_SUCCESS
- LOGIN_FAILED
- USER_BLOCKED
- MEMBER_CREATED
- ROLE_CHANGED

---

## ✅ TODO (Audit)

- [ ] Central audit service
- [ ] Admin audit dashboard
- [ ] IP + device logging

---

# ⚡ Permission System

---

## Structure

```text
Member → Permissions → Middleware
```

---

## Examples

- CREATE_EVENT
- MANAGE_MEMBERS
- SUBMIT_PROJECT

---

## ✅ TODO (Permissions)

- [ ] RBAC system
- [ ] Permission caching
- [ ] Dynamic permission assignment

---

# 🛡️ Rate Limiting

---

| Endpoint | Limit  |
| -------- | ------ |
| login    | 5/min  |
| signup   | 5/hour |
| OTP      | 3/min  |

---

## ✅ TODO (Rate Limit)

- [ ] Redis-based limiter
- [ ] IP + user hybrid limits

---

# 🔥 Builder Ecosystem Integration

```text
Discover → Join → Build → Submit → Judged → Reputation → Hiring
```

---

## ✅ TODO (Integration)

- [ ] Talent system integration
- [ ] Hiring signals
- [ ] Reputation pipeline

---

# 🚨 Critical Rules

---

## ❌ NEVER

- store plain passwords
- mix Auth & Member logic
- skip validation
- allow unverified users

---

## ✅ ALWAYS

- use activation flow
- log everything
- isolate layers
- validate inputs

---

# 🎯 Final Status

✅ Multi-role support
✅ Multi-community support
✅ Identity + Reputation system
✅ Enterprise-grade security
✅ Fully scalable

---

# 🚀 Next Steps

- [ ] Implement Auth module first
- [ ] Build Member system
- [ ] Add BuilderProfile
- [ ] Add Permission middleware
- [ ] Integrate Audit logs

---

# 🔥 Future (Unicorn Level)

- [ ] Redis sessions
- [ ] Event-driven architecture
- [ ] Microservices split
- [ ] Real-time systems
- [ ] Global deployment

---

# 🏁 Conclusion

This Auth system is not just authentication.

It is:

```text
Identity + Access + Reputation + Trust Layer of CommDesk
```

Build this correctly → your entire platform becomes scalable, secure, and future-proof.
