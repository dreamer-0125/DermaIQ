/**
 * Centralized timeout configuration for DermaIQ application
 * 
 * This file contains all timeout values used throughout the application
 * to ensure consistency and make it easy to adjust timeouts based on
 * performance requirements and network conditions.
 */

export const TIMEOUT_CONFIG = {
  // Database operation timeouts
  DATABASE: {
    // General database operations (insert, update, select) - OPTIMIZED: Reduced from 60s to 15s
    OPERATION: 15000, // 15 seconds
    
    // Connection health checks - OPTIMIZED: Reduced from 10s to 5s
    HEALTH_CHECK: 5000, // 5 seconds
    
    // Session operations (quick auth checks) - Fast for user experience
    SESSION: 5000, // 5 seconds
    
    // Retry configuration - OPTIMIZED: Reduced retries for faster failure feedback
    MAX_RETRIES: 3, // Reduced from 5 to 3
    RETRY_DELAY_BASE: 500, // 500ms base delay (reduced from 1s)
    RETRY_DELAY_MAX: 2000, // 2 seconds max delay (reduced from 5s)
  },

  // MCP (Model Control Protocol) service timeouts
  MCP: {
    // General API requests - OPTIMIZED: Reduced from 60s to 30s
    REQUEST: 30000, // 30 seconds
    
    // Health check requests - OPTIMIZED: Reduced from 30s to 10s
    HEALTH_CHECK: 10000, // 10 seconds
    
    // Treatment plan requests - OPTIMIZED: Reduced from 30s to 15s
    TREATMENT_PLAN: 15000, // 15 seconds
    
    // Doctor recommendations requests - OPTIMIZED: Reduced from 30s to 15s
    DOCTOR_RECOMMENDATIONS: 15000, // 15 seconds
    
    // Retry configuration - OPTIMIZED: Reduced retries and delays
    MAX_RETRIES: 2, // Reduced from 3 to 2
    RETRY_DELAY_BASE: 1000, // 1 second base delay
    RETRY_DELAY_MAX: 3000, // 3 seconds max delay (reduced from 5s)
  },

  // Analysis service timeouts - OPTIMIZED: Dynamic timeouts based on file size
  ANALYSIS: {
    // Overall analysis process timeout - Dynamic based on file size
    OVERALL: 120000, // 2 minutes (120 seconds) - base timeout
    OVERALL_MAX: 180000, // 3 minutes (180 seconds) - maximum timeout (reduced from 5min)
    
    // MCP analysis timeout (subset of overall) - Dynamic based on file size
    MCP_ANALYSIS: 90000, // 90 seconds - base timeout
    MCP_ANALYSIS_MAX: 150000, // 2.5 minutes (150 seconds) - maximum timeout (reduced from 4min)
    
    // File processing timeouts - OPTIMIZED: Reduced for faster feedback
    FILE_CONVERSION: 5000, // 5 seconds (reduced from 10s)
    IMAGE_PROCESSING: 15000, // 15 seconds (reduced from 30s)
    
    // Dynamic timeout calculation parameters
    DYNAMIC: {
      BASE_TIMEOUT: 90000, // 1.5 minutes base (increased for stability)
      SIZE_MULTIPLIER: 2000, // 2 seconds per MB (increased for large files)
      MIN_TIMEOUT: 90000, // Minimum 1.5 minutes
      MAX_TIMEOUT: 300000, // Maximum 5 minutes (increased for large files)
    }
  },

  // Frontend/UI timeouts
  UI: {
    // Progress update intervals
    PROGRESS_UPDATE_INTERVAL: 1000, // 1 second
    
    // Loading state timeouts
    LOADING_TIMEOUT: 30000, // 30 seconds
    
    // User interaction timeouts
    USER_INTERACTION_TIMEOUT: 5000, // 5 seconds
  },

  // Network and connection timeouts - OPTIMIZED: Reduced for better UX
  NETWORK: {
    // General fetch requests - OPTIMIZED: Reduced from 60s to 30s
    FETCH: 30000, // 30 seconds
    
    // WebSocket connections - OPTIMIZED: Reduced from 30s to 15s
    WEBSOCKET: 15000, // 15 seconds
    
    // File upload timeouts - OPTIMIZED: Reduced from 5min to 2min
    UPLOAD: 120000, // 2 minutes (120 seconds)
  },

  // Cache and storage timeouts
  CACHE: {
    // Health check cache duration
    HEALTH_CHECK_CACHE: 60000, // 1 minute
    
    // API response cache duration
    API_RESPONSE_CACHE: 300000, // 5 minutes
    
    // User session cache duration
    SESSION_CACHE: 1800000, // 30 minutes
  }
} as const;

