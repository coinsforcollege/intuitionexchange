'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { message } from 'antd';
import {
  getProducts,
  getCandles,
  getOrders,
  placeOrder,
  getOrderBook,
  getPublicTrades,
  CoinbaseCandle,
  InternalOrder,
  OrderBook,
  PublicTrade,
} from '@/services/api/coinbase';
import { getBalances, Balance } from '@/services/api/assets';

// Coinbase fee rate (typically 0.5% for market orders, but may vary)
// This is used for quote calculations. Actual fees are returned in order responses.
const COINBASE_FEE_RATE = 0.005; // 0.5%

// WebSocket URL - use environment variable or default to localhost
// Only connect if explicitly configured or in development
const WS_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_WS_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : null))
  : null;

interface PriceUpdate {
  product_id: string;
  price: string;
  price_percentage_change_24h: string;
  volume_24h: string;
  timestamp: number;
}

interface TradingPair {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  quote: string;
  baseCurrency: string;
  quoteCurrency: string;
  iconUrl: string;
}

interface ExchangeContextType {
  // Products/Pairs
  pairs: TradingPair[];
  isLoadingPairs: boolean;
  selectedPair: string;
  setSelectedPair: (pair: string) => void;
  currentPairData: TradingPair | null;
  
  // Price data
  currentPrice: number;
  priceChange: number;
  currentUsdVolume: number;
  
  // WebSocket status
  isConnected: boolean;
  
  // Candles for chart
  candles: CoinbaseCandle[];
  isLoadingCandles: boolean;
  candleGranularity: string;
  setCandleGranularity: (gran: string) => void;
  
  // Accounts/Balances
  balances: Balance[];
  isLoadingBalances: boolean;
  getBalance: (currency: string) => number;
  
  // Orders
  orders: InternalOrder[];
  isLoadingOrders: boolean;
  
  // Public trades
  publicTrades: PublicTrade[];
  isLoadingTrades: boolean;
  
  // Order book
  orderBook: OrderBook | null;
  isLoadingOrderBook: boolean;
  
  // Trading
  executeTrade: (side: 'BUY' | 'SELL', amount: number, total: number) => Promise<{ success: boolean; order?: InternalOrder }>;
  isTrading: boolean;
  
  // Refresh functions
  refreshProducts: () => Promise<void>;
  refreshCandles: () => Promise<void>;
  refreshBalances: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshTrades: () => Promise<void>;
  refreshOrderBook: () => Promise<void>;
}

const ExchangeContext = createContext<ExchangeContextType | null>(null);

export const useExchange = () => {
  const context = useContext(ExchangeContext);
  if (!context) {
    throw new Error('useExchange must be used within ExchangeProvider');
  }
  return context;
};

// Format volume to human readable
function formatVolume(volume: string): string {
  const num = parseFloat(volume);
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toFixed(0);
}

// Get icon URL
function getIconUrl(symbol: string): string {
  const s = symbol.toLowerCase();
  return `https://assets.coincap.io/assets/icons/${s}@2x.png`;
}

export const ExchangeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  const [isLoadingPairs, setIsLoadingPairs] = useState(true);
  const [selectedPair, setSelectedPair] = useState('BTC-USD');
  const [isConnected, setIsConnected] = useState(false);
  
  const [candles, setCandles] = useState<CoinbaseCandle[]>([]);
  const [isLoadingCandles, setIsLoadingCandles] = useState(false);
  const [candleGranularity, setCandleGranularity] = useState('1H');
  
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  
  const [orders, setOrders] = useState<InternalOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  
  const [publicTrades, setPublicTrades] = useState<PublicTrade[]>([]);
  const [isLoadingTrades, setIsLoadingTrades] = useState(false);
  
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  const [isLoadingOrderBook, setIsLoadingOrderBook] = useState(false);
  
  const [isTrading, setIsTrading] = useState(false);
  
  // WebSocket ref
  const socketRef = useRef<Socket | null>(null);
  
  // Store base product info (without prices) for merging with WS updates
  const baseProductsRef = useRef<Map<string, Omit<TradingPair, 'price' | 'change' | 'volume'>>>(new Map());
  
  // Store latest pairs in ref to avoid recreating callbacks on every price update
  const pairsRef = useRef<TradingPair[]>([]);

  // Derived state
  const currentPairData = pairs.find(p => p.symbol === selectedPair) || null;
  const currentPrice = currentPairData?.price || 0;
  const priceChange = currentPairData?.change || 0;
  
  // Calculate USD trading volume for current pair
  const getUsdVolume = (pair: TradingPair | null): number => {
    if (!pair || !pair.price || pair.price <= 0) return 0;
    const rawVolume = (pair as any)._rawVolume24h;
    if (rawVolume) return rawVolume * pair.price;
    // Fallback: parse from formatted volume string (less accurate)
    const volStr = pair.volume.replace(/[BMK]/g, '');
    const volNum = parseFloat(volStr) || 0;
    if (pair.volume.includes('B')) return volNum * 1e9 * pair.price;
    if (pair.volume.includes('M')) return volNum * 1e6 * pair.price;
    if (pair.volume.includes('K')) return volNum * 1e3 * pair.price;
    return volNum * pair.price;
  };
  
  const currentUsdVolume = getUsdVolume(currentPairData);

  // Fetch all products (initial load only)
  const refreshProducts = useCallback(async () => {
    try {
      setIsLoadingPairs(true);
      const products = await getProducts();
      
      // Filter to major quote currencies
      const quoteCurrencies = ['USD', 'USDT', 'ETH'];
      const filteredProducts = products.filter(p => 
        quoteCurrencies.includes(p.quote_currency)
      );

      // Store base product info
      const baseProducts = new Map<string, Omit<TradingPair, 'price' | 'change' | 'volume'>>();
      
      // First, transform all Coinbase pairs
      const transformedPairs: TradingPair[] = filteredProducts.map(p => {
        const baseInfo = {
          symbol: p.product_id,
          name: p.base_name,
          quote: p.quote_currency,
          baseCurrency: p.base_currency,
          quoteCurrency: p.quote_currency,
          iconUrl: getIconUrl(p.base_currency),
        };
        baseProducts.set(p.product_id, baseInfo);
        
        const price = parseFloat(p.price) || 0;
        const volume24h = parseFloat(p.volume_24h) || 0;
        
        return {
          ...baseInfo,
          price,
          change: parseFloat(p.price_percentage_change_24h) || 0,
          volume: formatVolume(p.volume_24h),
          // Store raw values for sorting
          _rawVolume24h: volume24h,
          _usdVolume: volume24h * price,
        };
      });

      // Create a map of USD pairs for cross-rate calculation
      const usdPairs = new Map<string, TradingPair>();
      transformedPairs.forEach(pair => {
        if (pair.quote === 'USD') {
          usdPairs.set(pair.baseCurrency, pair);
        }
      });

      // Get ETH-USD and USDT-USD prices for cross-rate calculation
      const ethUsd = usdPairs.get('ETH');
      const usdtUsd = usdPairs.get('USDT');

      // Generate synthetic ETH pairs (BASE-ETH = BASE-USD / ETH-USD)
      if (ethUsd && ethUsd.price > 0) {
        usdPairs.forEach((usdPair, baseCurrency) => {
          // Skip if already exists or if base is ETH itself
          if (baseCurrency === 'ETH' || transformedPairs.some(p => p.symbol === `${baseCurrency}-ETH`)) {
            return;
          }
          
          const crossPrice = usdPair.price / ethUsd.price;
          const crossVolume24h = usdPair._rawVolume24h || 0;
          // For cross pairs, use USD volume (since we're converting from USD)
          const crossUsdVolume = crossVolume24h * usdPair.price;
          
          transformedPairs.push({
            symbol: `${baseCurrency}-ETH`,
            name: usdPair.name,
            quote: 'ETH',
            baseCurrency: baseCurrency,
            quoteCurrency: 'ETH',
            iconUrl: getIconUrl(baseCurrency),
            price: crossPrice,
            change: usdPair.change, // Use same change as USD pair
            volume: formatVolume(crossVolume24h.toString()),
            _rawVolume24h: crossVolume24h,
            _usdVolume: crossUsdVolume,
          });
        });
      }

      // Generate synthetic USDT pairs (BASE-USDT = BASE-USD / USDT-USD)
      if (usdtUsd && usdtUsd.price > 0) {
        usdPairs.forEach((usdPair, baseCurrency) => {
          // Skip if already exists or if base is USDT itself
          if (baseCurrency === 'USDT' || transformedPairs.some(p => p.symbol === `${baseCurrency}-USDT`)) {
            return;
          }
          
          const crossPrice = usdPair.price / usdtUsd.price;
          const crossVolume24h = usdPair._rawVolume24h || 0;
          // For cross pairs, use USD volume (since we're converting from USD)
          const crossUsdVolume = crossVolume24h * usdPair.price;
          
          transformedPairs.push({
            symbol: `${baseCurrency}-USDT`,
            name: usdPair.name,
            quote: 'USDT',
            baseCurrency: baseCurrency,
            quoteCurrency: 'USDT',
            iconUrl: getIconUrl(baseCurrency),
            price: crossPrice,
            change: usdPair.change, // Use same change as USD pair
            volume: formatVolume(crossVolume24h.toString()),
            _rawVolume24h: crossVolume24h,
            _usdVolume: crossUsdVolume,
          });
        });
      }

      baseProductsRef.current = baseProducts;

      // Sort by USD trading volume (volume_24h × price)
      transformedPairs.sort((a, b) => {
        return (b as any)._usdVolume - (a as any)._usdVolume;
      });
      
      // Keep _rawVolume24h and _usdVolume for later use (don't delete)

      setPairs(transformedPairs);
      pairsRef.current = transformedPairs;
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoadingPairs(false);
    }
  }, []);

  // Handle WebSocket price updates
  const handlePriceUpdate = useCallback((pricesData: Record<string, PriceUpdate>) => {
    setPairs(prevPairs => {
      const updated = prevPairs.map(pair => {
        const update = pricesData[pair.symbol];
        if (update) {
          return {
            ...pair,
            price: parseFloat(update.price) || pair.price,
            change: parseFloat(update.price_percentage_change_24h) || pair.change,
            volume: formatVolume(update.volume_24h),
          };
        }
        return pair;
      });
      pairsRef.current = updated;
      return updated;
    });
  }, []);

  // Connect to WebSocket
  useEffect(() => {
    // Only connect if WS_URL is defined and we're in the browser
    if (typeof window === 'undefined' || !WS_URL || WS_URL === 'undefined') {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ WebSocket URL not configured, skipping connection');
      }
      return;
    }

    let socket: Socket | null = null;
    let isMounted = true;

    const connectSocket = () => {
      try {
        socket = io(`${WS_URL}/prices`, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 2000,
          reconnectionDelayMax: 10000,
          timeout: 10000,
          autoConnect: true,
        });

        if (!isMounted) {
          socket.disconnect();
          return;
        }

        socketRef.current = socket;

        socket.on('connect', () => {
          if (isMounted) {
            console.log('🔌 WebSocket connected');
            setIsConnected(true);
          }
        });

        socket.on('disconnect', (reason) => {
          if (isMounted) {
            console.log('🔌 WebSocket disconnected:', reason);
            setIsConnected(false);
          }
        });

        socket.on('prices', (data: Record<string, PriceUpdate>) => {
          if (isMounted) {
            handlePriceUpdate(data);
          }
        });

        socket.on('connect_error', (error) => {
          // Silently handle connection errors - don't spam console
          if (isMounted && process.env.NODE_ENV === 'development') {
            console.warn('WebSocket connection error (will retry):', error.message);
          }
          if (isMounted) {
            setIsConnected(false);
          }
        });

        // Suppress WebSocket errors from showing in console
        socket.io.on('error', (error: Error) => {
          // Only log in development
          if (isMounted && process.env.NODE_ENV === 'development') {
            console.warn('WebSocket IO error:', error.message);
          }
        });
      } catch (error) {
        if (isMounted && process.env.NODE_ENV === 'development') {
          console.error('Failed to initialize WebSocket:', error);
        }
        if (isMounted) {
          setIsConnected(false);
        }
      }
    };

    connectSocket();

    return () => {
      isMounted = false;
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [handlePriceUpdate]);

  // Fetch candles for chart
  const refreshCandles = useCallback(async () => {
    if (!selectedPair) return;
    
    try {
      setIsLoadingCandles(true);
      const granMap: Record<string, 'ONE_MINUTE' | 'FIVE_MINUTE' | 'FIFTEEN_MINUTE' | 'ONE_HOUR' | 'SIX_HOUR' | 'ONE_DAY'> = {
        '1M': 'ONE_MINUTE',
        '5M': 'FIVE_MINUTE',
        '15M': 'FIFTEEN_MINUTE',
        '1H': 'ONE_HOUR',
        '4H': 'SIX_HOUR',
        '1D': 'ONE_DAY',
      };
      const gran = granMap[candleGranularity] || 'ONE_HOUR';
      
      // Calculate time range - Coinbase limits to 350 candles max
      const now = Math.floor(Date.now() / 1000);
      let start: number;
      switch (candleGranularity) {
        case '1M': start = now - 60 * 300; break;
        case '5M': start = now - 5 * 60 * 300; break;
        case '15M': start = now - 15 * 60 * 300; break;
        case '1H': start = now - 60 * 60 * 300; break;
        case '4H': start = now - 6 * 60 * 60 * 300; break;
        case '1D': start = now - 24 * 60 * 60 * 300; break;
        default: start = now - 60 * 60 * 100;
      }
      
      // For synthetic pairs (ETH/USDT quotes), fetch USD pair candles and convert
      const [baseAsset, quoteAsset] = selectedPair.split('-');
      let coinbasePair = selectedPair;
      let conversionRate = 1;
      
      // Use ref to get latest pairs without causing callback recreation
      const currentPairs = pairsRef.current;
      const currentPair = currentPairs.find(p => p.symbol === selectedPair);
      const isSynthetic = (quoteAsset === 'ETH' || quoteAsset === 'USDT') && currentPair;
      
      if (isSynthetic) {
        // Use base-USD pair for candles (Coinbase doesn't have ETH/USDT quote pairs)
        coinbasePair = `${baseAsset}-USD`;
        
        // Get conversion rate: 1 USD = ? ETH or ? USDT
        const quoteUsdPair = currentPairs.find(p => p.symbol === `${quoteAsset}-USD`);
        if (quoteUsdPair && quoteUsdPair.price > 0) {
          conversionRate = 1 / quoteUsdPair.price; // Convert USD price to quote currency
        }
      }
      
      const candleData = await getCandles(coinbasePair, gran, start, now);
      
      // Convert candle prices if synthetic pair
      const convertedCandles = isSynthetic ? candleData.map(candle => ({
        ...candle,
        open: (parseFloat(candle.open) * conversionRate).toString(),
        high: (parseFloat(candle.high) * conversionRate).toString(),
        low: (parseFloat(candle.low) * conversionRate).toString(),
        close: (parseFloat(candle.close) * conversionRate).toString(),
      })) : candleData;
      
      setCandles(convertedCandles);
    } catch (error) {
      console.error('Failed to fetch candles:', error);
      setCandles([]);
    } finally {
      setIsLoadingCandles(false);
    }
  }, [selectedPair, candleGranularity]);

  // Fetch balances from our ledger
  const refreshBalances = useCallback(async () => {
    try {
      setIsLoadingBalances(true);
      const balanceData = await getBalances();
      setBalances(balanceData);
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    } finally {
      setIsLoadingBalances(false);
    }
  }, []);

  // Fetch orders
  const refreshOrders = useCallback(async () => {
    try {
      setIsLoadingOrders(true);
      const { orders: orderData } = await getOrders({ limit: 50 });
      setOrders(orderData);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  // Fetch public trades
  const refreshTrades = useCallback(async () => {
    if (!selectedPair) return;
    try {
      setIsLoadingTrades(true);
      
      // For synthetic pairs (ETH/USDT quotes), fetch USD pair trades and convert
      const [baseAsset, quoteAsset] = selectedPair.split('-');
      const currentPairs = pairsRef.current;
      const currentPair = currentPairs.find(p => p.symbol === selectedPair);
      const isSynthetic = (quoteAsset === 'ETH' || quoteAsset === 'USDT') && currentPair;
      
      let coinbasePair = selectedPair;
      let conversionRate = 1;
      
      if (isSynthetic) {
        // Use base-USD pair for trades (Coinbase doesn't have ETH/USDT quote pairs)
        coinbasePair = `${baseAsset}-USD`;
        
        // Get conversion rate: 1 USD = ? ETH or ? USDT
        const quoteUsdPair = currentPairs.find(p => p.symbol === `${quoteAsset}-USD`);
        if (quoteUsdPair && quoteUsdPair.price > 0) {
          conversionRate = 1 / quoteUsdPair.price; // Convert USD price to quote currency
        }
      }
      
      const tradesData = await getPublicTrades(coinbasePair, 50);
      
      // Convert trade prices if synthetic pair
      const convertedTrades = isSynthetic ? tradesData.map(trade => ({
        ...trade,
        price: (parseFloat(trade.price) * conversionRate).toString(),
      })) : tradesData;
      
      setPublicTrades(convertedTrades);
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    } finally {
      setIsLoadingTrades(false);
    }
  }, [selectedPair]);

  // Fetch order book
  const refreshOrderBook = useCallback(async () => {
    if (!selectedPair) return;
    try {
      setIsLoadingOrderBook(true);
      
      // For synthetic pairs (ETH/USDT quotes), fetch USD pair order book and convert
      const [baseAsset, quoteAsset] = selectedPair.split('-');
      const currentPairs = pairsRef.current;
      const currentPair = currentPairs.find(p => p.symbol === selectedPair);
      const isSynthetic = (quoteAsset === 'ETH' || quoteAsset === 'USDT') && currentPair;
      
      let coinbasePair = selectedPair;
      let conversionRate = 1;
      
      if (isSynthetic) {
        // Use base-USD pair for order book (Coinbase doesn't have ETH/USDT quote pairs)
        coinbasePair = `${baseAsset}-USD`;
        
        // Get conversion rate: 1 USD = ? ETH or ? USDT
        const quoteUsdPair = currentPairs.find(p => p.symbol === `${quoteAsset}-USD`);
        if (quoteUsdPair && quoteUsdPair.price > 0) {
          conversionRate = 1 / quoteUsdPair.price; // Convert USD price to quote currency
        }
      }
      
      const bookData = await getOrderBook(coinbasePair, 15);
      
      // Convert order book prices if synthetic pair
      const convertedBook = isSynthetic ? {
        ...bookData,
        bids: bookData.bids.map(bid => ({
          ...bid,
          price: (parseFloat(bid.price) * conversionRate).toString(),
        })),
        asks: bookData.asks.map(ask => ({
          ...ask,
          price: (parseFloat(ask.price) * conversionRate).toString(),
        })),
      } : bookData;
      
      setOrderBook(convertedBook);
    } catch (error) {
      console.error('Failed to fetch order book:', error);
    } finally {
      setIsLoadingOrderBook(false);
    }
  }, [selectedPair]);

  // Get balance for a currency
  const getBalance = useCallback((currency: string): number => {
    const balance = balances.find(b => b.asset === currency.toUpperCase());
    return balance ? balance.availableBalance : 0;
  }, [balances]);

  // Execute trade
  const executeTrade = useCallback(async (
    side: 'BUY' | 'SELL',
    amount: number,
    total: number,
  ): Promise<{ success: boolean; order?: InternalOrder }> => {
    if (!currentPairData) return { success: false };
    
    try {
      setIsTrading(true);
      
      const [baseAsset, quoteAsset] = selectedPair.split('-');
      const currentPairs = pairsRef.current;
      
      // Check if this is a synthetic pair (ETH or USDT quote, not directly on Coinbase)
      // All pairs with ETH or USDT as quote are synthetic (converted from USD pairs)
      const isSynthetic = (quoteAsset === 'ETH' || quoteAsset === 'USDT') && quoteAsset !== 'USD';
      
      if (isSynthetic) {
        // Validate minimum order size: Synthetic pairs must be at least $1 USD
        const quoteUsdPair = currentPairs.find(p => p.symbol === `${quoteAsset}-USD`);
        if (!quoteUsdPair) {
          console.error(`${quoteAsset}-USD pair not found`);
          return { success: false };
        }
        
        let usdValue: number;
        if (side === 'BUY') {
          // total is in quote currency (ETH/USDT), convert to USD
          usdValue = total * quoteUsdPair.price;
        } else {
          // SELL: amount is in base currency, total is expected quote currency value
          // Convert total (in quote currency) to USD
          usdValue = total * quoteUsdPair.price;
        }
        
        if (usdValue < 1) {
          const errorMsg = `Order size is too small. Minimum order size is $1.00 USD. Your order value is $${usdValue.toFixed(2)} USD.`;
          message.error(errorMsg);
          return { success: false };
        }
        
        // For synthetic pairs, do 2-step conversion via USD
        // Example: SOL-ETH -> SOL-USD then ETH-USD
        
        let lastOrder: InternalOrder | undefined;
        
        // Step 1: Convert to/from USD
        if (side === 'BUY') {
          // BUY XRP-ETH means: Buy XRP, paying with ETH
          // total is the amount in quote currency (ETH), not USD
          
          // total is already in the quote currency (ETH), so we sell that amount directly
          const quoteAmountToSell = total; // This is the ETH amount the user wants to spend
          
          // Sell quote asset to get USD
          const sellResult = await placeOrder(
            `${quoteAsset}-USD`,
            'SELL',
            quoteAmountToSell, // base size in quote currency (ETH)
          );
          
          if (!sellResult.success) {
            return { success: false };
          }
          
          // Step 2: Buy base asset with USD
          const baseUsdPair = currentPairs.find(p => p.symbol === `${baseAsset}-USD`);
          if (!baseUsdPair) {
            console.error(`${baseAsset}-USD pair not found`);
            return { success: false };
          }
          
          // Calculate USD value: convert ETH to USD, then apply fee estimate
          // total (ETH) * ETH-USD price = USD value, then subtract estimated fee
          const estimatedUsdValue = total * quoteUsdPair.price;
          const estimatedUsdAfterFees = estimatedUsdValue * 0.995; // 0.5% fee estimate
          
          // Buy base asset with the USD we got
          const buyResult = await placeOrder(
            `${baseAsset}-USD`,
            'BUY',
            estimatedUsdAfterFees, // quote size in USD
          );
          
          if (!buyResult.success) {
            return { success: false };
          }
          
          // Return the last order (buy order) for tracking
          lastOrder = buyResult.order;
        } else {
          // SELL XRP-ETH means: Sell XRP, receiving ETH
          // amount is in base currency (XRP), total is expected ETH received
          
          // Step 1: Sell base asset to get USD
          const baseUsdPair = currentPairs.find(p => p.symbol === `${baseAsset}-USD`);
          if (!baseUsdPair) {
            console.error(`${baseAsset}-USD pair not found`);
            return { success: false };
          }
          
          // Sell base asset (amount is in base currency)
          const sellResult = await placeOrder(
            `${baseAsset}-USD`,
            'SELL',
            amount, // base size (XRP)
          );
          
          if (!sellResult.success) {
            return { success: false };
          }
          
          // Step 2: Buy quote asset (ETH) with USD
          const quoteUsdPair = currentPairs.find(p => p.symbol === `${quoteAsset}-USD`);
          if (!quoteUsdPair) {
            console.error(`${quoteAsset}-USD pair not found`);
            return { success: false };
          }
          
          // Calculate USD value: convert base asset to USD, then apply fee estimate
          // amount (XRP) * XRP-USD price = USD value, then subtract estimated fee
          const estimatedUsdValue = amount * baseUsdPair.price;
          const estimatedUsdAfterFees = estimatedUsdValue * 0.995; // 0.5% fee estimate
          
          // Buy quote asset with the USD we got
          const buyResult = await placeOrder(
            `${quoteAsset}-USD`,
            'BUY',
            estimatedUsdAfterFees, // quote size in USD
          );
          
          if (!buyResult.success) {
            return { success: false };
          }
          
          // Return the last order (buy order) for tracking
          lastOrder = buyResult.order;
        }
        
        // Refresh balances and orders after successful trade
        await Promise.all([refreshBalances(), refreshOrders()]);
        
        // Return the last order so modal can track it
        return { success: true, order: lastOrder };
      } else {
        // Direct pair (e.g., BTC-USD) - single order
        // For BUY: amount is in quote currency (USD), for SELL: amount is in base currency (BTC)
        const orderAmount = side === 'BUY' ? total : amount;
        
        const result = await placeOrder(
          selectedPair,
          side,
          orderAmount,
        );
        
        if (!result.success) {
          // Return false with error - don't throw to prevent Next.js overlay
          // The error message will be shown by the caller
          return { success: false };
        }
        
        // Return the order so the caller can show the modal immediately
        return { success: true, order: result.order };
      }
    } catch (error: any) {
      // Log error for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.error('Trade failed:', error);
      }
      // Return false instead of throwing to prevent Next.js overlay
      // The error message will be shown by the caller
      return { success: false };
    } finally {
      setIsTrading(false);
    }
  }, [selectedPair, currentPairData, refreshBalances, refreshOrders]);

  // Initial load
  useEffect(() => {
    refreshProducts();
    refreshBalances();
  }, [refreshProducts, refreshBalances]);

  // Fetch candles when pair or granularity changes
  useEffect(() => {
    if (!isLoadingPairs && selectedPair) {
      refreshCandles();
    }
  }, [selectedPair, candleGranularity, isLoadingPairs, refreshCandles]);

  // Fetch trades and order book when pair changes
  useEffect(() => {
    if (!isLoadingPairs && selectedPair) {
      refreshTrades();
      refreshOrderBook();
    }
  }, [selectedPair, isLoadingPairs, refreshTrades, refreshOrderBook]);

  const value: ExchangeContextType = {
    pairs,
    isLoadingPairs,
    selectedPair,
    setSelectedPair,
    currentPairData,
    currentPrice,
    priceChange,
    currentUsdVolume,
    isConnected,
    candles,
    isLoadingCandles,
    candleGranularity,
    setCandleGranularity,
    balances,
    isLoadingBalances,
    getBalance,
    orders,
    isLoadingOrders,
    publicTrades,
    isLoadingTrades,
    orderBook,
    isLoadingOrderBook,
    executeTrade,
    isTrading,
    refreshProducts,
    refreshCandles,
    refreshBalances,
    refreshOrders,
    refreshTrades,
    refreshOrderBook,
  };

  return (
    <ExchangeContext.Provider value={value}>
      {children}
    </ExchangeContext.Provider>
  );
};
