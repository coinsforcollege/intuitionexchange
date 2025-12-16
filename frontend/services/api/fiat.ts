/**
 * Fiat API Service
 * Handles all fiat deposit/withdrawal API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface DepositIntentResponse {
  clientSecret: string;
  transactionId: string;
}

export interface FiatTransaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  method: string;
  amount: number;
  status: string;
  reference: string | null;
  createdAt: Date;
  updatedAt: Date;
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
 * Create a deposit payment intent
 */
export async function createDepositIntent(amount: number): Promise<DepositIntentResponse> {
  return apiCall<DepositIntentResponse>('/fiat/deposit', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

/**
 * Get user's fiat transactions
 */
export async function getFiatTransactions(options?: {
  type?: 'DEPOSIT' | 'WITHDRAWAL';
  limit?: number;
  offset?: number;
}): Promise<{ transactions: FiatTransaction[]; total: number }> {
  const params = new URLSearchParams();
  if (options?.type) params.append('type', options.type);
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.offset) params.append('offset', options.offset.toString());

  return apiCall<{ transactions: FiatTransaction[]; total: number }>(
    `/fiat/transactions?${params.toString()}`,
    {
      method: 'GET',
    },
  );
}

/**
 * Sync payment status from Stripe (fallback if webhook didn't process)
 */
export async function syncPaymentStatus(transactionId: string): Promise<{ success: boolean }> {
  return apiCall<{ success: boolean }>('/fiat/sync-payment', {
    method: 'POST',
    body: JSON.stringify({ transactionId }),
  });
}

/**
 * Bank Account Types
 */
export interface BankAccount {
  id: string;
  accountName: string;
  accountType: string;
  last4: string;
  routingNumber: string; // Masked
  isVerified: boolean;
  createdAt: Date;
}

/**
 * Get user's bank accounts
 */
export async function getBankAccounts(): Promise<BankAccount[]> {
  return apiCall<BankAccount[]>('/fiat/bank-accounts', {
    method: 'GET',
  });
}

/**
 * Add a new bank account
 */
export async function addBankAccount(
  paymentMethodId: string,
  accountName: string,
): Promise<{ id: string; last4: string; stripeBankAccountId: string }> {
  return apiCall<{ id: string; last4: string; stripeBankAccountId: string }>(
    '/fiat/bank-accounts',
    {
      method: 'POST',
      body: JSON.stringify({ paymentMethodId, accountName }),
    },
  );
}

/**
 * Delete a bank account
 */
export async function deleteBankAccount(bankAccountId: string): Promise<{ success: boolean }> {
  return apiCall<{ success: boolean }>(`/fiat/bank-accounts/${bankAccountId}`, {
    method: 'DELETE',
  });
}

/**
 * Create a withdrawal
 */
export async function createWithdrawal(
  bankAccountId: string,
  amount: number,
): Promise<{ transactionId: string; payoutId: string }> {
  return apiCall<{ transactionId: string; payoutId: string }>('/fiat/withdraw', {
    method: 'POST',
    body: JSON.stringify({ bankAccountId, amount }),
  });
}

