/**
 * Enhanced MCP Service with Performance Optimizations
 * 
 * This service implements the performance optimizations identified in the
 * comprehensive performance testing, including:
 * - Optimized timeout configurations
 * - Enhanced error handling with fast fail for auth errors
 * - Request queue management
 * - Caching strategies
 * - Retry logic with exponential backoff
 */

import { 
  API_CONFIG, 
  API_ENDPOINTS, 
  REQUEST_CONFIG, 
  ERROR_CONFIG, 
  API_UTILS,
  requestQueue 
} from '../../config/api';
import { TIMEOUT_CONFIG } from '../../config/timeouts';
// import { supabase } from '../../config/supabase';

// Types for MCP service
export interface MCPAnalysisResult {
  segmentation?: {
    mask: string;
    confidence: number;
    wound_area: number;
    wound_perimeter: number;
  };
  diagnosis?: {
    is_infected: boolean;
    confidence: number;
    infection_type?: string;
    severity: string;
  };
  description?: {
    wound_type: string;
    characteristics: string[];
    recommendations: string[];
  };
  treatment_plan?: {
    plan_type: string;
    steps: string[];
    medications: string[];
    follow_up: string;
  };
  doctor_recommendations?: {
    doctors: Array<{
      name: string;
      specialization: string;
      phone: string;
      email: string;
      rating: number;
    }>;
  };
  metadata?: {
    processing_time: number;
    model_version: string;
    timestamp: string;
  };
}

export interface AuthStatus {
  authenticated: boolean;
  error?: string;
  user_id?: string;
}

export interface DoctorContact {
  name: string;
  specialization: string;
  phone: string;
  email: string;
  address: string;
  rating: number;
  availability: string;
  consultation_types: string[];
}

class EnhancedMCPService {
  private baseUrl: string;
  private healthCheckCache: boolean | null = null;
  private healthCheckCacheTime: number = 0;
  private requestCache: Map<string, { data: any; timestamp: number; expires: number }> = new Map();

  constructor() {
    this.baseUrl = API_CONFIG.BACKEND.getBaseUrl();
    
    // console.log('Enhanced MCP Service initialized with baseUrl:', this.baseUrl);
  }

  // /**
  //  * Get current Supabase session token for backend authentication
  //  */
  // private async getSessionToken(): Promise<string | null> {
  //   try {
  //     console.log('Attempting to get Supabase session with timeout...');
      
  //     // Use timeout constants for session operations
  //     const timeoutPromise = new Promise<never>((_, reject) => {
  //       setTimeout(() => reject(new Error(`Supabase session timeout after ${TIMEOUT_CONFIG.DATABASE.SESSION / 1000} seconds`)), TIMEOUT_CONFIG.DATABASE.SESSION);
  //     });
      
  //     const sessionPromise = supabase.auth.getSession();
      
  //     const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]);
      
  //     if (error) {
  //       console.warn('Supabase session error:', error);
  //       return null;
  //     }
      
  //     console.log('Supabase session retrieved:', !!session, 'Token available:', !!session?.access_token);
  //     return session?.access_token || null;
  //   } catch (error) {
  //     console.warn('Supabase session retrieval failed, using fallback:', error);
      
  //     // Try to get token from localStorage as fallback
  //     try {
  //       // Check common Supabase localStorage keys
  //       const possibleKeys = [
  //         'sb-auth-token',
  //         'supabase.auth.token',
  //         'supabase.auth.session',
  //         'sb-localhost-auth-token', // Common for local development
  //         'supabase.auth.token', // Another common key
  //         'sb-' + (import.meta as any).env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token' // Dynamic key
  //       ];
        
  //       for (const key of possibleKeys) {
  //         try {
  //           const storedToken = localStorage.getItem(key);
  //           if (storedToken) {
  //             try {
  //               const parsedToken = JSON.parse(storedToken);
  //               const token = parsedToken.access_token || parsedToken.currentSession?.access_token || parsedToken;
  //               if (token && typeof token === 'string' && token.length > 50) {
  //                 console.log(`Using fallback token from localStorage key: ${key}`);
  //                 return token;
  //               }
  //             } catch (parseError) {
  //               // If it's not JSON, try as direct token
  //               if (typeof storedToken === 'string' && storedToken.length > 50) {
  //                 console.log(`Using direct token from localStorage key: ${key}`);
  //                 return storedToken;
  //               }
  //             }
  //           }
  //         } catch (keyError) {
  //           // Continue to next key
  //           continue;
  //         }
  //       }
  //     } catch (fallbackError) {
  //       console.warn('Fallback token retrieval failed:', fallbackError);
  //     }
      
