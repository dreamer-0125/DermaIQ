/**
 * Centralized API configuration for DermaIQ application
 * 
 * This file contains all API-related configurations including endpoints,
 * base URLs, and performance optimizations based on comprehensive testing.
 */

import { TIMEOUT_CONFIG, calculateDynamicTimeout } from './timeouts';

// API Base URLs
export const API_CONFIG = {
  // Backend API configuration
  BACKEND: {
    // Development and production URLs
    DEVELOPMENT: 'http://127.0.0.1:8000', // Use localhost for development
    PRODUCTION: 'https://mcp.dermaiq.org',
    
    // Get current base URL based on environment
    getBaseUrl: (): string => {
      const isProduction = window.location.hostname === 'dermaiq.org' || 
                          window.location.hostname === 'www.dermaiq.org';
      
      if (isProduction) {
        return API_CONFIG.BACKEND.PRODUCTION;
      }
      
      // For development, use the same host as the frontend but with port 8000
      const currentHost = window.location.hostname;
      
      // If we're running on localhost or 127.0.0.1, use localhost:8000
      if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
        return 'http://127.0.0.1:8000';
      }
      
      // If we're running on the external IP, use the same IP with port 8000
      if (currentHost === '138.201.55.18') {
        return 'http://138.201.55.18:8000';
      }
      
      // Fallback to localhost for any other development scenario
      return API_CONFIG.BACKEND.DEVELOPMENT;
    }
  },
  
  // Frontend configuration
  FRONTEND: {
    DEVELOPMENT: 'http://localhost:3001',
    PRODUCTION: 'https://dermaiq.org'
  }
} as const;

// API Endpoints - Optimized based on performance testing
export const API_ENDPOINTS = {
  // Health and status endpoints
  HEALTH: '/health',
  STATUS: '/status',
  MODEL_STATUS: '/api/analysis/model_status',
  PERFORMANCE_STATS: '/api/analysis/performance_stats',
  
  // Analysis endpoints - Optimized for single complete_analysis call
  ANALYSIS: {
    COMPLETE: '/api/analysis/complete_analysis',
    SEGMENT: '/api/analysis/segment_wound',
    DIAGNOSE: '/api/analysis/diagnose_infection',
    DESCRIBE: '/api/analysis/describe_wound'
  },
  
  // Treatment and recommendations
  TREATMENT: {
    PLAN: '/api/treatment/plan',
    PLANS: '/api/treatment/plans',
    VBC_COMPLETION: '/api/treatment/vbc_completion',
    GENERATE_PLAN: '/api/treatment/generate_plan'
  },
  
  RECOMMENDATIONS: {
    DOCTOR_CONTACT: '/api/recommendations/doctor_contact',
    SPECIALISTS: '/api/recommendations/specialists',
    RECOMMEND_SPECIALIST: '/api/recommendations/recommend_specialist',
    DOCTORS: '/api/recommendations/doctors',
    STATES: '/api/recommendations/states',
    SPECIALIZATIONS: '/api/recommendations/specializations'
  }
} as const;

// Request configuration with performance optimizations
export const REQUEST_CONFIG = {
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // File upload headers
  UPLOAD_HEADERS: {
    'Accept': 'application/json'
    // Note: Content-Type will be set automatically for FormData
  },
  
  // CORS configuration
  CORS: {
    ORIGIN: API_CONFIG.FRONTEND.DEVELOPMENT,
    CREDENTIALS: true
  },
  
  // Performance optimizations based on test results
  PERFORMANCE: {
    // Request queue management
    MAX_CONCURRENT_REQUESTS: 3,
    REQUEST_DELAY: 100, // ms between requests
    
    // Caching configuration
    CACHE_DURATION: {
      HEALTH_CHECK: TIMEOUT_CONFIG.CACHE.HEALTH_CHECK_CACHE,
      API_RESPONSE: TIMEOUT_CONFIG.CACHE.API_RESPONSE_CACHE,
      SESSION: TIMEOUT_CONFIG.CACHE.SESSION_CACHE
    },
    
    // Retry configuration - Optimized based on performance tests
    RETRY: {
      MAX_RETRIES: 2, // Reduced from 3 to 2
      BASE_DELAY: 1000, // 1 second
      MAX_DELAY: 3000, // 3 seconds (reduced from 5s)
      BACKOFF_MULTIPLIER: 2
    },
    
    // Timeout configuration - Optimized based on performance tests
    TIMEOUTS: {
      HEALTH_CHECK: TIMEOUT_CONFIG.MCP.HEALTH_CHECK, // 10s
      ANALYSIS: TIMEOUT_CONFIG.ANALYSIS.OVERALL, // 120s base, dynamic based on file size
      ANALYSIS_DYNAMIC: (fileSize: number) => calculateDynamicTimeout(fileSize), // Dynamic timeout
      TREATMENT_PLAN: TIMEOUT_CONFIG.MCP.TREATMENT_PLAN, // 15s
      DOCTOR_RECOMMENDATIONS: TIMEOUT_CONFIG.MCP.DOCTOR_RECOMMENDATIONS, // 15s
      UPLOAD: TIMEOUT_CONFIG.NETWORK.UPLOAD, // 120s
      GENERAL: TIMEOUT_CONFIG.MCP.REQUEST // 30s
    }
  }
} as const;

