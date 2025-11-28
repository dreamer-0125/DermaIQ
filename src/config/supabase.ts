import { createClient } from '@supabase/supabase-js';
import { TIMEOUT_CONFIG } from './timeouts';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
// console.log('Supabase URL:', supabaseUrl);
// console.log('Supabase Anon Key:', supabaseAnonKey);

// Check if Supabase is properly configured
const isSupabaseConfigured = supabaseUrl !== 'your-supabase-url' && 
  supabaseAnonKey !== 'your-supabase-anon-key' &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co') &&
  supabaseAnonKey.length > 50;

if (!isSupabaseConfigured) {
  // console.warn('⚠️ Supabase not configured! Please set the following environment variables:');
  // console.warn('VITE_SUPABASE_URL=https://your-project-id.supabase.co');
  // console.warn('VITE_SUPABASE_ANON_KEY=your-anon-key-here');
  // console.warn('Create a .env file in the project root with these values.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'dermaiq-auth-token',
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'x-client-info': 'dermaiq-web',
    },
  },
});

// Add a method to check if Supabase is configured
export const isSupabaseReady = () => isSupabaseConfigured;

// Test Supabase connection
export const testSupabaseConnection = async () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not properly configured');
  }
  
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Use a simple query with timeout
    const connectionPromise = supabase.from('users').select('count').limit(1);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Supabase connection test timeout after ${TIMEOUT_CONFIG.DATABASE.OPERATION / 1000} seconds`));
      }, TIMEOUT_CONFIG.DATABASE.OPERATION);
    });
    
    const { error } = await Promise.race([connectionPromise, timeoutPromise]);
    
    if (error) {
      // console.error('Supabase connection test failed:', {
      //   message: error.message,
      //   details: error.details,
      //   hint: error.hint,
      //   code: error.code
      // });
      throw new Error(`Supabase connection failed: ${error.message}`);
    }
    // console.log('✅ Supabase connection test successful');
    return true;
  } catch (error) {
    // console.error('Supabase connection test error:', error);
    
    // Provide more specific error information
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        // console.error('Supabase connection was aborted due to timeout');
      } else if (error.message.includes('Failed to fetch')) {
        // console.error('Supabase connection failed due to network error');
      } else if (error.message.includes('timeout')) {
        // console.error('Supabase connection timed out');
      }
    }
    
    throw error;
  }
};

export default supabase;
