/**
 * Supabase CRUD Service
 * 
 * This service handles all database operations that were previously
 * handled by the backend. All CRUD operations are now performed
 * directly from the frontend using Supabase client.
 */

import { supabase } from '../config/supabase';

// Types for database operations
export interface AnalysisThread {
  id?: string;
  user_id: string;
  patient_name: string;
  patient_id?: string;
  thread_title?: string;
  description?: string;
  status: 'uploaded' | 'analyzing' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
  analysis_completed_at?: string;
}

export interface AnalysisResult {
  id?: string;
  thread_id: string;
  user_id: string;
  severity: string;
  diagnosis: string;
  area_cm2: number;
  confidence_score?: number;
  wound_description?: string;
  infection_probability?: number;
  healing_stage?: string;
  tissue_types?: string[];
  recommendations: string[];
  follow_up_required: boolean;
  follow_up_days?: number;
  model_version?: string;
  processing_metadata?: any;
  original_image_url?: string;
  segmented_image_url?: string;
  analyzed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TreatmentPlan {
  id?: string;
  result_id: string;
  thread_id: string;
  user_id: string;
  plan_name: string;
  description?: string;
  immediate_actions?: string[];
  ongoing_care?: string[];
  medications?: string[];
  materials?: string[];
  procedures?: string[];
  steps?: Record<string, string>;
  frequency?: string;
  duration_days?: number;
  precautions?: string;
  when_to_seek_help?: string;
  is_self_treatable?: boolean;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  start_date?: string;
  end_date?: string;
  progress_notes?: string[];
  adherence_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DoctorRecommendation {
  id?: string;
  result_id: string;
  thread_id: string;
  requested_by: string; // Database column name (user_id)
  state: string;
  doctor_name: string;
  name?: string; // Alias for doctor_name for compatibility
  specialization: string;
  credentials?: string[];
  phone?: string;
  email?: string;
  address?: string;
  rating?: number;
  years_of_experience?: number;
  hospital_affiliation?: string;
  availability: string;
  consultation_types?: string[];
  consultationTypes?: string[]; // Alias for consultation_types for compatibility
  accepts_insurance?: boolean;
  accepts_medicare?: boolean;
  telehealth_available?: boolean;
  next_available_appointment?: string;
  match_score?: number;
  recommendation_reason?: string;
  execution_id?: string; // Made optional but will be auto-generated if not provided
  wound_type?: string;
  severity?: string;
  patient_conditions?: string;
  cache_key?: string;
  expires_at?: string;
  response_time_ms?: number;
  api_endpoint?: string;
  request_metadata?: any;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

class SupabaseCRUDService {
  /**
   * Create a new analysis thread
   */
  async createAnalysisThread(threadData: Omit<AnalysisThread, 'id' | 'created_at' | 'updated_at'>): Promise<AnalysisThread> {
    try {
      // console.log('Creating analysis thread:', threadData);
      
      const { data, error } = await supabase
        .from('wound_analysis_threads')
        .insert({
          ...threadData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        // console.error('Error creating analysis thread:', {
        //   message: error.message,
        //   details: error.details,
        //   hint: error.hint,
        //   code: error.code
        // });
        throw error;
      }
      
      // console.log('Analysis thread created successfully:', data);
      return data;
    } catch (error: any) {
      // console.error('Failed to create analysis thread:', error);
      throw new Error(`Failed to create analysis thread: ${error.message}`);
    }
  }

  /**
   * Get analysis threads for a user
   */
  async getAnalysisThreads(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      status?: string;
      priority?: string;
    } = {}
  ): Promise<{ threads: AnalysisThread[]; total_count: number }> {
    try {
      const { limit = 10, offset = 0, status, priority } = options;
      
      let query = supabase
        .from('wound_analysis_threads')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      if (status) query = query.eq('status', status);
      if (priority) query = query.eq('priority', priority);

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        // console.error('Error getting analysis threads:', error);
        throw error;
      }
      return { threads: data || [], total_count: count || 0 };
    } catch (error: any) {
      // console.error('Failed to get analysis threads:', error);
      throw new Error(`Failed to get analysis threads: ${error.message}`);
    }
  }

  /**
   * Get a specific analysis thread
   */
  async getAnalysisThread(threadId: string, userId: string): Promise<AnalysisThread> {
    try {
      const { data, error } = await supabase
        .from('wound_analysis_threads')
        .select('*')
        .eq('id', threadId)
        .eq('user_id', userId)
        .single();

      if (error) {
        // console.error('Error getting analysis thread:', error);
        throw error;
      }
      return data;
    } catch (error: any) {
      // console.error('Error getting analysis thread:', error);
      throw new Error(`Failed to get analysis thread: ${error.message}`);
    }
  }

  /**
   * Update an analysis thread
   */
  async updateAnalysisThread(
    threadId: string,
    userId: string,
    updates: Partial<AnalysisThread>
  ): Promise<AnalysisThread> {
    try {
      const { data, error } = await supabase
        .from('wound_analysis_threads')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', threadId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        // console.error('Error updating analysis thread:', error);
        throw error;
      }
      return data;
    } catch (error: any) {
      // console.error('Failed to update analysis thread:', error);
      throw new Error(`Failed to update analysis thread: ${error.message}`);
    }
  }

  /**
   * Delete an analysis thread
   */
  async deleteAnalysisThread(threadId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('wound_analysis_threads')
        .delete()
        .eq('id', threadId)
        .eq('user_id', userId);

      if (error) {
        // console.error('Error deleting analysis thread:', error);
        throw error;
      }
    } catch (error: any) {
      // console.error('Failed to delete analysis thread:', error);
      throw new Error(`Failed to delete analysis thread: ${error.message}`);
    }
  }

