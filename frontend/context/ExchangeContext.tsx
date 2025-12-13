'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  getProducts,
  getCandles,
  getAccounts,
  getOrders,
  placeOrder,
  getOrderBook,
  getPublicTrades,
  CoinbaseCandle,
  CoinbaseAccount,
  InternalOrder,
  OrderBook,
  PublicTrade,
} from '@/services/api/coinbase';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000';

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
  
  // WebSocket status
  isConnected: boolean;
  
  // Candles for chart
  candles: CoinbaseCandle[];
  isLoadingCandles: boolean;
  candleGranularity: string;
  setCandleGranularity: (gran: string) => void;
  
  // Accounts/Balances
  accounts: CoinbaseAccount[];
  isLoadingAccounts: boolean;
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
  executeTrade: (side: 'BUY' | 'SELL', amount: number, total: number) => Promise<boolean>;
  isTrading: boolean;
  
  // Refresh functions
  refreshProducts: () => Promise<void>;
  refreshCandles: () => Promise<void>;
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
  
  const [accounts, setAccounts] = useState<CoinbaseAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  
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

  // Derived state
  const currentPairData = pairs.find(p => p.symbol === selectedPair) || null;
  const currentPrice = currentPairData?.price || 0;
  const priceChange = currentPairData?.change || 0;

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
        
        return {
          ...baseInfo,
          price: parseFloat(p.price) || 0,
          change: parseFloat(p.price_percentage_change_24h) || 0,
          volume: formatVolume(p.volume_24h),
        };
      });

      baseProductsRef.current = baseProducts;

      // Sort by volume
      transformedPairs.sort((a, b) => {
        const volA = parseFloat(a.volume.replace(/[BMK]/g, '')) || 0;
        const volB = parseFloat(b.volume.replace(/[BMK]/g, '')) || 0;
        return volB - volA;
      });

      setPairs(transformedPairs);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoadingPairs(false);
    }
  }, []);

  // Handle WebSocket price updates
  const handlePriceUpdate = useCallback((pricesData: Record<string, PriceUpdate>) => {
    setPairs(prevPairs => {
      return prevPairs.map(pair => {
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
    });
  }, []);

  // Connect to WebSocket
  useEffect(() => {
    const socket = io(`${WS_URL}/prices`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 WebSocket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('prices', (data: Record<string, PriceUpdate>) => {
      handlePriceUpdate(data);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
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
      
      const candleData = await getCandles(selectedPair, gran, start, now);
      setCandles(candleData);
    } catch (error) {
      console.error('Failed to fetch candles:', error);
      setCandles([]);
    } finally {
      setIsLoadingCandles(false);
    }
  }, [selectedPair, candleGranularity]);

  // Fetch accounts
  const refreshAccounts = useCallback(async () => {
    try {
      setIsLoadingAccounts(true);
      const accountData = await getAccounts();
      setAccounts(accountData);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setIsLoadingAccounts(false);
    }
  }, []);

  // Fetch orders
  const refreshOrders = useCallback(async () => {
    try {
      setIsLoadingOrders(true);
      const orderData = await getOrders(undefined, 50);
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
      const tradesData = await getPublicTrades(selectedPair, 50);
      setPublicTrades(tradesData);
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
      const bookData = await getOrderBook(selectedPair, 15);
      setOrderBook(bookData);
    } catch (error) {
      console.error('Failed to fetch order book:', error);
    } finally {
      setIsLoadingOrderBook(false);
    }
  }, [selectedPair]);

  // Get balance for a currency
  const getBalance = useCallback((currency: string): number => {
    const account = accounts.find(a => a.currency === currency);
    return account ? parseFloat(account.available_balance.value) : 0;
  }, [accounts]);

  // Execute trade
  const executeTrade = useCallback(async (
    side: 'BUY' | 'SELL',
    amount: number,
    total: number,
  ): Promise<boolean> => {
    if (!currentPairData) return false;
    
    try {
      setIsTrading(true);
      
      // For BUY: amount is in quote currency (USD), for SELL: amount is in base currency (BTC)
      const orderAmount = side === 'BUY' ? total : amount;
      
      const result = await placeOrder(
        selectedPair,
        side,
        orderAmount,
      );
      
      if (result.success) {
        await Promise.all([refreshAccounts(), refreshOrders()]);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Trade failed:', error);
      return false;
    } finally {
      setIsTrading(false);
    }
  }, [selectedPair, currentPairData, refreshAccounts, refreshOrders]);

  // Initial load
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Fetch candles when pair or granularity changes
  useEffect(() => {
    if (!isLoadingPairs && pairs.length > 0) {
      refreshCandles();
    }
  }, [selectedPair, candleGranularity, isLoadingPairs, pairs.length, refreshCandles]);

  // Fetch trades and order book when pair changes
  useEffect(() => {
    if (!isLoadingPairs && pairs.length > 0 && selectedPair) {
      refreshTrades();
      refreshOrderBook();
    }
  }, [selectedPair, isLoadingPairs, pairs.length, refreshTrades, refreshOrderBook]);

  const value: ExchangeContextType = {
    pairs,
    isLoadingPairs,
    selectedPair,
    setSelectedPair,
    currentPairData,
    currentPrice,
    priceChange,
    isConnected,
    candles,
    isLoadingCandles,
    candleGranularity,
    setCandleGranularity,
    accounts,
    isLoadingAccounts,
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
