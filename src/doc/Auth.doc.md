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
  "owner": {
    "firstName": "John", // First name of the community owner
    "lastName": "Doe", // Last name of the community owner
    "email": "john@example.com", // Email address of the owner
    "primaryRole": "ADMIN", // The primary role of the owner in the community (can be "ADMIN", "MODERATOR", etc.)
    "location": "Berlin", // The geographical location of the owner
    "skills": ["React", "Node"], // Skills of the owner
    "areaOfInterest": ["MENTORSHIP"], // The owner's area of interest
    "internalNotes": "Speaker for React workshops", // Internal notes about the owner
    "accessLevel": {
      "internalDashboard": true, // Whether the owner has access to the internal dashboard
      "communityForum": true, // Whether the owner has access to the community forum
      "adminControls": false, // Whether the owner has admin control over the platform
      "superAdmin": false // Whether the owner has super admin privileges
    }
  },

  "CommunityName": "Apex Circle", // Name of the community
  "password": "securepassword123", // Password for community's account (hashed before saving)
  "Bio": "Developer community focused on open source and hackathons", // Short description of the community
  "City": "Ranchi", // City where the community is based
  "ContactPhone": "+91XXXXXXXXXX", // Contact phone number for the community
  "Country": "India", // Country where the community is located
  "LogoUrl": "https://cdn.com/logo.png", // URL to the community's logo image
  "OfficialEmail": "team@apexcircle.dev", // Official email of the community
  "Website": "https://apexcircle.dev", // URL to the community's website

  "socialLinks": {
    "github": "https://github.com/apexcircle",
    "discord": "https://discord.gg/apexcircle",
    "twitter": "https://twitter.com/apexcircle"
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

# 🧑‍💻 Participant (Builder) Creation — A→Z Production Doc (CommDesk)

> This defines the **complete creation + lifecycle of a Participant (Builder)**
> aligned with your flow:

```txt
Discover → Apply → Join Team → Build → Submit → Get Judged → Earn Reputation → Get Hired
```

👉 This is **NOT just profile creation**
👉 This is the **foundation of your entire ecosystem (events, hackathons, workshops, hiring)**

# 🚀 CORE IDEA

```txt
Auth → User → Member → BuilderProfile → BuilderStats
```

👉 Participant = **Member with role PARTICIPANT + BuilderProfile**

---

# 📦 ENTITY OVERVIEW

---

## 1. Member (already created)

```ts
primaryRole: "PARTICIPANT";
membershipStatus: "ACTIVE";
```

---

## 2. BuilderProfile (MAIN ENTITY)

```ts
BuilderProfile {
  userId: ObjectId
  communityId: ObjectId | null   // null = global profile

  username: String  // unique slug

  fullName: String
  avatarUrl: String
  bio: String
  location: String

  university: String
  degree: String
  graduationYear: Number

  experienceLevel: "Student" | "Junior" | "Mid" | "Senior"

  githubUrl: String
  linkedinUrl: String
  portfolioUrl: String
  xTwitterUrl: String
  resumeUrl: String

  skills: [String]
  preferredTracks: [String]

  openToTeamInvite: Boolean
  openToHiring: Boolean

  visibility: "Public" | "MembersOnly" | "Private"

  builderStatsId: ObjectId
  waitlistEntryId: ObjectId

  createdAt: Date
  updatedAt: Date
}
```

---

## 3. BuilderStats (ASYNC ENGINE)

```ts
BuilderStats {
  userId: ObjectId

  hackathonsJoined: Number
  projectsSubmitted: Number
  wins: Number
  finalistCount: Number
  averageScore: Number
  reputationPoints: Number

  followers: Number
  following: Number

  updatedAt: Date
}
```

---

# 🚀 PARTICIPANT CREATION ENTRY POINT

---

## Endpoint

```http
POST /api/v1/participants/create-profile
```

---

# 📥 REQUEST BODY

```json
{
  "username": "abhishek-dev",
  "fullName": "Abhishek Gupta",
  "bio": "Full-stack developer",

  "location": "India",

  "university": "XYZ University",
  "degree": "BCA",
  "graduationYear": 2026,
  "experienceLevel": "Student",

  "githubUrl": "https://github.com/...",
  "linkedinUrl": "https://linkedin.com/...",
  "portfolioUrl": "https://portfolio.com",

  "skills": ["React", "Node", "MongoDB"],
  "preferredTracks": ["Web3", "AI"],

  "openToTeamInvite": true,
  "openToHiring": true,

  "visibility": "Public"
}
```

---

# 🔍 VALIDATION RULES

---

## username

- required
- unique globally
- URL-safe slug
- lowercase only

---

## fullName

- required
- min 3 chars

---

## experienceLevel

```ts
"Student" | "Junior" | "Mid" | "Senior";
```

---

## skills

- max 30
- normalized (lowercase)

---

## links

- must be valid URLs

---

## visibility

```ts
"Public" | "MembersOnly" | "Private";
```

---

# ⚠️ PRE-CHECKS

---

## 1. Auth Required

- extract `userId`

---

## 2. Member Check

```ts
Member.findOne({ userId, primaryRole: "PARTICIPANT" });
```

❌ if not → reject

---

## 3. Duplicate Profile Check

```ts
BuilderProfile.findOne({ userId });
```

❌ if exists → reject

---

## 4. Username Check

```ts
BuilderProfile.findOne({ username });
```

❌ if exists → reject

---

# 🔥 CREATION FLOW (STEP BY STEP)

---

## 🟢 STEP 1: Normalize Data

- lowercase username
- normalize skills

---

## 🟢 STEP 2: Create BuilderStats (EMPTY)

```ts
BuilderStats.create({
  userId,
  hackathonsJoined: 0,
  projectsSubmitted: 0,
  wins: 0,
  reputationPoints: 0,
});
```

---

## 🟢 STEP 3: Create BuilderProfile

```ts
BuilderProfile.create({
  userId,
  communityId: null,

  username,
  fullName,
  bio,
  location,

  university,
  degree,
  graduationYear,
  experienceLevel,

  githubUrl,
  linkedinUrl,
  portfolioUrl,

  skills,
  preferredTracks,

  openToTeamInvite,
  openToHiring,

  visibility,

  builderStatsId,
});
```

---

## 🟢 STEP 4: Waitlist Entry (OPTIONAL)

👉 For upcoming events / early access

---

## 🟢 STEP 5: Audit Log

```ts
AuditLog.create({
  action: "BUILDER_PROFILE_CREATED",
  actorId: userId,
});
```

---

## 🟢 STEP 6: Response

```json
{
  "success": true,
  "message": "Builder profile created",
  "data": {
    "username": "abhishek-dev"
  }
}
```

---

# 🔄 LIFECYCLE INTEGRATION (VERY IMPORTANT)

---

## 1. Discover

- search via:
  - skills
  - reputation
  - visibility

---

## 2. Apply

- join event
- create WaitlistEntry

---

## 3. Join Team

- use `openToTeamInvite`
- match via skills

---

## 4. Build

- linked to project system

---

## 5. Submit

- increment:

```ts
projectsSubmitted++;
```

---

## 6. Get Judged

- update:

```ts
averageScore;
```

---

## 7. Earn Reputation

```ts
reputationPoints += score;
wins++;
```

---

## 8. Get Hired

- filter:

```ts
openToHiring === true;
visibility === "Public";
```

---

# ⚡ PERFORMANCE DESIGN

---

## Indexes

- username (unique)
- userId
- skills[]
- reputationPoints

---

# 🛡️ SECURITY RULES

---

- cannot edit another user's profile
- sanitize bio input
- validate URLs
- prevent script injection

---

# ⚡ EDGE CASES

---

## Case 1: User creates profile twice

❌ reject

---

## Case 2: Username conflict

❌ reject

---

## Case 3: Member not participant

❌ reject

---

# 📦 FINAL FLOW

```txt
Request
 ↓
Validate
 ↓
Check Member
 ↓
Check duplicate
 ↓
Create Stats
 ↓
Create Profile
 ↓
Audit Log
 ↓
Response
```

---

# ✅ TODO (Participant System)

- [ ] Profile update API
- [ ] Profile search API
- [ ] Team matching system
- [ ] Reputation calculation worker
- [ ] Hiring filter system
- [ ] Social graph (followers)
- [ ] Skill endorsement system
- [ ] Profile ranking algorithm
- [ ] Event participation tracking
- [ ] Resume parsing system

👉 This is your **core builder ecosystem engine** — build this cleanly.

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
