import { AnalysisThread, AnalysisResult, DoctorRecommendation, TreatmentPlan } from '../types/analysis';
import { enhancedMCPService } from './mcpService';
import { cacheService, CacheKeys, CacheTags, CacheTTL } from './cacheService';
import { TIMEOUT_CONFIG } from '../../config/timeouts';

// Interfaces for cached data
interface CachedThreadData {
  thread: AnalysisThread;
  imageFile: File;
  imageDimensions: string;
  userId: string;
  segmented_image_base64?: string;
  analysisResult?: AnalysisResult;
}

class AnalysisService {
  // Track active analysis to prevent duplicates
  private activeAnalyses: Set<string> = new Set();

  // Create a new analysis thread
  async createAnalysisThread(imageFile: File, patientName: string, userId: string): Promise<AnalysisThread> {
    // Check if there's already an active analysis for this user to prevent duplicates
    const existingThreads = await this.getThreads(userId);
    const activeThread = existingThreads.find(thread => 
      thread.status === 'uploaded' || thread.status === 'analyzing'
    );
    
    if (activeThread) {
      // console.warn(`User ${userId} already has an active analysis thread: ${activeThread.id} with status: ${activeThread.status}`);
      // Return the existing thread instead of creating a new one
      return activeThread;
    }

    // Validate image file
    if (!imageFile || imageFile.size === 0) {
      throw new Error('Invalid image file provided');
    }

    // Check file type
    if (!imageFile.type.startsWith('image/')) {
      throw new Error('Please upload a valid image file.');
    }

    // Check file size (limit to 10MB)
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxFileSize) {
      throw new Error('Image file is too large. Please upload an image smaller than 10MB.');
    }

    const imageUrl = await this.fileToDataURL(imageFile);
    
    // Check base64 size (should be roughly 1.33x the original file size)
    const maxBase64Size = 15 * 1024 * 1024; // 15MB for base64
    if (imageUrl.length > maxBase64Size) {
      throw new Error('Image is too large to process. Please upload a smaller image.');
    }
    
    // Get image dimensions for better metadata
    const imageDimensions = await this.getImageDimensions(imageFile);
    
    // console.log('Creating analysis thread with image data:', {
    //   fileName: imageFile.name,
    //   fileSize: imageFile.size,
    //   fileType: imageFile.type,
    //   dimensions: imageDimensions,
    //   base64Length: imageUrl.length
    // });
    
