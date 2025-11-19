/**
 * Authentication Helper for Development/Testing
 * 
 * This file provides authentication utilities for the DermaIQ application.
 * In production, this would integrate with a proper authentication service.
 */

// Mock authentication for development/testing
export const MOCK_AUTH_TOKEN = 'mock-jwt-token-for-development';

/**
 * Set up mock authentication for development
 */
export function setupMockAuth(): void {
  if (process.env.NODE_ENV === 'development') {
    // console.log('🔧 Setting up mock authentication for development');
    localStorage.setItem('auth_token', MOCK_AUTH_TOKEN);
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('auth_token');
  return !!token;
}

/**
 * Get authentication token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Clear authentication
 */
export function clearAuth(): void {
  localStorage.removeItem('auth_token');
  // console.log('🔓 Authentication cleared');
}

/**
 * Initialize authentication on app startup
 */
export function initializeAuth(): void {
  if (process.env.NODE_ENV === 'development') {
    // Auto-setup mock auth in development
    if (!isAuthenticated()) {
      setupMockAuth();
    }
  }
}
