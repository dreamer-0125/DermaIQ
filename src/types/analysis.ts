export interface AnalysisThread {
  id: string;
  patientName: string;
  imageUrl: string;
  uploadedAt: Date;
  status: 'uploaded' | 'analyzing' | 'completed' | 'failed';
  analysisResult?: AnalysisResult;
  processingTime?: number;
  priority: 'low' | 'medium' | 'high';
}

export interface AnalysisResult {
  severity: 'low' | 'medium' | 'high';
  healingStage: string;
  infectionRisk: string;
  recommendations: string[];
  treatmentPlan: {
    medications: string[];
    procedures: string[];
    followUp: string;
  };
  confidence: number;
  processingTime: number;
  area_cm2?: number;
  annotated_image_base64?: string | null;
  diagnosis?: 'infected' | 'not_infected' | 'diabetic_ulcer' | 'pressure_ulcer' | 'venous_ulcer';
  description?: string;
}

export interface DoctorRecommendation {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  rating: number;
  availability: 'available' | 'busy' | 'offline';
  consultationTypes: ('video' | 'chat' | 'phone')[];
}

export interface TreatmentPlan {
  id: string;
  name: string;
  description: string;
  materials: string[];
  steps: Record<string, string>;
  precautions: string;
  when_to_seek_help: string;
  duration: string;
  is_self_treatable: boolean;
  severity: 'low' | 'medium' | 'high';
}

// Backend API response interfaces based on successful test results
export interface BackendHealthCheck {
  status: 'healthy';
  version: string;
  supabase_configured: boolean;
  gemini_configured: boolean;
  supabase_connected: boolean;
}

export interface BackendTreatmentPlanResponse {
  name: string;
  description: string;
  materials: string[];
  steps: Record<string, string>;
  precautions: string;
  when_to_seek_help: string;
  duration: string;
  is_self_treatable: boolean;
}

export interface BackendDoctorResponse {
  name: string;
  specialization: string;
  phone: string;
  email: string;
  address: string;
}

// Enhanced diagnosis types based on backend test success
export type WoundDiagnosis = 'infected' | 'not_infected' | 'diabetic_ulcer' | 'pressure_ulcer' | 'venous_ulcer';

// States that have been successfully tested in backend
export type TestedStates = 'California' | 'Texas' | 'New York' | 'Florida';
