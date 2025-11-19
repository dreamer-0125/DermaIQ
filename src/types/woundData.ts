/**
 * WoundData types for DermaIQ Frontend
 * Matches backend wound data structures
 */

export interface WoundData {
  id: string;
  patient_id: string;
  image_url: string;
  area_cm2: number;
  severity: 'low' | 'medium' | 'high';
  healing_stage: string;
  infection_risk: string;
  diagnosis: string;
  description: string;
  confidence: number;
  annotated_image_base64?: string | null;
  created_at: string;
  updated_at: string;
  analysis_metadata?: {
    processing_time: number;
    model_version: string;
    confidence_threshold: number;
  };
}

export interface CreateWoundDataRequest {
  patient_id: string;
  image_url: string;
  area_cm2: number;
  severity: 'low' | 'medium' | 'high';
  healing_stage: string;
  infection_risk: string;
  diagnosis: string;
  description: string;
  confidence: number;
  annotated_image_base64?: string | null;
  analysis_metadata?: {
    processing_time: number;
    model_version: string;
    confidence_threshold: number;
  };
}

export interface UpdateWoundDataRequest {
  area_cm2?: number;
  severity?: 'low' | 'medium' | 'high';
  healing_stage?: string;
  infection_risk?: string;
  diagnosis?: string;
  description?: string;
  confidence?: number;
  annotated_image_base64?: string | null;
  analysis_metadata?: {
    processing_time: number;
    model_version: string;
    confidence_threshold: number;
  };
}
