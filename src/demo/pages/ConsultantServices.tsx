import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Video, 
  MessageCircle, 
  Search,
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { DoctorRecommendation, TestedStates } from '../../types/analysis';
import { enhancedMCPService } from '../services/mcpService';
import { cacheService, CacheKeys } from '../services/cacheService';
import { supabaseCRUDService } from '../../services/supabaseService';
import { useAuth } from '../../contexts/AuthContext';
import DemoLayout from '../components/layout/DemoLayout';

const ConsultantServices: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [doctors, setDoctors] = useState<DoctorRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<TestedStates>('California');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableThreads, setAvailableThreads] = useState<any[]>([]);
  const [showThreadList, setShowThreadList] = useState(false);

  useEffect(() => {
    if (threadId && currentUser?.id) {
      // Load specific thread's doctor recommendations
      loadDoctors();
      setShowThreadList(false);
    } else if (!threadId && currentUser?.id) {
      // Load available threads with doctor recommendations
      loadAvailableThreads();
      setShowThreadList(true);
    }
  }, [threadId, selectedState, currentUser?.id]);

  const loadAvailableThreads = async () => {
    if (!currentUser?.id) {
      // console.error('No current user found');
      setAvailableThreads([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch threads from Supabase
      const threadsResponse = await supabaseCRUDService.getAnalysisThreads(currentUser.id);
      
      // Filter for completed threads that have doctor recommendations
      const completedThreads = [];
      
      for (const thread of threadsResponse.threads) {
        if (thread.status === 'completed' && thread.id) {
          // Check if this thread has doctor recommendations
          try {
            const recommendations = await supabaseCRUDService.getDoctorRecommendationsByThread(thread.id, currentUser.id);
            if (recommendations.length > 0) {
              completedThreads.push({
                id: thread.id,
                patientName: thread.patient_name || 'Unknown Patient',
                uploadedAt: new Date(thread.created_at || new Date()),
                status: thread.status,
                priority: thread.priority,
                doctorCount: recommendations.length
              });
            }
          } catch (err) {
            // console.warn(`Failed to check recommendations for thread ${thread.id}:`, err);
          }
        }
      }

      setAvailableThreads(completedThreads);
      setShowThreadList(true);
    } catch (error) {
      // console.error('Failed to load available threads:', error);
      setAvailableThreads([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctors = async () => {
    setLoading(true);
    
    try {
      // Check cache first
      const cacheKey = threadId 
        ? CacheKeys.api.doctorRecommendations(`thread_${threadId}`)
        : CacheKeys.api.doctorRecommendations(selectedState);
      
      const cachedDoctors = cacheService.get<DoctorRecommendation[]>(cacheKey);
      if (cachedDoctors) {
        setDoctors(cachedDoctors);
        setLoading(false);
        return;
      }

      let doctorRecommendations: DoctorRecommendation[] = [];

      if (threadId && currentUser?.id) {
        // If we have a threadId, get doctor recommendations from database for this specific thread
        try {
          const dbRecommendations = await supabaseCRUDService.getDoctorRecommendationsByThread(threadId, currentUser.id);
          if (dbRecommendations.length > 0) {
            // Convert database format to frontend format
            doctorRecommendations = dbRecommendations.map(rec => ({
              id: rec.id || rec.doctor_name.replace(/\s+/g, '_').toLowerCase(),
              name: rec.doctor_name,
              specialization: rec.specialization,
              phone: rec.phone || '',
              email: rec.email || '',
              address: rec.address || '',
              state: rec.state,
              rating: rec.rating || 4.5,
              availability: rec.availability as 'available' | 'busy' | 'offline',
              consultationTypes: rec.consultation_types as ('video' | 'chat' | 'phone')[]
            }));
          }
        } catch (error) {
          // console.warn('Failed to load doctor recommendations from database:', error);
        }
      }

      // If no database recommendations found, try to get from API and save to database
      if (doctorRecommendations.length === 0) {
        try {
          const apiRecommendations = await enhancedMCPService.getDoctorRecommendations(selectedState);
          
          if (apiRecommendations && apiRecommendations.length > 0) {
            // Convert API response to frontend format
            const formattedDoctors: DoctorRecommendation[] = apiRecommendations.map(doctor => ({
              id: doctor.name.replace(/\s+/g, '_').toLowerCase(), // Generate ID from name
              name: doctor.name,
              specialization: doctor.specialization,
              phone: doctor.phone,
              email: doctor.email,
              address: doctor.address,
              state: selectedState,
              rating: doctor.rating,
              availability: doctor.availability as 'available' | 'busy' | 'offline',
              consultationTypes: doctor.consultation_types as ('video' | 'chat' | 'phone')[]
            }));

            // Save to database if we have a threadId and user
            if (threadId && currentUser?.id) {
              try {
                // Get the result ID for this thread
                const results = await supabaseCRUDService.getAnalysisResults(threadId, currentUser.id);
                const resultId = results.length > 0 ? results[0].id : null;
                
                if (resultId) {
                  for (const doctor of formattedDoctors) {
                    await supabaseCRUDService.createDoctorRecommendation({
                      result_id: resultId,
                      thread_id: threadId,
                      requested_by: currentUser.id,
                      doctor_name: doctor.name,
                      specialization: doctor.specialization,
                      phone: doctor.phone,
                      email: doctor.email,
                      address: doctor.address,
                      state: doctor.state,
                      rating: doctor.rating,
                      availability: doctor.availability,
                      consultation_types: doctor.consultationTypes,
                      status: 'pending',
                      execution_id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                    });
                  }
                }
              } catch (error) {
                // console.warn('Failed to save doctor recommendations to database:', error);
              }
            }

            doctorRecommendations = formattedDoctors;
          }
        } catch (error) {
          // console.warn('Failed to load doctor recommendations from API:', error);
        }
      }
      
      setDoctors(doctorRecommendations);
      
      // Cache the results
      if (doctorRecommendations.length > 0) {
        cacheService.set(cacheKey, doctorRecommendations, 600000); // Cache for 10 minutes
      }
    } catch (error) {
      // console.error('Failed to load doctors via API:', error);
      // Show no doctors when API fails
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available Now';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const doctorName = doctor.name || '';
    const doctorSpecialization = doctor.specialization || '';
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = doctorName.toLowerCase().includes(searchTermLower) ||
                         doctorSpecialization.toLowerCase().includes(searchTermLower);
    const matchesAvailability = filterAvailability === 'all' || doctor.availability === filterAvailability;
    return matchesSearch && matchesAvailability;
  });

  const handleScheduleConsultation = (doctor: DoctorRecommendation) => {
    // In a real app, this would open a scheduling modal or redirect to scheduling page
    const doctorName = doctor.name || 'Doctor';
    alert(`Scheduling consultation with ${doctorName}...`);
  };

  const handleContactDoctor = (doctor: DoctorRecommendation, method: 'phone' | 'email') => {
    if (method === 'phone') {
      window.open(`tel:${doctor.phone}`);
    } else {
      window.open(`mailto:${doctor.email}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <DemoLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading consultant services...</p>
          </div>
        </div>
      </DemoLayout>
    );
  }

  // Show list of available threads when no specific threadId is provided
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
                  <User className="w-6 h-6 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">Consultant Services</h1>
                </div>
                <p className="text-gray-600 mt-1">Select an analysis to view recommended consultants</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {availableThreads.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Consultant Recommendations</h2>
              {availableThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/demo/consultant/${thread.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{thread.patientName}</h3>
                        <p className="text-sm text-gray-500">
                          Analysis completed on {thread.uploadedAt.toLocaleDateString()}
                        </p>
                        <p className="text-sm text-purple-600">
                          {thread.doctorCount} recommended {thread.doctorCount === 1 ? 'specialist' : 'specialists'}
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
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Consultant Recommendations Available</h3>
              <p className="text-gray-500 mb-6">
                You need to complete a wound analysis first to get consultant recommendations.
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

  // Show specific thread's doctor recommendations
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
                <User className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Consultant Services</h1>
              </div>
              <p className="text-gray-600 mt-1">Find specialists for your wound care needs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value as TestedStates)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="California">California ✓</option>
                <option value="Texas">Texas ✓</option>
                <option value="New York">New York ✓</option>
                <option value="Florida">Florida ✓</option>
                <option value="Illinois">Illinois</option>
                <option value="Washington">Washington</option>
                <option value="Oregon">Oregon</option>
              </select>
              
              <select
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Availability</option>
                <option value="available">Available Now</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading consultant services...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredDoctors.length} Doctors Found
              </h2>
              <p className="text-sm text-gray-500">
                Showing results for {selectedState}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{doctor.name || 'Unknown Doctor'}</h3>
                        <p className="text-sm text-gray-500">{doctor.specialization || 'General Practice'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{doctor.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{doctor.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{doctor.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{doctor.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(doctor.availability)}`}>
                      {getAvailabilityText(doctor.availability)}
                    </span>
                    <span className="text-xs text-gray-500">{doctor.state}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>Consultation Types:</span>
                      <div className="flex space-x-1">
                        {doctor.consultationTypes.includes('video') && <Video className="w-3 h-3" />}
                        {doctor.consultationTypes.includes('chat') && <MessageCircle className="w-3 h-3" />}
                        {doctor.consultationTypes.includes('phone') && <Phone className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleScheduleConsultation(doctor)}
                      disabled={doctor.availability === 'offline'}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Schedule</span>
                    </button>
                    
                    <button
                      onClick={() => handleContactDoctor(doctor, 'phone')}
                      className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleContactDoctor(doctor, 'email')}
                      className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No consultant services available</h3>
                <p className="text-gray-500">No consultant services are currently available in the database for {selectedState}.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DemoLayout>
  );
};

export default ConsultantServices;
