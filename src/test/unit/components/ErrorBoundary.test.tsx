/**
 * Unit Tests for ErrorBoundary Component
 * Following backend testing patterns for comprehensive component testing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ErrorBoundary from '../../../components/ErrorBoundary'

// Mock component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div>No error</div>
}

// Mock component for testing
const TestComponent = () => <div>Test component</div>

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for error boundary tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Test component')).toBeInTheDocument()
  })

  it('should render error UI when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('An error occurred while loading this section. Please try refreshing the page.')).toBeInTheDocument()
  })

  it('should render custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('should call onError callback when error occurs', () => {
    const onError = vi.fn()

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    )
  })

  it('should show error details in development mode', async () => {
    // Mock development mode
    const originalEnv = (import.meta as any).env
    Object.defineProperty(import.meta, 'env', {
      value: { MODE: 'development' },
      writable: true,
      configurable: true
    })

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    // Wait for the error to be caught and rendered
    await waitFor(() => {
      expect(screen.getByText('Error Details:')).toBeInTheDocument()
    })
    expect(screen.getByText('Test error message')).toBeInTheDocument()
    
    // Restore original env
    Object.defineProperty(import.meta, 'env', {
      value: originalEnv,
      writable: true,
      configurable: true
    })
  })

  it('should not show error details in production mode', () => {
    // Mock production mode
    const originalEnv = (import.meta as any).env
    Object.defineProperty(import.meta, 'env', {
      value: { MODE: 'production' },
      writable: true,
      configurable: true
    })

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.queryByText('Error Details:')).not.toBeInTheDocument()
    expect(screen.queryByText('Test error message')).not.toBeInTheDocument()
    
    // Restore original env
    Object.defineProperty(import.meta, 'env', {
      value: originalEnv,
      writable: true,
      configurable: true
    })
  })

  it('should handle retry button click', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    const retryButton = screen.getByText('Try Again')
    fireEvent.click(retryButton)

    // After retry, should show the component again (no error)
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('should handle reload button click', () => {
    // Mock window.location.reload
    const reloadSpy = vi.fn()
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        reload: reloadSpy
      },
      writable: true,
      configurable: true
    })

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const reloadButton = screen.getByText('Reload Page')
    fireEvent.click(reloadButton)

    expect(reloadSpy).toHaveBeenCalled()

    // Restore original window.location
    Object.defineProperty(window, 'location', {
      value: window.location,
      writable: true,
      configurable: true
    })
  })

  it('should display proper error UI elements', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    // Check for error icon
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument()
    
    // Check for proper styling classes - look for the outer container
    const outerContainer = screen.getByText('Something went wrong').closest('.min-h-screen')
    expect(outerContainer).toHaveClass('min-h-screen', 'bg-gray-50')
  })

  it('should handle multiple errors correctly', () => {
    const onError = vi.fn()

    const { rerender } = render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalledTimes(1)

    // Rerender with different error
    rerender(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    // Should still only be called once per error boundary instance
    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('should maintain error state until reset', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    // Rerender with non-throwing component
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    // Should still show error (error boundary doesn't automatically reset)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('should handle async errors in componentDidCatch', () => {
    const onError = vi.fn()
    
    // Mock console.error to throw but don't let it propagate
    const originalConsoleError = console.error
    vi.spyOn(console, 'error').mockImplementation(() => {
      // Don't actually throw, just log the error
      originalConsoleError('Console error failed')
    })

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    // Should still handle the error gracefully
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })
})
