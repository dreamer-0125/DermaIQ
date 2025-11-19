/**
 * Mock Service Worker (MSW) Setup
 * Following backend testing patterns for comprehensive API mocking
 */

import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Mock API responses following backend patterns
export const handlers = [
  // Health check endpoint
  http.get('http://localhost:8000/health', () => {
    return HttpResponse.json({
      status: 'healthy',
      version: '1.0.0',
      supabase_configured: true,
      gemini_configured: true,
      supabase_connected: true,
    })
  }),

  // Root endpoint
  http.get('http://localhost:8000/', () => {
    return HttpResponse.json({
      message: 'DermaIQ Backend API',
      version: '1.0.0',
      docs: '/docs',
      health: '/health',
    })
  }),

  // Treatment plan endpoint
  http.get('http://localhost:8000/api/treatment/plan/:woundType', ({ params }) => {
    const { woundType } = params
    const isInfected = woundType === 'infected'
    
    return HttpResponse.json({
      data: {
        name: isInfected ? 'Infected Wound Care Plan' : 'Standard Wound Care Plan',
        description: isInfected 
          ? 'Comprehensive care plan for infected wounds requiring immediate attention'
          : 'Basic wound care recommendations for healing',
        materials: isInfected 
          ? ['Antibiotic ointment', 'Sterile gauze', 'Antiseptic solution', 'Medical tape', 'Oral antibiotics (if prescribed)']
          : ['Antiseptic solution', 'Sterile gauze', 'Medical tape', 'Antibiotic ointment'],
        steps: isInfected 
          ? {
              '1': 'Clean the wound thoroughly with antiseptic solution',
              '2': 'Apply prescribed antibiotic ointment',
              '3': 'Cover with sterile dressing',
              '4': 'Monitor for signs of improvement',
              '5': 'Seek medical attention if symptoms worsen'
            }
          : {
              '1': 'Clean the wound with antiseptic solution',
              '2': 'Apply antibiotic ointment if prescribed',
              '3': 'Cover with sterile gauze',
              '4': 'Change dressing daily or as needed'
            },
        precautions: isInfected 
          ? 'Seek immediate medical attention if symptoms worsen. Monitor closely for signs of spreading infection.'
          : 'Keep the wound clean and dry. Watch for signs of infection.',
        when_to_seek_help: isInfected 
          ? 'Contact healthcare provider immediately if fever develops or infection spreads'
          : 'Contact healthcare provider if you notice increased redness, swelling, or discharge',
        duration: isInfected ? '7-14 days with proper treatment' : 'Continue until wound is fully healed',
        is_self_treatable: !isInfected
      }
    })
  }),

  // Doctor recommendations endpoint
  http.get('http://localhost:8000/api/recommendations/doctor_contact/:state', ({ params }) => {
    const { state } = params
    
    return HttpResponse.json({
      data: {
        name: 'Dr. Sarah Johnson',
        specialization: 'Wound Care Specialist',
        phone: '(555) 123-4567',
        email: 'sarah.johnson@healthcare.com',
        address: `123 Medical Center Dr, ${state}`,
      }
    })
  }),

  // Complete analysis endpoint (simulated)
  http.post('http://localhost:8000/api/analysis/complete_analysis', async () => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return HttpResponse.json({
      data: {
        segmentation: {
          area_cm2: 3.45,
          annotated_image_base64: 'data:image/jpeg;base64,mock-annotated-image-data',
          message: 'Wound detected successfully'
        },
        diagnosis: 'not_infected',
        description: 'Wound appears to be in the granulation phase with moderate healing progress. Surrounding tissue shows signs of inflammation.',
        confidence: 0.87,
        processing_time: 2.5
      }
    })
  }),

  // Model status endpoint
  http.get('http://localhost:8000/api/analysis/model_status', () => {
    return HttpResponse.json({
      data: {
        models: {
          yolo_wound: { available: true, version: '1.0' },
          gemini_ai: { available: true, version: '1.0' }
        }
      }
    })
  }),

  // Performance stats endpoint
  http.get('http://localhost:8000/api/analysis/performance_stats', () => {
    return HttpResponse.json({
      data: {
        average_processing_time: 2.5,
        success_rate: 0.95,
        total_analyses: 1250
      }
    })
  }),

  // Treatment plans endpoint
  http.get('http://localhost:8000/api/treatment/plans', () => {
    return HttpResponse.json({
      data: {
        infected: {
          name: 'Infected Wound Care Plan',
          description: 'Comprehensive care plan for infected wounds'
        },
        not_infected: {
          name: 'Standard Wound Care Plan', 
          description: 'Basic wound care recommendations'
        }
      }
    })
  }),

  // VBC completion endpoint
  http.post('http://localhost:8000/api/treatment/vbc_completion', async () => {
    await new Promise(resolve => setTimeout(resolve, 50))
    return HttpResponse.json({
      data: {
        completion_score: 85,
        recommendations: ['Continue current treatment', 'Monitor healing progress']
      }
    })
  }),

  // Generate custom treatment plan endpoint
  http.post('http://localhost:8000/api/treatment/generate_plan', async () => {
    await new Promise(resolve => setTimeout(resolve, 50))
    return HttpResponse.json({
      data: {
        name: 'Custom Treatment Plan',
        description: 'Personalized treatment plan based on user preferences',
        materials: ['Custom materials based on preferences'],
        steps: { '1': 'Custom step 1', '2': 'Custom step 2' }
      }
    })
  }),

  // Specialists endpoint
  http.get('http://localhost:8000/api/recommendations/specialists', () => {
    return HttpResponse.json({
      data: [
        {
          name: 'Dr. Sarah Johnson',
          specialization: 'Wound Care Specialist',
          phone: '(555) 123-4567',
          email: 'sarah.johnson@healthcare.com',
          address: '123 Medical Center Dr, California',
          rating: 4.8,
          availability: 'available'
        }
      ]
    })
  }),

  // Recommend specialist endpoint
  http.post('http://localhost:8000/api/recommendations/recommend_specialist', async () => {
    await new Promise(resolve => setTimeout(resolve, 50))
    return HttpResponse.json({
      data: {
        name: 'Dr. Michael Chen',
        specialization: 'Dermatology',
        phone: '(555) 987-6543',
        email: 'michael.chen@healthcare.com',
        address: '456 Specialist Ave, California',
        rating: 4.9,
        availability: 'available'
      }
    })
  }),

  // Doctors endpoint
  http.get('http://localhost:8000/api/recommendations/doctors', () => {
    return HttpResponse.json({
      data: [
        {
          name: 'Dr. Sarah Johnson',
          specialization: 'Wound Care Specialist',
          phone: '(555) 123-4567',
          email: 'sarah.johnson@healthcare.com',
          address: '123 Medical Center Dr, California',
          rating: 4.8,
          availability: 'available'
        }
      ]
    })
  }),

  // States endpoint
  http.get('http://localhost:8000/api/recommendations/states', () => {
    return HttpResponse.json({
      data: {
        states: ['California', 'New York', 'Texas', 'Florida', 'Illinois']
      }
    })
  }),

  // Specializations endpoint
  http.get('http://localhost:8000/api/recommendations/specializations', () => {
    return HttpResponse.json({
      data: {
        specializations: ['Wound Care', 'Dermatology', 'General Practice', 'Emergency Medicine']
      }
    })
  }),

  // Error simulation endpoints
  http.get('http://localhost:8000/api/test/timeout', () => {
    return new Promise(() => {}) // Never resolves to simulate timeout
  }),

  http.get('http://localhost:8000/api/test/server-error', () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }),

  http.get('http://localhost:8000/api/test/network-error', () => {
    return HttpResponse.error()
  }),
]

export const server = setupServer(...handlers)
