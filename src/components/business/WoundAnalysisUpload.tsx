import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  Brain, 
  CheckCircle, 
  FileText,
  Loader2,
  Camera,
  Activity
} from 'lucide-react';
import { enhancedMCPService } from '../../demo/services/mcpService';
import { AnalysisThread, AnalysisResult } from '../../types/analysis';
import AnalysisProgress from './AnalysisProgress';
import WoundDiagnosis from './WoundDiagnosis';

interface WoundAnalysisUploadProps {
  userId: string;
  onAnalysisComplete?: (thread: AnalysisThread, results: AnalysisResult[]) => void;
  useDemoMode?: boolean; // New prop to determine which service to use
}

const WoundAnalysisUpload: React.FC<WoundAnalysisUploadProps> = ({
  userId,
  onAnalysisComplete,
  useDemoMode = false
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [, setAnalysisThread] = useState<AnalysisThread | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('preparing');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image file is too large. Please select an image smaller than 10MB');
        return;
      }
      
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const startAnalysis = useCallback(async () => {
    if (!uploadedImage || !patientName.trim()) {
      setError('Please provide both an image and patient name');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setCurrentStep('preparing');
    setProgress(0);
    setShowResults(false);
    
    try {
      // Create analysis thread
      const thread: AnalysisThread = {
        id: `${useDemoMode ? 'demo' : 'prod'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        patientName: patientName.trim(),
        imageUrl: uploadedImage,
        uploadedAt: new Date(),
        status: 'uploaded',
        priority: 'medium'
      };
      setAnalysisThread(thread);
      
      // Extract base64 data from data URL
      const base64Data = uploadedImage.split(',')[1];
      
      // Use enhanced MCP service for analysis with caching
      const mcpResult = await enhancedMCPService.analyzeWoundImage(base64Data, (step, progress) => {
        setCurrentStep(step);
        setProgress(progress);
      });
      
      // Convert enhanced MCP result to AnalysisResult format
      const result: AnalysisResult = {
        severity: (mcpResult.diagnosis?.severity as 'low' | 'medium' | 'high') || 'medium',
        healingStage: 'granulation', // Default healing stage
        infectionRisk: mcpResult.diagnosis?.is_infected ? 'high' : 'low',
        area_cm2: mcpResult.segmentation?.wound_area || 0,
        confidence: mcpResult.diagnosis?.confidence || 0.85,
        processingTime: mcpResult.metadata?.processing_time || 0,
        diagnosis: mcpResult.diagnosis?.is_infected ? 'infected' : 'not_infected',
        description: mcpResult.description?.wound_type || 'No description available',
        annotated_image_base64: mcpResult.segmentation?.mask,
        treatmentPlan: {
          medications: mcpResult.treatment_plan?.medications || ['Antibiotic ointment', 'Pain management'],
          procedures: mcpResult.treatment_plan?.steps || ['Daily dressing changes', 'Wound cleaning'],
          followUp: mcpResult.treatment_plan?.follow_up || 'Follow up in 1 week'
        },
        recommendations: mcpResult.description?.recommendations || [
          'Keep wound clean and dry',
          'Monitor for signs of infection',
          'Follow treatment plan consistently'
        ]
      };
      
      setAnalysisResults([result]);
      setShowResults(true);
      onAnalysisComplete?.(thread, [result]);
      
    } catch (err) {
      // console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [uploadedImage, patientName, userId, onAnalysisComplete, useDemoMode]);

  const handleRetry = useCallback(() => {
    if (uploadedImage && patientName.trim()) {
      startAnalysis();
    }
  }, [uploadedImage, patientName, startAnalysis]);

  const resetUpload = useCallback(() => {
    setUploadedImage(null);
    setPatientName('');
    setAnalysisThread(null);
    setAnalysisResults([]);
    setShowResults(false);
    setError(null);
    setCurrentStep('preparing');
    setProgress(0);
  }, []);


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Brain className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">AI Wound Analysis</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload a wound image for AI-powered analysis including segmentation, diagnosis, and treatment recommendations.
        </p>
      </div>

      {/* Upload Section */}
      {!showResults && (
        <div className="bg-white rounded-xl p-8 shadow-sm border">
          <div className="space-y-6">
            {/* Patient Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isAnalyzing}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wound Image
              </label>
              {!uploadedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Upload a clear image of the wound</p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isAnalyzing}
                    />
                    <div className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </div>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Wound"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="text-center text-white">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                          <p>Analyzing...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={startAnalysis}
                      disabled={isAnalyzing || !patientName.trim()}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Start Analysis
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetUpload}
                      disabled={isAnalyzing}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Component */}
      {(isAnalyzing || error) && (
        <AnalysisProgress
          currentStep={currentStep}
          progress={progress}
          isAnalyzing={isAnalyzing}
          error={error}
          onRetry={handleRetry}
        />
      )}

      {/* Results Section */}
      {showResults && analysisResults.length > 0 && (
        <div className="space-y-6">
          {/* Analysis Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Analysis Results</h2>
              <button
                onClick={resetUpload}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Analyze Another Image
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Original Image</h3>
                  <img
                    src={uploadedImage || ''}
                    alt="Original wound"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
              </div>

              {/* Segmented Image */}
              {analysisResults[0]?.annotated_image_base64 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">AI Segmentation</h3>
                  <img
                    src={analysisResults[0].annotated_image_base64}
                    alt="Segmented wound"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Diagnosis Results */}
          {analysisResults.map((result, index) => (
            <div key={index} className="space-y-4">
                <WoundDiagnosis
                  diagnosis={result.diagnosis || 'not_infected'}
                  severity={result.severity}
                  confidence={result.confidence}
                  areaCm2={result.area_cm2}
                  description={result.description || ''}
                />

              {/* Treatment Plan */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Plan</h3>
                
                <div className="space-y-6">
                  {result.treatmentPlan.medications.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <h4 className="font-medium text-gray-900">Medications</h4>
                      </div>
                      <ul className="space-y-2">
                        {result.treatmentPlan.medications.map((med, medIndex) => (
                          <li key={medIndex} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{med}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.treatmentPlan.procedures.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Activity className="w-5 h-5 text-green-500" />
                        <h4 className="font-medium text-gray-900">Procedures</h4>
                      </div>
                      <ul className="space-y-2">
                        {result.treatmentPlan.procedures.map((proc, procIndex) => (
                          <li key={procIndex} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{proc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.treatmentPlan.followUp && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-purple-500" />
                        <h4 className="font-medium text-gray-900">Follow-up</h4>
                      </div>
                      <p className="text-gray-700">{result.treatmentPlan.followUp}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, recIndex) => (
                      <div key={recIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WoundAnalysisUpload;
