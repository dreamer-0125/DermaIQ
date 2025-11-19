/**
 * Network connectivity test utility for debugging frontend-backend communication
 */

import { API_CONFIG, API_ENDPOINTS } from '../config/api';

export interface NetworkTestResult {
  test: string;
  success: boolean;
  error?: string;
  responseTime?: number;
  details?: any;
}

export class NetworkTester {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BACKEND.getBaseUrl();
  }

  /**
   * Run comprehensive network connectivity tests
   */
  async runAllTests(): Promise<NetworkTestResult[]> {
    const results: NetworkTestResult[] = [];

    // Test 1: Basic connectivity
    results.push(await this.testBasicConnectivity());

    // Test 2: Health endpoint
    results.push(await this.testHealthEndpoint());

    // Test 3: CORS preflight
    results.push(await this.testCORSPreflight());

    // Test 4: Simple POST request
    results.push(await this.testSimplePost());

    // Test 5: Analysis endpoint (without file)
    results.push(await this.testAnalysisEndpoint());

    return results;
  }

  /**
   * Test basic network connectivity
   */
  private async testBasicConnectivity(): Promise<NetworkTestResult> {
    const startTime = Date.now();
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        signal: AbortSignal.timeout(5000)
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        test: 'Basic Connectivity',
        success: true,
        responseTime,
        details: {
          status: response.status,
          statusText: response.statusText,
          url: this.baseUrl
        }
      };
    } catch (error) {
      return {
        test: 'Basic Connectivity',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          url: this.baseUrl,
          errorType: error instanceof Error ? error.constructor.name : 'Unknown'
        }
      };
    }
  }

  /**
   * Test health endpoint
   */
  private async testHealthEndpoint(): Promise<NetworkTestResult> {
    const startTime = Date.now();
    const url = `${this.baseUrl}${API_ENDPOINTS.HEALTH}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        signal: AbortSignal.timeout(10000)
      });
      
      const responseTime = Date.now() - startTime;
      const data = await response.json();
      
      return {
        test: 'Health Endpoint',
        success: response.ok,
        responseTime,
        details: {
          status: response.status,
          statusText: response.statusText,
          data,
          url
        }
      };
    } catch (error) {
      return {
        test: 'Health Endpoint',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          url,
          errorType: error instanceof Error ? error.constructor.name : 'Unknown'
        }
      };
    }
  }

  /**
   * Test CORS preflight request
   */
  private async testCORSPreflight(): Promise<NetworkTestResult> {
    const startTime = Date.now();
    const url = `${this.baseUrl}${API_ENDPOINTS.ANALYSIS.COMPLETE}`;
    
    try {
      const response = await fetch(url, {
        method: 'OPTIONS',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        },
        signal: AbortSignal.timeout(5000)
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        test: 'CORS Preflight',
        success: response.ok,
        responseTime,
        details: {
          status: response.status,
          statusText: response.statusText,
          headers: {
            'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
            'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
            'access-control-allow-headers': response.headers.get('access-control-allow-headers')
          },
          url
        }
      };
    } catch (error) {
      return {
        test: 'CORS Preflight',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          url,
          errorType: error instanceof Error ? error.constructor.name : 'Unknown'
        }
      };
    }
  }

  /**
   * Test simple POST request
   */
  private async testSimplePost(): Promise<NetworkTestResult> {
    const startTime = Date.now();
    const url = `${this.baseUrl}${API_ENDPOINTS.ANALYSIS.COMPLETE}`;
    
    try {
      // Create a simple test file
      const testBlob = new Blob(['test'], { type: 'text/plain' });
      const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
      
      const formData = new FormData();
      formData.append('file', testFile);
      formData.append('conf_thresh', '0.1');
      
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        body: formData,
        signal: AbortSignal.timeout(30000)
      });
      
      const responseTime = Date.now() - startTime;
      const responseText = await response.text();
      
      return {
        test: 'Simple POST Request',
        success: true, // We expect this to fail with validation error, but connection should work
        responseTime,
        details: {
          status: response.status,
          statusText: response.statusText,
          responseText: responseText.substring(0, 200),
          url
        }
      };
    } catch (error) {
      return {
        test: 'Simple POST Request',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          url,
          errorType: error instanceof Error ? error.constructor.name : 'Unknown'
        }
      };
    }
  }

  /**
   * Test analysis endpoint with proper image file
   */
  private async testAnalysisEndpoint(): Promise<NetworkTestResult> {
    const startTime = Date.now();
    const url = `${this.baseUrl}${API_ENDPOINTS.ANALYSIS.COMPLETE}`;
    
    try {
      // Create a minimal PNG file (1x1 pixel)
      const pngData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      const testBlob = new Blob([Uint8Array.from(atob(pngData), c => c.charCodeAt(0))], { type: 'image/png' });
      const testFile = new File([testBlob], 'test.png', { type: 'image/png' });
      
      const formData = new FormData();
      formData.append('file', testFile);
      formData.append('conf_thresh', '0.1');
      
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        body: formData,
        signal: AbortSignal.timeout(60000)
      });
      
      const responseTime = Date.now() - startTime;
      const responseText = await response.text();
      
      return {
        test: 'Analysis Endpoint',
        success: response.ok,
        responseTime,
        details: {
          status: response.status,
          statusText: response.statusText,
          responseText: responseText.substring(0, 500),
          url
        }
      };
    } catch (error) {
      return {
        test: 'Analysis Endpoint',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          url,
          errorType: error instanceof Error ? error.constructor.name : 'Unknown'
        }
      };
    }
  }

  /**
   * Get network information
   */
  getNetworkInfo(): any {
    return {
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt
      } : 'Not available',
      currentUrl: window.location.href,
      backendUrl: this.baseUrl,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const networkTester = new NetworkTester();