/**
 * Get timeout value with environment-specific adjustments
 */
export function getTimeout(
  category: keyof typeof TIMEOUT_CONFIG,
  key: string,
  environmentMultiplier: number = 1
): number {
  const config = TIMEOUT_CONFIG[category] as Record<string, number>;
  const baseTimeout = config[key];
  
  if (!baseTimeout) {
    // console.warn(`Timeout not found: ${category}.${key}`);
    return 30000; // Default 30 seconds
  }
  
  return Math.round(baseTimeout * environmentMultiplier);
}

/**
 * Calculate dynamic timeout based on file size
 */
export function calculateDynamicTimeout(fileSize: number, category: 'ANALYSIS' = 'ANALYSIS'): number {
  const dynamicConfig = TIMEOUT_CONFIG[category].DYNAMIC;
  if (!dynamicConfig) {
    // console.warn(`Dynamic timeout config not found for category: ${category}`);
    return TIMEOUT_CONFIG.ANALYSIS.OVERALL; // Fallback to base timeout
  }
  
  const { BASE_TIMEOUT, SIZE_MULTIPLIER, MIN_TIMEOUT, MAX_TIMEOUT } = dynamicConfig;
  
  // Calculate timeout: base + (file size in MB * multiplier)
  const fileSizeMB = fileSize / (1024 * 1024);
  const calculatedTimeout = BASE_TIMEOUT + (fileSizeMB * SIZE_MULTIPLIER);
  
  // Clamp between min and max
  const finalTimeout = Math.max(MIN_TIMEOUT, Math.min(calculatedTimeout, MAX_TIMEOUT));
  
  // console.log(`Dynamic timeout calculated: ${finalTimeout}ms for file size: ${fileSizeMB.toFixed(2)}MB`);
  return Math.round(finalTimeout);
}

/**
 * Get retry configuration
 */
export function getRetryConfig(category: 'DATABASE' | 'MCP') {
  const config = TIMEOUT_CONFIG[category];
  return {
    maxRetries: config.MAX_RETRIES,
    baseDelay: config.RETRY_DELAY_BASE,
    maxDelay: config.RETRY_DELAY_MAX,
    calculateDelay: (attempt: number) => 
      Math.min(
        config.RETRY_DELAY_BASE * Math.pow(2, attempt - 1),
        config.RETRY_DELAY_MAX
      )
  };
}

/**
 * Environment-specific timeout adjustments
 */
export const ENVIRONMENT_MULTIPLIERS = {
  development: 1.5, // 50% longer timeouts in development
  production: 1.0,  // Standard timeouts in production
  testing: 0.5,     // 50% shorter timeouts in testing
} as const;

/**
 * Get environment-appropriate timeout
 */
export function getEnvironmentTimeout(
  category: keyof typeof TIMEOUT_CONFIG,
  key: string,
  environment: keyof typeof ENVIRONMENT_MULTIPLIERS = 'production'
): number {
  const multiplier = ENVIRONMENT_MULTIPLIERS[environment];
  return getTimeout(category, key, multiplier);
}

// Export commonly used timeouts for convenience
export const {
  DATABASE_TIMEOUT,
  MCP_REQUEST_TIMEOUT,
  ANALYSIS_OVERALL_TIMEOUT,
  MCP_ANALYSIS_TIMEOUT,
  TREATMENT_PLAN_TIMEOUT,
  DOCTOR_RECOMMENDATIONS_TIMEOUT,
  HEALTH_CHECK_TIMEOUT
} = {
  DATABASE_TIMEOUT: TIMEOUT_CONFIG.DATABASE.OPERATION,
  MCP_REQUEST_TIMEOUT: TIMEOUT_CONFIG.MCP.REQUEST,
  ANALYSIS_OVERALL_TIMEOUT: TIMEOUT_CONFIG.ANALYSIS.OVERALL,
  MCP_ANALYSIS_TIMEOUT: TIMEOUT_CONFIG.ANALYSIS.MCP_ANALYSIS,
  TREATMENT_PLAN_TIMEOUT: TIMEOUT_CONFIG.MCP.TREATMENT_PLAN,
  DOCTOR_RECOMMENDATIONS_TIMEOUT: TIMEOUT_CONFIG.MCP.DOCTOR_RECOMMENDATIONS,
  HEALTH_CHECK_TIMEOUT: TIMEOUT_CONFIG.MCP.HEALTH_CHECK,
};