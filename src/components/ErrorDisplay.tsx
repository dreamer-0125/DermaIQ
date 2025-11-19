/**
 * Enhanced Error Display Component
 * Following backend testing patterns for comprehensive error presentation
 */

import React from 'react'
import { AlertTriangle, RefreshCw, X, Info, AlertCircle, XCircle } from 'lucide-react'
import { ProcessedError, ErrorType, ErrorSeverity } from '../utils/errorHandler'

interface ErrorDisplayProps {
  error: ProcessedError
  onRetry?: () => void
  onDismiss?: () => void
  showDetails?: boolean
  className?: string
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  showDetails = false,
  className = ''
}) => {
  const getIcon = () => {
    switch (error.severity) {
      case ErrorSeverity.LOW:
        return <Info className="w-5 h-5 text-blue-600" />
      case ErrorSeverity.MEDIUM:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case ErrorSeverity.HIGH:
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case ErrorSeverity.CRITICAL:
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />
    }
  }

  const getBackgroundColor = () => {
    switch (error.severity) {
      case ErrorSeverity.LOW:
        return 'bg-blue-50 border-blue-200'
      case ErrorSeverity.MEDIUM:
        return 'bg-yellow-50 border-yellow-200'
      case ErrorSeverity.HIGH:
        return 'bg-orange-50 border-orange-200'
      case ErrorSeverity.CRITICAL:
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getTextColor = () => {
    switch (error.severity) {
      case ErrorSeverity.LOW:
        return 'text-blue-800'
      case ErrorSeverity.MEDIUM:
        return 'text-yellow-800'
      case ErrorSeverity.HIGH:
        return 'text-orange-800'
      case ErrorSeverity.CRITICAL:
        return 'text-red-800'
      default:
        return 'text-gray-800'
    }
  }

  const getRetryButtonColor = () => {
    switch (error.severity) {
      case ErrorSeverity.LOW:
        return 'bg-blue-600 hover:bg-blue-700'
      case ErrorSeverity.MEDIUM:
        return 'bg-yellow-600 hover:bg-yellow-700'
      case ErrorSeverity.HIGH:
        return 'bg-orange-600 hover:bg-orange-700'
      case ErrorSeverity.CRITICAL:
        return 'bg-red-600 hover:bg-red-700'
      default:
        return 'bg-gray-600 hover:bg-gray-700'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getErrorTypeLabel = (type: ErrorType) => {
    switch (type) {
      case ErrorType.NETWORK_ERROR:
        return 'Network Error'
      case ErrorType.TIMEOUT_ERROR:
        return 'Timeout Error'
      case ErrorType.AUTHENTICATION_ERROR:
        return 'Authentication Error'
      case ErrorType.VALIDATION_ERROR:
        return 'Validation Error'
      case ErrorType.SERVER_ERROR:
        return 'Server Error'
      case ErrorType.CLIENT_ERROR:
        return 'Client Error'
      case ErrorType.UNKNOWN_ERROR:
        return 'Unknown Error'
      default:
        return 'Error'
    }
  }

  const getSeverityLabel = (severity: ErrorSeverity) => {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'Low Priority'
      case ErrorSeverity.MEDIUM:
        return 'Medium Priority'
      case ErrorSeverity.HIGH:
        return 'High Priority'
      case ErrorSeverity.CRITICAL:
        return 'Critical'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className={`rounded-lg border p-4 ${getBackgroundColor()} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-sm font-medium ${getTextColor()}`}>
                {getErrorTypeLabel(error.type)}
              </h3>
              <p className={`mt-1 text-sm ${getTextColor()}`}>
                {error.userMessage}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${getTextColor()} hover:bg-white hover:bg-opacity-20 transition-colors`}
                  aria-label="Dismiss error"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Error Details */}
          {showDetails && (
            <div className="mt-3 space-y-2">
              <div className="text-xs text-gray-600">
                <div className="flex items-center space-x-4">
                  <span>Severity: {getSeverityLabel(error.severity)}</span>
                  <span>Time: {formatTimestamp(error.context.timestamp)}</span>
                  {error.isRetryable && (
                    <span>Retryable: Yes ({error.retryCount}/{error.maxRetries})</span>
                  )}
                </div>
              </div>

              {error.context.component && (
                <div className="text-xs text-gray-600">
                  Component: {error.context.component}
                </div>
              )}

              {error.context.action && (
                <div className="text-xs text-gray-600">
                  Action: {error.context.action}
                </div>
              )}

              {/* Technical Details */}
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                  Technical Details
                </summary>
                <div className="mt-2 p-2 bg-gray-100 rounded text-gray-700 font-mono text-xs">
                  <div>ID: {error.id}</div>
                  <div>Type: {error.type}</div>
                  <div>Message: {error.technicalMessage}</div>
                  {error.context.url && <div>URL: {error.context.url}</div>}
                  {error.context.userAgent && (
                    <div>User Agent: {error.context.userAgent}</div>
                  )}
                </div>
              </details>
            </div>
          )}

          {/* Suggestions */}
          {error.suggestions.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-medium text-gray-700 mb-1">Suggestions:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {error.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex items-center space-x-3">
            {onRetry && error.isRetryable && error.retryCount < error.maxRetries && (
              <button
                onClick={onRetry}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white ${getRetryButtonColor()} transition-colors`}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Try Again
              </button>
            )}

            {error.fallbackAvailable && (
              <span className="text-xs text-gray-500">
                Fallback available
              </span>
            )}

            {!error.isRetryable && (
              <span className="text-xs text-gray-500">
                Cannot retry this error
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorDisplay
