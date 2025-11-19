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
  diagnosis?: string;
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