// Error handling configuration
export const ERROR_CONFIG = {
  // Error types that should trigger fast fail (no retries)
  FAST_FAIL_STATUSES: [401, 403, 404, 422],
  
  // Error types that should trigger retries
  RETRYABLE_STATUSES: [500, 502, 503, 504, 408, 429],
  
  // Network errors that should trigger retries (excluding AbortError to prevent interference)
  RETRYABLE_NETWORK_ERRORS: [
    'NetworkError',
    'TimeoutError'
    // Note: AbortError removed to prevent retry interference with intentional aborts
  ],
  
  // Error messages for user display
  USER_MESSAGES: {
    AUTHENTICATION_REQUIRED: 'Authentication required. Please log in to perform wound analysis.',
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Invalid input. Please check your data and try again.',
    RATE_LIMIT_ERROR: 'Too many requests. Please wait a moment and try again.'
  }
} as const;

// Request queue management - Optimized to prevent resource competition
export class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private activeRequests: number = 0;
  private maxConcurrentRequests: number = REQUEST_CONFIG.PERFORMANCE.MAX_CONCURRENT_REQUESTS;
  private requestDelay: number = REQUEST_CONFIG.PERFORMANCE.REQUEST_DELAY;
  private processing: boolean = false;

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    // Prevent concurrent processing
    if (this.processing) {
      return;
    }
    
    this.processing = true;
    
    try {
      while (this.activeRequests < this.maxConcurrentRequests && this.queue.length > 0) {
        const request = this.queue.shift();
        if (!request) break;

        this.activeRequests++;
        
        // Process request without blocking the queue
        request().finally(() => {
          this.activeRequests--;
        });
        
        // Add minimal delay between starting requests to prevent overwhelming
        if (this.requestDelay > 0 && this.queue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, this.requestDelay));
        }
      }
    } finally {
      this.processing = false;
    }
  }
}

// Global request queue instance
export const requestQueue = new RequestQueue();

// Utility functions for API calls
export const API_UTILS = {
  // Build full URL for endpoint
  buildUrl: (endpoint: string, baseUrl?: string): string => {
    const base = baseUrl || API_CONFIG.BACKEND.getBaseUrl();
    return `${base}${endpoint}`;
  },
  
  // Get authentication headers
  getAuthHeaders: async (): Promise<Record<string, string>> => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error(ERROR_CONFIG.USER_MESSAGES.AUTHENTICATION_REQUIRED);
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      ...REQUEST_CONFIG.DEFAULT_HEADERS
    };
  },
  
  // Check if error should trigger fast fail
  shouldFastFail: (error: any): boolean => {
    if (error?.response?.status) {
      return ERROR_CONFIG.FAST_FAIL_STATUSES.includes(error.response.status);
    }
    return false;
  },
  
  // Check if error should trigger retry
  shouldRetry: (error: any): boolean => {
    if (error?.response?.status) {
      return ERROR_CONFIG.RETRYABLE_STATUSES.includes(error.response.status);
    }
    
    if (error?.name) {
      return ERROR_CONFIG.RETRYABLE_NETWORK_ERRORS.includes(error.name);
    }
    
    return false;
  },
  
  // Calculate retry delay with exponential backoff
  calculateRetryDelay: (attempt: number): number => {
    const { BASE_DELAY, MAX_DELAY, BACKOFF_MULTIPLIER } = REQUEST_CONFIG.PERFORMANCE.RETRY;
    return Math.min(
      BASE_DELAY * Math.pow(BACKOFF_MULTIPLIER, attempt - 1),
      MAX_DELAY
    );
  },
  
  // Get user-friendly error message
  getUserMessage: (error: any): string => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return ERROR_CONFIG.USER_MESSAGES.AUTHENTICATION_REQUIRED;
    }
    
    if (error?.response?.status === 408 || error?.name === 'TimeoutError') {
      return ERROR_CONFIG.USER_MESSAGES.TIMEOUT_ERROR;
    }
    
    if (error?.response?.status === 429) {
      return ERROR_CONFIG.USER_MESSAGES.RATE_LIMIT_ERROR;
    }
    
    if (error?.response?.status >= 500) {
      return ERROR_CONFIG.USER_MESSAGES.SERVER_ERROR;
    }
    
    if (error?.response?.status === 422) {
      return ERROR_CONFIG.USER_MESSAGES.VALIDATION_ERROR;
    }
    
    if (error?.name === 'NetworkError' || !navigator.onLine) {
      return ERROR_CONFIG.USER_MESSAGES.NETWORK_ERROR;
    }
    
    return error?.message || ERROR_CONFIG.USER_MESSAGES.SERVER_ERROR;
  }
} as const;

// Export commonly used configurations
export const {
  BACKEND_BASE_URL,
  FRONTEND_BASE_URL,
  DEFAULT_TIMEOUT,
  MAX_RETRIES
} = {
  BACKEND_BASE_URL: API_CONFIG.BACKEND.getBaseUrl(),
  FRONTEND_BASE_URL: API_CONFIG.FRONTEND.DEVELOPMENT,
  DEFAULT_TIMEOUT: REQUEST_CONFIG.PERFORMANCE.TIMEOUTS.GENERAL,
  MAX_RETRIES: REQUEST_CONFIG.PERFORMANCE.RETRY.MAX_RETRIES
};