  /**
   * Create an analysis result
   */
  async createAnalysisResult(resultData: Omit<AnalysisResult, 'id' | 'created_at' | 'updated_at'>): Promise<AnalysisResult> {
    try {
      // console.log('Creating analysis result:', resultData);
      
      const { data, error } = await supabase
        .from('wound_analysis_results')
        .insert({
          ...resultData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        // console.error('Error creating analysis result:', {
        //   message: error.message,
        //   details: error.details,
        //   hint: error.hint,
        //   code: error.code
        // });
        throw error;
      }

      // console.log('Analysis result created successfully:', data);

      // Update thread status to completed (don't fail if this fails)
      try {
        await this.updateAnalysisThread(resultData.thread_id, resultData.user_id, {
          status: 'completed',
          analysis_completed_at: new Date().toISOString()
        });
      } catch (updateError) {
        // console.warn('Failed to update thread status, but result was created:', updateError);
      }

      return data;
    } catch (error: any) {
      // console.error('Failed to create analysis result:', error);
      throw new Error(`Failed to create analysis result: ${error.message}`);
    }
  }

  /**
   * Update an existing analysis result
   */
  async updateAnalysisResult(
    resultId: string, 
    userId: string, 
    updateData: Partial<Omit<AnalysisResult, 'id' | 'thread_id' | 'user_id' | 'created_at'>>
  ): Promise<AnalysisResult> {
    try {
      const { data, error } = await supabase
        .from('wound_analysis_results')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', resultId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        // console.error('Error updating analysis result:', error);
        throw error;
      }
      return data;
    } catch (error: any) {
      // console.error('Failed to update analysis result:', error);
      throw new Error(`Failed to update analysis result: ${error.message}`);
    }
  }

  /**
   * Get analysis results for a thread
   */
  async getAnalysisResults(threadId: string, userId: string): Promise<AnalysisResult[]> {
    try {
      const { data, error } = await supabase
        .from('wound_analysis_results')
        .select('*')
        .eq('thread_id', threadId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        // console.error('Error getting analysis results:', error);
        throw error;
      }
      return data || [];
    } catch (error: any) {
      // console.error('Failed to get analysis results:', error);
      throw new Error(`Failed to get analysis results: ${error.message}`);
    }
  }

  /**
   * Get a single analysis result
   */
  async getAnalysisResult(resultId: string, userId: string): Promise<AnalysisResult> {
    try {
      const { data, error } = await supabase
        .from('wound_analysis_results')
        .select('*')
        .eq('id', resultId)
        .eq('user_id', userId)
        .single();

      if (error) {
        // console.error('Error getting analysis result:', error);
        throw error;
      }
      return data;
    } catch (error: any) {
      // console.error('Failed to get analysis result:', error);
      throw new Error(`Failed to get analysis result: ${error.message}`);
    }
  }

