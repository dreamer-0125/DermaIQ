/**
 * Enhanced Error Handling System
 * Following backend testing patterns for comprehensive error management
 */

import { TIMEOUT_CONFIG } from '../config/timeouts';

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  timestamp: string
  userAgent?: string
  url?: string
  additionalData?: Record<string, any>
}

export interface ProcessedError {
  id: string
  type: ErrorType
  severity: ErrorSeverity
  message: string
  originalError: Error
  context: ErrorContext
  isRetryable: boolean
  retryCount: number
  maxRetries: number
  fallbackAvailable: boolean
  userMessage: string
  technicalMessage: string
  suggestions: string[]
}

export class ErrorHandler {
  private static instance: ErrorHandler
  private errorLog: ProcessedError[] = []
  private retryAttempts: Map<string, number> = new Map()

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  /**
   * Process and categorize errors following backend patterns
   */
  processError(
    error: Error,
    context: Partial<ErrorContext> = {},
    options: {
      maxRetries?: number
      fallbackAvailable?: boolean
      severity?: ErrorSeverity
    } = {}
  ): ProcessedError {
    const errorId = this.generateErrorId()
    const errorType = this.categorizeError(error)
    const severity = options.severity || this.determineSeverity(errorType, error)
    const isRetryable = this.isRetryableError(errorType, error)
    const maxRetries = options.maxRetries || this.getDefaultMaxRetries(errorType)
    const retryCount = this.retryAttempts.get(errorId) || 0

    const processedError: ProcessedError = {
      id: errorId,
      type: errorType,
      severity,
      message: error.message,
      originalError: error,
      context: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        ...context
      },
      isRetryable,
      retryCount,
      maxRetries,
      fallbackAvailable: options.fallbackAvailable || false,
      userMessage: this.generateUserMessage(errorType, error),
      technicalMessage: this.generateTechnicalMessage(errorType, error),
      suggestions: this.generateSuggestions(errorType, error)
    }

    this.errorLog.push(processedError)
    this.logError(processedError)

