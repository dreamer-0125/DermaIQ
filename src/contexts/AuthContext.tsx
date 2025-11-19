import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { clearAuth } from '../utils/authHelper';
import { debugAuth } from '../utils/authDebug';
import { TIMEOUT_CONFIG } from '../config/timeouts';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  title?: string;
  organization?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  medical_conditions?: string[];
  allergies?: string[];
  current_medications?: string[];
  insurance_provider?: string;
  insurance_policy_number?: string;
  preferred_language?: string;
  timezone?: string;
  created_at: string;
  updated_at?: string;
  last_signed_in_at?: string;
  is_active?: boolean;
  email_verified?: boolean;
  phone_verified?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, firstName: string, lastName: string, phone: string, title?: string, organization?: string, additionalData?: Partial<UserProfile>, redirectTo?: string) => Promise<void>;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  fetchUserProfile: (user: User) => Promise<void>;
  refreshUserData: () => Promise<void>;
  clearAllAuthData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const navigate = useNavigate();

  const signup = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    phone: string,
    title?: string, 
    organization?: string,
    additionalData?: Partial<UserProfile>,
    redirectTo?: string
  ) => {
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          title: title || '',
          organization: organization || '',
          phone: phone || '',
          ...additionalData
        }
      }
    });

    if (error) {
      // console.error('AuthContext: Signup error:', error);
      throw error;
    }



    // If user was created successfully, set the user state
    if (data.user) {
      setCurrentUser(data.user);
      
      // The database trigger handle_new_user() should have automatically created the profile
      // Give it a moment to complete, then fetch the profile
      try {
        // Wait a moment for the trigger to complete, with retry logic
        let retries = 3;
        while (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          try {
            await fetchUserProfile(data.user);
            break; // Success, exit retry loop
          } catch (error) {
            retries--;
            if (retries === 0) {
              // console.warn('Profile fetching failed after retries, but user was created:', error);
            }
          }
        }
      } catch (error) {
        // console.warn('Profile fetching failed, but user was created:', error);
      }
    }
    
    // Redirect to demo page after successful signup
    if (redirectTo) {
      navigate(redirectTo);
    } else {
      navigate('/demo');
    }
  };

  const login = async (email: string, password: string, redirectTo?: string) => {
    // console.log('AuthContext: Starting login process for email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // console.error('AuthContext: Login error:', error);
      throw error;
    }
    
    // console.log('AuthContext: Login successful, user:', data.user?.id);
    
    if (data.user) {
      setCurrentUser(data.user);
      await fetchUserProfile(data.user);
    }
    
    // Redirect to demo page after successful login
    if (redirectTo) {
      navigate(redirectTo);
    } else {
      navigate('/demo');
    }
  };

  const logout = async () => {
    // console.log('AuthContext: Starting logout process...');
    
    try {
      // Clear Supabase session
      const { error } = await supabase.auth.signOut();
      if (error) {
        // console.error('AuthContext: Supabase logout error:', error);
        throw error;
      }
      
      // Clear mock authentication (development)
      clearAuth();
      
      // Clear all state
      setCurrentUser(null);
      setUserProfile(null);
      
      // console.log('AuthContext: Logout successful, redirecting to home page...');
      
      // Always redirect to main website (home page) after logout
      // This ensures users are taken away from demo/protected areas
      navigate('/', { replace: true });
      
    } catch (error) {
      // console.error('AuthContext: Logout error:', error);
      
      // Even if there's an error, clear local state and redirect
      clearAuth();
      setCurrentUser(null);
      setUserProfile(null);
      navigate('/', { replace: true });
      throw error;
    }
  };

  // Force refresh user data
  const refreshUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      setCurrentUser(session.user);
    } else {
      setCurrentUser(null);
      setUserProfile(null);
    }
  };

  // Clear all authentication data (nuclear option)
  const clearAllAuthData = async () => {
    // console.log('AuthContext: Clearing all authentication data...');
    
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
    } catch (error) {
      // console.warn('AuthContext: Error during Supabase signout:', error);
    }
    
    // Clear mock authentication
    clearAuth();
    
    // Clear all state
    setCurrentUser(null);
    setUserProfile(null);
    
    // Clear browser storage
    localStorage.clear();
    sessionStorage.clear();
    
    // console.log('AuthContext: All auth data cleared, redirecting...');
    
    // Redirect to main website and force page reload to ensure clean state
    window.location.href = '/';
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    
    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', currentUser.id);
    
    if (error) throw error;
    
    // Update local state
    setUserProfile(prev => prev ? { ...prev, ...data } : null);
  };

  const fetchUserProfile = async (user: User) => {
    // Prevent duplicate requests for the same user or if already fetching
    if (fetchingProfile) {
      // console.log('User profile fetch already in progress for user ID:', user.id);
      return;
    }
    
    // Only skip if we already have the profile for this exact user
    if (userProfile && userProfile.id === user.id) {
      // console.log('User profile already loaded for user ID:', user.id);
      return;
    }
    
    setFetchingProfile(true);
    try {
      // console.log('Fetching user profile for user ID:', user.id);
      
      // Use SESSION timeout (5s) instead of OPERATION timeout (60s) for faster profile fetch
      const profilePromise = supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      // Use faster SESSION timeout for profile fetch
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Profile fetch timeout after ${TIMEOUT_CONFIG.DATABASE.SESSION / 1000} seconds`));
        }, TIMEOUT_CONFIG.DATABASE.SESSION);
      });
      
      const { data, error } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]);
      
      if (error) {
        // console.error('Error fetching user profile:', {
        //   message: error.message,
        //   details: error.details,
        //   hint: error.hint,
        //   code: error.code,
        //   userId: user.id
        // });
        
        // If user profile doesn't exist, create it
        if (error.code === 'PGRST116' || error.message.includes('No rows found')) {
          // console.log('User profile not found, creating new profile...');
          await createUserProfile(user);
        } else {
          // On error, set a minimal profile to prevent blocking
          // console.warn('Profile fetch failed, using minimal profile from user metadata');
          setMinimalProfileFromUser(user);
        }
        return;
      }
      
      if (data) {
        // console.log('Successfully fetched user profile:', data);
        setUserProfile(data);
        
        // Cache profile in session storage for faster subsequent loads
        try {
          sessionStorage.setItem(`profile-${user.id}`, JSON.stringify(data));
        } catch (e) {
          // console.warn('Failed to cache profile:', e);
        }
      }
    } catch (error) {
      // console.error('Unexpected error fetching user profile:', error);
      
      // If profile fetch fails due to timeout, use cached or minimal profile
      if (error instanceof Error && error.message.includes('timeout')) {
        // console.log(`Profile fetch timed out after ${TIMEOUT_CONFIG.DATABASE.SESSION / 1000} seconds`);
        
        // Try to load from cache first
        try {
          const cached = sessionStorage.getItem(`profile-${user.id}`);
          if (cached) {
            const cachedProfile = JSON.parse(cached);
            // console.log('Using cached profile');
            setUserProfile(cachedProfile);
            return;
          }
        } catch (e) {
          // console.warn('Failed to load cached profile:', e);
        }
        
        // Fallback to minimal profile
        setMinimalProfileFromUser(user);
      }
    } finally {
      setFetchingProfile(false);
    }
  };

  const setMinimalProfileFromUser = (user: User) => {
    const minimalProfile = {
      id: user.id,
      email: user.email || '',
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    // console.log('Setting minimal profile from user metadata:', minimalProfile);
    setUserProfile(minimalProfile);
  };

  const createUserProfile = async (user: User) => {
    try {
      const profileData = {
        id: user.id,
        email: user.email || '',
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        title: user.user_metadata?.title || '',
        organization: user.user_metadata?.organization || '',
        phone: user.user_metadata?.phone || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Use SESSION timeout for faster profile creation
      const createPromise = supabase
        .from('users')
        .insert(profileData)
        .select()
        .single();
      
      // Use faster SESSION timeout for profile creation
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Profile creation timeout after ${TIMEOUT_CONFIG.DATABASE.SESSION / 1000} seconds`));
        }, TIMEOUT_CONFIG.DATABASE.SESSION);
      });
      
      const { data, error } = await Promise.race([
        createPromise,
        timeoutPromise
      ]);

      if (error) {
        // console.error('Error creating user profile:', error);
        // Still set minimal profile on error
        setMinimalProfileFromUser(user);
        return;
      }

      if (data) {
        // console.log('Successfully created user profile:', data);
        setUserProfile(data);
        
        // Cache the newly created profile
        try {
          sessionStorage.setItem(`profile-${user.id}`, JSON.stringify(data));
        } catch (e) {
          // console.warn('Failed to cache profile:', e);
        }
      }
    } catch (error) {
      // console.error('Unexpected error creating user profile:', error);
      
      // If profile creation fails, set a minimal profile to prevent blocking the user
      setMinimalProfileFromUser(user);
    }
  };

  useEffect(() => {
    // Check for existing session on app startup
    const initializeAuth = async () => {
      try {
        // Run diagnostics in development
        if (process.env.NODE_ENV === 'development') {
          await debugAuth.runDiagnostics();
        }
        
        // Use SESSION timeout for faster initial auth check
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Session check timeout after ${TIMEOUT_CONFIG.DATABASE.SESSION / 1000} seconds`));
          }, TIMEOUT_CONFIG.DATABASE.SESSION);
        });
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]).catch((err) => {
          // console.warn('Session check timed out or failed:', err);
          return { data: { session: null }, error: err };
        });
        
        if (error) {
          // console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          setCurrentUser(session.user);
          
          // Try to load profile from cache first for instant UI
          try {
            const cached = sessionStorage.getItem(`profile-${session.user.id}`);
            if (cached) {
              const cachedProfile = JSON.parse(cached);
              // console.log('Using cached profile for instant load');
              setUserProfile(cachedProfile);
              setLoading(false);
              
              // Fetch fresh profile in background (don't await)
              fetchUserProfile(session.user).catch(_err => {
                // console.warn('Background profile refresh failed:', _err)
              });
              return;
            }
          } catch (e) {
            // console.warn('Failed to load cached profile:', e);
          }
          
          // No cache available, fetch profile normally
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        // console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // console.log('AuthContext: Auth state change:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setCurrentUser(session.user);
          
          // Check cache first
          try {
            const cached = sessionStorage.getItem(`profile-${session.user.id}`);
            if (cached) {
              const cachedProfile = JSON.parse(cached);
              setUserProfile(cachedProfile);
              
              // Refresh in background
              fetchUserProfile(session.user).catch(_err => {
                // console.warn('Background profile refresh failed:', _err)
              });
              return;
            }
          } catch (e) {
            // console.warn('Failed to load cached profile:', e);
          }
          
          // No cache, fetch normally
          await fetchUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          // console.log('AuthContext: User signed out, clearing state...');
          setCurrentUser(null);
          setUserProfile(null);
          
          // Clear cached profiles
          try {
            const keys = Object.keys(sessionStorage);
            keys.forEach(key => {
              if (key.startsWith('profile-')) {
                sessionStorage.removeItem(key);
              }
            });
          } catch (e) {
            // console.warn('Failed to clear cached profiles:', e);
          }
          
          // Also clear mock auth to ensure clean state
          clearAuth();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    fetchUserProfile,
    refreshUserData,
    clearAllAuthData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};