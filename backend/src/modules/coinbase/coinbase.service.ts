import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Using require for the coinbase-api SDK
const { CBAdvancedTradeClient } = require('coinbase-api');

export interface CoinbaseProduct {
  product_id: string;
  base_currency: string;
  quote_currency: string;
  price: string;
  price_percentage_change_24h: string;
  volume_24h: string;
  base_name: string;
  quote_name: string;
  status: string;
}

export interface CoinbaseCandle {
  start: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface CoinbaseOrder {
  order_id: string;
  product_id: string;
  side: 'BUY' | 'SELL';
  status: string;
  filled_size: string;
  filled_value: string;
  average_filled_price: string;
  created_time: string;
  completion_percentage: string;
}

export interface CoinbaseAccount {
  uuid: string;
  name: string;
  currency: string;
  available_balance: { value: string; currency: string };
  hold: { value: string; currency: string };
}

@Injectable()
export class CoinbaseService implements OnModuleInit {
  private readonly logger = new Logger(CoinbaseService.name);
  private client: any;
  private isInitialized = false;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('COINBASE_API_KEY');
    const apiSecret = this.configService.get<string>('COINBASE_API_SECRET');

    if (!apiKey || !apiSecret) {
      this.logger.warn('Coinbase API keys not configured');
      return;
    }

    this.client = new CBAdvancedTradeClient({
      apiKey,
      apiSecret,
    });

    this.isInitialized = true;
    this.logger.log('Coinbase client initialized');
  }

  private ensureInitialized() {
    if (!this.isInitialized) {
      throw new Error('Coinbase client not initialized');
    }
  }

  /**
   * Get all available trading products (pairs)
   */
  async getProducts(quoteCurrency?: string): Promise<CoinbaseProduct[]> {
    this.ensureInitialized();

    try {
      const response = await this.client.getProducts({ limit: 500 });
      let products = response.products || [];

      // Filter by quote currency if specified
      if (quoteCurrency) {
        products = products.filter(
          (p: any) => p.quote_currency_id === quoteCurrency,
        );
      }

      // Filter to only tradeable products
      products = products.filter((p: any) => p.status === 'online');

      return products.map((p: any) => ({
        product_id: p.product_id,
        base_currency: p.base_currency_id,
        quote_currency: p.quote_currency_id,
        price: p.price || '0',
        price_percentage_change_24h: p.price_percentage_change_24h || '0',
        volume_24h: p.volume_24h || '0',
        base_name: p.base_name || p.base_currency_id,
        quote_name: p.quote_name || p.quote_currency_id,
        status: p.status,
      }));
    } catch (error) {
      this.logger.error('Failed to get products', error);
      throw error;
    }
  }

  /**
   * Get single product details with price
   */
  async getProduct(productId: string): Promise<CoinbaseProduct> {
    this.ensureInitialized();

    try {
      const product = await this.client.getProduct({ product_id: productId });

      return {
        product_id: product.product_id,
        base_currency: product.base_currency_id,
        quote_currency: product.quote_currency_id,
        price: product.price || '0',
        price_percentage_change_24h: product.price_percentage_change_24h || '0',
        volume_24h: product.volume_24h || '0',
        base_name: product.base_name || product.base_currency_id,
        quote_name: product.quote_name || product.quote_currency_id,
        status: product.status,
      };
    } catch (error) {
      this.logger.error(`Failed to get product ${productId}`, error);
      throw error;
    }
  }

  /**
   * Get candle data for charts
   */
  async getCandles(
    productId: string,
    granularity:
      | 'ONE_MINUTE'
      | 'FIVE_MINUTE'
      | 'FIFTEEN_MINUTE'
      | 'ONE_HOUR'
      | 'SIX_HOUR'
      | 'ONE_DAY' = 'ONE_HOUR',
    start?: number,
    end?: number,
  ): Promise<CoinbaseCandle[]> {
    this.ensureInitialized();

    try {
      const now = Math.floor(Date.now() / 1000);
      const defaultStart = now - 24 * 60 * 60; // 24 hours ago

      const response = await this.client.getPublicProductCandles({
        product_id: productId,
        granularity,
        start: (start || defaultStart).toString(),
        end: (end || now).toString(),
      });

      return (response.candles || []).map((c: any) => ({
        start: c.start,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        volume: c.volume,
      }));
    } catch (error) {
      this.logger.error(`Failed to get candles for ${productId}`, error);
      throw error;
    }
  }

  /**
   * Get account balances
   */
  async getAccounts(): Promise<CoinbaseAccount[]> {
    this.ensureInitialized();

    try {
      const response = await this.client.getAccounts({ limit: 250 });

      return (response.accounts || []).map((a: any) => ({
        uuid: a.uuid,
        name: a.name,
        currency: a.currency,
        available_balance: a.available_balance,
        hold: a.hold,
      }));
    } catch (error) {
      this.logger.error('Failed to get accounts', error);
      throw error;
    }
  }

