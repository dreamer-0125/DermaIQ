/**
 * Enhanced Error Handler Hook
 * Following backend testing patterns for comprehensive error management
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { ProcessedError, ErrorType, ErrorSeverity, errorHandler } from '../utils/errorHandler'

interface UseErrorHandlerOptions {
  maxErrors?: number
  autoRetry?: boolean
  retryDelay?: number
  onError?: (error: ProcessedError) => void
  onRetry?: (error: ProcessedError) => void
  onDismiss?: (error: ProcessedError) => void
}

interface UseErrorHandlerReturn {
  errors: ProcessedError[]
  addError: (error: Error, context?: any) => ProcessedError
  removeError: (errorId: string) => void
  clearErrors: () => void
  retryError: (errorId: string) => Promise<void>
  retryAllErrors: () => Promise<void>
  getErrorsByType: (type: ErrorType) => ProcessedError[]
  getErrorsBySeverity: (severity: ErrorSeverity) => ProcessedError[]
  hasErrors: boolean
  hasRetryableErrors: boolean
  errorStats: {
    total: number
    byType: Record<ErrorType, number>
    bySeverity: Record<ErrorSeverity, number>
  }
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}): UseErrorHandlerReturn => {
  const {
    maxErrors = 10,
    autoRetry = false,
    retryDelay = 1000,
    onError,
    onRetry,
    onDismiss
  } = options

  const [errors, setErrors] = useState<ProcessedError[]>([])
  const retryTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      retryTimeouts.current.forEach(timeout => clearTimeout(timeout))
      retryTimeouts.current.clear()
    }
  }, [])

  const addError = useCallback((error: Error, context: any = {}): ProcessedError => {
    const processedError = errorHandler.processError(error, context)
    
    setErrors(prev => {
      const newErrors = [processedError, ...prev].slice(0, maxErrors)
      return newErrors
    })

    // Call error callback
    onError?.(processedError)

    // Auto-retry if enabled and error is retryable
    if (autoRetry && processedError.isRetryable && processedError.retryCount < processedError.maxRetries) {
      const timeout = setTimeout(() => {
        retryError(processedError.id)
      }, retryDelay)
      
      retryTimeouts.current.set(processedError.id, timeout)
    }

    return processedError
  }, [maxErrors, autoRetry, retryDelay, onError])

  const removeError = useCallback((errorId: string) => {
    setErrors(prev => prev.filter(error => error.id !== errorId))
    
    // Clear any pending retry timeout
    const timeout = retryTimeouts.current.get(errorId)
    if (timeout) {
      clearTimeout(timeout)
      retryTimeouts.current.delete(errorId)
    }

    // Find and call dismiss callback
    const error = errors.find(e => e.id === errorId)
    if (error) {
      onDismiss?.(error)
    }
  }, [errors, onDismiss])

  const clearErrors = useCallback(() => {
    setErrors([])
    
    // Clear all pending retry timeouts
    retryTimeouts.current.forEach(timeout => clearTimeout(timeout))
    retryTimeouts.current.clear()
  }, [])

  const retryError = useCallback(async (errorId: string) => {
    const error = errors.find(e => e.id === errorId)
    if (!error || !error.isRetryable || error.retryCount >= error.maxRetries) {
      return
    }

    // Clear any existing timeout
    const timeout = retryTimeouts.current.get(errorId)
    if (timeout) {
      clearTimeout(timeout)
      retryTimeouts.current.delete(errorId)
    }

    // Call retry callback
    onRetry?.(error)

    // Update retry count
    setErrors(prev => prev.map(e => 
      e.id === errorId 
        ? { ...e, retryCount: e.retryCount + 1 }
        : e
    ))
  }, [errors, onRetry])

  const retryAllErrors = useCallback(async () => {
    const retryableErrors = errors.filter(error => 
      error.isRetryable && error.retryCount < error.maxRetries
    )

    for (const error of retryableErrors) {
      await retryError(error.id)
    }
  }, [errors, retryError])

  const getErrorsByType = useCallback((type: ErrorType) => {
    return errors.filter(error => error.type === type)
  }, [errors])

  const getErrorsBySeverity = useCallback((severity: ErrorSeverity) => {
    return errors.filter(error => error.severity === severity)
  }, [errors])

  const hasErrors = errors.length > 0
  const hasRetryableErrors = errors.some(error => 
    error.isRetryable && error.retryCount < error.maxRetries
  )

  const errorStats = {
    total: errors.length,
    byType: Object.values(ErrorType).reduce((acc, type) => {
      acc[type] = getErrorsByType(type).length
      return acc
    }, {} as Record<ErrorType, number>),
    bySeverity: Object.values(ErrorSeverity).reduce((acc, severity) => {
      acc[severity] = getErrorsBySeverity(severity).length
      return acc
    }, {} as Record<ErrorSeverity, number>)
  }

  return {
    errors,
    addError,
    removeError,
    clearErrors,
    retryError,
    retryAllErrors,
    getErrorsByType,
    getErrorsBySeverity,
    hasErrors,
    hasRetryableErrors,
    errorStats
  }
}

// Hook for handling API errors specifically
export const useApiErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const errorHandler = useErrorHandler(options)

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    fallback?: () => Promise<T>,
    context: any = {}
  ): Promise<T> => {
    try {
      return await apiCall()
    } catch (error) {
      const processedError = errorHandler.addError(error as Error, {
        ...context,
        action: 'api_call'
      })

      // If fallback is available, use it
      if (fallback) {
        try {
          return await fallback()
        } catch (fallbackError) {
          errorHandler.addError(fallbackError as Error, {
            ...context,
            action: 'fallback_call'
          })
          throw fallbackError
        }
      }

      throw processedError
    }
  }, [errorHandler])

  return {
    ...errorHandler,
    handleApiCall
  }
}

// Hook for handling form validation errors
export const useValidationErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const errorHandler = useErrorHandler(options)

  const addValidationError = useCallback((field: string, message: string, context: any = {}) => {
    const error = new Error(`Validation failed for ${field}: ${message}`)
    return errorHandler.addError(error, {
      ...context,
      component: 'form',
      action: 'validation',
      field
    })
  }, [errorHandler])

  const getFieldErrors = useCallback((field: string) => {
    return errorHandler.errors.filter(error => 
      error.context.additionalData?.field === field
    )
  }, [errorHandler.errors])

  const clearFieldErrors = useCallback((field: string) => {
    const fieldErrors = getFieldErrors(field)
    fieldErrors.forEach(error => errorHandler.removeError(error.id))
  }, [getFieldErrors, errorHandler.removeError])

  return {
    ...errorHandler,
    addValidationError,
    getFieldErrors,
    clearFieldErrors
  }
}
