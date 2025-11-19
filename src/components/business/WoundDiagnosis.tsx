import React from 'react';
import { WoundDiagnosis as WoundDiagnosisType } from '../../types/analysis';
import { getWoundTypeDisplayName, getSeverityColor, getConfidenceLevel } from '../../utils/woundUtils';
import { AlertTriangle, CheckCircle, Info, Activity } from 'lucide-react';

interface WoundDiagnosisProps {
  diagnosis: WoundDiagnosisType | string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  areaCm2?: number;
  description?: string;
  className?: string;
}

const WoundDiagnosis: React.FC<WoundDiagnosisProps> = ({
  diagnosis,
  severity,
  confidence,
  areaCm2,
  description,
  className = ''
}) => {
  const getDiagnosisIcon = (diagnosis: string) => {
    switch (diagnosis) {
      case 'infected':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'diabetic_ulcer':
      case 'pressure_ulcer':
      case 'venous_ulcer':
        return <Activity className="h-5 w-5 text-orange-500" />;
      case 'not_infected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const severityConfig = {
    low: { icon: '🟢', label: 'Low Risk' },
    medium: { icon: '🟡', label: 'Medium Risk' },
    high: { icon: '🔴', label: 'High Risk' }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getDiagnosisIcon(diagnosis)}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {getWoundTypeDisplayName(diagnosis)}
            </h3>
            <p className="text-sm text-gray-600">
              {description || 'Wound analysis complete'}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(severity)}`}>
          {severityConfig[severity].icon} {severityConfig[severity].label}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-600 mb-1">Confidence</div>
          <div className="text-2xl font-bold text-gray-900">
            {(confidence * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-500">
            {getConfidenceLevel(confidence)} confidence
          </div>
        </div>

        {areaCm2 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">Wound Area</div>
            <div className="text-2xl font-bold text-gray-900">
              {areaCm2.toFixed(2)} cm²
            </div>
            <div className="text-xs text-gray-500">
              Measured area
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-600 mb-1">Analysis Status</div>
          <div className="text-2xl font-bold text-green-600">
            Complete
          </div>
          <div className="text-xs text-gray-500">
            AI analysis finished
          </div>
        </div>
      </div>

      {diagnosis === 'infected' && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div className="text-sm font-medium text-red-800">
              Infection Detected
            </div>
          </div>
          <p className="text-sm text-red-700 mt-1">
            This wound shows signs of infection. Please consult a healthcare professional immediately.
          </p>
        </div>
      )}

      {(diagnosis === 'diabetic_ulcer' || diagnosis === 'pressure_ulcer' || diagnosis === 'venous_ulcer') && (
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-orange-500" />
            <div className="text-sm font-medium text-orange-800">
              Specialized Care Required
            </div>
          </div>
          <p className="text-sm text-orange-700 mt-1">
            This type of wound requires specialized care and monitoring. Follow the treatment plan carefully.
          </p>
        </div>
      )}
    </div>
  );
};

export default WoundDiagnosis;
