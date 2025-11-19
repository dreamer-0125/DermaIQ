import React from 'react';
import { Card } from '../../design-system/components';
import { FileText, Activity, CheckCircle, Lightbulb } from 'lucide-react';

interface TreatmentPlanProps {
  medications: string[];
  procedures: string[];
  followUp?: string;
  recommendations: string[];
  className?: string;
}

const TreatmentPlan: React.FC<TreatmentPlanProps> = ({
  medications,
  procedures,
  followUp,
  recommendations,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Treatment Plan */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Treatment Plan</h3>
        
        <div className="space-y-6">
          {medications.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <h4 className="font-medium text-gray-900">Medications</h4>
              </div>
              <ul className="space-y-2">
                {medications.map((med, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{med}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {procedures.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Activity className="w-5 h-5 text-green-500" />
                <h4 className="font-medium text-gray-900">Procedures</h4>
              </div>
              <ul className="space-y-2">
                {procedures.map((proc, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{proc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {followUp && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                <h4 className="font-medium text-gray-900">Follow-up</h4>
              </div>
              <p className="text-gray-700">{followUp}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">AI Recommendations</h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{rec}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export { TreatmentPlan };
