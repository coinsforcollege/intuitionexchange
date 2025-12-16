import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

export interface WatchlistItemResponse {
  asset: string;
  addedAt: Date;
}

@Injectable()
export class WatchlistService {
  private readonly logger = new Logger(WatchlistService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get all watchlist items for a user
   */
  async getWatchlist(userId: string): Promise<WatchlistItemResponse[]> {
    const items = await this.prisma.client.watchlistItem.findMany({
      where: { userId },
      orderBy: { addedAt: 'desc' },
    });

    return items.map((item) => ({
      asset: item.asset,
      addedAt: item.addedAt,
    }));
  }

  /**
   * Add an asset to watchlist
   */
  async addToWatchlist(
    userId: string,
    asset: string,
  ): Promise<WatchlistItemResponse> {
    const normalizedAsset = asset.toUpperCase();

    const item = await this.prisma.client.watchlistItem.upsert({
      where: {
        userId_asset: {
          userId,
          asset: normalizedAsset,
        },
      },
      create: {
        userId,
        asset: normalizedAsset,
      },
      update: {}, // No update needed if already exists
    });

    return {
      asset: item.asset,
      addedAt: item.addedAt,
    };
  }

  /**
   * Remove an asset from watchlist
   */
  async removeFromWatchlist(userId: string, asset: string): Promise<void> {
    const normalizedAsset = asset.toUpperCase();

    await this.prisma.client.watchlistItem.deleteMany({
      where: {
        userId,
        asset: normalizedAsset,
      },
    });
  }

  /**
   * Check if an asset is in watchlist
   */
  async isInWatchlist(userId: string, asset: string): Promise<boolean> {
    const normalizedAsset = asset.toUpperCase();

    const item = await this.prisma.client.watchlistItem.findUnique({
      where: {
        userId_asset: {
          userId,
          asset: normalizedAsset,
        },
      },
    });

    return !!item;
  }

  /**
   * Toggle watchlist status (add if not present, remove if present)
   */
  async toggleWatchlist(
    userId: string,
    asset: string,
  ): Promise<{ added: boolean }> {
    const isInList = await this.isInWatchlist(userId, asset);

    if (isInList) {
      await this.removeFromWatchlist(userId, asset);
      return { added: false };
    } else {
      await this.addToWatchlist(userId, asset);
      return { added: true };
    }
  }
}


