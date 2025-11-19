/**
 * Integration Tests for Complete Frontend Workflow
 * Testing the new API-based service architecture
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { enhancedMCPService } from '../../demo/services/mcpService'
import { cacheService } from '../../demo/services/cacheService'
import { createMockBase64Image, measurePerformance } from '../setup'

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

// Mock demo component for testing (removed unused component)

describe('Complete Workflow Integration Tests', () => {
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
    cacheService.clear()
  })

  describe('Complete Analysis Workflow', () => {
    it('should complete full analysis workflow successfully', async () => {
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
          doctors: [{
            name: 'Dr. Sarah Johnson',
            specialization: 'Wound Care Specialist',
            phone: '(555) 123-4567',
            email: 'sarah.johnson@healthcare.com',
            address: '123 Medical Center Dr, California',
            rating: 4.8,
            availability: 'available',
            consultation_types: ['video', 'phone']
          }]
        },
        metadata: {
          processing_time: 2500,
          model_version: '1.0',
          timestamp: new Date().toISOString()
        }
      }

      const mockTreatmentPlan = {
        name: 'Standard Wound Care Plan',
        description: 'Basic wound care recommendations',
        medications: ['Antiseptic solution', 'Sterile gauze'],
        procedures: ['Clean the wound', 'Apply dressing'],
        follow_up: '3-7 days'
      }

      const mockDoctors = [{
        name: 'Dr. Sarah Johnson',
        specialization: 'Wound Care Specialist',
        phone: '(555) 123-4567',
        email: 'sarah.johnson@healthcare.com',
        address: '123 Medical Center Dr, California',
        rating: 4.8,
        availability: 'available',
        consultation_types: ['video', 'phone']
      }]

      // Mock API responses
      mockFetch
        .mockResolvedValueOnce({ // Health check
          ok: true,
          status: 200
        })
        .mockResolvedValueOnce({ // Analysis
          ok: true,
          json: vi.fn().mockResolvedValue(mockAnalysisResult),
          status: 200
        })
        .mockResolvedValueOnce({ // Treatment plan
          ok: true,
          json: vi.fn().mockResolvedValue(mockTreatmentPlan),
          status: 200
        })
        .mockResolvedValueOnce({ // Doctor recommendations
          ok: true,
          json: vi.fn().mockResolvedValue(mockDoctors),
          status: 200
        })

      // Measure complete workflow performance
      const { duration } = await measurePerformance(async () => {
        // Step 1: Check server health
        const isHealthy = await enhancedMCPService.checkHealth()
        expect(isHealthy).toBe(true)

        // Step 2: Analyze wound image
        const progressCallback = vi.fn()
        const analysisResult = await enhancedMCPService.analyzeWoundImage(mockBase64Image, progressCallback)
        
        expect(analysisResult).toEqual(mockAnalysisResult)
        expect(progressCallback).toHaveBeenCalledWith('preparing', 10)
        expect(progressCallback).toHaveBeenCalledWith('completed', 100)

        // Step 3: Get treatment plan
        const treatmentPlan = await enhancedMCPService.getTreatmentPlan('not_infected')
        expect(treatmentPlan).toEqual(mockTreatmentPlan)

        // Step 4: Get doctor recommendations
        const doctors = await enhancedMCPService.getDoctorRecommendations('California')
        expect(doctors).toHaveLength(1)
        expect(doctors[0].name).toBe('Dr. Sarah Johnson')

        return { analysisResult, treatmentPlan, doctors }
      }, 10000) // 10 second target

      expect(duration).toBeLessThan(10000)
      // console.log(`Complete workflow completed in ${duration.toFixed(2)}ms`)
    })

    it('should handle API errors gracefully', async () => {
      // Mock API failure
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({ error: 'Server error' })
      })

      const { duration } = await measurePerformance(async () => {
        // Should handle API errors gracefully
        await expect(
          enhancedMCPService.analyzeWoundImage(mockBase64Image)
        ).rejects.toThrow('Complete analysis failed: 500')

        return { error: 'handled' }
      }, 5000) // 5 second target for error handling

      expect(duration).toBeLessThan(5000)
      // console.log(`Error handling completed in ${duration.toFixed(2)}ms`)
    })

    it('should handle multiple concurrent API calls', async () => {
      const mockAnalysisResult = {
        segmentation: { mask: 'mock-mask', confidence: 0.95, wound_area: 3.45, wound_perimeter: 12.5 },
        diagnosis: { is_infected: false, confidence: 0.87, infection_type: 'not_infected', severity: 'low' },
        description: { wound_type: 'healing_wound', characteristics: ['clean'], recommendations: ['Keep clean'] },
        treatment_plan: { plan_type: 'standard_care', steps: ['Clean wound'], medications: ['Antiseptic'], follow_up: '3-7 days' },
        doctor_recommendations: { doctors: [] },
        metadata: { processing_time: 2500, model_version: '1.0', timestamp: new Date().toISOString() }
      }

      // Mock multiple API responses
      mockFetch
        .mockResolvedValue({ // Health checks
          ok: true,
          status: 200
        })
        .mockResolvedValue({ // Analysis calls
          ok: true,
          json: vi.fn().mockResolvedValue(mockAnalysisResult),
          status: 200
        })

      const { duration } = await measurePerformance(async () => {
        // Start 3 concurrent analysis workflows
        const analysisPromises = Array.from({ length: 3 }, () => 
          enhancedMCPService.analyzeWoundImage(mockBase64Image)
        )

        const results = await Promise.all(analysisPromises)
        expect(results).toHaveLength(3)
        results.forEach(result => {
          expect(result).toEqual(mockAnalysisResult)
        })

        return { results }
      }, 15000) // 15 second target for concurrent workflows

      expect(duration).toBeLessThan(15000)
      // console.log(`3 concurrent API calls completed in ${duration.toFixed(2)}ms`)
    })
  })

  describe('Error Recovery Workflow', () => {
    it('should handle authentication errors gracefully', async () => {
      mockLocalStorage.getItem.mockReturnValue(null) // No auth token

      const { duration } = await measurePerformance(async () => {
        // Should handle authentication errors
        await expect(
          enhancedMCPService.analyzeWoundImage(mockBase64Image)
        ).rejects.toThrow('Authentication required. Please log in to perform wound analysis.')

        return { error: 'handled' }
      }, 2000) // 2 second target for auth error handling

      expect(duration).toBeLessThan(2000)
      // console.log(`Authentication error handling completed in ${duration.toFixed(2)}ms`)
    })

    it('should handle network timeouts gracefully', async () => {
      // Mock network timeout
      mockFetch.mockRejectedValueOnce(new Error('Network timeout'))

      const { duration } = await measurePerformance(async () => {
        // Should handle network timeouts
        await expect(
          enhancedMCPService.analyzeWoundImage(mockBase64Image)
        ).rejects.toThrow('Network error. Please check your connection and try again.')

        return { error: 'handled' }
      }, 5000) // 5 second target for timeout handling

      expect(duration).toBeLessThan(5000)
      // console.log(`Network timeout handling completed in ${duration.toFixed(2)}ms`)
    })
  })
})
