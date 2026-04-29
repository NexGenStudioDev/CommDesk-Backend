# 🚀 CommDesk Webhook & Event Processing System

A **production-grade event-driven webhook system** built using MERN stack, designed for scalability, security, and observability.

---

# 🧠 Overview

This system captures internal & external events and delivers them to configured destinations such as:

- Discord
- Github
- External APIs (HTTP Webhooks)
- Internal services
- Apps / Real-time UI

---

## 🔁 Core Flow

```
Event Occurs
→ Event Stored
→ Job Added to Queue
→ Worker Processes Job
→ Webhook Triggered
→ Delivery Logged
→ UI Updated
```

---

# 🧱 Architecture

```
Client (React)
    ↓
Backend (Express)
    ↓
Event Bus
    ↓
Queue (BullMQ + Redis)
    ↓
Worker
    ↓
Delivery Engine
    ↓
External Systems (Discord / HTTP / App)
    ↓
Logs + Metrics
```

---

# 📦 Tech Stack

| Layer    | Technology         |
| -------- | ------------------ |
| Backend  | Node.js + Express  |
| Database | MongoDB (Mongoose) |
| Queue    | Redis + BullMQ     |
| Frontend | React              |
| Realtime | Socket.IO          |

---

# 🧠 Core Modules

---

## 1️⃣ Event System

### Event Schema

```ts
{
  eventId: string (UUID)
  type: string
  communityId: ObjectId

  payload: object

  metadata: {
    ip?: string
    userAgent?: string
    triggeredBy?: ObjectId
  }

  status: "pending" | "processed" | "failed"

  createdAt: Date
  processedAt?: Date
}
```

---

## 2️⃣ Webhook System

### Webhook Schema

```ts
{
  name: string
  communityId: ObjectId

  target: {
    type: "http" | "discord" | "internal"
    url: string
  }

  events: string[]

  secret: {
    hash: string
  }

  permissions: {
    rolesAllowed: string[]
    signedOnly: boolean
  }

  config: {
    retries: number
    timeout: number
  }

  filters?: {
    fields?: string[]
    conditions?: object
  }

  status: "active" | "disabled"
}
```

---

## 3️⃣ Delivery System

### Payload

```json
{
  "id": "evt_xxx",
  "type": "member.created",
  "createdAt": "ISO",
  "communityId": "id",
  "data": {},
  "meta": {
    "attempt": 1
  }
}
```

---

### Headers

```
X-Webhook-Id
X-Webhook-Event
X-Webhook-Signature
X-Webhook-Timestamp
```

---

# 🔐 Security

---

## Signature

```
HMAC_SHA256(secret, timestamp + body)
```

---

## Protection

- SSRF Protection (block localhost/private IPs)
- Replay Attack Protection (timestamp validation)
- Rate Limiting
- Secret encryption (never returned in API)

---

# ⚙️ Queue & Worker

---

## Job Structure

```ts
{
  (eventId, webhookId, attempt);
}
```

---

## Worker Flow

```
Fetch Event
→ Find Matching Webhooks
→ Dispatch Webhook
→ Store Result
→ Retry if needed
```

---

# 🔁 Retry System

---

## Strategy

```
1 → immediate
2 → 30 sec
3 → 2 min
4 → 10 min
5 → fail
```

---

## Dead Letter Queue

- Failed permanently
- Manual retry supported

---

# 📊 LOGGING SYSTEM (CRITICAL)

---

## 🧠 Why Logs Matter

Without logs, your system is:

```
Blind → No debugging → No trust → Not production-ready
```

---

## 🧾 Log Types (ALL REQUIRED)

---

### 1️⃣ Event Logs

```ts
{
  (eventId, type, status, createdAt, processedAt);
}
```

---

### 2️⃣ Webhook Delivery Logs

```ts
{
  eventId,
  webhookId,

  request: {
    url,
    headers,
    body
  },

  response: {
    statusCode,
    body,
    durationMs
  },

  status: "success" | "failed" | "retrying",

  attempts: number,
  error?: string,

  createdAt
}
```

---

### 3️⃣ System Logs (App Logs)

```ts
{
  level: "info" | "warn" | "error",
  message: string,
  context: object,
  timestamp: Date
}
```

---

### 4️⃣ Security Logs

```ts
{
  type: ("invalid_signature" | "rate_limit" | "ssrf_blocked",
    ip,
    webhookId,
    timestamp);
}
```

---

### 5️⃣ Queue Logs

```ts
{
  jobId,
  status: "queued" | "processing" | "failed",
  attempts,
  timestamp
}
```

---

## 📌 Log Storage Strategy

- MongoDB → structured logs
- Console/File → dev logs
- Optional → ELK / Loki (production)

---

## 📊 Metrics (MUST HAVE)

```
success rate
failure rate
retry count
queue size
avg response time
```

---

## 🚨 Alerts

Trigger alerts when:

- failure rate > threshold
- queue backlog increases
- repeated webhook failures

---

# 📡 Integrations

---

## GitHub Webhook

### Endpoint

```
POST /api/v1/webhooks/github
```

### Flow

```
Receive webhook
→ verify signature
→ parse event
→ emitEvent()
```

---

## Discord

### Payload

```json
{
  "content": "🚀 New event triggered"
}
```

---

# 📁 Project Structure

```
src/
 ├── modules/
 │   ├── event/
 │   ├── webhook/
 │   ├── delivery/
 │   ├── logs/
 │   ├── github/
 │
 ├── queue/
 ├── workers/
 ├── middlewares/
 ├── utils/
```

---

# 🧪 Testing

---

## Backend

- webhook delivery
- retry system
- signature validation

---

## Security

- SSRF attacks
- replay attacks
- invalid signatures

---

# ⚡ Performance

---

## Optimization

- Redis caching
- worker scaling
- batch DB queries

---

# 🧨 Edge Cases

```
duplicate events
timeout
invalid webhook URL
Discord downtime
queue crash
retry storm
```

---

# 🌍 Environments

```
DEV
STAGING
PROD
```

---

# ✅ Acceptance Criteria

- Webhook setup works
- Event system works
- Delivery system works
- Retry system works
- Logs visible
- Secure system
- Scalable architecture

---

# 🏁 Final Summary

This system is:

```
Event Processing Engine + Webhook Platform
```

Comparable to:

```
Stripe + GitHub + Slack (core behavior)
```

---

# 🔥 Final Note

If logs are not deeply implemented:

```
Your system will fail in production
```

Logs are not optional — they are **core infrastructure**.
