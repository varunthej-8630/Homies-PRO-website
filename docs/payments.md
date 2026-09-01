# 💳 Razorpay Payment & Checkout Flow — Homies Studio

## 1. End-to-End Checkout Workflow

```
1. Buyer selects Project & License Tier (Academic / Commercial)
                           │
                           ▼
2. Client calls POST /api/payments/create-order
   (Server validates project price in DB & creates Razorpay Order)
                           │
                           ▼
3. Client opens Razorpay Checkout Modal (UPI / NetBanking / Cards)
                           │
                           ▼
4. Buyer completes payment
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
5A. Client returns signature     5B. Razorpay Webhook fires
    POST /api/payments/verify        POST /api/payments/webhook
             │                           │
             └─────────────┬─────────────┘
                           │
                           ▼
6. Server cryptographically verifies HMAC-SHA256 signature
                           │
                           ▼
7. Server marks order as PAID, computes 80/20 royalty split,
   inserts creator_earnings record, and generates secure download tokens
                           │
                           ▼
8. Buyer instantly redirected to /buyer/dashboard with active download links
```

---

## 2. Server-Side Price & Integrity Enforcement

- **Zero Client Price Trust**: The client NEVER sends the total price to be charged. The client only sends `projectId` and `licenseType`. The server fetches the authoritative price directly from `public.projects`.
- **HMAC-SHA256 Verification**:
  ```javascript
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');
  ```
- **80/20 Revenue Calculation**:
  ```javascript
  const platformFee = Math.round(orderItem.price * 0.20);
  const creatorAmount = orderItem.price - platformFee;
  ```
