/**
 * Update balances for completed orders that might not have had balances updated
 * Run: npx ts-node update-completed-order-balances.ts
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ Error: DATABASE_URL must be set in .env file');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function updateBalances() {
  try {
    // Find completed orders
    const completedOrders = await prisma.trade.findMany({
      where: {
        status: 'COMPLETED',
        filledAmount: { gt: 0 },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Check last 10 completed orders
    });

    console.log(`Found ${completedOrders.length} completed orders\n`);

    for (const order of completedOrders) {
      try {
        console.log(`Processing order ${order.id} (${order.side} ${order.asset})...`);
        console.log(`  Filled: ${order.filledAmount} ${order.asset}`);
        console.log(`  Value: $${order.totalValue}`);
        console.log(`  Price: $${order.price}`);
        console.log(`  Fee: $${order.platformFee}`);

        // Check current balances
        const baseBalance = await prisma.cryptoBalance.findUnique({
          where: {
            userId_asset: {
              userId: order.userId,
              asset: order.asset,
            },
          },
        });

        const quoteBalance = await prisma.cryptoBalance.findUnique({
          where: {
            userId_asset: {
              userId: order.userId,
              asset: order.quote,
            },
          },
        });

        console.log(`  Current balances:`);
        console.log(`    ${order.asset}: ${baseBalance ? parseFloat(baseBalance.balance.toString()) : 0}`);
        console.log(`    ${order.quote}: ${quoteBalance ? parseFloat(quoteBalance.balance.toString()) : 0}`);

        // Update balances based on order side
        if (order.side === 'BUY') {
          // BUY: Add base asset, subtract quote currency (with fee)
          const totalCost = order.totalValue + order.platformFee;
          
          console.log(`  Updating balances for BUY order...`);
          
          // Subtract quote currency
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
              balance: -totalCost,
              availableBalance: -totalCost,
              lockedBalance: 0,
            },
            update: {
              balance: { decrement: totalCost },
              availableBalance: { decrement: totalCost },
            },
          });
          
          // Add base asset
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
              balance: order.filledAmount,
              availableBalance: order.filledAmount,
              lockedBalance: 0,
            },
            update: {
              balance: { increment: order.filledAmount },
              availableBalance: { increment: order.filledAmount },
            },
          });
          
          console.log(`  ✅ Updated balances: -${totalCost} ${order.quote}, +${order.filledAmount} ${order.asset}`);
        } else {
          // SELL: Subtract base asset, add quote currency (minus fee)
          const netQuote = order.totalValue - order.platformFee;
          
          console.log(`  Updating balances for SELL order...`);
          
          // Subtract base asset
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
              balance: -order.filledAmount,
              availableBalance: -order.filledAmount,
              lockedBalance: 0,
            },
            update: {
              balance: { decrement: order.filledAmount },
              availableBalance: { decrement: order.filledAmount },
            },
          });
          
          // Add quote currency
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
              balance: netQuote,
              availableBalance: netQuote,
              lockedBalance: 0,
            },
            update: {
              balance: { increment: netQuote },
              availableBalance: { increment: netQuote },
            },
          });
          
          console.log(`  ✅ Updated balances: -${order.filledAmount} ${order.asset}, +${netQuote} ${order.quote}`);
        }

        console.log('');
      } catch (error: any) {
        console.error(`  ❌ Error processing order ${order.id}:`, error.message || error);
      }
    }

    console.log('✅ Finished updating balances');
  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateBalances();

