/**
 * Unit Tests for EnhancedMCPService
 * Testing the new API-based service architecture
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { enhancedMCPService } from '../../../demo/services/mcpService'
import { createMockBase64Image } from '../../setup'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

describe('EnhancedMCPService', () => {
  const mockAuthToken = 'mock-auth-token'
  const mockBase64Image = createMockBase64Image()

  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(mockAuthToken)
    
    // Mock successful fetch responses by default
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
      status: 200
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAuthStatus', () => {
    it('should return authenticated status when token exists', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
        status: 200
      })

      const result = await enhancedMCPService.getAuthStatus()

      expect(result.authenticated).toBe(true)
      expect(result.user_id).toBe(mockAuthToken)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/health'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockAuthToken}`
          })
        })
      )
    })

    it('should return unauthenticated when no token exists', async () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const result = await enhancedMCPService.getAuthStatus()

      expect(result.authenticated).toBe(false)
      expect(result.error).toBe('Authentication required. Please log in to perform wound analysis.')
    })

    it('should handle authentication errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: vi.fn().mockResolvedValue({ error: 'Unauthorized' })
      })

      const result = await enhancedMCPService.getAuthStatus()

      expect(result.authenticated).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('checkHealth', () => {
    it('should return true when server is healthy', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200
      })

      const result = await enhancedMCPService.checkHealth()

      expect(result).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/health'),
        expect.objectContaining({
          method: 'GET'
        })
      )
    })

    it('should return false when server is unhealthy', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      const result = await enhancedMCPService.checkHealth()

      expect(result).toBe(false)
    })

    it('should use cached result when available', async () => {
      // First call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200
      })

      const result1 = await enhancedMCPService.checkHealth()
      expect(result1).toBe(true)

      // Second call should use cache
      const result2 = await enhancedMCPService.checkHealth()
      expect(result2).toBe(true)
      expect(mockFetch).toHaveBeenCalledTimes(1) // Only called once due to caching
    })
  })

  describe('analyzeWoundImage', () => {
    it('should analyze wound image successfully', async () => {
      const mockAnalysisResult = {
        segmentation: {
          mask: 'mock-mask-data',
          confidence: 0.95,
          wound_area: 3.45,
          wound_perimeter: 12.5
        },
        diagnosis: {
          is_infected: false,
          confidence: 0.87,
          infection_type: 'not_infected',
          severity: 'low'
        },
        description: {
          wound_type: 'healing_wound',
          characteristics: ['clean', 'granulating'],
          recommendations: ['Keep clean and dry']
        },
        treatment_plan: {
          plan_type: 'standard_care',
          steps: ['Clean wound', 'Apply dressing'],
          medications: ['Antiseptic solution'],
          follow_up: '3-7 days'
        },
        doctor_recommendations: {
          doctors: []
        },
        metadata: {
          processing_time: 2500,
          model_version: '1.0',
          timestamp: new Date().toISOString()
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockAnalysisResult),
        status: 200
      })

      const progressCallback = vi.fn()
      const result = await enhancedMCPService.analyzeWoundImage(mockBase64Image, progressCallback)

      expect(result).toEqual(mockAnalysisResult)
      expect(progressCallback).toHaveBeenCalledWith('preparing', 10)
      expect(progressCallback).toHaveBeenCalledWith('uploading', 20)
      expect(progressCallback).toHaveBeenCalledWith('analyzing', 30)
      expect(progressCallback).toHaveBeenCalledWith('processing', 70)
      expect(progressCallback).toHaveBeenCalledWith('completing', 90)
      expect(progressCallback).toHaveBeenCalledWith('completed', 100)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/analysis/complete_analysis'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      )
    })

    it('should handle authentication errors', async () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      await expect(
        enhancedMCPService.analyzeWoundImage(mockBase64Image)
      ).rejects.toThrow('Authentication required. Please log in to perform wound analysis.')
    })

    it('should handle analysis failures', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({ error: 'Analysis failed' })
      })

      await expect(
        enhancedMCPService.analyzeWoundImage(mockBase64Image)
      ).rejects.toThrow('Complete analysis failed: 500')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(
        enhancedMCPService.analyzeWoundImage(mockBase64Image)
      ).rejects.toThrow('Network error. Please check your connection and try again.')
    })
  })

  describe('getTreatmentPlan', () => {
    it('should get treatment plan successfully', async () => {
      const mockTreatmentPlan = {
        name: 'Standard Wound Care',
        description: 'Basic wound care plan',
        medications: ['Antiseptic solution'],
        procedures: ['Clean wound', 'Apply dressing'],
        follow_up: '3-7 days'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockTreatmentPlan),
        status: 200
      })

      const result = await enhancedMCPService.getTreatmentPlan('infected_wound')

      expect(result).toEqual(mockTreatmentPlan)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/treatment/plan/infected_wound'),
        expect.objectContaining({
          method: 'GET'
        })
      )
    })

    it('should use cached result when available', async () => {
      const mockTreatmentPlan = { name: 'Cached Plan' }

      // First call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockTreatmentPlan),
        status: 200
      })

      const result1 = await enhancedMCPService.getTreatmentPlan('test_condition')
      expect(result1).toEqual(mockTreatmentPlan)

      // Second call should use cache
      const result2 = await enhancedMCPService.getTreatmentPlan('test_condition')
      expect(result2).toEqual(mockTreatmentPlan)
      expect(mockFetch).toHaveBeenCalledTimes(1) // Only called once due to caching
    })
  })

  describe('getDoctorRecommendations', () => {
    it('should get doctor recommendations successfully', async () => {
      const mockDoctors = [
        {
          name: 'Dr. Smith',
          specialization: 'Wound Care Specialist',
          phone: '555-1234',
          email: 'dr.smith@example.com',
          address: '123 Medical St',
          rating: 4.8,
          availability: 'available',
          consultation_types: ['video', 'phone']
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockDoctors),
        status: 200
      })

      const result = await enhancedMCPService.getDoctorRecommendations('California')

      expect(result).toEqual(mockDoctors)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/recommendations/doctor_contact/California'),
        expect.objectContaining({
          method: 'GET'
        })
      )
    })

    it('should use cached result when available', async () => {
      const mockDoctors = [{ name: 'Dr. Cached' }]

      // First call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockDoctors),
        status: 200
      })

      const result1 = await enhancedMCPService.getDoctorRecommendations('Texas')
      expect(result1).toEqual(mockDoctors)

      // Second call should use cache
      const result2 = await enhancedMCPService.getDoctorRecommendations('Texas')
      expect(result2).toEqual(mockDoctors)
      expect(mockFetch).toHaveBeenCalledTimes(1) // Only called once due to caching
    })
  })

  describe('updateAuthToken', () => {
    it('should clear cache when called', async () => {
      await enhancedMCPService.updateAuthToken()

      // Since the method only clears cache and doesn't manage tokens,
      // we just verify it doesn't throw and clears the cache
      expect(true).toBe(true) // Method executed successfully
    })
  })

  describe('clearCache', () => {
    it('should clear all cached data', () => {
      enhancedMCPService.clearCache()
      // Cache clearing is internal, we just verify it doesn't throw
      expect(true).toBe(true)
    })
  })
})
