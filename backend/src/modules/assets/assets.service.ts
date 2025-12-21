import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

export interface BalanceResponse {
  asset: string;
  balance: number;
  availableBalance: number;
  lockedBalance: number;
  usdValue?: number; // Optional: calculated USD value if price provided
}

@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get all balances for a user
   */
  async getUserBalances(userId: string): Promise<BalanceResponse[]> {
    const balances = await this.prisma.client.cryptoBalance.findMany({
      where: { userId },
    });

    return balances.map((b) => ({
      asset: b.asset,
      balance: parseFloat(b.balance.toString()),
      availableBalance: parseFloat(b.availableBalance.toString()),
      lockedBalance: parseFloat(b.lockedBalance.toString()),
    }));
  }

  /**
   * Get balance for a specific asset
   */
  async getBalance(
    userId: string,
    asset: string,
  ): Promise<BalanceResponse | null> {
    const balance = await this.prisma.client.cryptoBalance.findUnique({
      where: {
        userId_asset: {
          userId,
          asset,
        },
      },
    });

    if (!balance) {
      return null;
    }

    return {
      asset: balance.asset,
      balance: parseFloat(balance.balance.toString()),
      availableBalance: parseFloat(balance.availableBalance.toString()),
      lockedBalance: parseFloat(balance.lockedBalance.toString()),
    };
  }

  /**
   * Get or create balance for an asset (returns 0 if doesn't exist)
   */
  async getOrCreateBalance(
    userId: string,
    asset: string,
  ): Promise<BalanceResponse> {
    const balance = await this.prisma.client.cryptoBalance.findUnique({
      where: {
        userId_asset: {
          userId,
          asset,
        },
      },
    });

    if (balance) {
      return {
        asset: balance.asset,
        balance: parseFloat(balance.balance.toString()),
        availableBalance: parseFloat(balance.availableBalance.toString()),
        lockedBalance: parseFloat(balance.lockedBalance.toString()),
      };
    }

    // Return zero balance if doesn't exist
    return {
      asset,
      balance: 0,
      availableBalance: 0,
      lockedBalance: 0,
    };
  }

  /**
   * Update balance after a trade
   * For BUY: adds base asset, subtracts quote asset
   * For SELL: subtracts base asset, adds quote asset
   */
  async updateBalanceAfterTrade(
    userId: string,
    asset: string,
    amount: number, // Positive to add, negative to subtract
  ): Promise<void> {
    await this.prisma.client.cryptoBalance.upsert({
      where: {
        userId_asset: {
          userId,
          asset,
        },
      },
      create: {
        userId,
        asset,
        balance: amount, // Can be negative if subtracting from non-existent balance
        availableBalance: amount,
        lockedBalance: 0,
      },
      update: {
        balance: {
          increment: amount,
        },
        availableBalance: {
          increment: amount,
        },
      },
    });
  }

  /**
   * Lock balance (move from available to locked)
   */
  async lockBalance(
    userId: string,
    asset: string,
    amount: number,
  ): Promise<void> {
    const balance = await this.getOrCreateBalance(userId, asset);

    if (balance.availableBalance < amount) {
      throw new Error(
        `Insufficient balance. Available: ${balance.availableBalance}, Required: ${amount}`,
      );
    }

    await this.prisma.client.cryptoBalance.update({
      where: {
        userId_asset: {
          userId,
          asset,
        },
      },
      data: {
        availableBalance: {
          decrement: amount,
        },
        lockedBalance: {
          increment: amount,
        },
      },
    });
  }

  /**
   * Unlock balance (move from locked back to available)
   */
  async unlockBalance(
    userId: string,
    asset: string,
    amount: number,
  ): Promise<void> {
    await this.prisma.client.cryptoBalance.update({
      where: {
        userId_asset: {
          userId,
          asset,
        },
      },
      data: {
        availableBalance: {
          increment: amount,
        },
        lockedBalance: {
          decrement: amount,
        },
      },
    });
  }

  /**
   * Check if user has sufficient balance
   */
  async hasSufficientBalance(
    userId: string,
    asset: string,
    requiredAmount: number,
  ): Promise<boolean> {
    const balance = await this.getOrCreateBalance(userId, asset);
    return balance.availableBalance >= requiredAmount;
  }

  // ============================================
  // PORTFOLIO SNAPSHOTS (Investor Mode)
  // ============================================

  /**
   * Create a portfolio snapshot for investor mode
   */
  async createPortfolioSnapshot(
    userId: string,
    cryptoPrices: Record<string, number>,
  ): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get current balances
    const balances = await this.getUserBalances(userId);
    
    const cashBalance = balances.find(b => b.asset === 'USD')?.balance || 0;
    
    let cryptoValue = 0;
    for (const balance of balances) {
      if (balance.asset !== 'USD' && cryptoPrices[balance.asset]) {
        cryptoValue += balance.balance * cryptoPrices[balance.asset];
      }
    }

    const totalValue = cashBalance + cryptoValue;

    // Calculate invested value (total deposits - total withdrawals)
    const depositSum = await this.prisma.client.fiatTransaction.aggregate({
      where: {
        userId,
        type: 'DEPOSIT',
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    const withdrawSum = await this.prisma.client.fiatTransaction.aggregate({
      where: {
        userId,
        type: 'WITHDRAWAL',
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    const totalDeposits = parseFloat(depositSum._sum.amount?.toString() || '0');
    const totalWithdrawals = parseFloat(withdrawSum._sum.amount?.toString() || '0');
    const investedValue = totalDeposits - totalWithdrawals;

    // Upsert snapshot
    await this.prisma.client.portfolioSnapshot.upsert({
      where: {
        userId_snapshotDate: {
          userId,
          snapshotDate: today,
        },
      },
      create: {
        userId,
        totalValue,
        investedValue,
        cashBalance,
        cryptoValue,
        snapshotDate: today,
      },
      update: {
        totalValue,
        investedValue,
        cashBalance,
        cryptoValue,
      },
    });

    this.logger.log(`Created investor portfolio snapshot for user ${userId}: total=$${totalValue.toFixed(2)}, invested=$${investedValue.toFixed(2)}`);
  }

  /**
   * Get portfolio history for investor mode growth chart
   */
  async getPortfolioHistory(
    userId: string,
    range: '1D' | '1W' | '1M' | '6M' | '1Y',
  ): Promise<{
    totalValue: number;
    investedValue: number;
    cashBalance: number;
    cryptoValue: number;
    snapshotDate: Date;
  }[]> {
    const now = new Date();
    let startDate: Date;

    switch (range) {
      case '1D':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '1W':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1M':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '6M':
        startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case '1Y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const snapshots = await this.prisma.client.portfolioSnapshot.findMany({
      where: {
        userId,
        snapshotDate: {
          gte: startDate,
        },
      },
      orderBy: {
        snapshotDate: 'asc',
      },
    });

    return snapshots.map(s => ({
      totalValue: parseFloat(s.totalValue.toString()),
      investedValue: parseFloat(s.investedValue.toString()),
      cashBalance: parseFloat(s.cashBalance.toString()),
      cryptoValue: parseFloat(s.cryptoValue.toString()),
      snapshotDate: s.snapshotDate,
    }));
  }
}
