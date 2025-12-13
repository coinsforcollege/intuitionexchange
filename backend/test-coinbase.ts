/**
 * Coinbase Advanced Trade API Test
 * Using coinbase-api SDK with ED25519 keys
 * 
 * Run: npx ts-node test-coinbase.ts
 */

// Load environment variables from .env
require('dotenv').config();

// Using the community SDK that supports ED25519 keys
const { CBAdvancedTradeClient, CBAppClient } = require('coinbase-api');

// Your CDP API Keys (ED25519 format) - loaded from .env
const API_KEY = process.env.COINBASE_API_KEY;
const API_SECRET = process.env.COINBASE_API_SECRET;

if (!API_KEY || !API_SECRET) {
  console.error('❌ Error: COINBASE_API_KEY and COINBASE_API_SECRET must be set in .env file');
  process.exit(1);
}

console.log('🔐 Coinbase Advanced Trade API Test\n');
console.log('=' .repeat(60));
console.log(`API Key: ${API_KEY.substring(0, 8)}...`);
console.log(`Secret: ${API_SECRET.substring(0, 10)}...`);
console.log('Key Type: ED25519 (UUID + Base64)');
console.log('=' .repeat(60) + '\n');

// Initialize the client with ED25519 keys
const client = new CBAdvancedTradeClient({
  apiKey: API_KEY,
  apiSecret: API_SECRET,
});

