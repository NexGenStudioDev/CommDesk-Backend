# CommDesk Payment Service Architecture (Production Grade)

## Goals

Build a highly reliable, scalable, fault-tolerant payment infrastructure capable of handling:

- Wallet Top-ups
- Membership Payments
- Event Registrations
- Sponsorship Payments
- Subscription Billing
- Refunds
- Invoice Generation
- Automated Reconciliation
- Audit Logs
- Financial Reporting

---

# Architecture

Frontend
↓
API Gateway
↓
Payment Service
↓
PostgreSQL
↓
Redis
↓
RabbitMQ
↓
Notification Service
↓
Email / SMS / Push

External Systems:

- Cashfree
- Razorpay
- Stripe
- GST Invoice Provider

---

# Core Principles

## Never Trust Frontend

Frontend can:

- Create Payment Intent
- Open Checkout
- View Status

Frontend CANNOT:

- Mark Payment Successful
- Credit Wallet
- Trigger Refund
- Update Ledger

Only backend performs financial state changes.

---

# Database Design

## payments

```sql
id UUID PK
order_id VARCHAR UNIQUE
provider VARCHAR
provider_order_id VARCHAR
provider_payment_id VARCHAR

user_id UUID

amount NUMERIC(12,2)
currency VARCHAR

status VARCHAR

payment_method VARCHAR

created_at TIMESTAMP
updated_at TIMESTAMP
paid_at TIMESTAMP

metadata JSONB
```

Status:

PENDING

PROCESSING

SUCCESS

FAILED

CANCELLED

REFUNDED

PARTIAL_REFUND

---

## wallets

```sql
id UUID PK
user_id UUID UNIQUE

balance NUMERIC(12,2)

created_at TIMESTAMP
updated_at TIMESTAMP
```

---

## wallet_transactions

```sql
id UUID PK

wallet_id UUID
payment_id UUID

amount NUMERIC(12,2)

type VARCHAR

status VARCHAR

description TEXT

created_at TIMESTAMP
```

Type:

CREDIT

DEBIT

REFUND

BONUS

ADJUSTMENT

---

## refunds

```sql
id UUID PK

payment_id UUID

amount NUMERIC(12,2)

provider_refund_id VARCHAR

status VARCHAR

reason TEXT

created_at TIMESTAMP
```

---

## invoices

```sql
id UUID PK

payment_id UUID

invoice_number VARCHAR UNIQUE

gst_number VARCHAR

amount NUMERIC

pdf_url TEXT

created_at TIMESTAMP
```

---

## payment_audit_logs

```sql
id UUID PK

payment_id UUID

event_type VARCHAR

payload JSONB

created_at TIMESTAMP
```

Every webhook stored forever.

No deletion.

---

# API Design

## Create Payment

POST

/api/v1/payments/create-intent

Request:

```json
{
  "amount": 500
}
```

Response:

```json
{
  "orderId": "order_xxx",
  "paymentSessionId": "session_xxx"
}
```

---

## Verify Payment

GET

/api/v1/payments/verify/:orderId

---

## Payment History

GET

/api/v1/payments/history

---

## Get Payment Details

GET

/api/v1/payments/:paymentId

---

## Refund Payment

POST

/api/v1/payments/refund

---

# Webhook System

POST

/api/v1/payments/webhook/cashfree

Flow:

Cashfree
↓
Webhook Controller
↓
Signature Validation
↓
Store Audit Log
↓
Publish RabbitMQ Event
↓
Return 200 Immediately

Never perform heavy work inside webhook.

---

# RabbitMQ Architecture

Exchange:

payments.exchange

Queues:

payments.success

payments.failed

payments.refund

payments.invoice

payments.notification

payments.analytics

Flow:

Webhook
↓
RabbitMQ
↓
Consumers

Benefits:

- Retry
- Async processing
- Fault tolerance
- Scalability

---

# Payment Success Consumer

Consumes:

payments.success

Tasks:

Update Payment Status

Credit Wallet

Generate Invoice

Create Ledger Entry

Send Notification

Emit Analytics Event

---

# Invoice Consumer

Consumes:

payments.invoice

Tasks:

Generate PDF

Upload to S3

Store URL

Email User

---

# Notification Consumer

Consumes:

payments.notification

Tasks:

Email

SMS

Push Notification

WhatsApp

---

# Ledger System

Never calculate money from wallet balance.

Use immutable ledger.

Table:

ledger_entries

```sql
id UUID

payment_id UUID

debit NUMERIC

credit NUMERIC

balance_after NUMERIC

created_at TIMESTAMP
```

All money movement recorded forever.

---

# Redis Usage

Store:

Payment Rate Limits

Webhook Deduplication

Idempotency Keys

Temporary Checkout State

Examples:

payment:idempotency:key

webhook:event:id

---

# Idempotency

Every payment request:

```http
Idempotency-Key:
```

Example:

```ts
crypto.randomUUID();
```

Prevent duplicate payments.

---

# Security

Validate Webhook Signature

Validate Amount

Validate Currency

Validate User Ownership

Use HTTPS

Encrypt Secrets

Rotate Keys

Audit Every Event

Never Trust Frontend Status

---

# Retry Strategy

RabbitMQ Dead Letter Queue

payments.dlq

Retries:

1 min

5 min

15 min

1 hour

After max retries:

Manual review queue

---

# Monitoring

Metrics:

Total Payments

Success Rate

Failure Rate

Refund Rate

Wallet Credits

Webhook Failures

Queue Lag

---

# Alerting

PagerDuty

Slack

Discord

Triggers:

Webhook Failure > 5%

Queue Lag > 1000

Refund Spike

Payment Failure Spike

---

# File Storage

Store:

Invoices

Receipts

Reports

Use:

AWS S3

Cloudflare R2

MinIO

Never store PDFs locally.

---

# Compliance

Maintain:

Audit Logs

Payment Logs

Refund Logs

Invoice Logs

Webhook Logs

Retain:

7+ years

---

# Future Features

Multi-Gateway Routing

Cashfree

Razorpay

Stripe

PayPal

UPI Intent

Subscriptions

Auto Renewals

EMI

International Payments

GST Billing

Accounting Integrations

QuickBooks

Zoho Books

Tally

---

# Production Flow

User
↓
Create Intent
↓
Cashfree Order
↓
Open Checkout
↓
Payment Success
↓
Cashfree Webhook
↓
Verify Signature
↓
Store Audit Log
↓
RabbitMQ Event
↓
Payment Success Consumer
↓
Credit Wallet
↓
Ledger Entry
↓
Invoice Generation
↓
Notification
↓
Analytics Event
↓
User Dashboard Updated

This is the single source of truth flow.

Never credit wallet from frontend.
Never trust redirect URLs.
Only trust verified webhook events.
