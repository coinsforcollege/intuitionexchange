## P2P OTC model (ads + escrow + off-platform payment)

### 1) Core entities

1. **Wallet Ledger (custodial)**

   * Per user, per asset: `available`, `locked`
2. **Ad**

   * `adId`, `userId` (maker)
   * `side`: SELL (maker sells crypto) or BUY (maker buys crypto)
   * `asset` (crypto), `fiatOrPayAsset`
   * `priceType`: FIXED
   * `price` (fixed)
   * `totalQty`, `remainingQty`
   * `minQty`, `maxQty` (per-trade bounds)
   * `paymentMethods[]`
   * `status`: ACTIVE, PAUSED, CLOSED
   * `createdAt`
3. **Trade**

   * `tradeId`, `adId`, `buyerUserId`, `sellerUserId`
   * `qtyCrypto`, `price`, `notional` (= qtyCrypto * price)
   * `paymentMethodSelected`
   * `paymentWindowSeconds` (= 900)
   * `status` (state machine below)
   * `proofRequired` (= true), `proofRefs[]`
   * `createdAt`, `expiresAt`, `paidAt`, `releasedAt`, `cancelledAt`
4. **Escrow Lock**

   * `escrowId`, `tradeId`
   * `asset`, `qtyLocked`
   * `status`: LOCKED, RELEASED, UNLOCKED
5. **Dispute**

   * `disputeId`, `tradeId`, `openedBy`, `reason`, `evidence[]`
   * `status`: OPEN, RESOLVED
   * `outcome`: RELEASE_TO_BUYER or REFUND_TO_SELLER

---

### 2) Marketplace listing and “matching”

1. Buyer selects a specific ad. Auto-match is disabled.
2. Ad listing sort order:

   * **Best price**, then **FIFO by ad creation time**.
3. Eligibility checks before a trade can be created:

   * Both users pass KYC requirement.
   * Both users under daily cap ($5,000) including this trade.
   * Ad is ACTIVE.
   * Requested qty is within ad min and max and ≤ remainingQty.
   * Seller has sufficient available balance to lock escrow (for SELL ads).
   * Maker is not blocked by platform risk rules (if any).

---

### 3) Price and quantity rules

1. Fixed price only.
2. Trade price = ad fixed price at the moment trade is created.
3. Quantity for a trade is fixed once the trade is created.
4. Ad inventory is divisible across many trades until remainingQty becomes 0.

---

### 4) Escrow and reservation rules

1. Escrow locks immediately when trade is created.
2. For **SELL ad** (maker sells crypto):

   * Lock `qtyCrypto` from seller `available` into `locked`.
   * Decrease ad `remainingQty` by `qtyCrypto` at trade creation.
3. For **BUY ad** (maker buys crypto):

   * Two standard approaches exist:

     * **Standard OTC**: maker’s crypto is not escrowed, only the crypto being sold is escrowed. This requires defining which side is escrowed.
     * **Platform-safe default**: escrow the crypto being sold in the trade. If your ad is “BUY crypto”, then the taker is selling crypto and that crypto must be escrowed from the taker at trade creation.
   * Implement: escrow always locks the **crypto asset being transferred on-platform**.
4. Concurrency rule:

   * Reserve in a single atomic operation: check remainingQty and balance, then lock escrow and decrement remainingQty.
   * If two buyers attempt the last remainingQty, first successful atomic reservation wins.

---

### 5) Trade state machine

Statuses:

1. `CREATED` (trade created, escrow locked, timer running)
2. `CANCELLED` (buyer cancelled before paid, or auto-expired unpaid)
3. `PAID` (buyer marked paid with mandatory proof)
4. `DISPUTED` (either party opened dispute after PAID, or seller contested)
5. `RELEASED` (seller released escrow, funds credited to buyer)
6. `REFUNDED` (dispute resolved to seller, escrow unlocked back to seller)
7. `EXPIRED` (unpaid timer elapsed, then treated as CANCELLED with strike)

Allowed actions:

* Buyer:

  * Create trade
  * Cancel trade only while status is CREATED and before marking paid
  * Mark paid (requires proof upload)
  * Open dispute after PAID
* Seller:

  * Release only while status is PAID
  * Open dispute after PAID
  * Cancel after PAID is disallowed, must dispute

---

### 6) Payment rules

1. Payment is off-platform via selected payment method.
2. Payment window = **15 minutes** from trade creation.
3. Proof is mandatory to transition to PAID:

   * Trade cannot enter PAID without proof attached.
4. Buyer “Mark Paid” does:

   * Require proof
   * Set `paidAt`
   * Set status to PAID
   * Stop expiry auto-cancel
