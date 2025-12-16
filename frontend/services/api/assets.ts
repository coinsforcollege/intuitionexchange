/**
 * Assets API Service
 * Handles all balance-related API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Balance {
  asset: string;
  balance: number;
  availableBalance: number;
  lockedBalance: number;
  usdValue?: number;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

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
 * Get all crypto balances for the authenticated user
 */
export async function getBalances(): Promise<Balance[]> {
  return apiCall<Balance[]>('/assets', {
    method: 'GET',
  });
}

/**
 * Get balance for a specific asset
 */
export async function getBalance(asset: string): Promise<Balance> {
  return apiCall<Balance>(`/assets/${asset}`, {
    method: 'GET',
  });
}

