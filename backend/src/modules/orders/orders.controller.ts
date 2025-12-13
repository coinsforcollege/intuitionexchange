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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * POST /orders
   * Place a new order
   */
  @Post()
  async placeOrder(
    @Request() req: any,
    @Body()
    body: {
      productId: string;
      side: 'BUY' | 'SELL';
      amount: number;
    },
  ) {
    try {
      const { productId, side, amount } = body;

      if (!productId || !side || !amount) {
        throw new HttpException(
          'productId, side, and amount are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!['BUY', 'SELL'].includes(side)) {
        throw new HttpException(
          'side must be BUY or SELL',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (amount <= 0) {
        throw new HttpException(
          'amount must be greater than 0',
          HttpStatus.BAD_REQUEST,
        );
      }

      const order = await this.ordersService.placeOrder({
        userId: req.user.id,
        productId,
        side,
        amount,
      });

      return { success: true, order };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to place order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /orders
   * Get user's orders
   */
  @Get()
  async getOrders(
    @Request() req: any,
    @Query('productId') productId?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    try {
      const result = await this.ordersService.getUserOrders(req.user.id, {
        productId,
        status: status as any,
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0,
      });

      return { success: true, ...result };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to fetch orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /orders/:orderId
   * Get a single order
   */
  @Get(':orderId')
  async getOrder(@Request() req: any, @Param('orderId') orderId: string) {
    try {
      const order = await this.ordersService.getOrder(req.user.id, orderId);

      if (!order) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }

      return { success: true, order };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Failed to fetch order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

