import React, { useState, useCallback } from 'react';
import { Button, Card, Progress } from '../../design-system/components';
import { LoadingState, ErrorState } from '../ui';
import { WoundImageUpload } from './WoundImageUpload';
import { WoundDiagnosis } from './WoundDiagnosis';
import { TreatmentPlan } from './TreatmentPlan';
import { Brain, Upload } from 'lucide-react';
import { enhancedMCPService } from '../../demo/services/mcpService';
import { AnalysisThread, AnalysisResult } from '../../types/analysis';

interface WoundAnalysisProps {
  userId: string;
  onAnalysisComplete?: (thread: AnalysisThread, results: AnalysisResult[]) => void;
  useDemoMode?: boolean;
  className?: string;
}

type AnalysisStep = 'upload' | 'analyzing' | 'results' | 'error';

const WoundAnalysis: React.FC<WoundAnalysisProps> = ({
  userId,
  onAnalysisComplete,
  useDemoMode = false,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('upload');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string>('');
  const [, setAnalysisThread] = useState<AnalysisThread | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentStepName, setCurrentStepName] = useState('preparing');
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    setError(null);
  }, []);

  const handleImageRemove = useCallback(() => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
  }, [previewUrl]);

  const startAnalysis = useCallback(async () => {
    if (!selectedImage || !patientName.trim()) {
      setError('Please provide both an image and patient name');
      return;
    }

    setCurrentStep('analyzing');
    setError(null);
    setCurrentProgress(0);
    setCurrentStepName('preparing');

    try {
      // Create analysis thread
      const thread: AnalysisThread = {
        id: `${useDemoMode ? 'demo' : 'prod'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        patientName: patientName.trim(),
        imageUrl: previewUrl || '',
        uploadedAt: new Date(),
        status: 'uploaded',
        priority: 'medium'
      };
      setAnalysisThread(thread);

      // Convert image to base64 for analysis
      const base64Data = previewUrl?.split(',')[1] || '';
      
      // Use enhanced MCP service for analysis with caching
      const mcpResult = await enhancedMCPService.analyzeWoundImage(base64Data, (step, progress) => {
        setCurrentStepName(step);
        setCurrentProgress(progress);
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
      setCurrentStep('results');
      onAnalysisComplete?.(thread, [result]);
      
    } catch (err) {
      // console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
      setCurrentStep('error');
    }
  }, [selectedImage, patientName, userId, onAnalysisComplete, useDemoMode, previewUrl]);

  const handleRetry = useCallback(() => {
    if (selectedImage && patientName.trim()) {
      startAnalysis();
    }
  }, [selectedImage, patientName, startAnalysis]);

  const resetAnalysis = useCallback(() => {
    setCurrentStep('upload');
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setPatientName('');
    setAnalysisThread(null);
    setAnalysisResults([]);
    setCurrentProgress(0);
    setCurrentStepName('preparing');
    setError(null);
  }, [previewUrl]);

  const renderContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">AI Wound Analysis</h1>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Upload a wound image for AI-powered analysis including segmentation, diagnosis, and treatment recommendations.
              </p>
            </div>

            <Card className="p-6">
              <div className="space-y-6">
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
                  />
                </div>

                <WoundImageUpload
                  onImageSelect={handleImageSelect}
                  onImageRemove={handleImageRemove}
                  selectedImage={selectedImage}
                  previewUrl={previewUrl}
                />

                <Button
                  onClick={startAnalysis}
                  disabled={!selectedImage || !patientName.trim()}
                  leftIcon={<Brain className="w-4 h-4" />}
                  fullWidth
                  size="lg"
                >
                  Start Analysis
                </Button>
              </div>
            </Card>
          </div>
        );

      case 'analyzing':
        return (
          <div className="text-center">
            <LoadingState
              message={`${currentStepName} ${currentProgress}%`}
              size="xl"
              fullScreen={false}
            />
            <div className="mt-6">
              <Progress
                value={currentProgress}
                max={100}
                size="lg"
                variant="primary"
                showLabel
                label="Analysis Progress"
              />
            </div>
          </div>
        );

      case 'results':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
              <Button
                onClick={resetAnalysis}
                variant="outline"
                leftIcon={<Upload className="w-4 h-4" />}
              >
                Analyze Another Image
              </Button>
            </div>

            {analysisResults.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Original Image</h3>
                  <img
                    src={previewUrl || ''}
                    alt="Original wound"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </Card>

                {analysisResults[0]?.annotated_image_base64 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Segmentation</h3>
                    <img
                      src={analysisResults[0].annotated_image_base64}
                      alt="Segmented wound"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </Card>
                )}
              </div>
            )}

            {analysisResults.map((result, index) => (
              <div key={index} className="space-y-6">
                <WoundDiagnosis
                  diagnosis={result.diagnosis || 'not_infected'}
                  severity={result.severity || 'medium'}
                  confidence={result.confidence || 0}
                  areaCm2={result.area_cm2 || 0}
                  description={result.description || ''}
                />

                <TreatmentPlan
                  medications={result.treatmentPlan.medications}
                  procedures={result.treatmentPlan.procedures}
                  followUp={result.treatmentPlan.followUp}
                  recommendations={result.recommendations}
                />
              </div>
            ))}
          </div>
        );

      case 'error':
        return (
          <ErrorState
            title="Analysis Failed"
            message={error || 'An unexpected error occurred during analysis'}
            onRetry={handleRetry}
            retryText="Try Again"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {renderContent()}
    </div>
  );
};

export { WoundAnalysis };