5. Seller release is manual only:

   * Seller verifies receipt off-platform, then releases.

---

### 7) Settlement rules (ledger posting)

1. On seller release:

   * Escrow locked crypto decreases from seller locked
   * Buyer available crypto increases by `qtyCrypto`
   * Escrow status becomes RELEASED
   * Trade status becomes RELEASED
2. On cancel before paid:

   * Escrow unlocks back to seller available
   * Ad remainingQty is restored by qtyCrypto
   * Trade status becomes CANCELLED
3. On auto-expiry unpaid:

   * Same as cancel, plus buyer strike (below)

---

### 8) Disputes (manual support)

1. Disputes enabled.
2. Either party can open dispute after PAID.
3. During dispute:

   * Escrow remains locked.
   * Trade is frozen, release disabled unless support resolves.
4. Outcomes allowed:

   * RELEASE_TO_BUYER: escrow transfers to buyer, trade becomes RELEASED
   * REFUND_TO_SELLER: escrow unlocks to seller, trade becomes REFUNDED
5. Evidence inputs:

   * Buyer proof of payment (mandatory)
   * Seller bank statement screenshot or transaction log (optional)
   * Chat logs (if you have chat)
6. Dispute triggers to support:

   * Buyer marked paid, seller says not received
   * Wrong amount paid
   * Wrong payment reference used
   * Wrong payment method used

---

### 9) Cancellations, expiry, strikes

1. Buyer cancel allowed only before PAID.
2. Seller cancel after PAID is disallowed, must dispute.
3. Unpaid expiry:

   * At expiresAt, trade auto-cancels, escrow unlocks, ad remainingQty restored
   * Buyer strike increments
4. Strike system events (industry standard defaults):

   * Strike on unpaid expiry
   * Strike on buyer cancelling repeatedly after creating trades (optional, configurable)
   * Strike on confirmed bad-faith disputes (optional, configurable)
5. Enforcement defaults (configurable):

   * Temporary suspension after repeated strikes within a rolling window.

---

### 10) Limits and eligibility

1. KYC required for all P2P actions.
2. Daily limit: **$5,000 per user per day** (sum of trade notional for all P2P trades, created or completed, based on your accounting rule).
3. Enforce at trade creation:

   * Reject creation if user would exceed cap.

---

### 11) Matching and edge-case scenarios (must be handled)

1. **Trade creation succeeds**: ad active, qty within bounds, escrow locked, timer starts.
2. **Trade creation fails due to remainingQty**: reject without side effects.
3. **Trade creation fails due to insufficient seller balance**: reject, ad can be auto-paused.
4. **Two takers try same inventory**: one reserves, the other gets insufficient remainingQty.
5. **Buyer cancels before paid**: escrow unlocks, inventory restored.
6. **Buyer does not pay in 15 min**: auto-cancel, escrow unlocks, inventory restored, buyer strike.
7. **Buyer marks paid with proof**: status PAID, timer stopped.
8. **Buyer tries to mark paid without proof**: reject action.
9. **Seller releases after paid**: escrow transfers, trade RELEASED.
10. **Seller does not release after paid**: buyer can dispute, escrow stays locked.
11. **Dispute opened**: trade frozen, escrow locked until resolved.
12. **Dispute resolved to buyer**: escrow transfers, trade RELEASED.
13. **Dispute resolved to seller**: escrow unlocks, trade REFUNDED.
14. **Cancel request after paid**:

* Buyer cancel rejected
* Seller cancel rejected, dispute required

15. **System retry / duplicate requests**: must be idempotent (below).

---

### 12) Engine integrity requirements

1. Atomic operations for:

   * Create trade: reserve inventory + lock escrow
   * Cancel: unlock escrow + restore inventory
   * Mark paid: status transition with proof requirement
   * Release: transfer escrow to buyer
   * Dispute resolve: one of two outcomes
2. Idempotency:

   * `createTradeIdempotencyKey`
   * `markPaidIdempotencyKey`
   * `releaseIdempotencyKey`
   * `cancelIdempotencyKey`
3. Immutable audit log:

   * Every state transition
   * Every balance change
   * Who triggered it, timestamp, previous state, new state

---

### 13) Minimum APIs

1. Ads:

   * CreateAd, UpdateAd (price, limits, payment methods), PauseAd, ResumeAd, CloseAd
   * ListAds(sorted), GetAd
2. Trades:

   * CreateTrade(adId, qty, paymentMethod)
   * UploadProof(tradeId, proof)
   * MarkPaid(tradeId)
   * CancelTrade(tradeId)
   * ReleaseTrade(tradeId)
   * OpenDispute(tradeId, reason, evidence)
3. Admin/support:

   * ResolveDispute(tradeId, outcome)
