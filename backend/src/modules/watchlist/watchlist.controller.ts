import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WatchlistService } from './watchlist.service';

@Controller('watchlist')
@UseGuards(JwtAuthGuard)
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  /**
   * GET /api/watchlist
   * Get all watchlist items for the authenticated user
   */
  @Get()
  async getWatchlist(@Request() req: any) {
    return this.watchlistService.getWatchlist(req.user.id);
  }

  /**
   * POST /api/watchlist/:asset
   * Add an asset to watchlist
   */
  @Post(':asset')
  async addToWatchlist(@Request() req: any, @Param('asset') asset: string) {
    return this.watchlistService.addToWatchlist(req.user.id, asset);
  }

  /**
   * DELETE /api/watchlist/:asset
   * Remove an asset from watchlist
   */
  @Delete(':asset')
  async removeFromWatchlist(
    @Request() req: any,
    @Param('asset') asset: string,
  ) {
    await this.watchlistService.removeFromWatchlist(req.user.id, asset);
    return { success: true };
  }

  /**
   * POST /api/watchlist/:asset/toggle
   * Toggle an asset in watchlist
   */
  @Post(':asset/toggle')
  async toggleWatchlist(@Request() req: any, @Param('asset') asset: string) {
    return this.watchlistService.toggleWatchlist(req.user.id, asset);
  }
}


