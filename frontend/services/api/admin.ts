/**
 * Admin API Service
 * Handles all admin-related API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types
export interface AdminUser {
  id: string;
  email: string;
  phone: string;
  phoneCountry: string;
  country: string;
  role: 'USER' | 'ADMIN';
  appMode: string;
  kycStatus: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  firstName: string | null;
  lastName: string | null;
}

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

export interface ReferenceToken {
  symbol: string;
  name: string;
}

async function adminApiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const headers: HeadersInit = {
    ...(options.headers || {}),
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Don't set Content-Type for FormData (browser will set it with boundary)
  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

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

// ============================================
// USER MANAGEMENT
// ============================================

/**
 * Get paginated list of users
 */
export async function getUsers(options?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<{
  success: boolean;
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}> {
  const params = new URLSearchParams();
  if (options?.page) params.append('page', options.page.toString());
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.search) params.append('search', options.search);
  if (options?.role) params.append('role', options.role);

  const queryString = params.toString();
  return adminApiCall(`/admin/users${queryString ? `?${queryString}` : ''}`, {
    method: 'GET',
  });
}

/**
 * Get single user details
 */
export async function getUser(id: string): Promise<{
  success: boolean;
  user: AdminUser;
}> {
  return adminApiCall(`/admin/users/${id}`, {
    method: 'GET',
  });
}

/**
 * Update user role
 */
export async function updateUserRole(
  id: string,
  role: 'USER' | 'ADMIN',
): Promise<{
  success: boolean;
  user: AdminUser;
  message: string;
}> {
  return adminApiCall(`/admin/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

// ============================================
// DEMO COLLEGE COINS MANAGEMENT
// ============================================

/**
 * Get reference tokens for pegging
 */
export async function getReferenceTokens(): Promise<{
  success: boolean;
  tokens: ReferenceToken[];
}> {
  return adminApiCall('/admin/college-coins/reference-tokens', {
    method: 'GET',
  });
}

/**
 * Get all demo college coins (including inactive)
 */
export async function getCollegeCoins(): Promise<{
  success: boolean;
  coins: DemoCollegeCoin[];
}> {
  return adminApiCall('/admin/college-coins', {
    method: 'GET',
  });
}

/**
 * Get single demo college coin
 */
export async function getCollegeCoin(id: string): Promise<{
  success: boolean;
  coin: DemoCollegeCoin;
}> {
  return adminApiCall(`/admin/college-coins/${id}`, {
    method: 'GET',
  });
}

/**
 * Create a new demo college coin
 */
export async function createCollegeCoin(data: {
  ticker: string;
  name: string;
  peggedToAsset: string;
  peggedPercentage: number;
  isActive?: boolean;
  description?: string;
  website?: string;
  whitepaper?: string;
  twitter?: string;
  discord?: string;
  categories?: string[];
  genesisDate?: string;
  icon?: File;
}): Promise<{
  success: boolean;
  coin: DemoCollegeCoin;
  message: string;
}> {
  const formData = new FormData();
  formData.append('ticker', data.ticker);
  formData.append('name', data.name);
  formData.append('peggedToAsset', data.peggedToAsset);
  formData.append('peggedPercentage', data.peggedPercentage.toString());
  formData.append('isActive', (data.isActive ?? true).toString());
  
  if (data.description) formData.append('description', data.description);
  if (data.website) formData.append('website', data.website);
  if (data.whitepaper) formData.append('whitepaper', data.whitepaper);
  if (data.twitter) formData.append('twitter', data.twitter);
  if (data.discord) formData.append('discord', data.discord);
  if (data.categories) formData.append('categories', JSON.stringify(data.categories));
  if (data.genesisDate) formData.append('genesisDate', data.genesisDate);
  if (data.icon) formData.append('icon', data.icon);

  return adminApiCall('/admin/college-coins', {
    method: 'POST',
    body: formData,
  });
}

/**
 * Update a demo college coin
 */
export async function updateCollegeCoin(
  id: string,
  data: {
    ticker?: string;
    name?: string;
    peggedToAsset?: string;
    peggedPercentage?: number;
    isActive?: boolean;
    description?: string;
    website?: string;
    whitepaper?: string;
    twitter?: string;
    discord?: string;
    categories?: string[];
    genesisDate?: string;
    icon?: File;
  },
): Promise<{
  success: boolean;
  coin: DemoCollegeCoin;
  message: string;
}> {
  const formData = new FormData();
  
  if (data.ticker) formData.append('ticker', data.ticker);
  if (data.name) formData.append('name', data.name);
  if (data.peggedToAsset) formData.append('peggedToAsset', data.peggedToAsset);
  if (data.peggedPercentage !== undefined) formData.append('peggedPercentage', data.peggedPercentage.toString());
  if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.website !== undefined) formData.append('website', data.website);
  if (data.whitepaper !== undefined) formData.append('whitepaper', data.whitepaper);
  if (data.twitter !== undefined) formData.append('twitter', data.twitter);
  if (data.discord !== undefined) formData.append('discord', data.discord);
  if (data.categories !== undefined) formData.append('categories', JSON.stringify(data.categories));
  if (data.genesisDate !== undefined) formData.append('genesisDate', data.genesisDate);
  if (data.icon) formData.append('icon', data.icon);

  return adminApiCall(`/admin/college-coins/${id}`, {
    method: 'PATCH',
    body: formData,
  });
}

/**
 * Delete a demo college coin
 */
export async function deleteCollegeCoin(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  return adminApiCall(`/admin/college-coins/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Import demo college coins from CSV
 */
export async function importCollegeCoins(file: File): Promise<{
  success: boolean;
  message: string;
  results: {
    total: number;
    created: number;
    failed: number;
    errors: { row: number; ticker: string; error: string }[];
  };
}> {
  const formData = new FormData();
  formData.append('file', file);

  return adminApiCall('/admin/college-coins/import', {
    method: 'POST',
    body: formData,
  });
}

// ============================================
// MEDIA MANAGER
// ============================================

export interface MediaFile {
  filename: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'file';
  size: number;
  url: string;
  createdAt: string;
  modifiedAt?: string;
  originalName?: string;
  mimetype?: string;
  uploadedAt?: string;
}

/**
 * Upload multiple files to media manager
 */
export async function uploadMedia(files: File[]): Promise<{
  success: boolean;
  message: string;
  files: MediaFile[];
}> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  return adminApiCall('/admin/media/upload', {
    method: 'POST',
    body: formData,
  });
}

/**
 * List all files in media manager
 */
export async function listMedia(): Promise<{
  success: boolean;
  files: MediaFile[];
  total: number;
}> {
  return adminApiCall('/admin/media', {
    method: 'GET',
  });
}

/**
 * Get single file details
 */
export async function getMediaFile(filename: string): Promise<{
  success: boolean;
  file: MediaFile;
}> {
  return adminApiCall(`/admin/media/${encodeURIComponent(filename)}`, {
    method: 'GET',
  });
}

/**
 * Delete a file from media manager
 */
export async function deleteMediaFile(filename: string): Promise<{
  success: boolean;
  message: string;
}> {
  return adminApiCall(`/admin/media/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
  });
}

