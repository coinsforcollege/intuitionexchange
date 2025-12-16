/**
 * Check and update pending orders
 * Run: npx ts-node check-pending-orders.ts
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { CBAdvancedTradeClient } = require('coinbase-api');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ Error: DATABASE_URL must be set in .env file');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

async function checkPendingOrders() {
  try {
    // Find all pending orders
    const pendingOrders = await prisma.trade.findMany({
      where: {
        status: 'PENDING',
        coinbaseOrderId: { not: null },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    console.log(`Found ${pendingOrders.length} pending orders\n`);

    for (const order of pendingOrders) {
      if (!order.coinbaseOrderId) {
        console.log(`⚠️  Order ${order.id} has no Coinbase order ID, skipping`);
        continue;
      }

      try {
        console.log(`Checking order ${order.id} (Coinbase: ${order.coinbaseOrderId})...`);
        const coinbaseOrder = await client.getOrder({ order_id: order.coinbaseOrderId });

        console.log(`  Full Coinbase response:`, JSON.stringify(coinbaseOrder, null, 2));

        // Handle different response structures
        const orderData = coinbaseOrder?.order || coinbaseOrder;
        const coinbaseStatus = orderData?.status || coinbaseOrder?.status;
        const filledSize = orderData?.filled_size || coinbaseOrder?.filled_size || '0';
        const filledValueStr = orderData?.filled_value || coinbaseOrder?.filled_value || '0';
        const avgPrice = orderData?.average_filled_price || coinbaseOrder?.average_filled_price || '0';

        const filledAmount = parseFloat(filledSize);
        const filledValue = parseFloat(filledValueStr);
        const filledPrice = filledAmount > 0 && filledValue > 0 
          ? filledValue / filledAmount 
          : parseFloat(avgPrice);
        const platformFee = filledValue * 0.005; // 0.5%

        console.log(`  Status: ${coinbaseStatus}`);
        console.log(`  Filled: ${filledAmount} ${order.asset}`);
        console.log(`  Value: $${filledValue}`);
        console.log(`  Price: $${filledPrice}`);

        // Map Coinbase status to our status
        let orderStatus = 'PENDING';
        if (coinbaseStatus === 'FILLED') {
          orderStatus = 'COMPLETED';
        } else if (coinbaseStatus === 'CANCELLED' || coinbaseStatus === 'EXPIRED') {
          orderStatus = 'CANCELLED';
        } else if (coinbaseStatus === 'FAILED') {
          orderStatus = 'FAILED';
        }

        // Update order
        await prisma.trade.update({
          where: { id: order.id },
          data: {
            filledAmount,
            price: filledPrice,
            totalValue: filledValue,
            platformFee,
            status: orderStatus as any,
            completedAt: coinbaseStatus === 'FILLED' ? new Date() : null,
          },
        });

        console.log(`  ✅ Updated order status to ${orderStatus}`);

        // If filled, update balances
        if (coinbaseStatus === 'FILLED' && filledAmount > 0) {
          console.log(`  Updating balances for user ${order.user.email}...`);
          
          if (order.side === 'BUY') {
            // BUY: Subtract quote currency (with fee), add base asset
            await prisma.cryptoBalance.upsert({
              where: {
                userId_asset: {
                  userId: order.userId,
                  asset: order.quote,
                },
              },
              create: {
                userId: order.userId,
                asset: order.quote,
                balance: -(filledValue + platformFee),
                availableBalance: -(filledValue + platformFee),
                lockedBalance: 0,
              },
              update: {
                balance: { decrement: filledValue + platformFee },
                availableBalance: { decrement: filledValue + platformFee },
              },
            });

            await prisma.cryptoBalance.upsert({
              where: {
                userId_asset: {
                  userId: order.userId,
                  asset: order.asset,
                },
              },
              create: {
                userId: order.userId,
                asset: order.asset,
                balance: filledAmount,
                availableBalance: filledAmount,
                lockedBalance: 0,
              },
              update: {
                balance: { increment: filledAmount },
                availableBalance: { increment: filledAmount },
              },
            });
          } else {
            // SELL: Subtract base asset, add quote currency (minus fee)
            await prisma.cryptoBalance.upsert({
              where: {
                userId_asset: {
                  userId: order.userId,
                  asset: order.asset,
                },
              },
              create: {
                userId: order.userId,
                asset: order.asset,
                balance: -filledAmount,
                availableBalance: -filledAmount,
                lockedBalance: 0,
              },
              update: {
                balance: { decrement: filledAmount },
                availableBalance: { decrement: filledAmount },
              },
            });

            await prisma.cryptoBalance.upsert({
              where: {
                userId_asset: {
                  userId: order.userId,
                  asset: order.quote,
                },
              },
              create: {
                userId: order.userId,
                asset: order.quote,
                balance: filledValue - platformFee,
                availableBalance: filledValue - platformFee,
                lockedBalance: 0,
              },
              update: {
                balance: { increment: filledValue - platformFee },
                availableBalance: { increment: filledValue - platformFee },
              },
            });
          }

          console.log(`  ✅ Updated balances\n`);
        }
      } catch (error: any) {
        console.error(`  ❌ Error checking order ${order.id}:`, error.message || error);
      }
    }

    console.log('✅ Finished checking pending orders');
  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkPendingOrders();