    return processedError
  }

  /**
   * Categorize errors based on type and message
   */
  private categorizeError(error: Error): ErrorType {
    const message = error.message.toLowerCase()
    const name = error.name.toLowerCase()

    // Network errors
    if (message.includes('failed to fetch') || 
        message.includes('network error') ||
        message.includes('err_network') ||
        name === 'typeerror' && message.includes('fetch')) {
      return ErrorType.NETWORK_ERROR
    }

    // Timeout errors
    if (message.includes('timeout') || 
        message.includes('aborted') ||
        name === 'aborterror') {
      return ErrorType.TIMEOUT_ERROR
    }

    // Authentication errors
    if (message.includes('401') || 
        message.includes('403') ||
        message.includes('unauthorized') ||
        message.includes('forbidden') ||
        message.includes('authentication')) {
      return ErrorType.AUTHENTICATION_ERROR
    }

    // Validation errors
    if (message.includes('validation') || 
        message.includes('invalid') ||
        message.includes('required') ||
        message.includes('format')) {
      return ErrorType.VALIDATION_ERROR
    }

    // Server errors
    if (message.includes('500') || 
        message.includes('502') ||
        message.includes('503') ||
        message.includes('504') ||
        message.includes('internal server error')) {
      return ErrorType.SERVER_ERROR
    }

    // Client errors
    if (message.includes('400') || 
        message.includes('404') ||
        message.includes('bad request') ||
        message.includes('not found')) {
      return ErrorType.CLIENT_ERROR
    }

    return ErrorType.UNKNOWN_ERROR
  }

  /**
   * Determine error severity based on type and context
   */
  private determineSeverity(type: ErrorType, _error: Error): ErrorSeverity {
    switch (type) {
      case ErrorType.NETWORK_ERROR:
      case ErrorType.TIMEOUT_ERROR:
        return ErrorSeverity.MEDIUM
      
      case ErrorType.AUTHENTICATION_ERROR:
        return ErrorSeverity.HIGH
      
      case ErrorType.VALIDATION_ERROR:
        return ErrorSeverity.LOW
      
      case ErrorType.SERVER_ERROR:
        return ErrorSeverity.HIGH
      
      case ErrorType.CLIENT_ERROR:
        return ErrorSeverity.MEDIUM
      
      case ErrorType.UNKNOWN_ERROR:
        return ErrorSeverity.MEDIUM
      
      default:
        return ErrorSeverity.MEDIUM
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(type: ErrorType, _error: Error): boolean {
    switch (type) {
      case ErrorType.NETWORK_ERROR:
      case ErrorType.TIMEOUT_ERROR:
      case ErrorType.SERVER_ERROR:
        return true
      
      case ErrorType.AUTHENTICATION_ERROR:
      case ErrorType.VALIDATION_ERROR:
      case ErrorType.CLIENT_ERROR:
        return false
      
      case ErrorType.UNKNOWN_ERROR:
        return true // Conservative approach
      
      default:
        return false
    }
  }

  /**
   * Get default max retries for error type
   */
  private getDefaultMaxRetries(type: ErrorType): number {
    switch (type) {
      case ErrorType.NETWORK_ERROR:
        return 3
      
      case ErrorType.TIMEOUT_ERROR:
        return 2
      
      case ErrorType.SERVER_ERROR:
        return 2
      
      case ErrorType.UNKNOWN_ERROR:
        return 1
      
      default:
        return 0
    }
  }

  /**
   * Generate user-friendly error message
   */
  private generateUserMessage(type: ErrorType, _error: Error): string {
    switch (type) {
      case ErrorType.NETWORK_ERROR:
        return 'Unable to connect to the server. Please check your internet connection and try again.'
      
      case ErrorType.TIMEOUT_ERROR:
        return 'The request is taking longer than expected. Please try again.'
      
      case ErrorType.AUTHENTICATION_ERROR:
        return 'Your session has expired. Please sign in again.'
      
      case ErrorType.VALIDATION_ERROR:
        return 'Please check your input and try again.'
      
      case ErrorType.SERVER_ERROR:
        return 'The server is temporarily unavailable. Please try again later.'
      
      case ErrorType.CLIENT_ERROR:
        return 'There was an issue with your request. Please try again.'
      
      case ErrorType.UNKNOWN_ERROR:
        return 'An unexpected error occurred. Please try again or contact support if the problem persists.'
      
      default:
        return 'An error occurred. Please try again.'
    }
  }

  /**
   * Generate technical error message for debugging
   */
  private generateTechnicalMessage(type: ErrorType, error: Error): string {
    return `${type}: ${error.name} - ${error.message}`
  }

  /**
   * Generate user suggestions based on error type
   */
  private generateSuggestions(type: ErrorType, _error: Error): string[] {
    switch (type) {
      case ErrorType.NETWORK_ERROR:
        return [
          'Check your internet connection',
          'Try refreshing the page',
          'Disable any VPN or proxy settings',
          'Contact support if the problem persists'
        ]
      
      case ErrorType.TIMEOUT_ERROR:
        return [
          'Try again in a few moments',
          'Check your internet connection',
          'Try refreshing the page'
        ]
      
      case ErrorType.AUTHENTICATION_ERROR:
        return [
          'Sign out and sign in again',
          'Clear your browser cache',
          'Check if your account is active'
        ]
      
      case ErrorType.VALIDATION_ERROR:
        return [
          'Check all required fields are filled',
          'Verify the format of your input',
          'Try using a different file or image'
        ]
      
      case ErrorType.SERVER_ERROR:
        return [
          'Try again in a few minutes',
          'Check our status page for updates',
          'Contact support if the problem continues'
        ]
      
      case ErrorType.CLIENT_ERROR:
        return [
          'Verify your request is correct',
          'Try refreshing the page',
          'Check if the resource exists'
        ]
      
      case ErrorType.UNKNOWN_ERROR:
        return [
          'Try refreshing the page',
          'Clear your browser cache',
          'Contact support with error details'
        ]
      
      default:
        return ['Try again', 'Contact support if the problem persists']
    }
  }

  /**
   * Retry failed operation with exponential backoff
   */
  async retryOperation<T>(
    operation: () => Promise<T>,
    errorId: string,
    delay: number = TIMEOUT_CONFIG.MCP.RETRY_DELAY_BASE,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          // Exponential backoff: 1s, 2s, 4s
          const backoffDelay = delay * Math.pow(2, attempt - 1)
          await new Promise(resolve => setTimeout(resolve, backoffDelay))
        }
        
        const result = await operation()
        
        // Clear retry attempts on success
        this.retryAttempts.delete(errorId)
        return result
      } catch (error) {
        lastError = error as Error
        this.retryAttempts.set(errorId, attempt + 1)
        
        if (attempt === maxRetries) {
          throw new Error(`Max retries (${maxRetries}) exceeded for operation ${errorId}`)
        }
      }
    }
    
    throw lastError || new Error(`Operation failed after ${maxRetries} retries`)
  }

  /**
   * Handle API errors with automatic retry and fallback
   */
  async handleApiCall<T>(
    apiCall: () => Promise<T>,
    fallback?: () => Promise<T>,
    context: Partial<ErrorContext> = {}
  ): Promise<T> {
    try {
      return await apiCall()
    } catch (error) {
      const processedError = this.processError(error as Error, context, {
        fallbackAvailable: !!fallback
      })

      // If retryable, attempt retries
      if (processedError.isRetryable) {
        try {
          return await this.retryOperation(apiCall, processedError.id, TIMEOUT_CONFIG.MCP.RETRY_DELAY_BASE, processedError.maxRetries)
        } catch (retryError) {
          // If retry fails and fallback is available, use fallback
          if (fallback) {
            // console.warn('API call failed after retry, using fallback:', retryError)
            return await fallback()
          }
          throw processedError
        }
      }

      // If fallback is available, use it
      if (fallback) {
        // console.warn('API call failed, using fallback:', error)
        return await fallback()
      }

      // Otherwise, throw the processed error
      throw processedError
    }
  }

  /**
   * Log error for monitoring and debugging
   */
  private logError(processedError: ProcessedError): void {
    const logLevel = this.getLogLevel(processedError.severity)
    
    console[logLevel](`[${processedError.type}] ${processedError.technicalMessage}`, {
      id: processedError.id,
      context: processedError.context,
      retryable: processedError.isRetryable,
      retryCount: processedError.retryCount
    })

    // In production, send to error monitoring service
    if ((import.meta as any).env?.PROD) {
      this.sendToErrorService(processedError)
    }
  }

  /**
   * Get console log level based on error severity
   */
  private getLogLevel(severity: ErrorSeverity): 'log' | 'warn' | 'error' {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'log'
      case ErrorSeverity.MEDIUM:
        return 'warn'
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return 'error'
      default:
        return 'warn'
    }
  }

  /**
   * Send error to monitoring service (placeholder)
   */
  private sendToErrorService(processedError: ProcessedError): void {
    // In a real application, this would send to services like:
    // - Sentry
    // - LogRocket
    // - Bugsnag
    // - Custom error tracking service
    
    console.log('Sending error to monitoring service:', {
      id: processedError.id,
      type: processedError.type,
      severity: processedError.severity,
      message: processedError.message,
      context: processedError.context
    })
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number
    byType: Record<ErrorType, number>
    bySeverity: Record<ErrorSeverity, number>
    recent: ProcessedError[]
  } {
    const byType = Object.values(ErrorType).reduce((acc, type) => {
      acc[type] = this.errorLog.filter(error => error.type === type).length
      return acc
    }, {} as Record<ErrorType, number>)

    const bySeverity = Object.values(ErrorSeverity).reduce((acc, severity) => {
      acc[severity] = this.errorLog.filter(error => error.severity === severity).length
      return acc
    }, {} as Record<ErrorSeverity, number>)

    const recent = this.errorLog
      .sort((a, b) => new Date(b.context.timestamp).getTime() - new Date(a.context.timestamp).getTime())
      .slice(0, 10)

    return {
      total: this.errorLog.length,
      byType,
      bySeverity,
      recent
    }
  }

  /**
   * Clear error log
   */
  clearErrorLog(): void {
    this.errorLog = []
    this.retryAttempts.clear()
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance()

// Export utility functions
export const handleError = (error: Error, context?: Partial<ErrorContext>) => 
  errorHandler.processError(error, context)

export const handleApiCall = <T>(
  apiCall: () => Promise<T>,
  fallback?: () => Promise<T>,
  context?: Partial<ErrorContext>
) => errorHandler.handleApiCall(apiCall, fallback, context)
