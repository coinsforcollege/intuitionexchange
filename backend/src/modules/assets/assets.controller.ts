import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
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

