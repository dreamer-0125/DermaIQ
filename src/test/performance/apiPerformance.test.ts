/**
 * Performance Tests for Enhanced MCP Service API Calls
 * Testing the new API-based service architecture performance
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { enhancedMCPService } from '../../demo/services/mcpService'
import { measurePerformance, createMockBase64Image } from '../setup'

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

describe('API Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue('mock-auth-token')
    
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

  describe('Enhanced MCP Service Performance', () => {
    it('should complete health check within 1 second', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200
      })

      const { duration } = await measurePerformance(
        () => enhancedMCPService.checkHealth(),
        1000 // 1 second target
      )

      expect(duration).toBeLessThan(1000)
      // console.log(`Health check completed in ${duration.toFixed(2)}ms`)
    })

    it('should complete wound analysis within 5 seconds', async () => {
      const mockBase64Image = createMockBase64Image()
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

      const { duration } = await measurePerformance(
        () => enhancedMCPService.analyzeWoundImage(mockBase64Image),
        5000 // 5 second target
      )

      expect(duration).toBeLessThan(5000)
      // console.log(`Wound analysis completed in ${duration.toFixed(2)}ms`)
    })

    it('should complete treatment plan retrieval within 0.5 seconds', async () => {
      const mockTreatmentPlan = {
        name: 'Standard Wound Care Plan',
        description: 'Basic wound care recommendations',
        medications: ['Antiseptic solution', 'Sterile gauze'],
        procedures: ['Clean the wound', 'Apply dressing'],
        follow_up: '3-7 days'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockTreatmentPlan),
        status: 200
      })

      const { duration } = await measurePerformance(
        () => enhancedMCPService.getTreatmentPlan('not_infected'),
        500 // 0.5 second target
      )

      expect(duration).toBeLessThan(500)
      // console.log(`Treatment plan retrieval completed in ${duration.toFixed(2)}ms`)
    })

    it('should complete doctor recommendations within 0.5 seconds', async () => {
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

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockDoctors),
        status: 200
      })

      const { duration } = await measurePerformance(
        () => enhancedMCPService.getDoctorRecommendations('California'),
        500 // 0.5 second target
      )

      expect(duration).toBeLessThan(500)
      // console.log(`Doctor recommendations completed in ${duration.toFixed(2)}ms`)
    })

    it('should handle concurrent requests efficiently', async () => {
      const mockDoctors = [{
        name: 'Dr. Test',
        specialization: 'Wound Care',
        phone: '(555) 123-4567',
        email: 'test@healthcare.com',
        address: '123 Test St, California',
        rating: 4.5,
        availability: 'available',
        consultation_types: ['video']
      }]

      mockFetch.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockDoctors),
        status: 200
      })

      const startTime = performance.now()
      
      // Make 5 concurrent requests
      const promises = Array.from({ length: 5 }, () => 
        enhancedMCPService.getDoctorRecommendations('California')
      )

      const results = await Promise.all(promises)
      const endTime = performance.now()
      const totalDuration = endTime - startTime

      expect(results).toHaveLength(5)
      expect(totalDuration).toBeLessThan(2000) // Should complete all within 2 seconds
      // console.log(`5 concurrent requests completed in ${totalDuration.toFixed(2)}ms`)
    })
  })

  describe('Error Handling Performance', () => {
    it('should handle timeout errors quickly', async () => {
      const mockBase64Image = createMockBase64Image()
      
      // Mock timeout
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'))

      const { duration } = await measurePerformance(
        () => enhancedMCPService.analyzeWoundImage(mockBase64Image),
        1000 // Should handle timeout within 1 second
      )

      expect(duration).toBeLessThan(1000)
      // console.log(`Timeout handling completed in ${duration.toFixed(2)}ms`)
    })

    it('should handle server errors quickly', async () => {
      const mockBase64Image = createMockBase64Image()
      
      // Mock server error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })

      const { duration } = await measurePerformance(
        () => enhancedMCPService.analyzeWoundImage(mockBase64Image),
        1000 // Should handle server error within 1 second
      )

      expect(duration).toBeLessThan(1000)
      // console.log(`Server error handling completed in ${duration.toFixed(2)}ms`)
    })

    it('should handle authentication errors quickly', async () => {
      mockLocalStorage.getItem.mockReturnValue(null) // No auth token

      const { duration } = await measurePerformance(
        () => enhancedMCPService.analyzeWoundImage(createMockBase64Image()),
        1000 // Should handle auth error within 1 second
      )

      expect(duration).toBeLessThan(1000)
      // console.log(`Authentication error handling completed in ${duration.toFixed(2)}ms`)
    })
  })
})
