/**
 * Unit Tests for ErrorHandler
 * Following backend testing patterns for comprehensive error management testing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ErrorHandler, ErrorType, ErrorSeverity } from '../../../utils/errorHandler'

describe('ErrorHandler', () => {
  let handler: ErrorHandler

  beforeEach(() => {
    handler = ErrorHandler.getInstance()
    handler.clearErrorLog()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('processError', () => {
    it('should categorize network errors correctly', () => {
      const networkError = new Error('Failed to fetch')
      const processedError = handler.processError(networkError, {
        component: 'MCPService',
        action: 'analyzeWoundImage'
      })

      expect(processedError.type).toBe(ErrorType.NETWORK_ERROR)
      expect(processedError.severity).toBe(ErrorSeverity.MEDIUM)
      expect(processedError.isRetryable).toBe(true)
      expect(processedError.maxRetries).toBe(3)
      expect(processedError.userMessage).toContain('Unable to connect to the server')
    })

    it('should categorize timeout errors correctly', () => {
      const timeoutError = new Error('Request timeout')
      timeoutError.name = 'AbortError'
      
      const processedError = handler.processError(timeoutError, {
        component: 'AnalysisService',
        action: 'startAnalysis'
      })

      expect(processedError.type).toBe(ErrorType.TIMEOUT_ERROR)
      expect(processedError.severity).toBe(ErrorSeverity.MEDIUM)
      expect(processedError.isRetryable).toBe(true)
      expect(processedError.maxRetries).toBe(2)
      expect(processedError.userMessage).toContain('taking longer than expected')
    })

    it('should categorize authentication errors correctly', () => {
      const authError = new Error('403 Forbidden')
      
      const processedError = handler.processError(authError, {
        component: 'AuthService',
        action: 'validateToken'
      })

      expect(processedError.type).toBe(ErrorType.AUTHENTICATION_ERROR)
      expect(processedError.severity).toBe(ErrorSeverity.HIGH)
      expect(processedError.isRetryable).toBe(false)
      expect(processedError.maxRetries).toBe(0)
      expect(processedError.userMessage).toContain('session has expired')
    })

    it('should categorize validation errors correctly', () => {
      const validationError = new Error('Invalid image format')
      
      const processedError = handler.processError(validationError, {
        component: 'ImageUpload',
        action: 'validateFile'
      })

      expect(processedError.type).toBe(ErrorType.VALIDATION_ERROR)
      expect(processedError.severity).toBe(ErrorSeverity.LOW)
      expect(processedError.isRetryable).toBe(false)
      expect(processedError.maxRetries).toBe(0)
      expect(processedError.userMessage).toContain('check your input')
    })

    it('should categorize server errors correctly', () => {
      const serverError = new Error('500 Internal Server Error')
      
      const processedError = handler.processError(serverError, {
        component: 'APIService',
        action: 'makeRequest'
      })

      expect(processedError.type).toBe(ErrorType.SERVER_ERROR)
      expect(processedError.severity).toBe(ErrorSeverity.HIGH)
      expect(processedError.isRetryable).toBe(true)
      expect(processedError.maxRetries).toBe(2)
      expect(processedError.userMessage).toContain('temporarily unavailable')
    })

    it('should categorize client errors correctly', () => {
      const clientError = new Error('400 Bad Request')
      
      const processedError = handler.processError(clientError, {
        component: 'FormComponent',
        action: 'submitForm'
      })

      expect(processedError.type).toBe(ErrorType.CLIENT_ERROR)
      expect(processedError.severity).toBe(ErrorSeverity.MEDIUM)
      expect(processedError.isRetryable).toBe(false)
      expect(processedError.maxRetries).toBe(0)
      expect(processedError.userMessage).toContain('issue with your request')
    })

    it('should categorize unknown errors correctly', () => {
      const unknownError = new Error('Something unexpected happened')
      
      const processedError = handler.processError(unknownError, {
        component: 'UnknownComponent',
        action: 'unknownAction'
      })

      expect(processedError.type).toBe(ErrorType.UNKNOWN_ERROR)
      expect(processedError.severity).toBe(ErrorSeverity.MEDIUM)
      expect(processedError.isRetryable).toBe(true)
      expect(processedError.maxRetries).toBe(1)
      expect(processedError.userMessage).toContain('unexpected error occurred')
    })

    it('should include context information', () => {
      const error = new Error('Test error')
      const context = {
        component: 'TestComponent',
        action: 'testAction',
        userId: 'user-123',
        additionalData: { field: 'test' }
      }

      const processedError = handler.processError(error, context)

      expect(processedError.context.component).toBe('TestComponent')
      expect(processedError.context.action).toBe('testAction')
      expect(processedError.context.userId).toBe('user-123')
      expect(processedError.context.additionalData).toEqual({ field: 'test' })
      expect(processedError.context.timestamp).toBeDefined()
      expect(processedError.context.userAgent).toBe(navigator.userAgent)
      expect(processedError.context.url).toBe(window.location.href)
    })

    it('should generate appropriate suggestions for each error type', () => {
      const networkError = new Error('Failed to fetch')
      const processedError = handler.processError(networkError)

      expect(processedError.suggestions).toContain('Check your internet connection')
      expect(processedError.suggestions).toContain('Try refreshing the page')
      expect(processedError.suggestions).toContain('Disable any VPN or proxy settings')
    })

    it('should allow custom options', () => {
      const error = new Error('Test error')
      const options = {
        maxRetries: 5,
        fallbackAvailable: true,
        severity: ErrorSeverity.CRITICAL
      }

      const processedError = handler.processError(error, {}, options)

      expect(processedError.maxRetries).toBe(5)
      expect(processedError.fallbackAvailable).toBe(true)
      expect(processedError.severity).toBe(ErrorSeverity.CRITICAL)
    })
  })

  describe('retryOperation', () => {
    it('should retry operation with exponential backoff', async () => {
      const mockOperation = vi.fn()
        .mockRejectedValueOnce(new Error('First attempt fails'))
        .mockRejectedValueOnce(new Error('Second attempt fails'))
        .mockResolvedValueOnce('Success')

      const errorId = 'test-error-123'
      const result = await handler.retryOperation(mockOperation, errorId, 100)

      expect(result).toBe('Success')
      expect(mockOperation).toHaveBeenCalledTimes(3)
    })

    it('should respect max retries', async () => {
      const mockOperation = vi.fn().mockRejectedValue(new Error('Always fails'))
      const errorId = 'test-error-456'

      await expect(
        handler.retryOperation(mockOperation, errorId, 10, 2)
      ).rejects.toThrow('Max retries (2) exceeded')

      expect(mockOperation).toHaveBeenCalledTimes(2)
    })

    it('should track retry attempts', async () => {
      const mockOperation = vi.fn().mockRejectedValue(new Error('Fails'))
      const errorId = 'test-error-789'

      try {
        await handler.retryOperation(mockOperation, errorId, 10, 1)
      } catch (error) {
        // Expected to fail
      }

      const retryCount = handler['retryAttempts'].get(errorId)
      expect(retryCount).toBe(1)
    })
  })

  describe('handleApiCall', () => {
    it('should return successful result', async () => {
      const mockApiCall = vi.fn().mockResolvedValue('Success')
      const result = await handler.handleApiCall(mockApiCall)

      expect(result).toBe('Success')
      expect(mockApiCall).toHaveBeenCalledTimes(1)
    })

    it('should retry on retryable errors', async () => {
      const mockApiCall = vi.fn()
        .mockRejectedValueOnce(new Error('Failed to fetch'))
        .mockResolvedValueOnce('Success')

      const result = await handler.handleApiCall(mockApiCall)

      expect(result).toBe('Success')
      expect(mockApiCall).toHaveBeenCalledTimes(2)
    })

    it('should use fallback when available', async () => {
      const mockApiCall = vi.fn().mockRejectedValue(new Error('API fails'))
      const mockFallback = vi.fn().mockResolvedValue('Fallback success')

      const result = await handler.handleApiCall(mockApiCall, mockFallback)

      expect(result).toBe('Fallback success')
      expect(mockApiCall).toHaveBeenCalledTimes(1)
      expect(mockFallback).toHaveBeenCalledTimes(1)
    })

    it('should use fallback after retry fails', async () => {
      const mockApiCall = vi.fn().mockRejectedValue(new Error('Failed to fetch'))
      const mockFallback = vi.fn().mockResolvedValue('Fallback success')

      const result = await handler.handleApiCall(mockApiCall, mockFallback)

      expect(result).toBe('Fallback success')
      expect(mockApiCall).toHaveBeenCalledTimes(3) // Initial + 2 retries
      expect(mockFallback).toHaveBeenCalledTimes(1)
    })

    it('should throw processed error when no fallback available', async () => {
      const mockApiCall = vi.fn().mockRejectedValue(new Error('Failed to fetch'))

      await expect(
        handler.handleApiCall(mockApiCall)
      ).rejects.toMatchObject({
        type: ErrorType.NETWORK_ERROR,
        severity: ErrorSeverity.MEDIUM
      })
    })

    it('should include context in processed error', async () => {
      const mockApiCall = vi.fn().mockRejectedValue(new Error('Test error'))
      const context = { component: 'TestComponent', action: 'testAction' }

      try {
        await handler.handleApiCall(mockApiCall, undefined, context)
      } catch (error: any) {
        expect(error.context.component).toBe('TestComponent')
        expect(error.context.action).toBe('testAction')
      }
    })
  })

  describe('getErrorStats', () => {
    it('should return correct error statistics', () => {
      // Add some test errors
      handler.processError(new Error('Network error'), { component: 'Test1' })
      handler.processError(new Error('Timeout error'), { component: 'Test2' })
      handler.processError(new Error('Validation error'), { component: 'Test3' })

      const stats = handler.getErrorStats()

      expect(stats.total).toBe(3)
      expect(stats.byType[ErrorType.NETWORK_ERROR]).toBe(1)
      expect(stats.byType[ErrorType.TIMEOUT_ERROR]).toBe(1)
      expect(stats.byType[ErrorType.VALIDATION_ERROR]).toBe(1)
      expect(stats.bySeverity[ErrorSeverity.MEDIUM]).toBe(2)
      expect(stats.bySeverity[ErrorSeverity.LOW]).toBe(1)
      expect(stats.recent).toHaveLength(3)
    })

    it('should return recent errors in correct order', async () => {
      const error1 = handler.processError(new Error('First error'))
      await new Promise(resolve => setTimeout(resolve, 1))
      const error2 = handler.processError(new Error('Second error'))
      await new Promise(resolve => setTimeout(resolve, 1))
      const error3 = handler.processError(new Error('Third error'))

      const stats = handler.getErrorStats()

      expect(stats.recent[0].id).toBe(error3.id) // Most recent first
      expect(stats.recent[1].id).toBe(error2.id)
      expect(stats.recent[2].id).toBe(error1.id)
    })
  })

  describe('clearErrorLog', () => {
    it('should clear all errors and retry attempts', () => {
      // Add some errors
      handler.processError(new Error('Test error 1'))
      handler.processError(new Error('Test error 2'))

      // Add some retry attempts
      handler['retryAttempts'].set('test-1', 2)
      handler['retryAttempts'].set('test-2', 1)

      expect(handler.getErrorStats().total).toBe(2)
      expect(handler['retryAttempts'].size).toBe(2)

      handler.clearErrorLog()

      expect(handler.getErrorStats().total).toBe(0)
      expect(handler['retryAttempts'].size).toBe(0)
    })
  })

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ErrorHandler.getInstance()
      const instance2 = ErrorHandler.getInstance()

      expect(instance1).toBe(instance2)
    })
  })

  describe('error ID generation', () => {
    it('should generate unique error IDs', () => {
      const error1 = handler.processError(new Error('Error 1'))
      const error2 = handler.processError(new Error('Error 2'))

      expect(error1.id).not.toBe(error2.id)
      expect(error1.id).toMatch(/^error_\d+_[a-z0-9]+$/)
      expect(error2.id).toMatch(/^error_\d+_[a-z0-9]+$/)
    })
  })

  describe('log levels', () => {
    it('should use correct log levels for different severities', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      handler.processError(new Error('Low severity'), {}, { severity: ErrorSeverity.LOW })
      handler.processError(new Error('Medium severity'), {}, { severity: ErrorSeverity.MEDIUM })
      handler.processError(new Error('High severity'), {}, { severity: ErrorSeverity.HIGH })

      expect(consoleSpy).toHaveBeenCalled()
      expect(warnSpy).toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
      warnSpy.mockRestore()
      errorSpy.mockRestore()
    })
  })
})
