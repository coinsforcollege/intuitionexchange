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
  commission?: string; // Coinbase trading fee in quote currency
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
   * Format order size to avoid scientific notation and ensure proper precision
   * Coinbase requires order sizes to be in fixed decimal format, not scientific notation
   * @param size - The order size to format
   * @param increment - The minimum increment allowed (e.g., 0.01 for USD, 0.00000001 for BTC)
   * @returns Formatted size string matching Coinbase precision requirements
   */
  private formatOrderSize(size: string | number, increment?: number): string {
    // Convert to number if it's a string
    const numSize = typeof size === 'string' ? parseFloat(size) : size;
    
    // Check if the number is valid
    if (isNaN(numSize) || !isFinite(numSize) || numSize <= 0) {
      throw new Error(`Invalid order size: ${size}`);
    }

    // If increment is provided, round to the nearest increment
    if (increment && increment > 0) {
      // Calculate decimal places from increment
      // Use logarithm to determine precision: log10(1/increment) gives decimal places
      let decimalPlaces = 0;
      
      if (increment >= 1) {
        // For increments >= 1, no decimal places needed
        decimalPlaces = 0;
      } else {
        // Calculate decimal places using logarithm
        // For 0.01: log10(1/0.01) = log10(100) = 2
        // For 1e-8: log10(1/1e-8) = log10(100000000) = 8
        const logValue = Math.log10(1 / increment);
        decimalPlaces = Math.ceil(logValue);
        
        // Clamp to reasonable range (0-18 decimals)
        decimalPlaces = Math.max(0, Math.min(18, decimalPlaces));
        
        // Verify by checking if increment * 10^decimalPlaces is close to an integer
        // This handles floating point precision issues
        const multiplier = Math.pow(10, decimalPlaces);
        const checkValue = increment * multiplier;
        // If not close to integer, we might need more precision
        if (Math.abs(checkValue - Math.round(checkValue)) > 0.0001) {
          // Try one more decimal place
          decimalPlaces = Math.min(18, decimalPlaces + 1);
        }
      }
      
      // Round to the calculated decimal places
      const rounded = Math.round(numSize * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
      
      // Safety check: if rounding resulted in zero but original was not zero, there's a precision issue
      if (rounded === 0 && numSize > 0) {
        this.logger.warn(`Rounding ${numSize} with increment ${increment} (${decimalPlaces} decimals) resulted in 0. Using original value with calculated precision.`);
        // Fall back to formatting original value with calculated decimal places
        const formatted = numSize.toFixed(decimalPlaces);
        return formatted.replace(/\.?0+$/, '');
      }
      
      // Format with the calculated decimal places
      const formatted = rounded.toFixed(decimalPlaces);
      
      // Remove trailing zeros for cleaner output, but ensure we don't return empty string
      const result = formatted.replace(/\.?0+$/, '');
      return result || '0';
    }

    // Default behavior: avoid scientific notation, use reasonable precision
    const str = numSize.toString();
    
    // If it's already in scientific notation, convert it
    if (str.includes('e') || str.includes('E')) {
      // Use toFixed with max decimals, then remove trailing zeros
      const fixed = numSize.toFixed(18);
      return fixed.replace(/\.?0+$/, '');
    }
    
    return str;
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
      // Fetch product details to get precision requirements and minimum order size
      let quoteIncrement: number | undefined;
      let baseIncrement: number | undefined;
      let minMarketFunds: number | undefined;
      let productPrice: number | undefined;
      
      try {
        const product = await this.client.getProduct({ product_id: productId });
        // Coinbase products have quote_increment, base_increment, and min_market_funds fields
        quoteIncrement = product.quote_increment ? parseFloat(product.quote_increment) : undefined;
        baseIncrement = product.base_increment ? parseFloat(product.base_increment) : undefined;
        minMarketFunds = product.min_market_funds ? parseFloat(product.min_market_funds) : undefined;
        productPrice = product.price ? parseFloat(product.price) : undefined;
        
        this.logger.log(`Product ${productId} increments: quote=${quoteIncrement}, base=${baseIncrement}, min_market_funds=${minMarketFunds}, price=${productPrice}`);
      } catch (error) {
        this.logger.warn(`Failed to fetch product details for ${productId}, using default precision`, error);
        // Fallback: use common defaults
        // USD typically has 0.01 increment (2 decimals)
        if (productId.includes('-USD')) {
          quoteIncrement = 0.01;
        }
      }

      // Generate client_order_id with required "cbnode" prefix
      // Coinbase requires client_order_id to be prefixed with "cbnode"
      const clientOrderId = `cbnode-intuition-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const orderConfig: any = {
        client_order_id: clientOrderId,
        product_id: productId,
        side,
        order_configuration: {
          market_market_ioc: {},
        },
      };

      if (side === 'BUY' && quoteSize) {
        // Format quote size to match product's quote_increment precision
        const formattedQuoteSize = this.formatOrderSize(quoteSize, quoteIncrement);
        
        // Check minimum order size
        const quoteSizeNum = parseFloat(formattedQuoteSize);
        if (minMarketFunds && quoteSizeNum < minMarketFunds) {
          this.logger.error(`Order size ${formattedQuoteSize} is below minimum ${minMarketFunds} for ${productId}`);
          throw new Error(`Order size is too small. Minimum order size is ${minMarketFunds} ${productId.split('-')[1]}.`);
        }
        
        orderConfig.order_configuration.market_market_ioc.quote_size = formattedQuoteSize;
        this.logger.log(`Formatted quote_size: ${quoteSize} -> ${formattedQuoteSize} (increment: ${quoteIncrement}, min: ${minMarketFunds})`);
      } else if (side === 'SELL' && baseSize) {
        // Format base size to match product's base_increment precision
        const formattedBaseSize = this.formatOrderSize(baseSize, baseIncrement);
        
        // For SELL orders, we need to estimate the quote value to check minimum
        if (minMarketFunds && productPrice) {
          const baseSizeNum = parseFloat(formattedBaseSize);
          const estimatedQuoteValue = baseSizeNum * productPrice;
          
          if (estimatedQuoteValue < minMarketFunds) {
            this.logger.error(`Estimated order value ${estimatedQuoteValue} is below minimum ${minMarketFunds} for ${productId}`);
            throw new Error(`Order size is too small. Minimum order value is ${minMarketFunds} ${productId.split('-')[1]}.`);
          }
        }
        
        orderConfig.order_configuration.market_market_ioc.base_size = formattedBaseSize;
        this.logger.log(`Formatted base_size: ${baseSize} -> ${formattedBaseSize} (increment: ${baseIncrement}, min: ${minMarketFunds})`);
      } else {
        throw new Error('Invalid order parameters');
      }

      const response = await this.client.submitOrder(orderConfig);
      
      this.logger.log(`Order submitted: ${JSON.stringify(response)}`);

      // Check for error response from Coinbase
      if (response?.error_response || response?.success === false) {
        const errorMsg = response?.error_response?.message || 'Order submission failed';
        const errorCode = response?.error_response?.error || 'UNKNOWN_ERROR';
        this.logger.error(`Coinbase order error: ${errorCode} - ${errorMsg}`);
        // Return generic error message for users, log technical details
        throw new Error('Unable to process trade at this time. Please try again later.');
      }

      // Handle different response structures for successful orders
      const orderId = 
        response?.order_id || 
        response?.success_response?.order_id ||
        response?.order?.order_id ||
        response?.data?.order_id;

      if (!orderId) {
        this.logger.warn('Order submitted but no order_id in response', response);
        throw new Error('Order submitted but no order ID returned from Coinbase');
      }

      return {
        orderId,
        success: true,
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
        commission: o.commission || '0',
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
      const response = await this.client.getOrder({ order_id: orderId });
      
      // Handle nested response structure: { order: { ... } } or direct order object
      const order = response?.order || response;

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
        commission: order.commission || '0',
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