async function testAPI() {
  // Test 1: Get Accounts
  console.log('📡 Test 1: Get Accounts');
  try {
    const accounts = await client.getAccounts();
    console.log('   ✅ SUCCESS!');
    console.log(`   Found ${accounts.accounts?.length || 0} accounts`);
    
    if (accounts.accounts && accounts.accounts.length > 0) {
      console.log('\n   Sample accounts:');
      accounts.accounts.slice(0, 5).forEach((acc: any) => {
        const balance = parseFloat(acc.available_balance?.value || 0);
        if (balance > 0) {
          console.log(`   - ${acc.currency}: ${balance}`);
        }
      });
    }
  } catch (e: any) {
    console.log(`   ❌ FAILED: ${e.message || JSON.stringify(e)}`);
  }

  // Test 2: Get Products (trading pairs)
  console.log('\n📡 Test 2: Get Products (Trading Pairs)');
  try {
    const products = await client.getProducts({ limit: 10 });
    console.log('   ✅ SUCCESS!');
    console.log(`   Found ${products.products?.length || 0} products`);
    
    if (products.products && products.products.length > 0) {
      console.log('\n   Sample products:');
      products.products.slice(0, 5).forEach((p: any) => {
        console.log(`   - ${p.product_id}: $${p.price}`);
      });
    }
  } catch (e: any) {
    console.log(`   ❌ FAILED: ${e.message || JSON.stringify(e)}`);
  }

  // Test 3: Get API Key Permissions
  console.log('\n📡 Test 3: Get API Key Permissions');
  try {
    const permissions = await client.getApiKeyPermissions();
    console.log('   ✅ SUCCESS!');
    console.log(`   Can View: ${permissions.can_view}`);
    console.log(`   Can Trade: ${permissions.can_trade}`);
    console.log(`   Can Transfer: ${permissions.can_transfer}`);
    console.log(`   Portfolio UUID: ${permissions.portfolio_uuid}`);
  } catch (e: any) {
    console.log(`   ❌ FAILED: ${e.message || JSON.stringify(e)}`);
  }

  // Test 4: Get BTC-USD Product
  console.log('\n📡 Test 4: Get BTC-USD Product Details');
  try {
    const product = await client.getProduct({ product_id: 'BTC-USD' });
    console.log('   ✅ SUCCESS!');
    console.log(`   Product: ${product.product_id}`);
    console.log(`   Price: $${product.price}`);
    console.log(`   24h Change: ${product.price_percentage_change_24h}%`);
    console.log(`   Volume 24h: $${product.volume_24h}`);
  } catch (e: any) {
    console.log(`   ❌ FAILED: ${e.message || JSON.stringify(e)}`);
  }

  // Test 5: Get Payment Methods
  console.log('\n📡 Test 5: Get Payment Methods');
  try {
    const paymentMethods = await client.getPaymentMethods();
    console.log('   ✅ SUCCESS!');
    
    if (paymentMethods.payment_methods && paymentMethods.payment_methods.length > 0) {
      console.log(`   Found ${paymentMethods.payment_methods.length} payment method(s):\n`);
      paymentMethods.payment_methods.forEach((pm: any) => {
        console.log(`   - ID: ${pm.id}`);
        console.log(`     Type: ${pm.type}`);
        console.log(`     Name: ${pm.name}`);
        console.log(`     Currency: ${pm.currency}`);
        console.log(`     Allow Buy: ${pm.allow_buy}`);
        console.log(`     Allow Sell: ${pm.allow_sell}`);
        console.log(`     Allow Deposit: ${pm.allow_deposit}`);
        console.log(`     Allow Withdraw: ${pm.allow_withdraw}`);
        console.log('');
      });
    } else {
      console.log('   No payment methods found');
      console.log('   Response:', JSON.stringify(paymentMethods, null, 2).substring(0, 500));
    }
  } catch (e: any) {
    console.log(`   ❌ FAILED: ${e.message || JSON.stringify(e)}`);
    console.log('   (Payment methods may require CBAppClient instead of CBAdvancedTradeClient)');
  }

  // Test 6: Try CBAppClient for accounts and payment methods
  console.log('\n📡 Test 6: Coinbase App Client - Accounts & Payment Methods');
  try {
    const appClient = new CBAppClient({
      apiKey: API_KEY,
      apiSecret: API_SECRET,
    });

    // Get accounts from App API
    const appAccounts = await appClient.getAccounts({});
    console.log('   App Accounts:');
    if (appAccounts.data && appAccounts.data.length > 0) {
      console.log(`   Found ${appAccounts.data.length} accounts`);
      appAccounts.data.slice(0, 5).forEach((acc: any) => {
        const balance = parseFloat(acc.balance?.amount || 0);
        if (balance > 0 || acc.currency === 'USD' || acc.currency === 'BTC') {
          console.log(`   - ${acc.currency}: ${acc.balance?.amount} (${acc.name})`);
        }
      });
    } else {
      console.log('   No accounts found in App API');
    }

    // Get payment methods from App API
    const appPaymentMethods = await appClient.getPaymentMethods();
    console.log('\n   App Payment Methods:');
    if (appPaymentMethods.data && appPaymentMethods.data.length > 0) {
      console.log(`   Found ${appPaymentMethods.data.length} payment method(s):`);
      appPaymentMethods.data.forEach((pm: any) => {
        console.log(`   - ${pm.name} (${pm.type})`);
        console.log(`     Currency: ${pm.currency}`);
        console.log(`     Allow Buy: ${pm.allow_buy}, Allow Sell: ${pm.allow_sell}`);
      });
    } else {
      console.log('   No payment methods found in App API');
    }
  } catch (e: any) {
    console.log(`   ❌ FAILED: ${e.message || JSON.stringify(e)}`);
  }

  // Test 7: Get Candle Data (for charts)
  console.log('\n📡 Test 7: Get BTC-USD Candle Data (for charts)');
  try {
    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - (24 * 60 * 60);
    
    const candles = await client.getPublicProductCandles({
      product_id: 'BTC-USD',
      granularity: 'ONE_HOUR',
      start: oneDayAgo.toString(),
      end: now.toString(),
    });
    
    console.log('   ✅ SUCCESS!');
    console.log(`   Found ${candles.candles?.length || 0} candles (1 hour each)`);
    
    if (candles.candles && candles.candles.length > 0) {
      console.log('\n   Latest 3 candles:');
      candles.candles.slice(0, 3).forEach((c: any) => {
        const date = new Date(parseInt(c.start) * 1000).toLocaleString();
        console.log(`   - ${date}`);
        console.log(`     Open: $${c.open}, High: $${c.high}, Low: $${c.low}, Close: $${c.close}`);
        console.log(`     Volume: ${c.volume}`);
      });
    }
  } catch (e: any) {
    console.log(`   ❌ FAILED: ${e.message || JSON.stringify(e)}`);
  }

  console.log('\n' + '=' .repeat(60));
  console.log('TEST COMPLETE');
  console.log('=' .repeat(60));
}

testAPI().catch(console.error);
