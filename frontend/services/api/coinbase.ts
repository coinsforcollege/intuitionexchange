/**
 * Coinbase API Service
 * Handles all Coinbase trading-related API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types
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

// Internal order (from our database)
export interface InternalOrder {
  id: string;
  productId: string;
  asset: string;
  quote: string;
  side: 'BUY' | 'SELL';
  requestedAmount: number;
  filledAmount: number;
  price: number;
  totalValue: number;
  platformFee: number;
  exchangeFee: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  coinbaseOrderId: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface CoinbaseAccount {
  uuid: string;
  name: string;
  currency: string;
  available_balance: { value: string; currency: string };
  hold: { value: string; currency: string };
}

export interface OrderBook {
  bids: Array<{ price: string; size: string }>;
  asks: Array<{ price: string; size: string }>;
}

export interface PublicTrade {
  trade_id: string;
  product_id: string;
  price: string;
  size: string;
  time: string;
  side: string;
}

// Helper for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error [${response.status}] ${endpoint}:`, data);
      throw new Error(data.message || `API request failed: ${response.status}`);
    }

    return data;
  } catch (error: any) {
    // Network error or JSON parse error
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Backend server is not running. Please start the backend.');
    }
    throw error;
  }
}

/**
 * Get all available trading products
 */
export async function getProducts(quoteCurrency?: string): Promise<CoinbaseProduct[]> {
  const query = quoteCurrency ? `?quote=${quoteCurrency}` : '';
  const data = await apiCall<{ success: boolean; products: CoinbaseProduct[] }>(
    `/coinbase/products${query}`,
  );
  return data.products;
}

/**
 * Get single product details with current price
 */
export async function getProduct(productId: string): Promise<CoinbaseProduct> {
  const data = await apiCall<{ success: boolean; product: CoinbaseProduct }>(
    `/coinbase/products/${productId}`,
  );
  return data.product;
}

/**
 * Get candle data for charts
 */
export async function getCandles(
  productId: string,
  granularity: 'ONE_MINUTE' | 'FIVE_MINUTE' | 'FIFTEEN_MINUTE' | 'ONE_HOUR' | 'SIX_HOUR' | 'ONE_DAY' = 'ONE_HOUR',
  start?: number,
  end?: number,
): Promise<CoinbaseCandle[]> {
  const params = new URLSearchParams({ granularity });
  if (start) params.append('start', start.toString());
  if (end) params.append('end', end.toString());

  const data = await apiCall<{ success: boolean; candles: CoinbaseCandle[] }>(
    `/coinbase/candles/${productId}?${params.toString()}`,
  );
  return data.candles;
}

/**
 * Get account balances
 */
export async function getAccounts(): Promise<CoinbaseAccount[]> {
  const data = await apiCall<{ success: boolean; accounts: CoinbaseAccount[] }>(
    '/coinbase/accounts',
  );
  return data.accounts;
}

/**
 * Place a market order (uses internal orders API)
 */
export async function placeOrder(
  productId: string,
  side: 'BUY' | 'SELL',
  amount: number,
): Promise<{ order: InternalOrder; success: boolean }> {
  const data = await apiCall<{ success: boolean; order: InternalOrder }>(
    '/orders',
    {
      method: 'POST',
      body: JSON.stringify({ productId, side, amount }),
    },
  );
  return { order: data.order, success: data.success };
}

/**
 * Get user's order history (from our database)
 */
export async function getOrders(
  productId?: string,
  limit = 50,
): Promise<InternalOrder[]> {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (productId) params.append('productId', productId);

  const data = await apiCall<{ success: boolean; orders: InternalOrder[]; total: number }>(
    `/orders?${params.toString()}`,
  );
  return data.orders;
}

/**
 * Get single order details (from our database)
 */
export async function getOrder(orderId: string): Promise<InternalOrder> {
  const data = await apiCall<{ success: boolean; order: InternalOrder }>(
    `/orders/${orderId}`,
  );
  return data.order;
}

/**
 * Get order book (bids and asks)
 */
export async function getOrderBook(productId: string, limit = 25): Promise<OrderBook> {
  const data = await apiCall<{ success: boolean; orderBook: OrderBook }>(
    `/coinbase/orderbook/${productId}?limit=${limit}`,
  );
  return data.orderBook;
}

/**
 * Get recent public trades
 */
export async function getPublicTrades(productId: string, limit = 50): Promise<PublicTrade[]> {
  const data = await apiCall<{ success: boolean; trades: PublicTrade[] }>(
    `/coinbase/trades/${productId}?limit=${limit}`,
  );
  return data.trades;
}

/**
 * Get crypto icon URL from CoinGecko/CryptoCompare CDN
 */
export function getCryptoIconUrl(symbol: string): string {
  // Use CryptoCompare CDN for icons
  const symbolLower = symbol.toLowerCase();
  return `https://assets.coincap.io/assets/icons/${symbolLower}@2x.png`;
}

/**
 * Fallback icon URL if primary fails
 */
export function getCryptoIconFallback(symbol: string): string {
  const symbolLower = symbol.toLowerCase();
  return `https://cryptoicons.org/api/icon/${symbolLower}/200`;
}