  //     console.log('No valid token found, proceeding without authentication');
  //     return null;
  //   }
  // }

  /**
   * Get authentication status - simplified for frontend
   */
  async getAuthStatus(): Promise<AuthStatus> {
    // Always return authenticated since backend doesn't require auth
    return {
      authenticated: true,
      user_id: 'demo_user'
    };
  }

  /**
   * Check server health with caching - NO AUTHENTICATION REQUIRED
   */
  async checkHealth(): Promise<boolean> {
    const now = Date.now();
    
    // Use cached result if still valid
    if (this.healthCheckCache !== null && 
        (now - this.healthCheckCacheTime) < TIMEOUT_CONFIG.CACHE.HEALTH_CHECK_CACHE) {
      return this.healthCheckCache;
    }

    try {
      // Add a small delay to give server time to start up
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Health check doesn't need authentication - make direct request
      const url = API_UTILS.buildUrl(API_ENDPOINTS.HEALTH, this.baseUrl);
      // console.log('Making health check request to URL:', url);
      // console.log('Base URL:', this.baseUrl);
      // console.log('Endpoint:', API_ENDPOINTS.HEALTH);
      
      // Use timeout constants for health checks
      const healthCheckTimeout = TIMEOUT_CONFIG.MCP.HEALTH_CHECK;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        // console.log(`Health check timeout after ${healthCheckTimeout}ms, aborting...`);
        controller.abort();
      }, healthCheckTimeout);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal,
        // Add mode and credentials for better CORS handling
        mode: 'cors',
        credentials: 'omit'
      });

      clearTimeout(timeoutId);

      this.healthCheckCache = response.ok;
      this.healthCheckCacheTime = now;
      
      // console.log('Health check successful:', response.status, response.statusText);
      return response.ok;
    } catch (error) {
      // console.error('Health check failed:', error);
      
      // Provide more specific error information
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          // console.error('Health check was aborted due to timeout - backend may be unreachable');
        } else if (error.message.includes('Failed to fetch')) {
          // console.error('Health check failed due to network error - backend may be down or CORS issue');
        } else if (error.message.includes('CORS')) {
          // console.error('Health check failed due to CORS policy');
        } else {
          // console.error('Health check failed with error:', error.message);
        }
      }
      
      // Try multiple fallback URLs if primary fails
      const currentHost = window.location.hostname;
      const fallbackUrls = [
        // Try the same host as frontend first
        `http://${currentHost}:8000/health`,
        // Then try localhost variants
        'http://192.168.130.30:8000/health',
        'http://192.168.130.30:8000/health', //127.0.0.1
        // Then try the external IP if not already tried
        ...(currentHost !== '138.201.55.18' ? ['http://138.201.55.18:8000/health'] : []),
        // Finally try production
        'https://mcp.dermaiq.org/health'
      ];
      
      for (const fallbackUrl of fallbackUrls) {
        try {
          // console.log(`Trying fallback health check URL: ${fallbackUrl}`);
          const fallbackController = new AbortController();
          const fallbackTimeoutId = setTimeout(() => {
            fallbackController.abort();
          }, 3000); // 3 second timeout for fallbacks
          
          const fallbackResponse = await fetch(fallbackUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            },
            signal: fallbackController.signal,
            mode: 'cors',
            credentials: 'omit'
          });
          
          clearTimeout(fallbackTimeoutId);
          
          if (fallbackResponse.ok) {
            // console.log(`Fallback health check successful: ${fallbackUrl}`);
            this.healthCheckCache = true;
            this.healthCheckCacheTime = now;
            return true;
          }
        } catch (fallbackError) {
          // console.error(`Fallback health check failed for ${fallbackUrl}:`, fallbackError);
        }
      }
      
      this.healthCheckCache = false;
      this.healthCheckCacheTime = now;
      return false;
    }
  }

  /**
   * Analyze wound image with optimized single API call and dynamic timeout
   */
  async analyzeWoundImage(
    imageBase64: string, 
    onProgress?: (step: string, progress: number) => void
  ): Promise<MCPAnalysisResult> {
    try {
      const startTime = Date.now();
      
      // console.log('Starting OPTIMIZED MCP analysis...');
      onProgress?.('preparing', 10);
      
      // Authentication check removed - backend no longer requires authentication
      // console.log('Proceeding with analysis (no authentication required)');
      
      onProgress?.('uploading', 20);

      // Calculate dynamic timeout based on base64 string size - use reasonable timeout for analysis
      const imageSizeMB = (imageBase64.length * 0.75) / (1024 * 1024); // Approximate size in MB
      const dynamicTimeout = Math.max(300000, Math.min(600000, 300000 + (imageSizeMB * 5000))); // 5-10 minutes
      // console.log(`Using dynamic timeout: ${dynamicTimeout}ms for image size: ${imageSizeMB.toFixed(2)}MB`);

      // OPTIMIZATION: Use single complete_analysis endpoint
      // console.log('Starting OPTIMIZED single API call...');
      onProgress?.('analyzing', 30);
      
      // Perform a quick health check before starting analysis to ensure connection is stable
      try {
        // console.log('Performing pre-analysis health check...');
        const healthResult = await this.checkHealth();
        // console.log('Health check result:', healthResult);
        if (!healthResult) {
          throw new Error('Backend server is not healthy. Please check if the server is running and accessible.');
        }
        // console.log('Health check passed, proceeding with analysis...');
      } catch (error) {
        // console.error('Pre-analysis health check failed:', error);
        throw new Error(`Cannot connect to analysis server: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Prepare JSON request body for complete_analysis endpoint
      const requestBody = {
        image_base64: imageBase64,
        include_treatment_plan: true,
        include_doctor_recommendations: true,
        user_location: null
      };

      // Use the main endpoint since authentication is no longer required
      const endpoint = API_ENDPOINTS.ANALYSIS.COMPLETE;
      
      // console.log('Request body prepared, making API request to:', endpoint);
      // console.log('Request configuration:', {
      //   method: 'POST',
      //   timeout: dynamicTimeout,
      //   imageSize: imageSizeMB.toFixed(2) + 'MB',
      //   hasAuth: false
      // });
      
      // Enhanced logging for debugging
      // console.log('=== REQUEST DETAILS ===');
      // console.log('Request body:', {
      //   image_base64_length: imageBase64.length,
      //   include_treatment_plan: requestBody.include_treatment_plan,
      //   include_doctor_recommendations: requestBody.include_doctor_recommendations
      // });
      // console.log('Target URL:', API_UTILS.buildUrl(endpoint, this.baseUrl));
      
      const response = await this.makeRequest(
        endpoint,
        { 
          method: 'POST', 
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        },
        dynamicTimeout
      );
      
      // console.log('API response received:', response.status, response.statusText);
      // console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      onProgress?.('processing', 70);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        // console.error('=== ANALYSIS FAILED ===');
        // console.error('Response status:', response.status);
        // console.error('Response status text:', response.statusText);
        // console.error('Response headers:', Object.fromEntries(response.headers.entries()));
        // console.error('Response body:', errorText);
        
        // Enhanced error handling based on status code
        if (response.status === 400) {
          // console.error('Bad Request (400) - Possible causes:');
          // console.error('1. Invalid file format or corrupted image');
          // console.error('2. File too large or too small');
          // console.error('3. Missing required parameters');
          // console.error('4. Malformed request body');
        } else if (response.status === 413) {
          // console.error('Payload Too Large (413) - File size exceeds server limits');
        } else if (response.status === 415) {
          // console.error('Unsupported Media Type (415) - File format not supported');
        } else if (response.status === 422) {
          // console.error('Unprocessable Entity (422) - Request validation failed');
        } else if (response.status >= 500) {
          // console.error('Server Error (5xx) - Backend server issue');
        }
        
        throw new Error(`Complete analysis failed: ${response.status} - ${errorText}`);
      }

      let responseData;
      try {
        responseData = await response.json();
        // console.log('Complete analysis response received successfully');
      } catch (jsonError) {
        // console.error('Failed to parse response JSON:', jsonError);
        throw new Error('Invalid response format: unable to parse JSON');
      }

      onProgress?.('completing', 90);

      // Extract data from the wrapped response structure
      const completeData = responseData.data;
      if (!completeData) {
        // console.error('Response data:', responseData);
        throw new Error('Invalid response format: missing data field');
      }

      // console.log('=== ANALYSIS RESPONSE DATA ===');
      // console.log('Complete data keys:', Object.keys(completeData));
      // console.log('Segmentation:', completeData.segmentation ? 'Present' : 'Missing');
      // console.log('Diagnosis:', completeData.diagnosis ? 'Present' : 'Missing');
      // console.log('Description:', completeData.description ? 'Present' : 'Missing');
      // console.log('Treatment plan:', completeData.treatment_plan ? 'Present' : 'Missing');
      // console.log('Doctor recommendations:', completeData.doctor_recommendations ? 'Present' : 'Missing');
      // console.log('Metadata:', completeData.metadata);
      // console.log('Image URLs in metadata:', completeData.metadata?.image_urls);

      // Process the complete analysis result
      const result: MCPAnalysisResult = {
        segmentation: completeData.segmentation,
        diagnosis: completeData.diagnosis,
        description: completeData.description,
        treatment_plan: completeData.treatment_plan,
        doctor_recommendations: completeData.doctor_recommendations,
        metadata: {
          ...completeData.metadata, // ⭐ Include ALL backend metadata (including image_urls)
          processing_time: Date.now() - startTime,
          model_version: completeData.metadata?.model_version || '1.0',
          timestamp: new Date().toISOString()
        }
      };

      // console.log('=== PROCESSED RESULT ===');
      // console.log('Result structure:', JSON.stringify(result, null, 2));

      onProgress?.('completed', 100);
      
      // console.log('OPTIMIZED analysis completed in', Date.now() - startTime, 'ms');
      return result;

    } catch (error) {
      // console.error('Analysis failed:', error);
      
      // Enhanced error logging for debugging
      if (error instanceof Error) {
        // console.error('Error details:', {
        //   name: error.name,
        //   message: error.message,
        //   stack: error.stack
        // });
        
        // Check for specific network errors
        if (error.message.includes('Failed to fetch')) {
          // console.error('Network connectivity issue detected. Possible causes:');
          // console.error('1. Backend server is not running');
          // console.error('2. Network connectivity issues');
          // console.error('3. CORS policy blocking the request');
          // console.error('4. Browser security policies');
          // console.error('5. Firewall or proxy blocking the request');
          
          // Try to provide more specific guidance
          const currentHost = window.location.hostname;
          if (currentHost === '138.201.55.18') {
            // console.error('Running on external IP. Check if backend is accessible at http://138.201.55.18:8000');
          } else if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
            // console.error('Running on localhost. Check if backend is accessible at http://192.168.130.30:8000');
          }
        }
      }
      
      throw new Error(API_UTILS.getUserMessage(error));
    }
  }

  /**
   * Get treatment plan with caching
   */
  async getTreatmentPlan(condition: string): Promise<any> {
    try {
      // Check cache first
      const cacheKey = `treatment_plan_${condition}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await this.makeRequest(
        `${API_ENDPOINTS.TREATMENT.PLAN}/${condition}`,
        { method: 'GET' },
        REQUEST_CONFIG.PERFORMANCE.TIMEOUTS.TREATMENT_PLAN
      );

      if (!response.ok) {
        throw new Error(`Treatment plan request failed: ${response.status}`);
      }

      const responseData = await response.json();
      const data = responseData.data;
      
      // Cache treatment plan for 5 minutes
      this.setCachedData(cacheKey, data, TIMEOUT_CONFIG.CACHE.API_RESPONSE_CACHE);
      
      return data;
    } catch (error) {
      // console.error('Treatment plan request failed:', error);
      throw new Error(API_UTILS.getUserMessage(error));
    }
  }

  /**
   * Get doctor recommendations with caching
   */
  async getDoctorRecommendations(state: string): Promise<DoctorContact[]> {
    try {
      // Check cache first
      const cacheKey = `doctor_recommendations_${state}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await this.makeRequest(
        `${API_ENDPOINTS.RECOMMENDATIONS.DOCTOR_CONTACT}/${state}`,
        { method: 'GET' },
        REQUEST_CONFIG.PERFORMANCE.TIMEOUTS.DOCTOR_RECOMMENDATIONS
      );

      if (!response.ok) {
        throw new Error(`Doctor recommendations request failed: ${response.status}`);
      }

      const responseData = await response.json();
      const data = responseData.data;
      
      // Cache doctor recommendations for 10 minutes
      this.setCachedData(cacheKey, data, TIMEOUT_CONFIG.CACHE.API_RESPONSE_CACHE * 2);
      
      return data;
    } catch (error) {
      // console.error('Doctor recommendations request failed:', error);
      throw new Error(API_UTILS.getUserMessage(error));
    }
  }

  /**
   * Make optimized HTTP request with retry logic and error handling
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {},
    timeout: number = REQUEST_CONFIG.PERFORMANCE.TIMEOUTS.GENERAL
  ): Promise<Response> {
    const url = API_UTILS.buildUrl(endpoint, this.baseUrl);
    // console.log('Making request to URL:', url);
    
    // Authentication removed - backend no longer requires authentication
    // console.log('Making request without authentication (backend handles MCP only)');
    
    // Use request queue for better performance and connection stability
    // console.log('Adding request to queue...');
    return requestQueue.add(async () => {
      // console.log('Request queue processing...');
      return this.makeRequestWithRetry(url, options, timeout);
    });
  }

  /**
   * Make request with retry logic and exponential backoff - Improved to handle AbortError properly
   */
  private async makeRequestWithRetry(
    url: string,
    options: RequestInit,
    timeout: number,
    attempt: number = 1
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      // console.log(`Request timeout after ${timeout}ms, aborting...`);
      controller.abort();
    }, timeout);

    // Add a progress indicator to track request progress
    const progressInterval = setInterval(() => {
      // console.log('Request still in progress...', new Date().toISOString());
    }, 10000); // Log every 10 seconds

    try {
      // console.log('=== FETCH REQUEST DETAILS ===');
      // console.log('URL:', url);
      // console.log('Method:', options.method);
      // console.log('Headers:', options.headers);
      // console.log('Body type:', options.body?.constructor?.name);
      // console.log('Body size:', options.body instanceof FormData ? 'FormData' : 'Other');
      // console.log('Timeout:', timeout, 'ms');
      // console.log('Starting fetch request...');
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit',
        // Ensure proper handling of FormData
        headers: options.headers || {}
      });
      
      clearInterval(progressInterval);
      // console.log('Fetch request completed successfully');
      
      // console.log('=== FETCH RESPONSE RECEIVED ===');
      // console.log('Status:', response.status);
      // console.log('Status text:', response.statusText);
      // console.log('Headers:', Object.fromEntries(response.headers.entries()));

      clearTimeout(timeoutId);

      // Check for fast fail conditions (auth errors)
      if (ERROR_CONFIG.FAST_FAIL_STATUSES.includes(response.status as 401 | 403 | 404 | 422)) {
        throw new Error(`Fast fail: ${response.status}`);
      }

      // Check for retryable errors
      if (!response.ok && ERROR_CONFIG.RETRYABLE_STATUSES.includes(response.status as 500 | 502 | 503 | 504 | 408 | 429)) {
        if (attempt <= REQUEST_CONFIG.PERFORMANCE.RETRY.MAX_RETRIES) {
          const delay = API_UTILS.calculateRetryDelay(attempt);
          // console.log(`Retrying request (attempt ${attempt + 1}) after ${delay}ms delay`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.makeRequestWithRetry(url, options, timeout, attempt + 1);
        }
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      
      // Handle AbortError specifically - don't retry timeout aborts
      if (error instanceof Error && error.name === 'AbortError') {
        // console.log(`Request aborted (attempt ${attempt}): ${error.message}`);
        const timeoutSeconds = Math.round(timeout / 1000);
        
        // Provide more specific error messages based on the request type
        if (url.includes('/health')) {
          throw new Error(`Health check timed out after ${timeoutSeconds} seconds. The backend server may be unreachable.`);
        } else if (url.includes('/analysis')) {
          throw new Error(`Analysis request timed out after ${timeoutSeconds} seconds. The analysis is taking longer than expected. Please try with a smaller image or check your connection.`);
        } else {
          throw new Error(`Request timed out after ${timeoutSeconds} seconds. Please check your connection and try again.`);
        }
      }
      
      // Handle network errors with more specific messages
      if (error instanceof Error && (
        error.message.includes('Failed to fetch') ||
        error.message.includes('ERR_CONNECTION_RESET') ||
        error.message.includes('ERR_NETWORK_CHANGED') ||
        error.message.includes('ERR_ADDRESS_UNREACHABLE') ||
        error.name === 'TypeError' // Often indicates network issues
      )) {
        if (attempt <= REQUEST_CONFIG.PERFORMANCE.RETRY.MAX_RETRIES) {
          const delay = API_UTILS.calculateRetryDelay(attempt);
          // console.log(`Network error (${error.message}), retrying request (attempt ${attempt + 1}) after ${delay}ms delay`);
          
          // Add exponential backoff with jitter to prevent thundering herd
          const jitter = Math.random() * 1000; // Add up to 1 second of jitter
          await new Promise(resolve => setTimeout(resolve, delay + jitter));
          return this.makeRequestWithRetry(url, options, timeout, attempt + 1);
        } else {
          // Provide more specific error message based on the URL and error type
          const currentHost = window.location.hostname;
          let errorMessage = 'Network error: Unable to connect to the server.';
          
          if (error.message.includes('ERR_CONNECTION_RESET')) {
            errorMessage = 'Connection was reset by the server. This may happen during long-running operations. Please try again.';
          } else if (error.message.includes('ERR_NETWORK_CHANGED')) {
            errorMessage = 'Network configuration changed during the request. Please check your connection and try again.';
          } else if (error.message.includes('ERR_ADDRESS_UNREACHABLE')) {
            errorMessage = 'Unable to reach the server. Please check your connection and ensure the server is running.';
          } else if (url.includes(currentHost) || url.includes('localhost') || url.includes('127.0.0.1')) {
            errorMessage = 'Network error: Unable to connect to the analysis server. Please check your connection and ensure the server is running.';
          }
          
          throw new Error(errorMessage);
        }
      }
      
      // Handle authentication errors specifically
      if (error instanceof Response && error.status === 403) {
        throw new Error('Authentication failed: Please sign in to access this feature.');
      }
      
      if (error instanceof Response && error.status === 401) {
        throw new Error('Authentication expired: Please sign in again.');
      }
      
      // Handle other network errors with retry
      if (API_UTILS.shouldRetry(error) && attempt <= REQUEST_CONFIG.PERFORMANCE.RETRY.MAX_RETRIES) {
        const delay = API_UTILS.calculateRetryDelay(attempt);
        // console.log(`Retrying request (attempt ${attempt + 1}) after ${delay}ms delay`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeRequestWithRetry(url, options, timeout, attempt + 1);
      }
      
      throw error;
    }
  }

  /**
   * Get cached data if still valid
   */
  private getCachedData(key: string): any | null {
    const cached = this.requestCache.get(key);
    if (cached && Date.now() < cached.expires) {
      return cached.data;
    }
    
    // Remove expired cache entry
    if (cached) {
      this.requestCache.delete(key);
    }
    
    return null;
  }

  /**
   * Set cached data with expiration
   */
  private setCachedData(key: string, data: any, duration: number): void {
    this.requestCache.set(key, {
      data,
      timestamp: Date.now(),
      expires: Date.now() + duration
    });
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.requestCache.clear();
    this.healthCheckCache = null;
    this.healthCheckCacheTime = 0;
  }

  /**
   * Update auth token (simplified - no longer needed)
   */
  async updateAuthToken(): Promise<void> {
    // No auth token management needed - backend handles auth
    this.clearCache();
  }

  /**
   * Refresh auth token (simplified - no longer needed)
   */
  async refreshAuthToken(): Promise<void> {
    // No auth token management needed - backend handles auth
    this.clearCache();
  }
}

// Export singleton instance
export const enhancedMCPService = new EnhancedMCPService();
export default enhancedMCPService;
