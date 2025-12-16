import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LearnerService } from './learner.service';

@Controller('learner')
@UseGuards(JwtAuthGuard)
export class LearnerController {
  private readonly logger = new Logger(LearnerController.name);

  constructor(private readonly learnerService: LearnerService) {}

  /**
   * GET /api/learner/balances
   * Get all learner mode balances (fiat + crypto)
   */
  @Get('balances')
  async getBalances(@Request() req: any) {
    try {
      const balances = await this.learnerService.getLearnerBalances(req.user.id);
      return { success: true, balances };
    } catch (error: any) {
      this.logger.error('Failed to get learner balances', error);
      throw new HttpException(
        error.message || 'Failed to fetch balances',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/learner/reset
   * Reset learner account to initial state ($10,000)
   */
  @Post('reset')
  async resetAccount(@Request() req: any) {
    try {
      const result = await this.learnerService.resetLearnerAccount(req.user.id);
      return { success: true, ...result };
    } catch (error: any) {
      this.logger.error('Failed to reset learner account', error);
      throw new HttpException(
        error.message || 'Failed to reset account',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/learner/trade
   * Place a simulated trade in learner mode
   */
  @Post('trade')
  async placeTrade(
    @Request() req: any,
    @Body()
    body: {
      productId: string;
      side: 'BUY' | 'SELL';
      amount: number;
      currentPrice: number; // Real price from frontend
    },
  ) {
    try {
      const { productId, side, amount, currentPrice } = body;

      if (!productId || !side || !amount || !currentPrice) {
        throw new BadRequestException('productId, side, amount, and currentPrice are required');
      }

      if (!['BUY', 'SELL'].includes(side)) {
        throw new BadRequestException('side must be BUY or SELL');
      }

      if (amount <= 0) {
        throw new BadRequestException('amount must be greater than 0');
      }

      if (currentPrice <= 0) {
        throw new BadRequestException('currentPrice must be greater than 0');
      }

      // Validation is now handled by coinbaseService.validateAndFormatOrder
      // This ensures learner mode has identical validation to live mode

      const result = await this.learnerService.placeLearnerTrade(
        req.user.id,
        productId,
        side,
        amount,
        currentPrice,
      );

      return result;
    } catch (error: any) {
      this.logger.error('Learner trade failed', {
        error: error.message,
        userId: req.user?.id,
      });

      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(
        error.message || 'Unable to process simulated trade',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/learner/orders
   * Get learner mode order history
   */
  @Get('orders')
  async getOrders(
    @Request() req: any,
    @Query('productId') productId?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    try {
      const result = await this.learnerService.getLearnerOrders(req.user.id, {
        productId,
        status: status as any,
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0,
      });

      return { success: true, ...result };
    } catch (error: any) {
      this.logger.error('Failed to fetch learner orders', error);
      throw new HttpException(
        error.message || 'Failed to fetch orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/learner/orders/:orderId
   * Get a single learner order
   */
  @Get('orders/:orderId')
  async getOrder(@Request() req: any, @Param('orderId') orderId: string) {
    try {
      const order = await this.learnerService.getLearnerOrder(req.user.id, orderId);

      if (!order) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }

      return { success: true, order };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Failed to fetch learner order', error);
      throw new HttpException(
        error.message || 'Failed to fetch order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/learner/portfolio-history
   * Get portfolio snapshots for growth chart
   */
  @Get('portfolio-history')
  async getPortfolioHistory(
    @Request() req: any,
    @Query('range') range?: string,
  ) {
    try {
      const validRanges = ['1D', '1W', '1M', '6M', '1Y'];
      const selectedRange = (validRanges.includes(range?.toUpperCase() || '') 
        ? range?.toUpperCase() 
        : '1M') as '1D' | '1W' | '1M' | '6M' | '1Y';

      const history = await this.learnerService.getPortfolioHistory(
        req.user.id,
        selectedRange,
      );

      return { success: true, history, range: selectedRange };
    } catch (error: any) {
      this.logger.error('Failed to fetch portfolio history', error);
      throw new HttpException(
        error.message || 'Failed to fetch portfolio history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/learner/snapshot
   * Manually create a portfolio snapshot (with current prices)
   */
  @Post('snapshot')
  async createSnapshot(
    @Request() req: any,
    @Body() body: { cryptoPrices: Record<string, number> },
  ) {
    try {
      const { cryptoPrices } = body;

      if (!cryptoPrices || typeof cryptoPrices !== 'object') {
        throw new BadRequestException('cryptoPrices object is required');
      }

      await this.learnerService.createPortfolioSnapshot(req.user.id, cryptoPrices);

      return { success: true, message: 'Portfolio snapshot created' };
    } catch (error: any) {
      this.logger.error('Failed to create portfolio snapshot', error);
      throw new HttpException(
        error.message || 'Failed to create snapshot',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

