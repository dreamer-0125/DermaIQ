import React, { useState, useEffect } from 'react';
import { Eye, Download, Share2, AlertTriangle, CheckCircle, FileText, Calendar, User, Printer } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { cacheService, CacheKeys, CacheTags } from '../services/cacheService';
import { supabaseCRUDService } from '../../services/supabaseService';
import { useAuth } from '../../contexts/AuthContext';
import DemoLayout from '../components/layout/DemoLayout';
import { API_CONFIG } from '../../config/api';
import { downloadPDFReport, printPDFReport } from '../../utils/pdfReportGenerator';

// Frontend display structure
interface AnalysisResult {
  id: string;
  imageUrl: string;
  originalImageUrl?: string;
  segmentedImageUrl?: string;
  woundType: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  confidence: number;
  isInfected: boolean;
  infectionType: string | null;
  woundArea: number;
  characteristics: string[];
  description: string;
  recommendations: string[];
  timestamp: string;
  analyzedBy: string;
  processingTime?: number;
  treatmentPlan?: any;
  doctorRecommendations?: any[];
}

const Result: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'details'>('overview');
  const [availableThreads, setAvailableThreads] = useState<any[]>([]);
  const [showThreadList, setShowThreadList] = useState(false);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    // console.log('Result.tsx useEffect triggered:', { threadId, userId: currentUser?.id });
    
    if (threadId && currentUser?.id) {
      // console.log('Loading analysis result for thread:', threadId);
      loadAnalysisResult();
      setShowThreadList(false); // Explicitly set to detail view mode
    } else if (!threadId && currentUser?.id) {
      // console.log('Loading available threads for user:', currentUser.id);
      loadAvailableThreads();
      setShowThreadList(true); // Explicitly set to list view mode
    } else if (!currentUser?.id) {
      // console.log('Waiting for user authentication...');
    }
  }, [threadId, currentUser?.id]);

  const loadAnalysisResult = async () => {
    if (!threadId || !currentUser?.id) {
      // console.log('Cannot load analysis result - missing data:', { 
      //   threadId, 
      //   userId: currentUser?.id 
      // });
      return;
    }
    
    // console.log('Starting to load analysis result:', { threadId, userId: currentUser.id });
    setLoading(true);
    setError(null);
    
    try {
      // Check cache first for analysis result
      const cacheKey = CacheKeys.api.analysisResult(threadId);
      const cachedResult = cacheService.get(cacheKey);
      
      if (cachedResult) {
        // console.log('Using cached analysis result:', cachedResult);
        setSelectedResult(cachedResult as AnalysisResult);
        setLoading(false);
        return;
      }

      // console.log('Fetching analysis result from Supabase...');
      
      // Fetch real data from Supabase - including treatment plans and doctor recommendations
      const [thread, results] = await Promise.all([
        supabaseCRUDService.getAnalysisThread(threadId, currentUser.id),
        supabaseCRUDService.getAnalysisResults(threadId, currentUser.id)
      ]);

      // console.log('Fetched data:', { thread, resultsCount: results?.length });

      if (!thread) {
        // console.error('Thread not found:', threadId);
        setError('Analysis thread not found');
        setLoading(false);
        return;
      }
      
      if (!results || results.length === 0) {
        // console.error('No results found for thread:', threadId);
        setError('No analysis results found for this thread');
        setLoading(false);
        return;
      }

      const result = results[0]; // Get the first (most recent) result
      // console.log('Processing result data:', result);
      
      // Fetch treatment plans and doctor recommendations from separate tables
      let treatmentPlans: any[] = [];
      let doctorRecommendations: any[] = [];
      
      if (result.id) {
        try {
          [treatmentPlans, doctorRecommendations] = await Promise.all([
            supabaseCRUDService.getTreatmentPlansByResult(result.id, currentUser.id),
            supabaseCRUDService.getDoctorRecommendationsByThread(threadId, currentUser.id)
          ]);
          // console.log('✅ Fetched treatment plans:', treatmentPlans.length);
          // console.log('✅ Fetched doctor recommendations:', doctorRecommendations.length);
        } catch (err) {
          // console.warn('Failed to fetch treatment plans or doctor recommendations:', err);
        }
      }
      
      // Parse processing_metadata which contains the backend response structure
      let backendData: any = null;
      if (result.processing_metadata) {
        try {
          backendData = typeof result.processing_metadata === 'string' 
            ? JSON.parse(result.processing_metadata) 
            : result.processing_metadata;
          // console.log('Backend data from processing_metadata:', backendData);
        } catch (e) {
          // console.warn('Failed to parse processing_metadata:', e);
        }
      }
      
      // Determine image URLs
      const backendBaseUrl = API_CONFIG.BACKEND.getBaseUrl();
      let imageUrl = '/images/sample-wound-analysis.jpg'; // Default placeholder
      let originalImageUrl: string | undefined;
      let segmentedImageUrl: string | undefined;
      
      if (result.segmented_image_url) {
        segmentedImageUrl = result.segmented_image_url.startsWith('http') 
          ? result.segmented_image_url 
          : `${backendBaseUrl}${result.segmented_image_url}`;
        imageUrl = segmentedImageUrl; // Prefer segmented
        // console.log('Using segmented image:', imageUrl);
      }
      
      if (result.original_image_url) {
        originalImageUrl = result.original_image_url.startsWith('http')
          ? result.original_image_url
          : `${backendBaseUrl}${result.original_image_url}`;
        if (!segmentedImageUrl) {
          imageUrl = originalImageUrl; // Fallback to original
          // console.log('Using original image:', imageUrl);
        }
      }
      
      if (!originalImageUrl && !segmentedImageUrl) {
        // console.log('No stored images found, using placeholder');
      }
      
      // Use treatment plans and doctor recommendations from separate tables
      const treatmentPlanData = treatmentPlans.length > 0 ? treatmentPlans[0] : null;
      // console.log('Treatment plan from database:', treatmentPlanData);
      // console.log('Doctor recommendations from database:', doctorRecommendations);
      
      // Extract data from database fields (this is from Supabase save)
      const severity = result.severity || 'mild';
      const diagnosis = result.diagnosis || 'unknown';
      const woundDescription = result.wound_description || '';
      const characteristics = woundDescription ? woundDescription.split(',').map((s: string) => s.trim()) : [];
      const recommendations = Array.isArray(result.recommendations) ? result.recommendations : [];
      const woundType = result.healing_stage || diagnosis || 'Wound Assessment';
      
      // Convert database result to frontend format
      const analysisResult: AnalysisResult = {
        id: threadId,
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
      
      // console.log('Analysis result formatted:', analysisResult);
      
      // Cache the analysis result
      cacheService.set(cacheKey, analysisResult, CacheTags.ANALYSIS as any);
      setSelectedResult(analysisResult);
      setShowThreadList(false); // Ensure we show the detail view, not the list
    } catch (error) {
      // console.error('Failed to load analysis result:', error);
      setError(error instanceof Error ? error.message : 'Failed to load analysis result');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableThreads = async () => {
    if (!currentUser?.id) {
      // console.error('No current user found');
      setAvailableThreads([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Check cache for available threads
      const cacheKey = CacheKeys.user.profile(currentUser.id);
      const cachedData = cacheService.get(cacheKey);
      
      if (cachedData && (cachedData as any).threads) {
        const completedThreads = (cachedData as any).threads
          .filter((thread: any) => thread.status === 'completed');
        setAvailableThreads(completedThreads);
      } else {
        // Fetch real data from Supabase
        const threadsResponse = await supabaseCRUDService.getAnalysisThreads(currentUser.id);
        
        // Filter for completed threads and format for display
        const completedThreads = threadsResponse.threads
          .filter((thread: any) => thread.status === 'completed')
          .map((thread: any) => ({
            id: thread.id!,
            patientName: thread.patient_name || 'Unknown Patient',
            imageUrl: '', // TODO: Store actual image URLs in database
            uploadedAt: new Date(thread.created_at || new Date()),
            status: thread.status,
            priority: thread.priority,
            processingTime: thread.analysis_completed_at ? 
              Math.round((new Date(thread.analysis_completed_at).getTime() - new Date(thread.created_at || new Date()).getTime()) / 1000) : 
              null
          }));

        setAvailableThreads(completedThreads);
      }
      setShowThreadList(true);
    } catch (error) {
      // console.error('Failed to load available threads:', error);
      setAvailableThreads([]);
    } finally {
      setLoading(false);
    }
  };

  // const getWoundTypeDisplayName = (diagnosis: string): string => {
  //   const woundTypeNames: Record<string, string> = {
  //     'infected': 'Infected Wound',
  //     'not_infected': 'Non-Infected Wound',
  //     'diabetic_ulcer': 'Diabetic Foot Ulcer',
  //     'pressure_ulcer': 'Pressure Ulcer (Bed Sore)',
  //     'venous_ulcer': 'Venous Ulcer'
  //   };
  //   return woundTypeNames[diagnosis] || diagnosis;
  // };

  // const getSeverityDisplayName = (severity: string): string => {
  //   const severityNames: Record<string, string> = {
  //     'low': 'Low',
  //     'medium': 'Moderate',
  //     'high': 'High'
  //   };
  //   return severityNames[severity] || severity;
  // };


  const getSeverityColor = (severity: string) => {
    const lowerSeverity = severity.toLowerCase();
    switch (lowerSeverity) {
      case 'mild':
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'moderate':
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
      case 'severe':
        return 'text-orange-600 bg-orange-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadImage = async () => {
    if (!selectedResult) return;
    
    // Get the segmented image URL (prioritize segmented over original)
    const downloadUrl = selectedResult.segmentedImageUrl || selectedResult.imageUrl;
    
    if (!downloadUrl) {
      console.error('No image URL available for download');
      alert('Image not available for download');
      return;
    }
    
    try {
      // console.log('Downloading image from:', downloadUrl.substring(0, 100) + '...');
      
      // For data URLs, create download directly
      if (downloadUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `wound-analysis-${selectedResult.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // console.log('✓ Data URL download triggered');
        return;
      }
      
      // For HTTP URLs, fetch as blob
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      // console.log('✓ Image blob fetched, size:', blob.size, 'type:', blob.type);
      
      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `wound-analysis-${selectedResult.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
      // console.log('✓ Image download completed');
    } catch (error) {
      console.error('✗ Failed to download image:', error);
      // Fallback: open in new tab if download fails
      window.open(downloadUrl, '_blank');
    }
  };

  const handleViewFullSize = () => {
    setShowFullScreenImage(true);
  };

  const handleCloseFullScreen = () => {
    setShowFullScreenImage(false);
  };

  const handleExportPDF = async () => {
    if (!selectedResult) return;
    
    setIsGeneratingPDF(true);
    try {
      await downloadPDFReport(selectedResult);
      // console.log('PDF report downloaded successfully');
    } catch (error) {
      // console.error('Failed to export PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrintReport = async () => {
    if (!selectedResult) return;
    
    setIsPrinting(true);
    try {
      await printPDFReport(selectedResult);
      // console.log('Print dialog opened successfully');
    } catch (error) {
      // console.error('Failed to print report:', error);
      alert(error instanceof Error ? error.message : 'Failed to print report. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Results</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/demo/upload')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Start New Analysis
          </button>
        </div>
      </div>
    );
  }

  // Show list of available results when no specific threadId is provided
  if (showThreadList) {
    return (
      <DemoLayout>
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <FileText className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
                </div>
                <p className="text-gray-600 mt-1">Select an analysis to view its results</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {availableThreads.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Analysis Results</h2>
              {availableThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/demo/result/${thread.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{thread.patientName}</h3>
                        <p className="text-sm text-gray-500">
                          Analysis completed on {thread.uploadedAt.toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Processing time: {thread.processingTime ? `${thread.processingTime}s` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        thread.priority === 'high' ? 'text-red-600 bg-red-100' :
                        thread.priority === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                        'text-green-600 bg-green-100'
                      }`}>
                        {thread.priority.toUpperCase()} PRIORITY
                      </span>
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Results Available</h3>
              <p className="text-gray-500 mb-6">
                You need to complete a wound analysis first to see results here.
              </p>
              <button
                onClick={() => navigate('/demo/upload')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Start New Analysis
              </button>
            </div>
          )}
        </div>
      </DemoLayout>
    );
  }

  if (!selectedResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Analysis Results</h2>
          <p className="text-gray-600">Upload wound images to see analysis results here.</p>
        </div>
      </div>
    );
  }

  return (
    <DemoLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
              <p className="text-gray-600 mt-1">
                AI-powered wound analysis and treatment recommendations
              </p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => alert('Share functionality coming soon')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button 
                onClick={handleExportPDF}
                disabled={isGeneratingPDF}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingPDF ? 'Generating...' : 'Export'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image and Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedResult.imageUrl}
                    alt="Wound analysis"
                    className="w-full h-64 object-cover rounded-lg border cursor-pointer"
                    onClick={handleViewFullSize}
                  />
                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={handleViewFullSize}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Full Size</span>
                    </button>
                    <button 
                      onClick={handleDownloadImage}
                      className="flex items-center space-x-2 text-green-600 hover:text-green-800 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedResult.woundType}
                    </h2>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(selectedResult.severity)}`}>
                        {selectedResult.severity.charAt(0).toUpperCase() + selectedResult.severity.slice(1)} Severity
                      </span>
                      <span className={`text-sm font-medium ${getConfidenceColor(selectedResult.confidence)}`}>
                        {selectedResult.confidence}% Confidence
                      </span>
                      {selectedResult.isInfected && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          Infected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Wound Area</p>
                      <p className="font-semibold">{selectedResult.woundArea.toFixed(2)} cm²</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Infection Status</p>
                      <p className="font-semibold">{selectedResult.isInfected ? 'Infected' : 'Not Infected'}</p>
                    </div>
                    {selectedResult.infectionType && (
                      <div>
                        <p className="text-sm text-gray-600">Infection Type</p>
                        <p className="font-semibold">{selectedResult.infectionType}</p>
                      </div>
                    )}
                    {selectedResult.processingTime && (
                      <div>
                        <p className="text-sm text-gray-600">Processing Time</p>
                        <p className="font-semibold">{(selectedResult.processingTime / 1000).toFixed(2)}s</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Analyzed on {formatDate(selectedResult.timestamp)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <User className="w-4 h-4" />
                      <span>By {selectedResult.analyzedBy}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: Eye },
                    { id: 'recommendations', label: 'Recommendations', icon: CheckCircle },
                    { id: 'details', label: 'Details', icon: FileText }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Wound Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Wound Description</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">{selectedResult.description}</p>
                      </div>
                    </div>

                    {/* Wound Characteristics */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Wound Characteristics</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {selectedResult.characteristics.map((characteristic, index) => (
                          <div key={index} className="flex items-start space-x-2 bg-blue-50 p-3 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <span className="text-gray-700 flex-1">{characteristic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Infection Status */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Infection Assessment</h3>
                      <div className={`p-4 rounded-lg ${selectedResult.isInfected ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {selectedResult.isInfected ? (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          <span className="font-semibold text-gray-900">
                            {selectedResult.isInfected ? 'Infection Detected' : 'No Infection Detected'}
                          </span>
                        </div>
                        {selectedResult.infectionType && (
                          <p className="text-sm text-gray-700 ml-7">Type: {selectedResult.infectionType}</p>
                        )}
                        <p className="text-sm text-gray-700 ml-7">Confidence: {selectedResult.confidence}%</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'recommendations' && (
                  <div className="space-y-6">
                    {/* General Recommendations */}
                    {selectedResult.recommendations && selectedResult.recommendations.length > 0 ? (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                          <span>Recommended Actions</span>
                        </h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <ul className="space-y-2">
                            {selectedResult.recommendations.map((action, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <span className="text-gray-700">{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No specific recommendations available</p>
                      </div>
                    )}

                    {/* Doctor Recommendations */}
                    {selectedResult.doctorRecommendations && selectedResult.doctorRecommendations.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Healthcare Providers</h3>
                        <div className="space-y-3">
                          {selectedResult.doctorRecommendations.map((doctor: any, index: number) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                                </div>
                                {doctor.rating && (
                                  <div className="flex items-center space-x-1">
                                    <span className="text-yellow-500">★</span>
                                    <span className="font-medium">{doctor.rating}</span>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>📞 {doctor.phone}</p>
                                <p>✉️ {doctor.email}</p>
                                <p>📍 {doctor.address}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Link to separate pages */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedResult.treatmentPlan && (
                        <button
                          onClick={() => navigate(`/demo/treatment/${threadId}`)}
                          className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-left"
                        >
                          <h4 className="font-semibold mb-1">View Full Treatment Plan</h4>
                          <p className="text-sm opacity-90">Detailed wound care instructions</p>
                        </button>
                      )}
                      {selectedResult.doctorRecommendations && selectedResult.doctorRecommendations.length > 0 && (
                        <button
                          onClick={() => navigate(`/demo/consultant/${threadId}`)}
                          className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-left"
                        >
                          <h4 className="font-semibold mb-1">View All Healthcare Providers</h4>
                          <p className="text-sm opacity-90">Find specialists in your area</p>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysis Details</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Wound Type</span>
                            <span className="font-medium">{selectedResult.woundType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Severity Level</span>
                            <span className="font-medium">{selectedResult.severity.charAt(0).toUpperCase() + selectedResult.severity.slice(1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Confidence Score</span>
                            <span className="font-medium">{selectedResult.confidence}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Infection Status</span>
                            <span className="font-medium">{selectedResult.isInfected ? 'Infected' : 'Not Infected'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Analysis Date</span>
                            <span className="font-medium">{formatDate(selectedResult.timestamp)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Measurements</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Wound Area</span>
                            <span className="font-medium">{selectedResult.woundArea.toFixed(2)} cm²</span>
                          </div>
                          {selectedResult.infectionType && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Infection Type</span>
                              <span className="font-medium">{selectedResult.infectionType}</span>
                            </div>
                          )}
                          {selectedResult.processingTime && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Processing Time</span>
                              <span className="font-medium">{(selectedResult.processingTime / 1000).toFixed(2)}s</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">AI Model Version</p>
                            <p className="font-medium">{selectedResult.analyzedBy}</p>
                          </div>
                          {selectedResult.processingTime && (
                            <div>
                              <p className="text-gray-600">Processing Time</p>
                              <p className="font-medium">{(selectedResult.processingTime / 1000).toFixed(2)} seconds</p>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-600">Analysis ID</p>
                            <p className="font-medium font-mono text-xs">{selectedResult.id}</p>
                          </div>
                          {selectedResult.originalImageUrl && (
                            <div>
                              <p className="text-gray-600">Original Image</p>
                              <a href={selectedResult.originalImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                                View Image
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Treatment Plan Preview */}
                    {selectedResult.treatmentPlan && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Treatment Plan Summary</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          {selectedResult.treatmentPlan.name && (
                            <div className="mb-3">
                              <h4 className="font-semibold text-blue-900">{selectedResult.treatmentPlan.name}</h4>
                              {selectedResult.treatmentPlan.description && (
                                <p className="text-sm text-gray-700 mt-1">{selectedResult.treatmentPlan.description}</p>
                              )}
                            </div>
                          )}
                          
                          {selectedResult.treatmentPlan.materials && selectedResult.treatmentPlan.materials.length > 0 && (
                            <div className="mb-3">
                              <p className="font-medium text-gray-900 mb-1">Required Materials:</p>
                              <ul className="list-disc list-inside text-sm text-gray-700 max-h-32 overflow-y-auto">
                                {selectedResult.treatmentPlan.materials.slice(0, 5).map((material: string, idx: number) => (
                                  <li key={idx}>{material}</li>
                                ))}
                                {selectedResult.treatmentPlan.materials.length > 5 && (
                                  <li className="text-blue-600">... and {selectedResult.treatmentPlan.materials.length - 5} more</li>
                                )}
                              </ul>
                            </div>
                          )}
                          
                          <button
                            onClick={() => navigate(`/demo/treatment/${threadId}`)}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-3"
                          >
                            View Full Treatment Plan
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate(`/demo/treatment/${threadId}`)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Treatment Plan
                </button>
                <button 
                  onClick={() => navigate(`/demo/consultant/${threadId}`)}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Consult Specialist
                </button>
                <button 
                  onClick={handlePrintReport}
                  disabled={isPrinting}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isPrinting ? 'Preparing...' : 'Print Report'}</span>
                </button>
              </div>
            </div>

            {/* Related Cases */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Cases</h3>
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-3">
                  <p className="font-medium text-sm">Diabetic Ulcer - Healed</p>
                  <p className="text-xs text-gray-500">Similar characteristics</p>
                  <p className="text-xs text-green-600">Treatment successful</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <p className="font-medium text-sm">Pressure Sore - Improving</p>
                  <p className="text-xs text-gray-500">Similar severity</p>
                  <p className="text-xs text-yellow-600">Ongoing treatment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Screen Image Modal */}
        {showFullScreenImage && selectedResult && (selectedResult.segmentedImageUrl || selectedResult.imageUrl) && (
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            onClick={handleCloseFullScreen}
          >
            <div className="relative max-w-7xl max-h-full">
              <button
                onClick={handleCloseFullScreen}
                className="absolute top-4 right-4 bg-white text-gray-900 rounded-full p-2 hover:bg-gray-100 transition-colors z-10"
                aria-label="Close full screen"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedResult.segmentedImageUrl || selectedResult.imageUrl}
                alt="Full size wound analysis"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedResult.woundType}</h3>
                  <p className="text-sm text-gray-600">Analysis ID: {selectedResult.id}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadImage();
                  }}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DemoLayout>
  );
};

export default Result;