  /**
   * Create a treatment plan
   */
  async createTreatmentPlan(planData: Omit<TreatmentPlan, 'id' | 'created_at' | 'updated_at'>): Promise<TreatmentPlan> {
    try {
      const { data, error } = await supabase
        .from('treatment_plans')
        .insert({
          ...planData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        // console.error('Supabase error creating treatment plan:', error);
        throw error;
      }
      return data;
    } catch (error: any) {
      // console.error('Error creating treatment plan:', error);
      throw new Error(`Failed to create treatment plan: ${error.message}`);
    }
  }

  /**
   * Get treatment plans for a user
   */
  async getTreatmentPlans(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      status?: string;
    } = {}
  ): Promise<{ treatment_plans: TreatmentPlan[]; total_count: number }> {
    try {
      const { limit = 10, offset = 0, status } = options;
      
      let query = supabase
        .from('treatment_plans')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      if (status) query = query.eq('status', status);

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        // console.error('Supabase error getting treatment plans:', error);
        throw error;
      }
      return { treatment_plans: data || [], total_count: count || 0 };
    } catch (error: any) {
      // console.error('Error getting treatment plans:', error);
      throw new Error(`Failed to get treatment plans: ${error.message}`);
    }
  }

  /**
   * Get treatment plans for a specific result
   */
  async getTreatmentPlansByResult(resultId: string, userId: string): Promise<TreatmentPlan[]> {
    try {
      const { data, error } = await supabase
        .from('treatment_plans')
        .select('*')
        .eq('result_id', resultId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        // console.error('Supabase error getting treatment plans by result:', error);
        throw error;
      }
      return data || [];
    } catch (error: any) {
      // console.error('Error getting treatment plans by result:', error);
      throw new Error(`Failed to get treatment plans: ${error.message}`);
    }
  }

  /**
   * Update a treatment plan
   */
  async updateTreatmentPlan(
    planId: string,
    userId: string,
    updates: Partial<TreatmentPlan>
  ): Promise<TreatmentPlan> {
    try {
      const { data, error } = await supabase
        .from('treatment_plans')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', planId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        // console.error('Supabase error updating treatment plan:', error);
        throw error;
      }
      return data;
    } catch (error: any) {
      // console.error('Error updating treatment plan:', error);
      throw new Error(`Failed to update treatment plan: ${error.message}`);
    }
  }

  /**
   * Create a doctor recommendation
   */
  async createDoctorRecommendation(
    recommendationData: Omit<DoctorRecommendation, 'id' | 'created_at' | 'updated_at'>
  ): Promise<DoctorRecommendation> {
    try {
      const { data, error } = await supabase
        .from('doctor_recommendations')
        .insert({
          ...recommendationData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        // console.error('Supabase error creating doctor recommendation:', error);
        throw error;
      }
      return data;
    } catch (error: any) {
      // console.error('Error creating doctor recommendation:', error);
      throw new Error(`Failed to create doctor recommendation: ${error.message}`);
    }
  }

  /**
   * Get doctor recommendations by state
   */
  async getDoctorRecommendationsByState(
    state: string,
    userId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<{ doctor_recommendations: DoctorRecommendation[]; total_count: number }> {
    try {
      const { limit = 10, offset = 0 } = options;
      
      const { data, error, count } = await supabase
        .from('doctor_recommendations')
        .select('*', { count: 'exact' })
        .eq('state', state)
        .eq('requested_by', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        // console.error('Supabase error getting doctor recommendations by state:', error);
        throw error;
      }
      return { doctor_recommendations: data || [], total_count: count || 0 };
    } catch (error: any) {
      // console.error('Error getting doctor recommendations by state:', error);
      throw new Error(`Failed to get doctor recommendations: ${error.message}`);
    }
  }

  /**
   * Get doctor recommendations by thread
   */
  async getDoctorRecommendationsByThread(threadId: string, userId: string): Promise<DoctorRecommendation[]> {
    try {
      const { data, error } = await supabase
        .from('doctor_recommendations')
        .select('*')
        .eq('thread_id', threadId)
        .eq('requested_by', userId)
        .order('created_at', { ascending: false });

      if (error) {
        // console.error('Supabase error getting doctor recommendations by thread:', error);
        throw error;
      }
      return data || [];
    } catch (error: any) {
      // console.error('Error getting doctor recommendations by thread:', error);
      throw new Error(`Failed to get doctor recommendations: ${error.message}`);
    }
  }

  /**
   * Update a doctor recommendation
   */
  async updateDoctorRecommendation(
    recommendationId: string,
    userId: string,
    updates: Partial<DoctorRecommendation>
  ): Promise<DoctorRecommendation> {
    try {
      const { data, error } = await supabase
        .from('doctor_recommendations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', recommendationId)
        .eq('requested_by', userId)
        .select()
        .single();

      if (error) {
        // console.error('Supabase error updating doctor recommendation:', error);
        throw error;
      }
      return data;
    } catch (error: any) {
      // console.error('Error updating doctor recommendation:', error);
      throw new Error(`Failed to update doctor recommendation: ${error.message}`);
    }
  }

  /**
   * Delete a doctor recommendation
   */
  async deleteDoctorRecommendation(recommendationId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('doctor_recommendations')
        .delete()
        .eq('id', recommendationId)
        .eq('requested_by', userId);

      if (error) {
        // console.error('Supabase error deleting doctor recommendation:', error);
        throw error;
      }
    } catch (error: any) {
      // console.error('Error deleting doctor recommendation:', error);
      throw new Error(`Failed to delete doctor recommendation: ${error.message}`);
    }
  }

  /**
   * Get a single doctor recommendation by ID
   */
  async getDoctorRecommendation(recommendationId: string, userId: string): Promise<DoctorRecommendation> {
    try {
      const { data, error } = await supabase
        .from('doctor_recommendations')
        .select('*')
        .eq('id', recommendationId)
        .eq('requested_by', userId)
        .single();

      if (error) {
        // console.error('Supabase error getting doctor recommendation:', error);
        throw error;
      }
      return data;
    } catch (error: any) {
      // console.error('Error getting doctor recommendation:', error);
      throw new Error(`Failed to get doctor recommendation: ${error.message}`);
    }
  }
}

// Export singleton instance
export const supabaseCRUDService = new SupabaseCRUDService();
export default supabaseCRUDService;
