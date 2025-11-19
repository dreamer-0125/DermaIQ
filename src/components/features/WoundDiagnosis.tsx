import React from 'react';
import { Card, Badge } from '../../design-system/components';
import { AlertCircle, CheckCircle, Info, TrendingUp } from 'lucide-react';
import { getWoundTypeDisplayName } from '../../utils/woundUtils';

interface WoundDiagnosisProps {
  diagnosis: 'infected' | 'not_infected' | 'diabetic_ulcer' | 'pressure_ulcer' | 'venous_ulcer';
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  areaCm2: number;
  description: string;
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
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getDiagnosisIcon = (diagnosis: string) => {
    switch (diagnosis) {
      case 'infected':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'not_infected':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'diabetic_ulcer':
      case 'pressure_ulcer':
      case 'venous_ulcer':
        return <Info className="w-5 h-5 text-orange-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getDiagnosisColor = (diagnosis: string) => {
    switch (diagnosis) {
      case 'infected':
        return 'error';
      case 'not_infected':
        return 'success';
      case 'diabetic_ulcer':
      case 'pressure_ulcer':
      case 'venous_ulcer':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Wound Diagnosis</h3>
        <div className="flex items-center space-x-2">
          {getDiagnosisIcon(diagnosis)}
          <Badge variant={getDiagnosisColor(diagnosis)}>
            {getWoundTypeDisplayName(diagnosis)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Severity */}
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-6 h-6 text-gray-600" />
          </div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Severity</h4>
          <Badge variant={getSeverityColor(severity)} size="lg">
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </Badge>
        </div>

        {/* Confidence */}
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Confidence</h4>
          <p className="text-lg font-semibold text-gray-900">
            {Math.round(confidence * 100)}%
          </p>
        </div>

        {/* Area */}
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Info className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Area</h4>
          <p className="text-lg font-semibold text-gray-900">
            {areaCm2.toFixed(2)} cm&#178;
          </p>
        </div>

        {/* Processing Time */}
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Analysis Time</h4>
          <p className="text-lg font-semibold text-gray-900">
            &lt; 30s
          </p>
        </div>
      </div>

      {description && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      )}
    </Card>
  );
};

export { WoundDiagnosis };
