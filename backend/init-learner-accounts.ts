/**
 * Initialize learner accounts for all existing users
 * Run: npx ts-node init-learner-accounts.ts
 * 
 * This script:
 * - Finds all users without a learner fiat balance
 * - Creates $10,000 USD learner balance for each
 * - Creates initial portfolio snapshot
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

const INITIAL_BALANCE = 10000;

async function initializeLearnerAccounts() {
  try {
    console.log('🚀 Starting learner account initialization...\n');

    // Find all users
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true },
    });

    console.log(`📊 Found ${allUsers.length} total users\n`);

    // Find users already having learner fiat balance
    const existingLearnerBalances = await prisma.learnerFiatBalance.findMany({
      select: { userId: true },
    });

    const existingUserIds = new Set(existingLearnerBalances.map((b: any) => b.userId));

    // Filter users who need learner accounts
    const usersNeedingAccounts = allUsers.filter((u: any) => !existingUserIds.has(u.id));

    console.log(`📝 ${usersNeedingAccounts.length} users need learner accounts initialized\n`);

    if (usersNeedingAccounts.length === 0) {
      console.log('✅ All users already have learner accounts!');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let successCount = 0;
    let errorCount = 0;

    for (const user of usersNeedingAccounts) {
      try {
        // Create fiat balance
        await prisma.learnerFiatBalance.create({
          data: {
            userId: user.id,
            currency: 'USD',
            balance: INITIAL_BALANCE,
            availableBalance: INITIAL_BALANCE,
            lockedBalance: 0,
          },
        });

        // Create initial portfolio snapshot
        await prisma.learnerPortfolioSnapshot.create({
          data: {
            userId: user.id,
            totalValue: INITIAL_BALANCE,
            investedValue: INITIAL_BALANCE,
            cashBalance: INITIAL_BALANCE,
            cryptoValue: 0,
            snapshotDate: today,
          },
        });

        console.log(`✅ Initialized learner account for ${user.email}`);
        successCount++;
      } catch (error: any) {
        console.error(`❌ Failed to initialize for ${user.email}: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n========================================');
    console.log('📊 SUMMARY');
    console.log('========================================');
    console.log(`✅ Successfully initialized: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`💰 Each user now has $${INITIAL_BALANCE.toLocaleString()} in learner mode`);
    console.log('========================================\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

initializeLearnerAccounts();


