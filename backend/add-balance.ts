/**
 * Add balance to user account for testing
 * Run: npx ts-node add-balance.ts
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

async function addBalance() {
  const email = 'eyeclik@gmail.com';
  const asset = 'ETH';
  const amount = 10;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);

    // Get or create balance
    const existingBalance = await prisma.cryptoBalance.findUnique({
      where: {
        userId_asset: {
          userId: user.id,
          asset,
        },
      },
    });

    if (existingBalance) {
      // Update existing balance
      const updated = await prisma.cryptoBalance.update({
        where: {
          userId_asset: {
            userId: user.id,
            asset,
          },
        },
        data: {
          balance: {
            increment: amount,
          },
          availableBalance: {
            increment: amount,
          },
        },
      });

      console.log(`✅ Added ${amount} ${asset} to existing balance`);
      console.log(`   Previous balance: ${parseFloat(existingBalance.balance.toString())}`);
      console.log(`   New balance: ${parseFloat(updated.balance.toString())}`);
      console.log(`   Available: ${parseFloat(updated.availableBalance.toString())}`);
    } else {
      // Create new balance
      const created = await prisma.cryptoBalance.create({
        data: {
          userId: user.id,
          asset,
          balance: amount,
          availableBalance: amount,
          lockedBalance: 0,
        },
      });

      console.log(`✅ Created new balance with ${amount} ${asset}`);
      console.log(`   Balance: ${parseFloat(created.balance.toString())}`);
      console.log(`   Available: ${parseFloat(created.availableBalance.toString())}`);
    }

    console.log('\n✅ Balance updated successfully!');
  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addBalance();

