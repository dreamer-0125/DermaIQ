import React, { useState } from 'react';
import { API_CONFIG } from '../../../config/api';
import { 
  Brain, 
  Target, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Upload,
  FileText,
  BarChart3,
  Heart,
  DollarSign
} from 'lucide-react';

interface PersonalizeVBCProps {
  onBack: () => void;
}

interface VBCAnalysis {
  personalized_plan: {
    treatment_recommendations: string;
    risk_stratification: string;
    intervention_priority: string;
    cost_effectiveness: string;
    patient_engagement: string;
    outcome_prediction: string;
    care_coordination: string;
  };
  vbc_metrics: {
    quality_score: number;
    cost_savings_potential: number;
    intervention_effectiveness: number;
    patient_satisfaction_prediction: number;
  };
  recommendations: string[];
}

const PersonalizeVBC: React.FC<PersonalizeVBCProps> = ({ onBack }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [woundType, setWoundType] = useState('diabetic_ulcer');
  const [riskScore, setRiskScore] = useState(1.5);
  const [insuranceType, setInsuranceType] = useState('medicare');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [vbcAnalysis, setVbcAnalysis] = useState<VBCAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a wound image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('wound_type', woundType);
      formData.append('patient_risk_score', riskScore.toString());
      formData.append('insurance_type', insuranceType);

      const response = await fetch(`${API_CONFIG.BACKEND.getBaseUrl()}/api/treatment/vbc_completion`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze wound image');
      }

      const data = await response.json();
      setVbcAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Personalize VBC™</h1>
              <p className="text-gray-600">Personalized care interventions for wound care treatment goals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information & Wound Image</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wound Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="wound-image"
              />
              <label htmlFor="wound-image" className="cursor-pointer">
                <span className="text-indigo-600 hover:text-indigo-700 font-medium">
                  {selectedFile ? selectedFile.name : 'Click to upload wound image'}
                </span>
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Upload a clear image of the wound for analysis
              </p>
            </div>
          </div>

          {/* Patient Parameters */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wound Type
              </label>
              <select
                value={woundType}
                onChange={(e) => setWoundType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="diabetic_ulcer">Diabetic Ulcer</option>
                <option value="pressure_sore">Pressure Sore</option>
                <option value="surgical_wound">Surgical Wound</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Risk Score
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={riskScore}
                onChange={(e) => setRiskScore(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Low (0.0)</span>
                <span className="font-medium">{riskScore}</span>
                <span>High (5.0)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Type
              </label>
              <select
                value={insuranceType}
                onChange={(e) => setInsuranceType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="medicare">Medicare</option>
                <option value="medicaid">Medicaid</option>
                <option value="private">Private Insurance</option>
                <option value="self_pay">Self Pay</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || isAnalyzing}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                <span>Generate Personalized VBC Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {vbcAnalysis && (
        <div className="space-y-6">
          {/* VBC Metrics Dashboard */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
              VBC Performance Metrics
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between">
                  <Heart className="w-6 h-6 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-700">
                    {vbcAnalysis.vbc_metrics.quality_score}%
                  </span>
                </div>
                <p className="text-sm text-blue-700 font-medium mt-1">Quality Score</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center justify-between">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  <span className="text-2xl font-bold text-green-700">
                    ${vbcAnalysis.vbc_metrics.cost_savings_potential}
                  </span>
                </div>
                <p className="text-sm text-green-700 font-medium mt-1">Cost Savings</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center justify-between">
                  <Target className="w-6 h-6 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-700">
                    {vbcAnalysis.vbc_metrics.intervention_effectiveness}%
                  </span>
                </div>
                <p className="text-sm text-purple-700 font-medium mt-1">Effectiveness</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <div className="flex items-center justify-between">
                  <Users className="w-6 h-6 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-700">
                    {vbcAnalysis.vbc_metrics.patient_satisfaction_prediction}%
                  </span>
                </div>
                <p className="text-sm text-orange-700 font-medium mt-1">Patient Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Personalized Plan */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
              Personalized Care Plan
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Risk Stratification</h3>
                  <p className="text-gray-600">{vbcAnalysis.personalized_plan.risk_stratification}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Intervention Priority</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(vbcAnalysis.personalized_plan.intervention_priority)}`}>
                    {vbcAnalysis.personalized_plan.intervention_priority}
                  </span>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Cost Effectiveness</h3>
                  <p className="text-gray-600">{vbcAnalysis.personalized_plan.cost_effectiveness}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Patient Engagement</h3>
                  <p className="text-gray-600">{vbcAnalysis.personalized_plan.patient_engagement}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Outcome Prediction</h3>
                  <p className="text-gray-600">{vbcAnalysis.personalized_plan.outcome_prediction}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Care Coordination</h3>
                  <p className="text-gray-600">{vbcAnalysis.personalized_plan.care_coordination}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-indigo-600" />
              AI-Generated Treatment Recommendations
            </h2>
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {vbcAnalysis.personalized_plan.treatment_recommendations}
              </p>
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-indigo-600" />
              Actionable Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vbcAnalysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizeVBC;
