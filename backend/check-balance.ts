/**
 * Check Coinbase Account Balances
 * Run: npx ts-node check-balance.ts
 */

require('dotenv').config();
const { CBAdvancedTradeClient } = require('coinbase-api');

const API_KEY = process.env.COINBASE_API_KEY;
const API_SECRET = process.env.COINBASE_API_SECRET;

if (!API_KEY || !API_SECRET) {
  console.error('❌ Error: COINBASE_API_KEY and COINBASE_API_SECRET must be set in .env file');
  process.exit(1);
}

const client = new CBAdvancedTradeClient({
  apiKey: API_KEY,
  apiSecret: API_SECRET,
});

async function checkBalances() {
  console.log('🔍 Checking Coinbase Account Balances\n');
  console.log('='.repeat(60));

  try {
    const response = await client.getAccounts({ limit: 250 });
    const accounts = response.accounts || [];

    if (accounts.length === 0) {
      console.log('No accounts found');
      return;
    }

    console.log(`Found ${accounts.length} account(s)\n`);

    // Filter to accounts with non-zero balances
    const accountsWithBalance = accounts.filter((acc: any) => {
      const available = parseFloat(acc.available_balance?.value || 0);
      const hold = parseFloat(acc.hold?.value || 0);
      return available > 0 || hold > 0;
    });

    if (accountsWithBalance.length === 0) {
      console.log('⚠️  No accounts with balances found');
      console.log('\nAll accounts:');
      accounts.slice(0, 10).forEach((acc: any) => {
        console.log(`  - ${acc.currency}: Available: ${acc.available_balance?.value || '0'}, Hold: ${acc.hold?.value || '0'}`);
      });
      return;
    }

    console.log('💰 Accounts with Balances:\n');

    let totalUsdValue = 0;

    accountsWithBalance.forEach((acc: any) => {
      const available = parseFloat(acc.available_balance?.value || 0);
      const hold = parseFloat(acc.hold?.value || 0);
      const total = available + hold;

      console.log(`Currency: ${acc.currency}`);
      console.log(`  Available: ${available.toFixed(8)}`);
      console.log(`  On Hold: ${hold.toFixed(8)}`);
      console.log(`  Total: ${total.toFixed(8)}`);
      console.log(`  UUID: ${acc.uuid}`);
      console.log(`  Name: ${acc.name || 'N/A'}`);
      console.log('');
    });

    // Try to get USD value for major currencies
    console.log('💵 Summary:');
    const usdAccount = accounts.find((acc: any) => acc.currency === 'USD');
    const btcAccount = accounts.find((acc: any) => acc.currency === 'BTC');
    const ethAccount = accounts.find((acc: any) => acc.currency === 'ETH');

    if (usdAccount) {
      const usdBalance = parseFloat(usdAccount.available_balance?.value || 0);
      console.log(`  USD: $${usdBalance.toFixed(2)}`);
      totalUsdValue += usdBalance;
    }

    if (btcAccount) {
      const btcBalance = parseFloat(btcAccount.available_balance?.value || 0);
      console.log(`  BTC: ${btcBalance.toFixed(8)}`);
      // Get BTC price to calculate USD value
      try {
        const btcProduct = await client.getProduct({ product_id: 'BTC-USD' });
        const btcPrice = parseFloat(btcProduct.price || 0);
        const btcUsdValue = btcBalance * btcPrice;
        console.log(`    ≈ $${btcUsdValue.toFixed(2)} USD`);
        totalUsdValue += btcUsdValue;
      } catch (e) {
        console.log(`    (Could not fetch BTC price)`);
      }
    }

    if (ethAccount) {
      const ethBalance = parseFloat(ethAccount.available_balance?.value || 0);
      console.log(`  ETH: ${ethBalance.toFixed(8)}`);
      // Get ETH price to calculate USD value
      try {
        const ethProduct = await client.getProduct({ product_id: 'ETH-USD' });
        const ethPrice = parseFloat(ethProduct.price || 0);
        const ethUsdValue = ethBalance * ethPrice;
        console.log(`    ≈ $${ethUsdValue.toFixed(2)} USD`);
        totalUsdValue += ethUsdValue;
      } catch (e) {
        console.log(`    (Could not fetch ETH price)`);
      }
    }

    if (totalUsdValue > 0) {
      console.log(`\n📊 Total Estimated Value: $${totalUsdValue.toFixed(2)} USD`);
    }

  } catch (error: any) {
    console.error('❌ Error fetching balances:', error.message || error);
    process.exit(1);
  }
}

checkBalances();

