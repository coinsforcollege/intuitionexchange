import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CoinbaseService } from '../coinbase/coinbase.service';
import { Prisma, TradeStatus, OrderType } from '@prisma/client';

export interface CreateOrderDto {
  userId: string;
  productId: string;
  side: 'BUY' | 'SELL';
  amount: number; // For SELL: base amount, For BUY: quote amount
}

export interface OrderResponse {
  id: string;
  productId: string;
  asset: string;
  quote: string;
  side: OrderType;
  requestedAmount: number;
  filledAmount: number;
  price: number;
  totalValue: number;
  platformFee: number;
  exchangeFee: number;
  status: TradeStatus;
  coinbaseOrderId: string | null;
  createdAt: Date;
  completedAt: Date | null;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly PLATFORM_FEE_PERCENT = 0.5; // 0.5% platform fee

  constructor(
    private prisma: PrismaService,
    private coinbaseService: CoinbaseService,
  ) {}

  /**
   * Place a market order
   */
  async placeOrder(dto: CreateOrderDto): Promise<OrderResponse> {
    const { userId, productId, side, amount } = dto;
    const [asset, quote] = productId.split('-');

    // Create pending order in database
    const order = await this.prisma.trade.create({
      data: {
        userId,
        productId,
        asset,
        quote,
        side: side as OrderType,
        requestedAmount: amount,
        filledAmount: 0,
        price: 0,
        totalValue: 0,
        platformFee: 0,
        exchangeFee: 0,
        status: 'PENDING',
      },
    });

    try {
      // Place order on Coinbase
      const coinbaseResult = await this.coinbaseService.placeMarketOrder(
        productId,
        side,
        side === 'BUY' ? amount.toString() : undefined, // quoteSize for BUY
        side === 'SELL' ? amount.toString() : undefined, // baseSize for SELL
      );

      if (!coinbaseResult.success) {
        // Update order as failed
        await this.prisma.trade.update({
          where: { id: order.id },
          data: { status: 'FAILED' },
        });
        throw new Error('Coinbase order failed');
      }

      // Get order details from Coinbase to get fill info
      // Note: Market orders fill immediately, but we may need to poll for exact fill details
      const coinbaseOrder = await this.coinbaseService.getOrder(coinbaseResult.orderId);

      // Calculate fees
      const filledValue = parseFloat(coinbaseOrder.filled_value) || 0;
      const platformFee = filledValue * (this.PLATFORM_FEE_PERCENT / 100);

      // Update order with Coinbase details
      const updatedOrder = await this.prisma.trade.update({
        where: { id: order.id },
        data: {
          coinbaseOrderId: coinbaseResult.orderId,
          filledAmount: parseFloat(coinbaseOrder.filled_size) || 0,
          price: parseFloat(coinbaseOrder.average_filled_price) || 0,
          totalValue: filledValue,
          platformFee,
          status: this.mapCoinbaseStatus(coinbaseOrder.status),
          completedAt: coinbaseOrder.status === 'FILLED' ? new Date() : null,
        },
      });

      return this.mapOrderToResponse(updatedOrder);
    } catch (error) {
      this.logger.error(`Order failed for user ${userId}`, error);
      
      // Update order as failed
      await this.prisma.trade.update({
        where: { id: order.id },
        data: { status: 'FAILED' },
      });

      throw error;
    }
  }

  /**
   * Get orders for a user
   */
  async getUserOrders(
    userId: string,
    options?: {
      productId?: string;
      status?: TradeStatus;
      limit?: number;
      offset?: number;
    },
  ): Promise<{ orders: OrderResponse[]; total: number }> {
    const where: Prisma.TradeWhereInput = { userId };

    if (options?.productId) {
      where.productId = options.productId;
    }
    if (options?.status) {
      where.status = options.status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.trade.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0,
      }),
      this.prisma.trade.count({ where }),
    ]);

    return {
      orders: orders.map(this.mapOrderToResponse),
      total,
    };
  }

  /**
   * Get a single order
   */
  async getOrder(userId: string, orderId: string): Promise<OrderResponse | null> {
    const order = await this.prisma.trade.findFirst({
      where: { id: orderId, userId },
    });

    return order ? this.mapOrderToResponse(order) : null;
  }

  /**
   * Map Coinbase status to our status
   */
  private mapCoinbaseStatus(coinbaseStatus: string): TradeStatus {
    switch (coinbaseStatus) {
      case 'FILLED':
        return 'COMPLETED';
      case 'CANCELLED':
      case 'EXPIRED':
        return 'CANCELLED';
      case 'FAILED':
        return 'FAILED';
      default:
        return 'PENDING';
    }
  }

  /**
   * Map database order to response
   */
  private mapOrderToResponse(order: any): OrderResponse {
    return {
      id: order.id,
      productId: order.productId,
      asset: order.asset,
      quote: order.quote,
      side: order.side,
      requestedAmount: parseFloat(order.requestedAmount.toString()),
      filledAmount: parseFloat(order.filledAmount.toString()),
      price: parseFloat(order.price.toString()),
      totalValue: parseFloat(order.totalValue.toString()),
      platformFee: parseFloat(order.platformFee.toString()),
      exchangeFee: parseFloat(order.exchangeFee.toString()),
      status: order.status,
      coinbaseOrderId: order.coinbaseOrderId,
      createdAt: order.createdAt,
      completedAt: order.completedAt,
    };
  }
}

