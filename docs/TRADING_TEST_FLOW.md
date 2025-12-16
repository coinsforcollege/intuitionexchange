# Trading Flow Testing Guide

## Expected Flow

1. **User places buy request** - User enters amount in TradeForm
2. **Quote is presented** - Confirmation modal shows price, fees, and total
3. **User confirms** - User clicks confirm in modal
4. **Trade is executed on Coinbase** - Backend places order on Coinbase (master/omnibus account)
5. **User's balance is updated** - User's ledger balance is updated on our exchange

## Architecture

- **Coinbase Account**: Master/Omnibus account (single account for all users)
- **User Balances**: Ledger-based balances in our database (users don't own Coinbase accounts)
- **Trading**: All trades execute on Coinbase, but balances are tracked in our ledger

## Testing Checklist

### Pre-Testing Setup

- [ ] Backend server is running on `http://localhost:8000`
- [ ] Frontend is running on `http://localhost:3000`
- [ ] User is logged in and KYC is approved
- [ ] User has sufficient balance in their ledger (e.g., USD for buying BTC)
- [ ] Coinbase API keys are configured in backend `.env`

### Test Case 1: Buy Order (BTC-USD)

1. **Navigate to Exchange**
   - Go to `/exchange`
   - Select BTC-USD pair

2. **Place Buy Request**
   - Enter amount (e.g., 0.001 BTC) or total (e.g., $100 USD)
   - Verify quote is displayed in confirmation modal:
     - Amount: 0.001 BTC
     - Price: Current BTC price
     - Fee: 0.5% of total
     - Total: Amount × Price + Fee

3. **Confirm Trade**
   - Click "Confirm Buy" in modal
   - Verify loading state shows
   - Wait for success message

4. **Verify Trade Execution**
   - Check order appears in "My Orders" section
   - Verify order status is "COMPLETED"
   - Verify Coinbase order ID is present

5. **Verify Balance Update**
   - Check user's BTC balance increased by filled amount
   - Check user's USD balance decreased by (total cost + fee)
   - Refresh balances and verify they're updated

### Test Case 2: Sell Order (BTC-USD)

1. **Place Sell Request**
   - Switch to "Sell" tab
   - Enter amount (e.g., 0.001 BTC)
   - Verify quote shows:
     - Amount: 0.001 BTC
     - Price: Current BTC price
     - Fee: 0.5% of total value
     - Total: (Amount × Price) - Fee

2. **Confirm Trade**
   - Click "Confirm Sell"
   - Wait for success

3. **Verify Trade Execution**
   - Check order in "My Orders"
   - Verify status is "COMPLETED"

4. **Verify Balance Update**
   - Check user's BTC balance decreased by sold amount
   - Check user's USD balance increased by (total value - fee)

### Test Case 3: Insufficient Balance

1. **Try to buy with insufficient funds**
   - Enter amount that exceeds available balance
   - Try to confirm
   - Verify error message: "Insufficient balance"

### Test Case 4: Order Failure Handling

1. **Monitor failed orders**
   - If Coinbase order fails, verify:
     - Order status is "FAILED"
     - Locked balance is unlocked
     - User balance is not changed

## API Endpoints Used

### Frontend → Backend

1. **GET `/api/assets`** - Get user balances
2. **POST `/api/orders`** - Place order
   ```json
   {
     "productId": "BTC-USD",
     "side": "BUY",
     "amount": 100
   }
   ```
3. **GET `/api/orders`** - Get user orders

### Backend → Coinbase

1. **POST Coinbase API** - Place market order
2. **GET Coinbase API** - Get order status

## Database Tables

- **`crypto_balances`** - User ledger balances
  - `balance` - Total balance
  - `availableBalance` - Available for trading
  - `lockedBalance` - Locked in pending orders

- **`trades`** - Trade history
  - `productId` - Trading pair (e.g., "BTC-USD")
  - `side` - BUY or SELL
  - `requestedAmount` - Amount user requested
  - `filledAmount` - Amount actually filled
  - `price` - Execution price
  - `totalValue` - Total value in quote currency
  - `platformFee` - Our platform fee (0.5%)
  - `status` - PENDING, COMPLETED, FAILED, CANCELLED
  - `coinbaseOrderId` - Reference to Coinbase order

## Key Implementation Details

### Balance Locking
- When order is placed, balance is locked
- If order succeeds, locked amount is unlocked, then actual cost is deducted
- If order fails, locked amount is unlocked

### Fee Calculation
- Platform fee: 0.5% of trade value
- For BUY: Fee is added to cost
- For SELL: Fee is deducted from proceeds

### Order Amounts
- **BUY orders**: `amount` is in quote currency (USD)
- **SELL orders**: `amount` is in base currency (BTC)

## Troubleshooting

### Order stuck in PENDING
- Check Coinbase order status
- Verify Coinbase API is responding
- Check backend logs for errors

### Balance not updating
- Verify order status is COMPLETED
- Check `updateBalanceAfterTrade` was called
- Verify database transaction completed

### Coinbase order fails
- Check Coinbase API error message
- Verify Coinbase account has sufficient balance
- Check API key permissions

## Notes

- All trades execute on Coinbase's master account
- Users only have ledger balances, not actual Coinbase accounts
- Balance updates are atomic (database transactions)
- Failed orders unlock balances automatically