  /**
   * Place a market order
   */
  async placeMarketOrder(
    productId: string,
    side: 'BUY' | 'SELL',
    quoteSize?: string, // For BUY: amount in quote currency (USD)
    baseSize?: string, // For SELL: amount in base currency (BTC)
  ): Promise<{ orderId: string; success: boolean }> {
    this.ensureInitialized();

    try {
      const clientOrderId = `intuition-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const orderConfig: any = {
        client_order_id: clientOrderId,
        product_id: productId,
        side,
        order_configuration: {
          market_market_ioc: {},
        },
      };

      if (side === 'BUY' && quoteSize) {
        orderConfig.order_configuration.market_market_ioc.quote_size = quoteSize;
      } else if (side === 'SELL' && baseSize) {
        orderConfig.order_configuration.market_market_ioc.base_size = baseSize;
      } else {
        throw new Error('Invalid order parameters');
      }

      const response = await this.client.createOrder(orderConfig);

      return {
        orderId: response.order_id || response.success_response?.order_id,
        success: response.success || !!response.success_response,
      };
    } catch (error) {
      this.logger.error('Failed to place order', error);
      throw error;
    }
  }

  /**
   * Get order history
   */
  async getOrders(
    productId?: string,
    limit = 50,
  ): Promise<CoinbaseOrder[]> {
    this.ensureInitialized();

    try {
      const params: any = {
        limit,
        order_status: ['FILLED', 'CANCELLED', 'EXPIRED', 'PENDING'],
      };

      if (productId) {
        params.product_id = productId;
      }

      const response = await this.client.getOrders(params);

      return (response.orders || []).map((o: any) => ({
        order_id: o.order_id,
        product_id: o.product_id,
        side: o.side,
        status: o.status,
        filled_size: o.filled_size || '0',
        filled_value: o.filled_value || '0',
        average_filled_price: o.average_filled_price || '0',
        created_time: o.created_time,
        completion_percentage: o.completion_percentage || '0',
      }));
    } catch (error) {
      this.logger.error('Failed to get orders', error);
      throw error;
    }
  }

  /**
   * Get a single order by ID
   */
  async getOrder(orderId: string): Promise<CoinbaseOrder> {
    this.ensureInitialized();

    try {
      const order = await this.client.getOrder({ order_id: orderId });

      return {
        order_id: order.order_id,
        product_id: order.product_id,
        side: order.side,
        status: order.status,
        filled_size: order.filled_size || '0',
        filled_value: order.filled_value || '0',
        average_filled_price: order.average_filled_price || '0',
        created_time: order.created_time,
        completion_percentage: order.completion_percentage || '0',
      };
    } catch (error) {
      this.logger.error(`Failed to get order ${orderId}`, error);
      throw error;
    }
  }

  /**
   * Get best bid/ask for order book
   */
  async getBestBidAsk(productIds: string[]): Promise<
    Array<{
      product_id: string;
      bids: Array<{ price: string; size: string }>;
      asks: Array<{ price: string; size: string }>;
    }>
  > {
    this.ensureInitialized();

    try {
      const response = await this.client.getBestBidAsk({
        product_ids: productIds,
      });

      return (response.pricebooks || []).map((pb: any) => ({
        product_id: pb.product_id,
        bids: pb.bids || [],
        asks: pb.asks || [],
      }));
    } catch (error) {
      this.logger.error('Failed to get best bid/ask', error);
      throw error;
    }
  }

  /**
   * Get public trades (recent market trades)
   */
  async getPublicTrades(
    productId: string,
    limit = 50,
  ): Promise<
    Array<{
      trade_id: string;
      product_id: string;
      price: string;
      size: string;
      time: string;
      side: string;
    }>
  > {
    this.ensureInitialized();

    try {
      const response = await this.client.getPublicMarketTrades({
        product_id: productId,
        limit,
      });

      return (response.trades || []).map((t: any) => ({
        trade_id: t.trade_id,
        product_id: t.product_id,
        price: t.price,
        size: t.size,
        time: t.time,
        side: t.side,
      }));
    } catch (error) {
      this.logger.error(`Failed to get public trades for ${productId}`, error);
      throw error;
    }
  }

  /**
   * Get product order book (bids and asks)
   */
  async getProductBook(
    productId: string,
    limit = 25,
  ): Promise<{
    bids: Array<{ price: string; size: string }>;
    asks: Array<{ price: string; size: string }>;
  }> {
    this.ensureInitialized();

    try {
      const response = await this.client.getPublicProductBook({
        product_id: productId,
        limit,
      });

      return {
        bids: (response.pricebook?.bids || []).map((b: any) => ({
          price: b.price,
          size: b.size,
        })),
        asks: (response.pricebook?.asks || []).map((a: any) => ({
          price: a.price,
          size: a.size,
        })),
      };
    } catch (error) {
      this.logger.error(`Failed to get order book for ${productId}`, error);
      throw error;
    }
  }
}

