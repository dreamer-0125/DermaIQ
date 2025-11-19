/**
 * Authentication Debug Utilities
 * 
 * This file provides debugging utilities for authentication issues.
 * Use these functions to diagnose problems with signin/signout.
 */

import { supabase, isSupabaseReady, testSupabaseConnection } from '../config/supabase';

export const debugAuth = {
  /**
   * Check Supabase configuration and connection
   */
  async checkSupabaseConfig() {
    // console.log('🔍 Debugging Supabase Configuration...');
    
    // Check if Supabase is configured
    const isReady = isSupabaseReady();
    // console.log('✅ Supabase configured:', isReady);
    
    if (!isReady) {
      // console.error('❌ Supabase is not properly configured');
      return false;
    }
    
    // Test connection
    try {
      await testSupabaseConnection();
      return true;
    } catch (error) {
      // console.error('❌ Supabase connection test failed:', error);
      return false;
    }
  },

  /**
   * Check current authentication state
   */
  async checkAuthState() {
    // console.log('🔍 Checking authentication state...');
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        // console.error('❌ Error getting session:', error);
        return null;
      }
      
      if (session) {
        // console.log('✅ User is authenticated:', {
        //   userId: session.user.id,
        //   email: session.user.email,
        //   expiresAt: session.expires_at
        // });
        return session;
      } else {
        // console.log('ℹ️ No active session found');
        return null;
      }
    } catch (error) {
      // console.error('❌ Error checking auth state:', error);
      return null;
    }
  },

  /**
   * Test signin with provided credentials
   */
  async testSignIn(email: string, password: string) {
    // console.log('🔍 Testing signin...');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // console.error('❌ Signin failed:', error);
        return { success: false, error };
      }
      
      // console.log('✅ Signin successful:', {
      //   userId: data.user?.id,
      //   email: data.user?.email
      // });
      
      return { success: true, data };
    } catch (error) {
      // console.error('❌ Signin error:', error);
      return { success: false, error };
    }
  },

  /**
   * Test signout
   */
  async testSignOut() {
    // console.log('🔍 Testing signout...');
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // console.error('❌ Signout failed:', error);
        return { success: false, error };
      }
      
      // console.log('✅ Signout successful');
      return { success: true };
    } catch (error) {
      // console.error('❌ Signout error:', error);
      return { success: false, error };
    }
  },

  /**
   * Run comprehensive authentication diagnostics
   */
  async runDiagnostics() {
    // console.log('🚀 Running comprehensive authentication diagnostics...');
    
    const results = {
      supabaseConfig: false,
      authState: null as any,
      timestamp: new Date().toISOString()
    };
    
    // Check Supabase configuration
    results.supabaseConfig = await this.checkSupabaseConfig();
    
    // Check current auth state
    results.authState = await this.checkAuthState();
    
    // console.log('📊 Diagnostic Results:', results);
    return results;
  }
};

// Make debug functions available globally in development
if (process.env.NODE_ENV === 'development') {
  (window as any).debugAuth = debugAuth;
  // console.log('🔧 Authentication debug utilities available at window.debugAuth');
}