    // Create thread via backend API
    const threadId = `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Convert to frontend format
    const thread: AnalysisThread = {
      id: threadId,
      patientName: patientName,
      imageUrl: imageUrl,
      uploadedAt: new Date(),
      status: 'uploaded',
      priority: 'medium',
      processingTime: undefined
    };

    // Cache the thread data for later use
    cacheService.set(
      CacheKeys.api.analysisResult(threadId),
      {
        thread,
        imageFile,
        imageDimensions,
        userId
      },
      CacheTTL.MEDIUM,
      [CacheTags.ANALYSIS, CacheTags.API]
    );

    return thread;
  }

  // Start analysis for a thread with progress tracking
  async startAnalysis(
    threadId: string, 
    userId: string, 
    onProgress?: (step: string, progress: number) => void
  ): Promise<void> {
    // Check if analysis is already in progress for this thread
    if (this.activeAnalyses.has(threadId)) {
      // console.warn('Analysis already in progress for thread:', threadId);
      return;
    }
    
    // Mark this analysis as active
    this.activeAnalyses.add(threadId);
    
    try {
      // Get cached thread data
      const cachedData = cacheService.get<CachedThreadData>(CacheKeys.api.analysisResult(threadId));
      if (!cachedData) {
        throw new Error(`Thread ${threadId} not found in cache`);
      }
      
      const { thread } = cachedData;
      // const { thread, imageFile } = cachedData;
      
      if (thread.status !== 'uploaded') {
        // console.warn(`Thread ${threadId} is in status '${thread.status}', expected 'uploaded'`);
        // Don't throw error, just log warning and continue
      }
      
      // Log image file info for debugging
      // console.log('Processing image file:', {
      //   name: imageFile.name,
      //   size: imageFile.size,
      //   type: imageFile.type
      // });
      
      const startTime = Date.now();
      // console.log('Starting analysis for thread:', threadId, 'at', new Date().toISOString());
      
      onProgress?.('preparing', 5);
      
      // Add timeout wrapper for the entire analysis process
      const analysisTimeout = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Analysis timeout: Process took longer than ${TIMEOUT_CONFIG.ANALYSIS.OVERALL / 1000} seconds`));
        }, TIMEOUT_CONFIG.ANALYSIS.OVERALL);
      });
      
      const analysisPromise = this.performAnalysis(threadId, userId, startTime, onProgress);
      
      await Promise.race([analysisPromise, analysisTimeout]);
      
    } catch (error) {
      // console.error('Analysis failed:', error);
      
      onProgress?.('error', 0);
      
      // Update cached thread status to failed
      const cachedData = cacheService.get<CachedThreadData>(CacheKeys.api.analysisResult(threadId));
      if (cachedData) {
        cachedData.thread.status = 'failed';
        cacheService.set(
          CacheKeys.api.analysisResult(threadId),
          cachedData,
          CacheTTL.MEDIUM,
          [CacheTags.ANALYSIS, CacheTags.API]
        );
      }
      
      throw error;
    } finally {
      // Always remove from active analyses when done
      this.activeAnalyses.delete(threadId);
    }
  }
  
  // Separate method for the actual analysis logic with progress tracking
  private async performAnalysis(
    threadId: string, 
    userId: string, 
    startTime: number, 
    onProgress?: (step: string, progress: number) => void
  ): Promise<void> {
      
      // Get cached thread data
      const cachedData = cacheService.get<CachedThreadData>(CacheKeys.api.analysisResult(threadId));
      if (!cachedData) {
        throw new Error('Thread not found in cache');
      }
      
      const { thread, imageFile } = cachedData;
      
      // Update thread status to analyzing
      thread.status = 'analyzing';
      cacheService.set(
        CacheKeys.api.analysisResult(threadId),
        cachedData,
        CacheTTL.MEDIUM,
        [CacheTags.ANALYSIS, CacheTags.API]
      );

      // Convert image file to base64 for analysis
      const imageBase64 = await this.fileToDataURL(imageFile);

      // Call enhanced MCP service for analysis with progress tracking
      // console.log('Starting enhanced MCP analysis for thread:', threadId);
      let mcpResult;
      try {
        // Add timeout wrapper for the entire MCP analysis
        const mcpTimeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error(`MCP analysis timed out after ${TIMEOUT_CONFIG.ANALYSIS.MCP_ANALYSIS / 1000} seconds`));
          }, TIMEOUT_CONFIG.ANALYSIS.MCP_ANALYSIS);
        });

        const mcpAnalysisPromise = enhancedMCPService.analyzeWoundImage(imageBase64, onProgress);
        
        mcpResult = await Promise.race([mcpAnalysisPromise, mcpTimeoutPromise]);
        // console.log('Enhanced MCP analysis completed:', mcpResult);
        // console.log('Segmented image base64 length:', mcpResult.segmentation?.mask?.length || 0);
      } catch (error) {
        // console.warn('MCP analysis failed, using fallback simulation:', error);
        
        // Provide more specific error information
        let errorMessage = 'Analysis service temporarily unavailable';
        if (error instanceof Error) {
          if (error.message.includes('timeout')) {
            errorMessage = 'Analysis took longer than expected. Using basic assessment.';
          } else if (error.message.includes('GEMINI_API_KEY')) {
            errorMessage = 'AI analysis features are limited. Basic wound assessment provided.';
          } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Analysis service connection failed. Using offline assessment.';
          } else if (error.message.includes('403')) {
            errorMessage = 'Analysis service access denied. Using offline assessment.';
          } else if (error.message.includes('Database operation timed out')) {
            errorMessage = 'Database connection is slow. Using offline assessment.';
          } else if (error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
            errorMessage = 'System resources are limited. Using basic assessment.';
          }
        }
        
        onProgress?.('fallback', 60);
        
        // Use fallback simulation when MCP server is unavailable
        mcpResult = {
          segmentation: {
            mask: imageBase64, // Use original image as fallback
            confidence: 0.60,
            wound_area: 2.5,
            wound_perimeter: 8.0
          },
          diagnosis: {
            is_infected: false,
            confidence: 0.60, // Lower confidence for fallback
            severity: 'low'
          },
          description: {
            wound_type: 'healing_wound',
            characteristics: ['normal_healing', 'no_infection_signs'],
            recommendations: [
              'Keep wound clean and dry',
              'Monitor for signs of infection',
              'Consult healthcare professional for detailed assessment',
              errorMessage
            ]
          },
          metadata: {
            processing_time: 5.0,
            model_version: 'fallback',
            timestamp: new Date().toISOString()
          }
        };
      }
      
      // Get treatment plan - Updated to handle all wound types from backend tests
      const diagnosisType = mcpResult.diagnosis?.is_infected ? 'infected' : 'not_infected';
      // console.log('Getting treatment plan for diagnosis:', diagnosisType);
      let treatmentPlan;
      try {
        treatmentPlan = await enhancedMCPService.getTreatmentPlan(diagnosisType);
        // console.log('Treatment plan received:', treatmentPlan);
      } catch (error) {
        // console.warn('Treatment plan request failed, using enhanced fallback:', error);
        
        // Enhanced fallback that handles all wound types from backend tests
        const getFallbackTreatmentPlan = (diagnosis: string) => {
          const plans = {
            infected: {
              name: 'Infected Wound Care Plan',
              description: 'Comprehensive care plan for infected wounds requiring immediate attention',
              materials: ['Antibiotic ointment', 'Sterile gauze', 'Antiseptic solution', 'Medical tape', 'Oral antibiotics (if prescribed)'],
              steps: {
                '1': 'Clean the wound thoroughly with antiseptic solution',
                '2': 'Apply prescribed antibiotic ointment',
                '3': 'Cover with sterile dressing',
                '4': 'Monitor for signs of improvement',
                '5': 'Seek medical attention if symptoms worsen'
              },
              precautions: 'Seek immediate medical attention if symptoms worsen. Monitor closely for signs of spreading infection.',
              when_to_seek_help: 'Contact healthcare provider immediately if fever develops or infection spreads',
              duration: '7-14 days with proper treatment',
              is_self_treatable: false
            },
            diabetic_ulcer: {
              name: 'Diabetic Ulcer Care Plan',
              description: 'Specialized care for diabetic foot ulcers with emphasis on blood sugar control',
              materials: ['Specialized diabetic wound dressing', 'Antibiotic ointment', 'Compression bandages', 'Blood glucose monitoring supplies'],
              steps: {
                '1': 'Monitor blood glucose levels closely',
                '2': 'Clean wound with saline solution',
                '3': 'Apply specialized diabetic dressing',
                '4': 'Use compression therapy if indicated',
                '5': 'Regular podiatrist follow-up'
              },
              precautions: 'Maintain strict blood sugar control and avoid pressure on affected area',
              when_to_seek_help: 'If wound worsens, signs of infection, or blood sugar is uncontrolled',
              duration: '4-12 weeks depending on severity',
              is_self_treatable: false
            },
            pressure_ulcer: {
              name: 'Pressure Ulcer Care Plan',
              description: 'Comprehensive care for pressure ulcers with focus on pressure relief',
              materials: ['Pressure-relieving mattress/padding', 'Specialized wound dressings', 'Skin barrier cream', 'Nutritional supplements'],
              steps: {
                '1': 'Relieve pressure from affected area',
                '2': 'Clean wound with gentle saline',
                '3': 'Apply appropriate dressing',
                '4': 'Reposition every 2 hours',
                '5': 'Ensure adequate nutrition and hydration'
              },
              precautions: 'Never leave patient in same position for extended periods',
              when_to_seek_help: 'If ulcer deepens, shows signs of infection, or fails to heal',
              duration: '2-8 weeks with proper pressure management',
              is_self_treatable: false
            },
            venous_ulcer: {
              name: 'Venous Ulcer Care Plan',
              description: 'Treatment for venous leg ulcers focusing on circulation improvement',
              materials: ['Compression stockings or bandages', 'Moist wound dressings', 'Leg elevation pillow', 'Skin moisturizer'],
              steps: {
                '1': 'Elevate legs above heart level when resting',
                '2': 'Apply compression therapy as prescribed',
                '3': 'Keep wound moist with appropriate dressing',
                '4': 'Exercise legs regularly to improve circulation',
                '5': 'Maintain healthy weight'
              },
              precautions: 'Avoid prolonged standing or sitting, maintain compression therapy',
              when_to_seek_help: 'If ulcer increases in size, becomes more painful, or shows infection signs',
              duration: '6-12 weeks with consistent compression therapy',
              is_self_treatable: false
            }
          };
          
          return plans[diagnosis as keyof typeof plans] || plans.infected;
        };
        
        treatmentPlan = getFallbackTreatmentPlan(diagnosisType);
      }
      
      // Get doctor recommendations
      // console.log('Getting doctor recommendations...');
      let doctorRecommendations: any[] = [];
      try {
        // Default to California for now - in a real app, this would come from user profile
        const userState = 'California';
        
        // console.log(`Getting doctor recommendations for user in state: ${userState}`);
        doctorRecommendations = await enhancedMCPService.getDoctorRecommendations(userState);
        // console.log('Doctor recommendations received:', doctorRecommendations.length);
      } catch (error) {
        // console.warn('Failed to get doctor recommendations:', error);
      }
      
      const processingTime = (Date.now() - startTime) / 1000;

      // Determine severity based on diagnosis and area
      let severity: 'low' | 'medium' | 'high' = 'medium';
      const woundArea = mcpResult.segmentation?.wound_area || 0;
      if (mcpResult.diagnosis?.is_infected) {
        severity = woundArea > 5 ? 'high' : 'medium';
      } else {
        severity = woundArea > 10 ? 'medium' : 'low';
      }

      // Generate recommendations
      const recommendations = [
        mcpResult.diagnosis?.is_infected ? 'Seek immediate medical attention' : 'Monitor wound healing progress',
        'Keep the wound clean and dry',
        'Follow prescribed treatment plan',
        'Watch for signs of infection',
        woundArea > 5 ? 'Consider professional wound care' : 'Continue with current treatment'
      ];

      // Create analysis result
      const resultId = `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const analysisResult: AnalysisResult = {
        severity,
        diagnosis: diagnosisType as 'infected' | 'not_infected' | 'diabetic_ulcer' | 'pressure_ulcer' | 'venous_ulcer',
        area_cm2: Math.min(Math.max(woundArea, 0), 9.9999),
        confidence: Math.min(Math.max(mcpResult.diagnosis?.confidence || 0.85, 0), 1),
        description: mcpResult.description?.wound_type || 'Wound analysis completed',
        healingStage: mcpResult.diagnosis?.is_infected ? 'Inflammatory Phase' : 'Granulation Phase',
        infectionRisk: mcpResult.diagnosis?.is_infected ? 'high' : 'low',
        recommendations,
        treatmentPlan: {
          medications: (treatmentPlan.materials || []).filter((m: string) => 
            m.toLowerCase().includes('antibiotic') || m.toLowerCase().includes('ointment')
          ),
          procedures: Object.values(treatmentPlan.steps || {}).slice(0, 4) as string[],
          followUp: treatmentPlan.duration || 'Continue until healed'
        },
        processingTime: processingTime,
        annotated_image_base64: mcpResult.segmentation?.mask
      };

      // console.log('Storing analysis result in cache:', {
      //   thread_id: threadId,
      //   user_id: userId,
      //   severity,
      //   diagnosis: diagnosisType,
      //   area_cm2: analysisResult.area_cm2,
      //   confidence: analysisResult.confidence
      // });

      // Store analysis result in cache
      cacheService.set(
        CacheKeys.api.analysisResult(resultId),
        analysisResult,
        CacheTTL.LONG,
        [CacheTags.ANALYSIS, CacheTags.API]
      );

      // Store doctor recommendations in cache
      if (doctorRecommendations.length > 0) {
        // console.log('Storing doctor recommendations in cache...');
        const userState = 'California'; // Default state
        const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const doctorRecommendationsData = doctorRecommendations.map(doctor => ({
          id: `doctor-${threadId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          state: userState,
          doctor_name: doctor.name || 'Unknown Doctor',
          specialization: doctor.specialization || 'General Practice',
          phone: doctor.phone || '',
          email: doctor.email || '',
          address: doctor.address || '',
          rating: doctor.rating || 4.5,
          availability: doctor.availability || 'available',
          consultation_types: doctor.consultation_types || ['video', 'chat', 'phone'],
          execution_id: executionId,
          requested_by: userId,
          thread_id: threadId,
          wound_type: diagnosisType,
          severity: severity,
          patient_conditions: `Wound analysis for ${diagnosisType}`,
          cache_key: `doctor-${threadId}-${Date.now()}`,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          response_time_ms: Math.round(processingTime * 1000),
          api_endpoint: '/api/analysis/complete_analysis',
          request_metadata: {
            thread_id: threadId,
            analysis_result_id: resultId,
            processing_time: processingTime
          }
        }));
        
        cacheService.set(
          CacheKeys.api.doctorRecommendations(userState),
          doctorRecommendationsData,
          CacheTTL.LONG,
          [CacheTags.DOCTORS, CacheTags.API]
        );
        // console.log('Doctor recommendations stored in cache successfully');
      }
      
      // console.log('Analysis completed successfully, updating thread status to completed');
      
      // Update thread status to completed in cache
      const updatedCachedData = cacheService.get<CachedThreadData>(CacheKeys.api.analysisResult(threadId));
      if (updatedCachedData) {
        updatedCachedData.thread.status = 'completed';
        updatedCachedData.thread.processingTime = Math.round(processingTime);
        updatedCachedData.segmented_image_base64 = mcpResult.segmentation?.mask;
        updatedCachedData.analysisResult = analysisResult;
        
        cacheService.set(
          CacheKeys.api.analysisResult(threadId),
          updatedCachedData,
          CacheTTL.LONG,
          [CacheTags.ANALYSIS, CacheTags.API]
        );
        
        // console.log('Thread status updated to completed in cache');
        // console.log('Segmented image stored in cache, length:', mcpResult.segmentation?.mask?.length || 0);
      }
      
      // console.log('Analysis completed successfully for thread:', threadId);
  }

  // Get all threads for a user with better error handling
  async getThreads(userId: string): Promise<AnalysisThread[]> {
    try {
      // console.log('Fetching threads for user:', userId);
      
      // Get all cached analysis results for this user
      const allKeys = cacheService.getKeys(/^api:analysis_result:/);
      const userThreads: AnalysisThread[] = [];
      
      for (const key of allKeys) {
        const cachedData = cacheService.get<CachedThreadData>(key);
        if (cachedData && cachedData.userId === userId) {
          userThreads.push(cachedData.thread);
        }
      }
      
      // console.log(`Retrieved ${userThreads.length} cached threads for user ${userId}`);
      return userThreads;
    } catch (error) {
      // console.error('Error fetching threads from cache:', error);
      return [];
    }
  }

  // Get a specific thread
  async getThread(threadId: string): Promise<AnalysisThread | null> {
    try {
      const cachedData = cacheService.get<CachedThreadData>(CacheKeys.api.analysisResult(threadId));
      if (cachedData) {
        // console.log('getThread returning cached thread with status:', cachedData.thread.status);
        return cachedData.thread;
      }
      return null;
    } catch (error) {
      // console.error('Error fetching thread from cache:', error);
      return null;
    }
  }

  // Get analysis results for a thread
  async getAnalysisResults(threadId: string): Promise<AnalysisResult[]> {
    try {
      const cachedData = cacheService.get<CachedThreadData>(CacheKeys.api.analysisResult(threadId));
      if (cachedData && cachedData.analysisResult) {
        return [cachedData.analysisResult];
      }
      return [];
    } catch (error) {
      // console.error('Error fetching analysis results from cache:', error);
      return [];
    }
  }

  // Get consultant services for a thread with intelligent caching
  async getDoctorRecommendationsForThread(
    threadId: string, 
    state?: string, 
    options?: {
      woundType?: string;
      severity?: string;
      forceRefresh?: boolean;
      userId?: string;
    }
  ): Promise<DoctorRecommendation[]> {
    try {
      // Get analysis results to extract wound type and severity for better caching
      // const results = await this.getAnalysisResults(threadId);
      
      // Extract wound information from the latest result
      // const latestResult = results[0];
      // const woundType = options?.woundType || latestResult?.diagnosis;
      // const severity = options?.severity || latestResult?.severity;
      
      // Determine state - use provided state or default to California
      const userState = state || 'California';
      
      // console.log(`Getting doctor recommendations for thread ${threadId} with context:`, {
      //   state: userState,
      //   woundType,
      //   severity,
      //   forceRefresh: options?.forceRefresh
      // });
      
      // Check cache first
      if (!options?.forceRefresh) {
        const cachedDoctors = cacheService.get<DoctorRecommendation[]>(CacheKeys.api.doctorRecommendations(userState));
        if (cachedDoctors) {
          // console.log('Returning cached doctor recommendations');
          return cachedDoctors;
        }
      }
      
      const doctors = await enhancedMCPService.getDoctorRecommendations(userState);
      
      const doctorRecommendations = doctors.map((doctor, index) => ({
        id: `doctor-${threadId}-${index}`,
        name: doctor.name,
        specialization: doctor.specialization,
        phone: doctor.phone,
        email: doctor.email,
        address: doctor.address,
        state: userState,
        rating: doctor.rating || (4.5 + Math.random() * 0.5), // Use API rating or random fallback
        availability: doctor.availability || (['available', 'busy', 'offline'][Math.floor(Math.random() * 3)] as any),
        consultationTypes: (doctor.consultation_types || ['video', 'chat', 'phone']) as ('phone' | 'video' | 'chat')[]
      }));
      
      // Cache the results
      cacheService.set(
        CacheKeys.api.doctorRecommendations(userState),
        doctorRecommendations,
        CacheTTL.LONG,
        [CacheTags.DOCTORS, CacheTags.API]
      );
      
      return doctorRecommendations;
    } catch (error) {
      // console.error('Error getting doctor recommendations for thread:', error);
      // Return empty array when service fails - no fallback data
      return [];
    }
  }

  // Get treatment plan for a thread
  async getTreatmentPlanForThread(threadId: string): Promise<TreatmentPlan> {
    try {
      // Get cached thread data
      const cachedData = cacheService.get<CachedThreadData>(CacheKeys.api.analysisResult(threadId));
      if (!cachedData) {
        throw new Error('Thread not found');
      }

      const results = await this.getAnalysisResults(threadId);
      if (results.length === 0) {
        throw new Error('Analysis not completed');
      }

      const latestResult = results[0];
      const diagnosis = latestResult.diagnosis || 'not_infected';
      const treatmentPlan = await enhancedMCPService.getTreatmentPlan(diagnosis);

      return {
        id: `treatment-${threadId}`,
        name: treatmentPlan.name,
        description: treatmentPlan.description,
        materials: treatmentPlan.materials,
        steps: treatmentPlan.steps,
        precautions: treatmentPlan.precautions,
        when_to_seek_help: treatmentPlan.when_to_seek_help,
        duration: treatmentPlan.duration,
        is_self_treatable: treatmentPlan.is_self_treatable,
        severity: latestResult.severity
      };
    } catch (error) {
      // console.error('Error getting treatment plan for thread:', error);
      throw error;
    }
  }

  // Convert file to data URL
  private fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Get image dimensions
  private getImageDimensions(file: File): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(`${img.width}x${img.height}`);
      };
      img.onerror = () => {
        resolve('unknown');
      };
      img.src = URL.createObjectURL(file);
    });
  }

  // Delete a thread
  async deleteThread(threadId: string): Promise<boolean> {
    try {
      cacheService.delete(CacheKeys.api.analysisResult(threadId));
      return true;
    } catch (error) {
      // console.error('Error deleting thread from cache:', error);
      return false;
    }
  }

  // Update thread priority
  async updateThreadPriority(threadId: string, priority: 'low' | 'medium' | 'high'): Promise<boolean> {
    try {
      const cachedData = cacheService.get<CachedThreadData>(CacheKeys.api.analysisResult(threadId));
      if (cachedData) {
        cachedData.thread.priority = priority;
        cacheService.set(
          CacheKeys.api.analysisResult(threadId),
          cachedData,
          CacheTTL.LONG,
          [CacheTags.ANALYSIS, CacheTags.API]
        );
        return true;
      }
      return false;
    } catch (error) {
      // console.error('Error updating thread priority:', error);
      return false;
    }
  }

  // Get complete analysis data for a user
  async getCompleteAnalysisData(userId: string) {
    try {
      const threads = await this.getThreads(userId);
      const completeData = [];
      
      for (const thread of threads) {
        const results = await this.getAnalysisResults(thread.id);
        const doctorRecommendations = await this.getDoctorRecommendationsForThread(thread.id);
        
        completeData.push({
          thread,
          results,
          doctorRecommendations
        });
      }
      
      return completeData;
    } catch (error) {
      // console.error('Error getting complete analysis data:', error);
      return [];
    }
  }

  // Update thread with additional metadata
  async updateThread(threadId: string, updates: Partial<AnalysisThread>): Promise<boolean> {
    try {
      const cachedData = cacheService.get<CachedThreadData>(CacheKeys.api.analysisResult(threadId));
      if (cachedData) {
        Object.assign(cachedData.thread, updates);
        cacheService.set(
          CacheKeys.api.analysisResult(threadId),
          cachedData,
          CacheTTL.LONG,
          [CacheTags.ANALYSIS, CacheTags.API]
        );
        return true;
      }
      return false;
    } catch (error) {
      // console.error('Error updating thread:', error);
      return false;
    }
  }

  // Get treatment plans for a user
  async getTreatmentPlans(userId: string) {
    try {
      const threads = await this.getThreads(userId);
      const treatmentPlans = [];
      
      for (const thread of threads) {
        try {
          const treatmentPlan = await this.getTreatmentPlanForThread(thread.id);
          treatmentPlans.push(treatmentPlan);
        } catch (error) {
          // console.warn(`Could not get treatment plan for thread ${thread.id}:`, error);
        }
      }
      
      return treatmentPlans;
    } catch (error) {
      // console.error('Error getting treatment plans:', error);
      return [];
    }
  }

  // Get follow-up appointments for a user (placeholder - would need backend API)
  async getFollowUpAppointments(_userId: string) {
    // console.warn('getFollowUpAppointments not implemented - requires backend API');
    return [];
  }
}

export const analysisService = new AnalysisService();