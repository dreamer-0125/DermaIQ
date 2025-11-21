import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload as UploadIcon, Camera, FileImage, X, CheckCircle, AlertCircle, Loader2, Eye, Download, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DemoLayout from '../components/layout/DemoLayout';
import { enhancedMCPService } from '../services/mcpService';
import { cacheService, CacheKeys } from '../services/cacheService';
import { supabaseCRUDService } from '../../services/supabaseService';
import { useAuth } from '../../contexts/AuthContext';
import { API_CONFIG } from '../../config/api';
import { downloadPDFReport } from '../../utils/pdfReportGenerator';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'analyzing' | 'success' | 'error';
  progress: number;
  analysisResult?: any;
  analysisStep?: string;
  threadId?: string; // Track the database thread ID to prevent duplicates
  resultId?: string; // Track the database result ID to prevent duplicates
  isStored?: boolean; // Flag to prevent duplicate storage
  isProcessing?: boolean; // Flag to prevent multiple simultaneous processing
  warning?: string; // Warning message for non-critical errors
}

const Upload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Track processing files to prevent duplicates
  const processingFiles = useRef<Set<string>>(new Set());
  
  // Track files that need to be processed
  const [filesToProcess, setFilesToProcess] = useState<UploadedFile[]>([]);

  // Process queued files with useEffect
  useEffect(() => {
    if (filesToProcess.length > 0) {
      // console.log('Processing queued files:', filesToProcess.length);
      
      // Process each file sequentially to avoid overwhelming the server
      filesToProcess.forEach((file, index) => {
        // Add a small delay between processing files to prevent server overload
        setTimeout(() => {
          // console.log(`Starting processing for file ${index + 1}/${filesToProcess.length}:`, file.id);
          startUploadAndAnalysis(file.id, file);
        }, index * 1000); // 1 second delay between each file
      });
      
      // Clear the queue after processing
      setFilesToProcess([]);
    }
  }, [filesToProcess]);

  // Network status check effect
  useEffect(() => {
    const checkNetworkStatus = async () => {
      setNetworkStatus('checking');
      const isConnected = true;//await testNetworkConnectivity();
      setNetworkStatus(isConnected ? 'connected' : 'disconnected');
    };

    // Check network status on component mount
    checkNetworkStatus();

    // Set up periodic network status checks
    const interval = setInterval(checkNetworkStatus, 30000); // Check every 30 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      // Clean up object URLs to prevent memory leaks
      uploadedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      
      // Clear processing flags
      processingFiles.current.clear();
    };
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };


  const handleFiles = (files: File[]) => {

    // Filter out duplicate files (same name and size)
    const filteredFiles = files.filter(newFile => {
      const isDuplicate = uploadedFiles.some(existingFile => 
        existingFile.file.name === newFile.name && 
        existingFile.file.size === newFile.size
      );
      
      if (isDuplicate) {
        // console.log('Skipping duplicate file:', newFile.name);
      }
      
      return !isDuplicate;
    });

    if (filteredFiles.length === 0) {
      // console.log('All files are duplicates, skipping upload');
      return;
    }

    const newFiles: UploadedFile[] = filteredFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: 'uploading' as const,
      progress: 0,
      analysisStep: 'Uploading...',
      isProcessing: false,
      isStored: false
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Queue files for processing
    setFilesToProcess(newFiles);
  };

  const startUploadAndAnalysis = async (fileId: string, fileObj?: UploadedFile) => {
    try {
      // console.log('=== STARTING UPLOAD AND ANALYSIS ===');
      // console.log('File ID:', fileId);
      // console.log('Timestamp:', new Date().toISOString());
      // console.log('Current processing files:', Array.from(processingFiles.current));
      
      // Use provided fileObj or find it from current state
      const currentFileObj = fileObj || uploadedFiles.find(f => f.id === fileId);
      if (!currentFileObj) {
        // console.error('File not found for analysis:', fileId);
        // console.error('Available files:', uploadedFiles.map(f => ({ id: f.id, name: f.file.name })));
        return;
      }

      // console.log('File details:', {
      //   id: currentFileObj.id,
      //   name: currentFileObj.file.name,
      //   size: currentFileObj.file.size,
      //   type: currentFileObj.file.type,
      //   status: currentFileObj.status
      // });

      // IMMEDIATE duplicate prevention using ref (synchronous)
      if (processingFiles.current.has(fileId)) {
        // console.log('⚠️ File is already being processed, skipping duplicate request:', fileId);
        return;
      }

      // Check if file is already in success or error state
      const currentState = uploadedFiles.find(f => f.id === fileId);
      if (currentState?.status === 'success' || currentState?.status === 'error') {
        // console.log('⚠️ File already processed, skipping duplicate request:', fileId, 'Status:', currentState.status);
        return;
      }

      // Mark as processing IMMEDIATELY using ref (synchronous)
      processingFiles.current.add(fileId);
      // console.log('✅ File marked as processing:', fileId);
      
      // Also update state for UI
      setUploadedFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, isProcessing: true }
          : file
      ));

      // console.log('File found, converting to base64:', currentFileObj.file.name, currentFileObj.file.size, 'bytes');
      
      // Convert file to base64
      const base64 = await fileToBase64(currentFileObj.file);
      // console.log('Base64 conversion complete, length:', base64.length);
      
      // Update status to analyzing
      setUploadedFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, status: 'analyzing' as const, progress: 10, analysisStep: 'Preparing analysis...' }
          : file
      ));

      // Check if user is authenticated
      if (!currentUser) {
        throw new Error('User must be authenticated to perform analysis');
      }

      // console.log('User authenticated, starting analysis...');
      
      // Use enhanced MCP service for analysis with optimized progress tracking
      const analysisResult = await enhancedMCPService.analyzeWoundImage(
        `data:image/png;base64,${base64}`,
        (step: string, progress: number) => {
          // console.log('Progress update:', step, progress + '%');
          // Throttle progress updates to reduce UI overhead
          setUploadedFiles(prev => prev.map(file => {
            if (file.id === fileId) {
              // Only update if progress changed significantly (5% threshold)
              const progressDiff = Math.abs(progress - file.progress);
              if (progressDiff >= 5 || step !== file.analysisStep) {
                return { ...file, progress, analysisStep: step };
              }
              return file;
            }
            return file;
          }));
        }
      ).catch(async (error) => {
        // Enhanced error handling with connection retry
        // console.error('Analysis failed, attempting connection recovery:', error);
        
        // Test network connectivity before giving up
        const isConnected = await testNetworkConnectivity();
        if (!isConnected) {
          throw new Error('Network connection lost during analysis. Please check your connection and try again.');
        }
        
        // If network is fine, re-throw the original error
        throw error;
      });
      
      // console.log('Analysis completed via enhanced MCP service:', analysisResult);
      // console.log('Current user', currentUser);

      // Store analysis result in database using Supabase CRUD service
      // Only save if analysis was successful and user is authenticated
      if (currentUser && !currentFileObj.isStored) {
        try {
          let thread: any;
          let result: any;
          
          // Check if we already have a thread ID (for retries)
          if (currentFileObj.threadId) {
            // console.log('Retry detected - updating existing thread:', currentFileObj.threadId);
            // Update existing thread with completion status
            thread = await supabaseCRUDService.updateAnalysisThread(
              currentFileObj.threadId, 
              currentUser.id, 
              {
                status: 'completed',
                analysis_completed_at: new Date().toISOString()
              }
            );
            // console.log('Updated existing analysis thread:', thread.id);
          } else {
            // console.log('First save attempt - creating new thread');
            // Create new analysis thread with completed status and analysis_completed_at
            thread = await supabaseCRUDService.createAnalysisThread({
              user_id: currentUser.id,
              patient_name: `Analysis ${new Date().toLocaleString()}`,
              status: 'completed',
              priority: 'medium',
              analysis_completed_at: new Date().toISOString() // Set completion time on creation
            });
            // console.log('Created new analysis thread:', thread.id);
            
            // Immediately update the file object with thread ID to prevent duplicates
            setUploadedFiles(prev => prev.map(file => 
              file.id === fileId 
                ? { ...file, threadId: thread.id }
                : file
            ));
          }

          // Extract image URLs from metadata (for both create and update)
          const metadata = analysisResult.metadata as any;
          const imageUrls = metadata?.image_urls || {};
          const originalImageUrl = imageUrls.original || null;
          const segmentedImageUrl = imageUrls.segmented || null;
          
          // Check if we already have a result ID (for retries)
          if (currentFileObj.resultId) {
            // Update existing result (WITHOUT treatment_plan field)
            result = await supabaseCRUDService.updateAnalysisResult(
              currentFileObj.resultId,
              currentUser.id,
              {
                severity: analysisResult.diagnosis?.severity || 'low',
                diagnosis: analysisResult.diagnosis?.infection_type || 'unknown',
                area_cm2: analysisResult.segmentation?.wound_area || 0,
                confidence_score: analysisResult.diagnosis?.confidence || 0,
                wound_description: analysisResult.description?.characteristics?.join(', ') || 'No description available',
                infection_probability: analysisResult.diagnosis?.is_infected ? 1.0 : 0.0,
                healing_stage: analysisResult.description?.wound_type || 'Assessment in progress',
                tissue_types: [],
                recommendations: analysisResult.description?.recommendations || [],
                original_image_url: originalImageUrl,
                segmented_image_url: segmentedImageUrl,
                follow_up_required: true,
                follow_up_days: 7,
                model_version: analysisResult.metadata?.model_version || '1.0',
                processing_metadata: {
                  file_name: currentFileObj.file.name,
                  file_size: currentFileObj.file.size,
                  processing_time: analysisResult.metadata?.processing_time || 0,
                  image_urls: imageUrls,
                  backend_response: analysisResult // Store full response for reference
                }
              }
            );
            // console.log('Updated existing analysis result:', result.id);
            // console.log('Image URLs updated:', { originalImageUrl, segmentedImageUrl });
          } else {
            // Create new analysis result (WITHOUT treatment_plan field)
            result = await supabaseCRUDService.createAnalysisResult({
              thread_id: thread.id!,
              user_id: currentUser.id,
              severity: analysisResult.diagnosis?.severity || 'low',
              diagnosis: analysisResult.diagnosis?.infection_type || 'unknown',
              area_cm2: analysisResult.segmentation?.wound_area || 0,
              confidence_score: analysisResult.diagnosis?.confidence || 0,
              wound_description: analysisResult.description?.characteristics?.join(', ') || 'No description available',
              infection_probability: analysisResult.diagnosis?.is_infected ? 1.0 : 0.0,
              healing_stage: analysisResult.description?.wound_type || 'Assessment in progress',
              tissue_types: [],
              recommendations: analysisResult.description?.recommendations || [],
              original_image_url: originalImageUrl,
              segmented_image_url: segmentedImageUrl,
              follow_up_required: true,
              follow_up_days: 7,
              model_version: analysisResult.metadata?.model_version || '1.0',
              processing_metadata: {
                file_name: currentFileObj.file.name,
                file_size: currentFileObj.file.size,
                processing_time: analysisResult.metadata?.processing_time || 0,
                image_urls: imageUrls,
                backend_response: analysisResult // Store full response for reference
              }
            });
            // console.log('Created new analysis result:', result.id);
            // console.log('Image URLs saved:', { originalImageUrl, segmentedImageUrl });
          }

          // Ensure result ID is valid before saving related records
          if (!result?.id) {
            // console.error('❌ Result ID is missing, cannot save treatment plan or doctor recommendations');
            throw new Error('Failed to create analysis result - no ID returned');
          }

          // console.log('✅ Analysis result saved with ID:', result.id);

          // NOW: Save treatment plan to separate table
          if (analysisResult.treatment_plan) {
            try {
              const treatmentPlan: any = analysisResult.treatment_plan;
              
              // Convert steps array to object if needed
              let stepsObj: Record<string, string> = {};
              if (Array.isArray(treatmentPlan.steps)) {
                treatmentPlan.steps.forEach((step: string, index: number) => {
                  stepsObj[(index + 1).toString()] = step;
                });
              } else if (typeof treatmentPlan.steps === 'object') {
                stepsObj = treatmentPlan.steps;
              }
              
              await supabaseCRUDService.createTreatmentPlan({
                result_id: result.id,
                thread_id: thread.id!,
                user_id: currentUser.id,
                plan_name: treatmentPlan.name || treatmentPlan.plan_type || `Treatment Plan for ${analysisResult.diagnosis?.infection_type || 'Wound'}`,
                description: treatmentPlan.description || 'Comprehensive wound care treatment plan based on AI analysis',
                immediate_actions: treatmentPlan.immediate_actions || [],
                ongoing_care: treatmentPlan.ongoing_care || [],
                medications: treatmentPlan.medications || [],
                materials: treatmentPlan.materials || [],
                procedures: treatmentPlan.procedures || [],
                steps: stepsObj,
                frequency: treatmentPlan.frequency || 'Daily',
                duration_days: treatmentPlan.estimated_healing_time ? parseInt(treatmentPlan.estimated_healing_time) : (treatmentPlan.duration_days || 14),
                precautions: treatmentPlan.precautions || '',
                when_to_seek_help: treatmentPlan.when_to_seek_help || '',
                is_self_treatable: treatmentPlan.is_self_treatable ?? true,
                status: 'active'
              });
              // console.log('✅ Treatment plan saved to separate table');
            } catch (error) {
              // console.error('❌ Failed to save treatment plan:', error);
              // Don't fail the whole upload if treatment plan save fails
            }
          }

          // NOW: Save doctor recommendations to separate table
          if (analysisResult.doctor_recommendations && Array.isArray(analysisResult.doctor_recommendations)) {
            try {
              for (const doctor of analysisResult.doctor_recommendations) {
                const doctorData: any = doctor;
                await supabaseCRUDService.createDoctorRecommendation({
                  result_id: result.id,
                  thread_id: thread.id!,
                  requested_by: currentUser.id, // Database uses 'requested_by' not 'user_id'
                  state: doctorData.state || 'CA',
                  doctor_name: doctorData.name || doctorData.doctor_name || 'Unknown Doctor',
                  specialization: doctorData.specialization || 'Wound Care Specialist',
                  credentials: doctorData.credentials || [],
                  phone: doctorData.phone || '',
                  email: doctorData.email || '',
                  address: doctorData.address || '',
                  rating: doctorData.rating || 0,
                  years_of_experience: doctorData.years_of_experience || 0,
                  hospital_affiliation: doctorData.hospital_affiliation || '',
                  availability: doctorData.availability || 'Available',
                  consultation_types: doctorData.consultation_types || ['In-person', 'Telehealth'],
                  accepts_insurance: doctorData.accepts_insurance ?? true,
                  accepts_medicare: doctorData.accepts_medicare ?? true,
                  telehealth_available: doctorData.telehealth_available ?? false,
                  next_available_appointment: doctorData.next_available_appointment || '',
                  match_score: doctorData.match_score || 0,
                  recommendation_reason: doctorData.recommendation_reason || '',
                  execution_id: doctorData.execution_id || `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                  status: 'pending'
                });
              }
              // console.log(`✅ Saved ${analysisResult.doctor_recommendations.length} doctor recommendations to separate table`);
            } catch (error) {
              // console.error('❌ Failed to save doctor recommendations:', error);
              // Don't fail the whole upload if doctor recommendations save fails
            }
          }

          // Update the file object with the database IDs and mark as stored
          setUploadedFiles(prev => prev.map(file => 
            file.id === fileId 
              ? { 
                  ...file, 
                  threadId: thread.id,
                  resultId: result.id,
                  isStored: true
                }
              : file
          ));

          // console.log('Analysis result stored in database');
        } catch (error: any) {
          // console.warn('Failed to store analysis result in database:', error);
          
          // Update file status to show database storage warning
          setUploadedFiles(prev => prev.map(file => 
            file.id === fileId 
              ? { 
                  ...file, 
                  status: 'success' as const,
                  analysisStep: 'Analysis complete (storage failed)',
                  warning: `Analysis completed but failed to save to database: ${error.message}. You can retry saving later.`
                }
              : file
          ));
          
          // Continue anyway - don't fail the analysis if storage fails
        }
      } else if (currentFileObj.isStored) {
        // console.log('Analysis already stored in database, skipping storage');
      }

      // Cache the analysis result
      const cacheKey = CacheKeys.api.analysisResult(fileId);
      cacheService.set(cacheKey, analysisResult, 300000); // Cache for 5 minutes

      // Clear processing flag
      processingFiles.current.delete(fileId);
      
      // Update with successful result
      setUploadedFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { 
              ...file, 
              status: 'success' as const, 
              progress: 100, 
              analysisStep: 'Analysis complete',
              isProcessing: false, // Clear processing flag
              analysisResult: {
                severity: analysisResult.diagnosis?.severity || 'low',
                healingStage: analysisResult.description?.wound_type || 'Assessment in progress',
                infectionRisk: analysisResult.diagnosis?.is_infected ? 'High' : 'Low',
                description: analysisResult.description?.characteristics?.join(', ') || 'No description available',
                area: analysisResult.segmentation?.wound_area || 0,
                confidence: analysisResult.diagnosis?.confidence || 0,
                annotatedImage: analysisResult.segmentation?.mask,
                processingTime: analysisResult.metadata?.processing_time || 0,
                diagnosis: analysisResult.diagnosis?.infection_type || 'unknown',
                treatmentPlan: analysisResult.treatment_plan,
                doctorRecommendations: analysisResult.doctor_recommendations
              }
            }
          : file
      ));

    } catch (error) {
      // console.error('=== ANALYSIS FAILED ===');
      // console.error('File ID:', fileId);
      // console.error('Error:', error);
      // console.error('Error type:', typeof error);
      // console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
      // console.error('Error message:', error instanceof Error ? error.message : String(error));
      // console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Network diagnostics
      // console.log('=== NETWORK DIAGNOSTICS ===');
      // console.log('Current URL:', window.location.href);
      // console.log('User agent:', navigator.userAgent);
      // console.log('Online status:', navigator.onLine);
      // console.log('Connection type:', (navigator as any).connection?.effectiveType || 'Unknown');
      
      // Clear processing flag
      processingFiles.current.delete(fileId);
      // console.log('✅ Processing flag cleared for file:', fileId);
      
      // Enhanced error handling with more specific error messages
      let errorMessage = 'Analysis failed';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = `Network error - Unable to connect to analysis server. Please check if the backend server is running at ${API_CONFIG.BACKEND.getBaseUrl()}`;
        } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
          errorMessage = 'Analysis timed out - try with a smaller image (under 2MB) or check your connection';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'Server connection issue - CORS policy may be blocking the request';
        } else if (error.message.includes('Authentication required')) {
          errorMessage = 'Please log in to perform analysis';
        } else if (error.message.includes('AbortError') || error.message.includes('aborted')) {
          errorMessage = 'Request was cancelled - try again';
        } else if (error.message.includes('Analysis request timed out')) {
          errorMessage = error.message; // Use the specific timeout message from MCP service
        } else if (error.message.includes('Network error: Unable to connect')) {
          errorMessage = error.message; // Use the specific network error message
        } else {
          errorMessage = `Analysis failed: ${error.message}`;
        }
      }
      
      // console.log('Final error message for user:', errorMessage);
      
      setUploadedFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { 
              ...file, 
              status: 'error' as const, 
              progress: 0,
              analysisStep: errorMessage,
              isProcessing: false // Clear processing flag
            }
          : file
      ));
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/...;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  // Network connectivity test function
  const testNetworkConnectivity = async (): Promise<boolean> => {
    try {
      // console.log('=== TESTING NETWORK CONNECTIVITY ===');
      
      // Test multiple endpoints to determine connectivity
      // Test 127.0.0.1 first as it's most reliable (direct IPv4)
      const testUrls = [
        'http://192.168.130.30:8000/health', //127.0.0.1
        'http://192.168.130.30:8000/health',
        `${API_CONFIG.BACKEND.getBaseUrl()}/health`
      ];
      
      for (const url of testUrls) {
        try {
          // console.log(`Testing connectivity to: ${url}`);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
          
          const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            mode: 'cors',
            credentials: 'omit'
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            // console.log(`✅ Connectivity test successful: ${url}`);
            return true;
          } else {
            // console.log(`⚠️ Connectivity test failed: ${url} - Status: ${response.status}`);
          }
        } catch (error) {
          // Don't log abort errors as they're expected when timeout occurs
          if (error instanceof Error && error.name === 'AbortError') {
            // console.log(`⏱️ Connectivity test timed out for ${url} (trying next endpoint...)`);
          } else {
            // console.log(`⚠️ Connectivity test error for ${url}:`, error);
          }
        }
      }
      
      // console.log('❌ All connectivity tests failed');
      return false;
    } catch (error) {
      // console.error('Connectivity test failed:', error);
      return false;
    }
  };

  const retryUpload = async (fileId: string) => {
    // console.log('=== RETRYING UPLOAD ===');
    // console.log('File ID:', fileId);
    
    // Test network connectivity before retry
    const isConnected = await testNetworkConnectivity();
    if (!isConnected) {
      // console.error('Network connectivity test failed, cannot retry');
      setUploadedFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { 
              ...file, 
              status: 'error' as const, 
              analysisStep: 'Network connectivity test failed - please check your connection and ensure the backend server is running'
            }
          : file
      ));
      return;
    }
    
    setUploadedFiles(prev => {
      const fileToRetry = prev.find(f => f.id === fileId);
      if (!fileToRetry) {
        // console.error('File not found for retry:', fileId);
        return prev;
      }
      
      // console.log('File found for retry:', {
      //   id: fileToRetry.id,
      //   name: fileToRetry.file.name,
      //   size: fileToRetry.file.size
      // });
      
      const updatedFiles = prev.map(file => 
        file.id === fileId 
          ? { 
              ...file, 
              status: 'uploading' as const, 
              progress: 0, 
              analysisStep: 'Retrying...',
              isProcessing: false // Reset processing flag
            }
          : file
      );
      
      // Clear any existing processing flag
      processingFiles.current.delete(fileId);
      
      // Start retry with the file object
      setTimeout(() => {
        startUploadAndAnalysis(fileId, fileToRetry);
      }, 1000); // Small delay before retry
      
      return updatedFiles;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'analyzing':
        return <Brain className="w-5 h-5 text-purple-500 animate-pulse" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  // Navigate to results detailed page
  const handleViewDetails = (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file && file.threadId) {
      navigate(`/demo/result/${file.threadId}`);
    } else {
      // console.error('Thread ID not found for file:', fileId);
      alert('Cannot view details - analysis thread not found');
    }
  };

  // Download PDF report
  const handleDownloadReport = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file || !file.threadId || !currentUser) {
      // console.error('Cannot download report - missing data');
      alert('Cannot download report - analysis data not found');
      return;
    }

    try {
      // console.log('Downloading report for thread:', file.threadId);
      
      // Fetch the analysis result from database
      const results = await supabaseCRUDService.getAnalysisResults(file.threadId, currentUser.id);
      if (!results || results.length === 0) {
        throw new Error('No analysis results found');
      }

      const result = results[0];
      
      // Fetch treatment plans and doctor recommendations
      let treatmentPlans: any[] = [];
      let doctorRecommendations: any[] = [];
      
      try {
        [treatmentPlans, doctorRecommendations] = await Promise.all([
          supabaseCRUDService.getTreatmentPlansByResult(result.id!, currentUser.id),
          supabaseCRUDService.getDoctorRecommendationsByThread(file.threadId, currentUser.id)
        ]);
      } catch (err) {
        // console.warn('Failed to fetch treatment plans or doctor recommendations:', err);
      }
      
      // Parse processing_metadata
      let backendData: any = null;
      if (result.processing_metadata) {
        try {
          backendData = typeof result.processing_metadata === 'string' 
            ? JSON.parse(result.processing_metadata) 
            : result.processing_metadata;
        } catch (e) {
          // console.warn('Failed to parse processing_metadata:', e);
        }
      }
      
      // Extract data from database fields
      const severity = result.severity || 'mild';
      const diagnosis = result.diagnosis || 'unknown';
      const woundDescription = result.wound_description || '';
      const characteristics = woundDescription ? woundDescription.split(',').map((s: string) => s.trim()) : [];
      const recommendations = Array.isArray(result.recommendations) ? result.recommendations : [];
      const woundType = result.healing_stage || diagnosis || 'Wound Assessment';
      
      const treatmentPlanData = treatmentPlans.length > 0 ? treatmentPlans[0] : null;
      
      // Determine image URLs
      const backendBaseUrl = API_CONFIG.BACKEND.getBaseUrl();
      let imageUrl = '/images/sample-wound-analysis.jpg';
      let originalImageUrl: string | undefined;
      let segmentedImageUrl: string | undefined;
      
      if (result.segmented_image_url) {
        segmentedImageUrl = result.segmented_image_url.startsWith('http') 
          ? result.segmented_image_url 
          : `${backendBaseUrl}${result.segmented_image_url}`;
        imageUrl = segmentedImageUrl || imageUrl;
      }
      
      if (result.original_image_url) {
        originalImageUrl = result.original_image_url.startsWith('http')
          ? result.original_image_url
          : `${backendBaseUrl}${result.original_image_url}`;
        if (!segmentedImageUrl) {
          imageUrl = originalImageUrl || imageUrl;
        }
      }
      
      // Format result for PDF generator
      const formattedResult = {
        id: file.threadId,
        imageUrl: imageUrl,
        originalImageUrl,
        segmentedImageUrl,
        woundType: woundType,
        severity: severity as any,
        confidence: Math.round((result.confidence_score || 0) * 100),
        isInfected: result.infection_probability ? result.infection_probability > 0.5 : false,
        infectionType: diagnosis !== 'unknown' && diagnosis !== 'not_infected' ? diagnosis : null,
        woundArea: result.area_cm2 || 0,
        characteristics: characteristics.length > 0 ? characteristics : ['Wound characteristics not available'],
        description: woundDescription || 'No description available',
        recommendations: recommendations,
        timestamp: result.analyzed_at || result.created_at || new Date().toISOString(),
        analyzedBy: `DermaIQ AI ${result.model_version || 'v2.1'}`,
        processingTime: backendData?.processing_time,
        treatmentPlan: treatmentPlanData,
        doctorRecommendations: doctorRecommendations
      };
      
      // Generate and download PDF
      await downloadPDFReport(formattedResult);
      // console.log('PDF report downloaded successfully');
    } catch (error) {
      // console.error('Error downloading PDF report:', error);
      alert('Failed to download PDF report. Please try again.');
    }
  };

  return (
    <DemoLayout>
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">DermaIQ Upload</h1>
              </div>
              <p className="text-gray-600 mt-1">
                AI-Powered Wound Analysis & Treatment Planning
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Camera className="w-4 h-4" />
              <span>Camera integration available</span>
            </div>
          </div>
        </div>

        {/* Network Status */}
        <div className={`border rounded-xl p-6 mb-6 ${
          networkStatus === 'connected' 
            ? 'bg-green-50 border-green-200' 
            : networkStatus === 'disconnected' 
            ? 'bg-red-50 border-red-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center space-x-3">
            {networkStatus === 'connected' ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : networkStatus === 'disconnected' ? (
              <AlertCircle className="w-6 h-6 text-red-600" />
            ) : (
              <Loader2 className="w-6 h-6 text-yellow-600 animate-spin" />
            )}
            <div>
              <h3 className={`text-lg font-semibold ${
                networkStatus === 'connected' 
                  ? 'text-green-800' 
                  : networkStatus === 'disconnected' 
                  ? 'text-red-800' 
                  : 'text-yellow-800'
              }`}>
                {networkStatus === 'connected' 
                  ? 'Backend Server Connected' 
                  : networkStatus === 'disconnected' 
                  ? 'Backend Server Disconnected' 
                  : 'Checking Backend Connection...'}
              </h3>
              <p className={`mt-1 ${
                networkStatus === 'connected' 
                  ? 'text-green-700' 
                  : networkStatus === 'disconnected' 
                  ? 'text-red-700' 
                  : 'text-yellow-700'
              }`}>
                {networkStatus === 'connected' 
                  ? 'Analysis server is accessible and ready for image processing.' 
                  : networkStatus === 'disconnected' 
                  ? `Cannot connect to analysis server. Please ensure the backend is running at ${API_CONFIG.BACKEND.getBaseUrl()}` 
                  : 'Verifying connection to the analysis server...'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Area */}
          <div className="lg:col-span-2">
            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragOver
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <UploadIcon className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Drop images here or click to browse
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Supports JPG, PNG, and other common image formats
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <label className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    Browse Files
                  </label>
                  
                  <button 
                    className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <Camera className="w-4 h-4 inline mr-2" />
                    Take Photo
                  </button>
                </div>

                <div className="text-xs text-gray-500">
                  <p>• Maximum file size: 10MB per image</p>
                  <p>• Recommended resolution: 1920x1080 or higher</p>
                  <p>• Ensure good lighting and clear focus</p>
                </div>
              </div>
            </div>

            {/* Upload Guidelines */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Upload Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure the wound is clearly visible and well-lit</li>
                <li>• Include surrounding skin for context</li>
                <li>• Avoid blurry or out-of-focus images</li>
                <li>• Remove any bandages or dressings if possible</li>
                <li>• Take multiple angles if the wound is complex</li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Files</span>
                  <span className="font-semibold">{uploadedFiles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Successfully Analyzed</span>
                  <span className="font-semibold text-green-600">
                    {uploadedFiles.filter(f => f.status === 'success').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing</span>
                  <span className="font-semibold text-blue-600">
                    {uploadedFiles.filter(f => f.status === 'uploading' || f.status === 'analyzing').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Errors</span>
                  <span className="font-semibold text-red-600">
                    {uploadedFiles.filter(f => f.status === 'error').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Uploads */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h3>
              <div className="space-y-3">
                {uploadedFiles.slice(0, 3).map((file) => (
                  <div key={file.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileImage className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    {getStatusIcon(file.status)}
                  </div>
                ))}
                {uploadedFiles.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No files uploaded yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Files</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`border rounded-lg p-4 ${getStatusColor(file.status)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  {(file.status === 'uploading' || file.status === 'analyzing') && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{file.analysisStep || 'Processing...'}</span>
                        <span>{Math.round(file.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            file.status === 'analyzing' ? 'bg-purple-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(file.status)}
                      <span className="text-sm capitalize">{file.status}</span>
                    </div>
                    
                    {file.status === 'success' && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewDetails(file.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View detailed analysis"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDownloadReport(file.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Download PDF report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {file.status === 'error' && (
                      <button
                        onClick={() => retryUpload(file.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Retry
                      </button>
                    )}
                  </div>

                  {/* Warning Message */}
                  {file.warning && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-2">
                          <p className="text-sm text-yellow-700">{file.warning}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Analysis Result Preview */}
                  {file.analysisResult && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        {file.analysisResult.woundType}
                      </p>
                      <p className="text-xs text-gray-600">
                        Confidence: {file.analysisResult.confidence * 100}%
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DemoLayout>
  );
};

export default Upload;
