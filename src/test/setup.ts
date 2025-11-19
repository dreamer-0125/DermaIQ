/**
 * Frontend Test Setup Configuration
 * Following backend testing patterns for comprehensive test coverage
 */

import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { server } from './mocks/server'

// Extend Vitest's expect with jest-dom matchers
// The matchers are automatically available when importing the package

// Mock environment variables for testing
Object.defineProperty(import.meta, 'env', {
  value: {
    MODE: 'test',
    VITE_SUPABASE_URL: 'https://test.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'test-anon-key',
    VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_123',
  },
  writable: true,
})

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock FileReader for file upload tests
const MockFileReader = vi.fn().mockImplementation(() => ({
  readAsDataURL: vi.fn(),
  readAsText: vi.fn(),
  readAsArrayBuffer: vi.fn(),
  result: null,
  error: null,
  onload: null,
  onerror: null,
  onloadend: null,
  onloadstart: null,
  onprogress: null,
  onabort: null,
  abort: vi.fn(),
})) as any

MockFileReader.EMPTY = 0
MockFileReader.LOADING = 1
MockFileReader.DONE = 2

global.FileReader = MockFileReader

// Mock URL.createObjectURL for image tests
global.URL.createObjectURL = vi.fn(() => 'mock-object-url')
global.URL.revokeObjectURL = vi.fn()

// Setup MSW server for API mocking
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

// Performance testing utilities
export const measurePerformance = async (fn: () => Promise<any>, maxTime: number = 5000) => {
  const start = performance.now()
  const result = await fn()
  const end = performance.now()
  const duration = end - start
  
  expect(duration).toBeLessThan(maxTime)
  return { result, duration }
}

// Mock image creation for testing
export const createMockImageFile = (name: string = 'test-wound.jpg', size: number = 1024) => {
  const file = new File(['mock-image-data'], name, { type: 'image/jpeg' })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

// Mock base64 image data
export const createMockBase64Image = () => {
  return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
}

// Error simulation utilities
export const simulateNetworkError = () => {
  return new Error('Failed to fetch')
}

export const simulateTimeoutError = () => {
  const error = new Error('Request timeout')
  error.name = 'AbortError'
  return error
}

export const simulateServerError = (status: number = 500) => {
  const error = new Error(`Server error: ${status}`)
  return error
}
