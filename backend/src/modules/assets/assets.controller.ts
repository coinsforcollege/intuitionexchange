import { Controller, Get, Post, UseGuards, Request, Param, Query, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssetsService } from './assets.service';

@Controller('assets')
@UseGuards(JwtAuthGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  /**
   * GET /api/assets
   * Get all crypto balances for the authenticated user
   */
  @Get()
  async getBalances(@Request() req: any) {
    const balances = await this.assetsService.getUserBalances(req.user.id);
    return balances;
  }

  /**
   * GET /api/assets/portfolio/history
   * Get portfolio history for investor mode growth chart
   */
  @Get('portfolio/history')
  async getPortfolioHistory(
    @Request() req: any,
    @Query('range') range: '1D' | '1W' | '1M' | '6M' | '1Y' = '1M',
  ) {
    const history = await this.assetsService.getPortfolioHistory(req.user.id, range);
    return {
      success: true,
      history,
      range,
    };
  }

  /**
   * POST /api/assets/portfolio/snapshot
   * Create a portfolio snapshot for investor mode
   */
  @Post('portfolio/snapshot')
  async createPortfolioSnapshot(
    @Request() req: any,
    @Body() body: { cryptoPrices: Record<string, number> },
  ) {
    await this.assetsService.createPortfolioSnapshot(req.user.id, body.cryptoPrices);
    return {
      success: true,
      message: 'Portfolio snapshot created',
    };
  }

  /**
   * GET /api/assets/:asset
   * Get balance for a specific asset
   */
  @Get(':asset')
  async getBalance(@Request() req: any, @Param('asset') asset: string) {
    const balance = await this.assetsService.getBalance(
      req.user.id,
      asset.toUpperCase(),
    );

    if (!balance) {
      return {
        asset: asset.toUpperCase(),
        balance: 0,
        availableBalance: 0,
        lockedBalance: 0,
      };
    }

    return balance;
  }
}

