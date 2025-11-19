import React from 'react';
import { 
  Upload, 
  Brain, 
  Eye, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Zap
} from 'lucide-react';

interface AnalysisProgressProps {
  currentStep: string;
  progress: number;
  isAnalyzing: boolean;
  error?: string | null;
  onRetry?: () => void;
}

interface Step {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  currentStep,
  progress,
  isAnalyzing,
  error,
  onRetry
}) => {
  const steps: Step[] = [
    {
      id: 'preparing',
      name: 'Preparing',
      description: 'Validating image and preparing for analysis',
      icon: <Upload className="w-5 h-5" />,
      color: 'text-blue-500'
    },
    {
      id: 'uploading',
      name: 'Uploading',
      description: 'Sending image to AI analysis server',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-purple-500'
    },
    {
      id: 'segmenting',
      name: 'Segmenting',
      description: 'AI is identifying wound boundaries',
      icon: <Eye className="w-5 h-5" />,
      color: 'text-green-500'
    },
    {
      id: 'diagnosing',
      name: 'Diagnosing',
      description: 'Analyzing infection status',
      icon: <Brain className="w-5 h-5" />,
      color: 'text-orange-500'
    },
    {
      id: 'describing',
      name: 'Describing',
      description: 'Generating detailed wound description',
      icon: <FileText className="w-5 h-5" />,
      color: 'text-indigo-500'
    },
    {
      id: 'finalizing',
      name: 'Finalizing',
      description: 'Compiling analysis results',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-emerald-500'
    },
    {
      id: 'completed',
      name: 'Completed',
      description: 'Analysis complete',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-green-600'
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const currentStepData = steps[currentStepIndex] || steps[0];

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  const getStepColor = (status: string, stepColor: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-300';
      case 'current':
        return `${stepColor} bg-blue-50 border-blue-300`;
      default:
        return 'text-gray-400 bg-gray-50 border-gray-200';
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Analysis Failed</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Retry Analysis</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          {isAnalyzing ? (
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          ) : (
            <Brain className="w-6 h-6 text-blue-600" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isAnalyzing ? 'Analyzing Wound' : 'Analysis Complete'}
          </h3>
          <p className="text-gray-600">
            {isAnalyzing ? currentStepData.description : 'Your wound analysis is ready'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isCurrent = status === 'current';
          
          return (
            <div
              key={step.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                getStepColor(status, step.color)
              } ${isCurrent ? 'animate-pulse' : ''}`}
            >
              <div className={`flex-shrink-0 ${isCurrent ? 'animate-spin' : ''}`}>
                {status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  step.icon
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{step.name}</span>
                  {isCurrent && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-sm opacity-75">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Step Highlight */}
      {isAnalyzing && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-800">
              Currently: {currentStepData.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisProgress;

