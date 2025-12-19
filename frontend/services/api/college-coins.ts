/**
 * College Coins API Service (Public)
 * For fetching demo college coins data on markets, trade pages, etc.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface DemoCollegeCoin {
  id: string;
  ticker: string;
  name: string;
  iconUrl: string | null;
  peggedToAsset: string;
  peggedPercentage: number;
  isActive: boolean;
  description: string | null;
  website: string | null;
  whitepaper: string | null;
  twitter: string | null;
  discord: string | null;
  categories: string[];
  genesisDate: string | null;
  createdAt: string;
  updatedAt: string;
  currentPrice?: number;
  referencePrice?: number;
}

async function apiCall<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API request failed: ${response.status}`);
    }

    return data;
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Backend server is not running.');
    }
    throw error;
  }
}

/**
 * Get all active demo college coins with calculated prices
 * Public endpoint
 */
export async function getDemoCollegeCoins(): Promise<{
  success: boolean;
  coins: DemoCollegeCoin[];
}> {
  return apiCall('/college-coins');
}

/**
 * Get a single demo college coin by ticker with calculated price
 * Public endpoint
 */
export async function getDemoCollegeCoin(ticker: string): Promise<{
  success: boolean;
  coin: DemoCollegeCoin;
}> {
  return apiCall(`/college-coins/${ticker}`);
}

/**
 * Get reference tokens list
 * Public endpoint
 */
export async function getReferenceTokens(): Promise<{
  success: boolean;
  tokens: { symbol: string; name: string }[];
}> {
  return apiCall('/college-coins/reference-tokens');
}

