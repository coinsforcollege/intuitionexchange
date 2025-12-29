# P2P OTC Marketplace - UI Specification

## Table of Contents
1. [API Endpoints Reference](#api-endpoints-reference)
2. [User Flows](#user-flows)
3. [User Dashboard Pages & Components](#user-dashboard-pages--components)
4. [Admin Dashboard Pages & Components](#admin-dashboard-pages--components)

---

## API Endpoints Reference

### Authentication Required
All P2P endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### KYC Required
All P2P endpoints (except public ad listing) require `kycStatus: APPROVED`.

---

### Payment Methods

| Method | Endpoint | Description | Auth | KYC |
|--------|----------|-------------|------|-----|
| POST | `/api/p2p/payment-methods` | Create payment method | ✅ | ✅ |
| GET | `/api/p2p/payment-methods` | List user's payment methods | ✅ | ✅ |
| PUT | `/api/p2p/payment-methods/:id` | Update payment method | ✅ | ✅ |
| DELETE | `/api/p2p/payment-methods/:id` | Delete payment method | ✅ | ✅ |

**Payment Method Types:**
- `BANK_TRANSFER`
- `UPI`
- `PAYPAL`
- `VENMO`
- `ZELLE`
- `CASH_APP`
- `WISE`
- `REVOLUT`
- `OTHER`

---

### Ads

| Method | Endpoint | Description | Auth | KYC |
|--------|----------|-------------|------|-----|
| POST | `/api/p2p/ads` | Create ad | ✅ | ✅ |
| GET | `/api/p2p/ads` | List active ads (public) | ❌ | ❌ |
| GET | `/api/p2p/ads/my` | Get user's ads | ✅ | ✅ |
| GET | `/api/p2p/ads/:id` | Get ad details | ❌ | ❌ |
| PUT | `/api/p2p/ads/:id` | Update ad | ✅ | ✅ |
| POST | `/api/p2p/ads/:id/pause` | Pause ad | ✅ | ✅ |
| POST | `/api/p2p/ads/:id/resume` | Resume ad | ✅ | ✅ |
| POST | `/api/p2p/ads/:id/close` | Close ad | ✅ | ✅ |

**Query Parameters for GET /api/p2p/ads:**
- `side`: `BUY` or `SELL`
- `asset`: e.g., `BTC`, `ETH`
- `fiatCurrency`: e.g., `USD`, `EUR`
- `limit`: number (default 20)
- `offset`: number (default 0)

---

### Trades

| Method | Endpoint | Description | Auth | KYC |
|--------|----------|-------------|------|-----|
| POST | `/api/p2p/trades` | Create trade (take ad) | ✅ | ✅ |
| GET | `/api/p2p/trades` | List user's trades | ✅ | ✅ |
| GET | `/api/p2p/trades/:id` | Get trade details | ✅ | ✅ |
| POST | `/api/p2p/trades/:id/proof` | Upload payment proof | ✅ | ✅ |
| POST | `/api/p2p/trades/:id/mark-paid` | Mark as paid (buyer) | ✅ | ✅ |
| POST | `/api/p2p/trades/:id/cancel` | Cancel trade (buyer) | ✅ | ✅ |
| POST | `/api/p2p/trades/:id/release` | Release escrow (seller) | ✅ | ✅ |

**Query Parameters for GET /api/p2p/trades:**
- `status`: `CREATED`, `PAID`, `DISPUTED`, `RELEASED`, `REFUNDED`, `CANCELLED`, `EXPIRED`, `ALL`
- `role`: `buyer`, `seller`, `all`
- `limit`: number (default 20)
- `offset`: number (default 0)

---

### Disputes

| Method | Endpoint | Description | Auth | KYC | Admin |
|--------|----------|-------------|------|-----|-------|
| POST | `/api/p2p/trades/:id/dispute` | Open dispute | ✅ | ✅ | ❌ |
| POST | `/api/p2p/trades/:id/dispute/resolve` | Resolve dispute | ✅ | ✅ | ✅ |

**Dispute Outcomes:**
- `RELEASE_TO_BUYER` - Crypto goes to buyer
- `REFUND_TO_SELLER` - Crypto returns to seller

---

### User Stats

| Method | Endpoint | Description | Auth | KYC |
|--------|----------|-------------|------|-----|
| GET | `/api/p2p/stats` | Get user's P2P stats | ✅ | ✅ |

**Response:**
```json
{
  "dailyVolumeUsd": 950,
  "dailyLimitUsd": 5000,
  "dailyRemainingUsd": 4050,
  "strikeCount": 0,
  "suspendedUntil": null,
  "totalTradesCompleted": 2,
  "totalTradesCancelled": 1
}
```

---

### Admin

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| POST | `/api/p2p/admin/expire-trades` | Expire unpaid trades (cron) | ✅ | ✅ |

---

## User Flows

### Flow 1: First-Time Setup
```
1. User navigates to P2P section
2. If not KYC approved → Show "Complete KYC" message with link
3. If KYC approved but no payment methods → Prompt to add payment method
4. User adds payment method(s)
5. User can now create ads or take existing ads
```

### Flow 2: Create Ad (Maker)
```
1. User clicks "Post Ad" or "Create Ad"
2. Select side: "I want to Buy" or "I want to Sell"
3. Select asset: BTC, ETH, etc.
4. Select fiat currency: USD, EUR, etc.
5. Enter price per unit
6. Enter total quantity
7. Enter min/max per trade
8. Select accepted payment methods (from user's saved methods)
9. Enter terms (optional)
10. If SELL ad: Check user has sufficient crypto balance
11. Submit → Ad created with status ACTIVE
12. Redirect to "My Ads" page
```

### Flow 3: Take Ad (Taker)
```
1. User browses ad list (filtered by asset, fiat, side)
2. Clicks on an ad to view details
3. Cannot take own ad (button disabled)
4. Enter quantity (within min/max bounds)
5. Select payment method type (from ad's accepted methods)
6. System calculates notional value
7. Check: daily limit not exceeded
8. Submit → Trade created
   - For BUY ad: Taker is selling crypto → Taker's crypto locked
   - For SELL ad: Ad maker is selling → Maker's crypto locked
9. Redirect to Trade Details page
10. 15-minute payment timer starts
```

### Flow 4: Complete Trade (Buyer)
```
1. Trade is in CREATED status
2. Timer shows remaining time (15 min)
3. Buyer sees seller's payment details
4. Buyer makes off-platform payment (bank transfer, etc.)
5. Buyer uploads proof of payment (screenshot)
6. Buyer clicks "I Have Paid"
7. Trade status → PAID
8. Timer stops
9. Buyer waits for seller to release
```

### Flow 5: Complete Trade (Seller)
```
1. Trade is in CREATED status
2. Seller waits for buyer to pay
3. Notification: "Buyer has marked as paid"
4. Trade status → PAID
5. Seller reviews payment proof
6. Seller verifies payment received (off-platform)
7. Seller clicks "Release Crypto"
8. Crypto transferred from escrow to buyer
9. Trade status → RELEASED
10. Trade complete
```

### Flow 6: Cancel Trade (Buyer Only, Before Paid)
```
1. Trade is in CREATED status
2. Buyer clicks "Cancel Trade"
3. Confirmation dialog
4. Escrow unlocked → Crypto returns to seller
5. Ad remaining quantity restored
6. Trade status → CANCELLED
```

### Flow 7: Trade Expires (No Payment)
```
1. Trade is in CREATED status
2. 15-minute timer expires
3. System auto-cancels trade
4. Escrow unlocked → Crypto returns to seller
5. Ad remaining quantity restored
6. Trade status → EXPIRED
7. Buyer receives strike
```

### Flow 8: Open Dispute (After Paid)
```
1. Trade is in PAID status
2. Either party clicks "Open Dispute"
3. Enter reason for dispute
4. Upload evidence (optional)
5. Trade status → DISPUTED
6. Escrow remains locked
7. Release button disabled
8. Wait for admin resolution
```

### Flow 9: Dispute Resolution (Admin)
```
1. Admin views disputed trade
2. Reviews:
   - Payment proof (buyer's evidence)
   - Seller's evidence
   - Trade details
3. Admin selects outcome:
   - RELEASE_TO_BUYER: Crypto goes to buyer
   - REFUND_TO_SELLER: Crypto returns to seller
4. Enter resolution notes
5. Submit resolution
6. Trade status → RELEASED or REFUNDED
7. Both parties notified
```

### Flow 10: Manage Ads
```
1. User views "My Ads" list
2. For each ad, can:
   - Pause (ACTIVE → PAUSED)
   - Resume (PAUSED → ACTIVE, checks balance for SELL ads)
   - Close (ACTIVE/PAUSED → CLOSED, only if no active trades)
   - Edit (price, limits, payment methods, terms)
```

---

## User Dashboard Pages & Components

### Page: `/p2p` or `/p2p/marketplace`
**Purpose:** Browse and take P2P ads

**Components:**
1. **KYC Gate Component**
   - If not KYC approved: Show message + CTA to complete KYC
   - If KYC approved: Show marketplace

2. **P2P Stats Banner**
   - Daily limit remaining: `$4,050 / $5,000`
   - Total trades completed
   - Strike count (if any)

3. **Filter Bar**
   - Side toggle: Buy / Sell (from user perspective)
   - Asset dropdown: BTC, ETH, etc.
   - Fiat dropdown: USD, EUR, etc.
   - Refresh button

4. **Ad List**
   - Table or card view
   - Columns: Advertiser, Price, Available, Limits, Payment Methods, Action
   - Sort by: Best price (default), Newest
   - Pagination

5. **Ad Card/Row**
   - User email (or masked)
   - Price per unit
   - Available quantity
   - Min/Max per trade
   - Payment method badges
   - "Trade" button (disabled if own ad)

---

### Page: `/p2p/ad/:id`
**Purpose:** View ad details and create trade

**Components:**
1. **Ad Details Card**
   - Side: BUY or SELL
   - Asset + Fiat pair
   - Price per unit
   - Available quantity
   - Min/Max limits
   - Payment methods list
   - Terms (if any)
   - Advertiser info
   - Created date

2. **Trade Form**
   - Quantity input (with validation)
   - Auto-calculate notional value
   - Payment method selector (from ad's accepted methods)
   - Daily limit check display
   - "Create Trade" button
   - Cancel button

3. **Error States**
   - Own ad: "You cannot trade with your own ad"
   - Insufficient balance: "Seller has insufficient balance"
   - Daily limit: "Trade exceeds daily limit"
   - KYC required: "Complete KYC to trade"

---

### Page: `/p2p/trades`
**Purpose:** View all user's trades

**Components:**
1. **Filter Tabs**
   - All
   - Active (CREATED, PAID)
   - Completed (RELEASED)
   - Disputed
   - Cancelled/Expired

2. **Role Filter**
   - All / As Buyer / As Seller

3. **Trade List**
   - Trade number (P2P-YYYYMMDD-XXXXXX)
   - Asset + amount
   - Counterparty
   - Status badge
   - Created date
   - Action button (View)

---

### Page: `/p2p/trade/:id`
**Purpose:** Trade details and actions

**Components:**
1. **Trade Header**
   - Trade number
   - Status badge (color-coded)
   - User's role: "You are the Buyer" or "You are the Seller"

2. **Trade Details Card**
   - Asset + quantity
   - Price per unit
   - Total value (notional)
   - Payment method
   - Counterparty info

3. **Timer (if CREATED)**
   - Countdown: "Payment due in 12:34"
   - Visual indicator (progress bar)

4. **Payment Details (if Buyer)**
   - Seller's payment info
   - Instructions

5. **Proof Section**
   - If buyer: Upload proof button
   - Display uploaded proofs (images)

6. **Action Buttons (based on role and status)**

   **Buyer Actions:**
   | Status | Actions |
   |--------|---------|
   | CREATED | Upload Proof, Mark Paid, Cancel |
   | PAID | Open Dispute |
   | DISPUTED | View dispute status |
   | RELEASED/REFUNDED | None (view only) |

   **Seller Actions:**
   | Status | Actions |
   |--------|---------|
   | CREATED | Wait (view only) |
   | PAID | Release, Open Dispute |
   | DISPUTED | View dispute status |
   | RELEASED/REFUNDED | None (view only) |

7. **Dispute Section (if DISPUTED)**
   - Dispute reason
   - Evidence submitted
   - Status: "Awaiting admin review"

8. **Escrow Status**
   - Locked: "0.01 BTC held in escrow"
   - Released/Unlocked: Final status

9. **Audit Trail**
   - Timeline of events: Created → Paid → Released
   - Timestamps

---

### Page: `/p2p/ads/my`
**Purpose:** Manage user's own ads

**Components:**
1. **Create Ad Button**
   - Opens create ad page/modal

2. **Filter Tabs**
   - Active
   - Paused
   - Closed
   - All

3. **Ad List**
   - Side (BUY/SELL)
   - Asset/Fiat
   - Price
   - Remaining / Total qty
   - Status badge
   - Actions: Pause/Resume, Edit, Close

4. **Stats per Ad**
   - Total trades
   - Active trades count

---

### Page: `/p2p/ads/create`
**Purpose:** Create new ad

**Components:**
1. **Side Selection**
   - Radio/Toggle: "I want to Buy crypto" / "I want to Sell crypto"

2. **Asset Selection**
   - Dropdown: BTC, ETH, etc.
   - Show user's balance (for SELL ads)

3. **Fiat Selection**
   - Dropdown: USD, EUR, etc.

4. **Price Input**
   - Number input
   - Market price reference (optional)

5. **Quantity Inputs**
   - Total quantity
   - Min per trade
   - Max per trade
   - Validation: min <= max <= total

6. **Payment Methods**
   - Multi-select from user's saved methods
   - Link to add new payment method if none

7. **Terms Textarea**
   - Optional
   - Max 2000 chars

8. **Balance Check (SELL ads)**
   - Show available balance
   - Error if insufficient

9. **Preview Card**
   - How ad will appear to others

10. **Submit Button**
    - Create Ad

---

### Page: `/p2p/ads/:id/edit`
**Purpose:** Edit existing ad

**Components:**
- Same as create, but pre-filled
- Cannot change: side, asset, fiat
- Can change: price, min, max, payment methods, terms

---

### Page: `/p2p/payment-methods`
**Purpose:** Manage payment methods

**Components:**
1. **Add Button**
   - Opens add modal

2. **Payment Method List**
   - Type (Bank, PayPal, etc.)
   - Name
   - Details (masked)
   - Active status toggle
   - Edit button
   - Delete button

3. **Add/Edit Modal**
   - Type selector
   - Name input
   - Details inputs (dynamic based on type)
   - Save button

---

### Component: P2P Navigation
**Location:** Sidebar or tabs within P2P section

**Items:**
- Marketplace (browse ads)
- My Trades
- My Ads
- Payment Methods
- (Stats shown inline or in header)

---

## Admin Dashboard Pages & Components

### Page: `/admin/p2p`
**Purpose:** P2P overview for admin

**Components:**
1. **Stats Cards**
   - Total active ads
   - Total active trades
   - Open disputes count
   - Total volume (24h)

2. **Quick Links**
   - View Disputes
   - View All Trades
   - View All Ads
   - Run Expiry Job

---

### Page: `/admin/p2p/disputes`
**Purpose:** Manage disputed trades

**Components:**
1. **Filter**
   - Status: Open / Resolved / All
   - Date range

2. **Dispute List**
   - Trade number
   - Buyer / Seller
   - Amount
   - Dispute reason (truncated)
   - Opened date
   - Status badge
   - Action: View

---

### Page: `/admin/p2p/dispute/:tradeId`
**Purpose:** Review and resolve dispute

**Components:**
1. **Trade Summary**
   - Trade number
   - Asset, quantity, price, notional
   - Buyer info
   - Seller info

2. **Timeline**
   - Trade created
   - Payment marked
   - Dispute opened
   - Current status

3. **Buyer Section**
   - Payment proof images (clickable to enlarge)
   - Any notes

4. **Seller Section**
   - Evidence submitted
   - Dispute reason

5. **Escrow Status**
   - Amount locked
   - Asset

6. **Resolution Form**
   - Outcome selector: RELEASE_TO_BUYER / REFUND_TO_SELLER
   - Resolution notes (textarea)
   - Resolve button
   - Confirmation dialog

7. **Audit Log**
   - Full history of trade

---

### Page: `/admin/p2p/trades`
**Purpose:** View all P2P trades

**Components:**
1. **Filters**
   - Status dropdown
   - Date range
   - User search
   - Asset filter

2. **Trade List**
   - Trade number
   - Buyer / Seller
   - Asset / Amount
   - Status
   - Created date
   - Action: View

3. **Pagination**

---

### Page: `/admin/p2p/ads`
**Purpose:** View all P2P ads

**Components:**
1. **Filters**
   - Status: Active / Paused / Closed
   - Side: Buy / Sell
   - Asset filter
   - User search

2. **Ad List**
   - Ad ID
   - User
   - Side
   - Asset / Fiat
   - Price
   - Remaining qty
   - Status
   - Created date

3. **Actions**
   - View details
   - (Admin cannot edit user ads)

---

### Page: `/admin/p2p/users`
**Purpose:** View P2P user stats

**Components:**
1. **User Search**
   - By email

2. **User List**
   - Email
   - Daily volume
   - Total trades
   - Strike count
   - Suspended until
   - Actions: View, Reset strikes

3. **User Detail Modal**
   - Full stats
   - Trade history link
   - Ad history link
   - Strike management

---

### Component: Admin P2P Navigation
**Location:** Admin sidebar

**Items:**
- P2P Overview
- Disputes (with badge for open count)
- All Trades
- All Ads
- User Stats

---

## UI State Reference

### Trade Status Colors
| Status | Color | Description |
|--------|-------|-------------|
| CREATED | Yellow/Orange | Awaiting payment |
| PAID | Blue | Payment marked, awaiting release |
| DISPUTED | Red | Under review |
| RELEASED | Green | Complete - crypto transferred |
| REFUNDED | Gray | Complete - refunded to seller |
| CANCELLED | Gray | Cancelled by buyer |
| EXPIRED | Gray | Payment timeout |

### Ad Status Colors
| Status | Color |
|--------|-------|
| ACTIVE | Green |
| PAUSED | Yellow |
| CLOSED | Gray |

### Escrow Status Colors
| Status | Color |
|--------|-------|
| LOCKED | Yellow |
| RELEASED | Green |
| UNLOCKED | Gray |

---

## Error Messages Reference

| Scenario | Message |
|----------|---------|
| Not KYC approved | "Complete identity verification to access P2P trading" |
| No payment methods | "Add a payment method to create ads" |
| Own ad | "You cannot trade with your own ad" |
| Insufficient balance | "Insufficient {asset} balance. Available: X, Required: Y" |
| Daily limit exceeded | "Daily limit exceeded. Remaining: $X" |
| Qty below min | "Minimum quantity is X {asset}" |
| Qty above max | "Maximum quantity is X {asset}" |
| Qty above remaining | "Only X {asset} available" |
| Trade expired | "Payment window has expired" |
| Proof required | "Payment proof is required" |
| Cannot cancel paid | "Cannot cancel after payment marked" |
| Cannot release unpaid | "Can only release after buyer marks paid" |
| Account suspended | "Account suspended until {date}" |

---

## Real-time Considerations

1. **Trade Timer**
   - Client-side countdown
   - Check expiry on each action
   - Auto-redirect when expired

2. **Status Updates**
   - Polling every 10-15 seconds on trade detail page
   - Or WebSocket for real-time updates (optional)

3. **Notifications**
   - New trade on your ad
   - Payment marked
   - Payment released
   - Dispute opened
   - Dispute resolved

---

## File Upload

**Proof Upload:**
- Use existing `/api/uploads` endpoint
- Accept: jpg, png, pdf
- Max size: 5MB
- Store URL in trade proofUrls array

