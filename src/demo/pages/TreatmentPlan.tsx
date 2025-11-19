import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Pill, 
  Activity, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight,
  Download,
  Share2,
  User
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { TreatmentPlan as TreatmentPlanType } from '../../types/analysis';
import { cacheService, CacheKeys, CacheTags } from '../services/cacheService';
import { supabaseCRUDService } from '../../services/supabaseService';
import { useAuth } from '../../contexts/AuthContext';
import DemoLayout from '../components/layout/DemoLayout';

const TreatmentPlan: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlanType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [availableThreads, setAvailableThreads] = useState<any[]>([]);
  const [showThreadList, setShowThreadList] = useState(false);

  // Helper function to get user-friendly wound type names
  // const getWoundTypeDisplayName = (diagnosis: string): string => {
  //   const woundTypeNames: Record<string, string> = {
  //     'infected': 'Infected Wound',
  //     'not_infected': 'Non-Infected Wound',
  //     'diabetic_ulcer': 'Diabetic Ulcer',
  //     'pressure_ulcer': 'Pressure Ulcer (Bed Sore)',
  //     'venous_ulcer': 'Venous Ulcer'
  //   };
  //   return woundTypeNames[diagnosis] || diagnosis;
  // };

  useEffect(() => {
    // console.log('TreatmentPlan useEffect triggered:', { threadId, userId: currentUser?.id });
    
    if (threadId && currentUser?.id) {
      // console.log('Loading treatment plan for thread:', threadId);
      loadTreatmentPlan();
      setShowThreadList(false);
    } else if (!threadId && currentUser?.id) {
      // console.log('Loading available threads for user:', currentUser.id);
      loadAvailableThreads();
      setShowThreadList(true);
    } else if (!currentUser?.id) {
      // console.log('Waiting for user authentication...');
    }
  }, [threadId, currentUser?.id]);

  const loadTreatmentPlan = async () => {
    if (!threadId || !currentUser?.id) {
      // console.log('Cannot load treatment plan - missing data:', { 
      //   threadId, 
      //   userId: currentUser?.id 
      // });
      return;
    }
    
    // console.log('Starting to load treatment plan:', { threadId, userId: currentUser.id });
    setLoading(true);
    setShowThreadList(false);
    
    try {
      // Check cache first for treatment plan data
      const cacheKey = CacheKeys.api.treatmentPlan(threadId);
      const cachedPlan = cacheService.get(cacheKey) as TreatmentPlanType;
      
      if (cachedPlan) {
        // console.log('Using cached treatment plan:', cachedPlan);
        setTreatmentPlan(cachedPlan);
        setLoading(false);
        return;
      }

      // console.log('Fetching treatment plan from Supabase...');
      
      // Fetch real data from Supabase - get treatment plans from the database
      const [thread, results] = await Promise.all([
        supabaseCRUDService.getAnalysisThread(threadId, currentUser.id),
        supabaseCRUDService.getAnalysisResults(threadId, currentUser.id)
      ]);

      // console.log('Fetched data:', { thread, resultsCount: results?.length });

      // Get treatment plans from the database if we have results
      const treatmentPlans = results.length > 0 && results[0].id
        ? await supabaseCRUDService.getTreatmentPlansByResult(results[0].id, currentUser.id)
        : [];

      // console.log('Treatment plans from database:', treatmentPlans.length);

      if (!thread) {
        // console.error('Thread not found:', threadId);
        setTreatmentPlan(null);
        setLoading(false);
        return;
      }
      
      if (results.length === 0) {
        // console.error('No results found for thread:', threadId);
        setTreatmentPlan(null);
        setLoading(false);
        return;
      }

      const result = results[0]; // Get the first (most recent) result
      
      // Use database treatment plan if available, otherwise create from analysis result
      let treatmentPlan: TreatmentPlanType;
      
      if (treatmentPlans.length > 0) {
        // Use existing treatment plan from database
        const dbPlan = treatmentPlans[0];
        treatmentPlan = {
          id: dbPlan.id || threadId,
          name: dbPlan.plan_name || `Treatment Plan for ${thread.patient_name || 'Patient'}`,
          description: dbPlan.description || `Comprehensive wound care treatment plan based on AI analysis`,
          materials: dbPlan.medications || [
            'Antibiotic ointment',
            'Sterile gauze pads',
            'Medical tape',
            'Saline solution',
            'Pain management medication'
          ],
          steps: {
            '1': 'Clean the wound area with saline solution',
            '2': 'Apply appropriate dressing based on wound type',
            '3': 'Monitor for signs of infection',
            '4': 'Change dressing as recommended',
            '5': 'Follow up with healthcare provider',
            '6': 'Maintain proper wound care hygiene'
          },
          precautions: 'Keep the wound clean and dry. Avoid activities that may cause trauma to the area.',
          when_to_seek_help: 'Seek immediate medical attention if you notice increased redness, swelling, pus, or fever.',
          duration: `${dbPlan.duration_days || result.follow_up_days || 7}-${(dbPlan.duration_days || result.follow_up_days || 7) + 7} days`,
          is_self_treatable: result.severity === 'low' || result.severity === 'medium',
          severity: (result.severity === 'low' || result.severity === 'medium' || result.severity === 'high') 
            ? result.severity 
            : 'medium'
        };
      } else {
        // Create treatment plan from analysis result
        treatmentPlan = {
          id: threadId,
          name: `Treatment Plan for ${thread.patient_name || 'Patient'}`,
          description: `Comprehensive wound care treatment plan based on AI analysis of ${result.diagnosis || 'wound assessment'}`,
          materials: [
            'Antibiotic ointment',
            'Sterile gauze pads',
            'Medical tape',
            'Saline solution',
            'Pain management medication'
          ],
          steps: {
            '1': 'Clean the wound area with saline solution',
            '2': 'Apply appropriate dressing based on wound type',
            '3': 'Monitor for signs of infection',
            '4': 'Change dressing as recommended',
            '5': 'Follow up with healthcare provider',
            '6': 'Maintain proper wound care hygiene'
          },
          precautions: 'Keep the wound clean and dry. Avoid activities that may cause trauma to the area.',
          when_to_seek_help: 'Seek immediate medical attention if you notice increased redness, swelling, pus, or fever.',
          duration: `${result.follow_up_days || 7}-${(result.follow_up_days || 7) + 7} days`,
          is_self_treatable: result.severity === 'low' || result.severity === 'medium',
          severity: (result.severity === 'low' || result.severity === 'medium' || result.severity === 'high') 
            ? result.severity 
            : 'medium'
        };

        // If no treatment plan exists in database, create one
        if (treatmentPlans.length === 0 && currentUser?.id && result.id && threadId) {
          try {
            await supabaseCRUDService.createTreatmentPlan({
              result_id: result.id,
              thread_id: threadId,
              user_id: currentUser.id,
              plan_name: treatmentPlan.name,
              description: treatmentPlan.description,
              medications: treatmentPlan.materials,
              procedures: Object.values(treatmentPlan.steps),
              frequency: 'Daily',
              status: 'active'
            });
            // console.log('✅ Treatment plan saved to database');
          } catch (error) {
            // console.warn('Failed to save treatment plan to database:', error);
          }
        }
      }
      
      // console.log('Treatment plan formatted:', treatmentPlan);
      
      // Cache the treatment plan
      cacheService.set(cacheKey, treatmentPlan, 300000, [CacheTags.TREATMENT]);
      setTreatmentPlan(treatmentPlan);
      // console.log('✅ Treatment plan loaded successfully');
    } catch (error) {
      // console.error('Failed to load treatment plan:', error);
      setTreatmentPlan(null);
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
      const cachedData = cacheService.get(cacheKey) as any;
      
      if (cachedData && cachedData.threads) {
        const completedThreads = cachedData.threads
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleDownload = () => {
    if (!treatmentPlan) return;
    
    const content = `
Treatment Plan: ${treatmentPlan.name}

Description: ${treatmentPlan.description}

Materials Needed:
${treatmentPlan.materials.map(material => `- ${material}`).join('\n')}

Steps:
${Object.entries(treatmentPlan.steps).map(([step, description]) => `${step}. ${description}`).join('\n')}

Precautions: ${treatmentPlan.precautions}
When to Seek Help: ${treatmentPlan.when_to_seek_help}
Duration: ${treatmentPlan.duration}
Self-Treatable: ${treatmentPlan.is_self_treatable ? 'Yes' : 'No'}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `treatment-plan-${threadId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: treatmentPlan?.name || 'Treatment Plan',
        text: treatmentPlan?.description || '',
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading treatment plans...</p>
        </div>
      </div>
    );
  }

  // Show list of available treatment plans when no specific threadId is provided
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
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">Treatment Plans</h1>
                </div>
                <p className="text-gray-600 mt-1">Select an analysis to view its treatment plan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {availableThreads.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Treatment Plans</h2>
              {availableThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/demo/treatment/${thread.id}`)}
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
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Treatment Plans Available</h3>
              <p className="text-gray-500 mb-6">
                You need to complete a wound analysis first to generate treatment plans.
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

  if (!treatmentPlan) {
    return (
      <DemoLayout>
        <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Treatment Plan Not Found</h3>
            <p className="text-gray-500 mb-6">The treatment plan for this analysis is not available.</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => navigate('/demo/treatment')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                View All Treatment Plans
              </button>
              <button
                onClick={() => navigate('/demo/upload')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Start New Analysis
              </button>
            </div>
          </div>
        </div>
      </DemoLayout>
    );
  }

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
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Treatment Plan</h1>
              </div>
              <p className="text-gray-600 mt-1">AI-generated treatment recommendations</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Plan Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{treatmentPlan.name}</h2>
                <p className="text-gray-600">{treatmentPlan.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(treatmentPlan.severity)}`}>
                {treatmentPlan.severity.toUpperCase()} SEVERITY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Duration: {treatmentPlan.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Self-Treatable: {treatmentPlan.is_self_treatable ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Status: Active</span>
              </div>
            </div>
          </div>

          {/* Materials Needed */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-2 mb-4">
              <Pill className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Materials Needed</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {treatmentPlan.materials.map((material, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">{material}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Treatment Steps */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Treatment Steps</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(treatmentPlan.steps).map(([stepNumber, description]) => (
                <div
                  key={stepNumber}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedStep === parseInt(stepNumber)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedStep(selectedStep === parseInt(stepNumber) ? null : parseInt(stepNumber))}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {stepNumber}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Precautions and Warnings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">Precautions & Warnings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Precautions</h4>
                <p className="text-gray-700">{treatmentPlan.precautions}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">When to Seek Medical Help</h4>
                <p className="text-gray-700">{treatmentPlan.when_to_seek_help}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate(`/demo/consultant/${threadId}`)}
                className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Find Doctors</span>
              </button>
              
              <button
                onClick={() => navigate(`/demo/result/${threadId}`)}
                className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span>View Analysis Results</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
};

export default TreatmentPlan;
