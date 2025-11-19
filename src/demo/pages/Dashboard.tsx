import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Clock, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  FileText,
  User,
  TrendingUp,
  Download,
  Share2,
  CheckCircle2
} from 'lucide-react';
import DemoLayout from '../components/layout/DemoLayout';
import ErrorBoundary from '../../components/ErrorBoundary';
import { supabaseCRUDService } from '../../services/supabaseService';
import { useAuth } from '../../contexts/AuthContext';
import { downloadPDFReport } from '../../utils/pdfReportGenerator';
import { API_CONFIG } from '../../config/api';


interface AnalyticsData {
  totalAnalyses: number;
  successRate: number;
  averageProcessingTime: number;
  highPriorityAnalyses: number;
  woundTypes: {
    type: string;
    count: number;
    percentage: number;
  }[];
  severityDistribution: {
    severity: string;
    count: number;
    percentage: number;
  }[];
  monthlyTrends: {
    month: string;
    analyses: number;
    successRate: number;
  }[];
  topRecommendations: {
    recommendation: string;
    frequency: number;
    effectiveness: number;
  }[];
}

const Dashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'overview' | 'trends' | 'recommendations' | 'threads'>('overview');
  const [selectedAnalysisResult, setSelectedAnalysisResult] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analysisThreads, setAnalysisThreads] = useState<any[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Fetch data from Supabase and calculate analytics
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // console.log('Fetching dashboard data from Supabase...');
        
        // Fetch only completed analysis threads (those with results)
        const threadsResponse = await supabaseCRUDService.getAnalysisThreads(
          currentUser.id,
          { 
            limit: 100, 
            offset: 0,
            status: 'completed' // Only fetch completed threads
          }
        );
        
        const threads = threadsResponse.threads || [];
        // console.log(`Fetched ${threads.length} completed analysis threads`);
        
        // Fetch analysis results only for completed threads
        const resultsPromises = threads.map(thread => 
          supabaseCRUDService.getAnalysisResults(thread.id!, currentUser.id)
            .catch(_err => {
              // console.warn(`Failed to fetch results for thread ${thread.id}:`, _err);
              return [];
            })
        );
        
        const resultsArrays = await Promise.all(resultsPromises);
        const results = resultsArrays.flat();
        // console.log(`Fetched ${results.length} analysis results`);
        
        // Filter out threads that don't have results
        const threadsWithResults = threads.filter(thread => 
          results.some(result => result.thread_id === thread.id)
        );
        
        // console.log(`${threadsWithResults.length} threads have analysis results`);
        
        // Update state with only threads that have results
        setAnalysisThreads(threadsWithResults);
        setAnalysisResults(results);
        
        // Calculate analytics from real data
        const analytics = calculateAnalytics(threadsWithResults, results);
        setAnalyticsData(analytics);
        
        // console.log('Dashboard data loaded successfully', {
        //   threads: threadsWithResults.length,
        //   results: results.length,
        //   totalAnalyses: analytics.totalAnalyses
        // });

      } catch (error) {
        // console.error('Error fetching analytics data from Supabase:', error);
        // Set fallback data if fetch fails
        setAnalyticsData(getFallbackAnalytics());
        setAnalysisThreads([]);
        setAnalysisResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [currentUser?.id, selectedTimeRange]);

  // Calculate analytics from cached or demo data
  const calculateAnalytics = (threads: any[], results: any[]): AnalyticsData => {
    try {
      if (!threads || !results || !Array.isArray(threads) || !Array.isArray(results)) {
        // console.warn('Invalid threads or results data provided to calculateAnalytics');
        return getFallbackAnalytics();
      }

      const totalAnalyses = threads.length;
    
    // Calculate high priority analyses count with safe access
    const highPriorityAnalyses = threads.filter(thread => thread?.priority === 'high').length;
    const completedAnalyses = threads.filter(t => t?.status === 'completed').length;
    const successRate = totalAnalyses > 0 ? (completedAnalyses / totalAnalyses) * 100 : 0;
    
    const avgProcessingTime = results.length > 0 
      ? results.reduce((sum, r) => {
          const processingTime = r?.processing_metadata?.processing_time;
          // Convert milliseconds to seconds
          return sum + (typeof processingTime === 'number' && !isNaN(processingTime) ? processingTime / 1000 : 0);
        }, 0) / results.length
      : 0;
    
    // console.log('Processing time calculation:', {
    //   resultsCount: results.length,
    //   avgProcessingTime,
    //   sampleMetadata: results[0]?.processing_metadata
    // });

    // Calculate wound types distribution with safe access
    const woundTypeCounts: { [key: string]: number } = {};
    results.forEach(result => {
      try {
        const type = result?.diagnosis || 'Unknown';
        if (typeof type === 'string') {
      woundTypeCounts[type] = (woundTypeCounts[type] || 0) + 1;
        }
      } catch (error) {
        // console.warn('Error processing wound type:', error);
      }
    });

    const woundTypes = Object.entries(woundTypeCounts).map(([type, count]) => {
      try {
        return {
          type: typeof type === 'string' ? type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown',
          count: typeof count === 'number' ? count : 0,
          percentage: totalAnalyses > 0 ? ((typeof count === 'number' ? count : 0) / totalAnalyses) * 100 : 0
        };
      } catch (error) {
        // console.warn('Error formatting wound type:', error);
        return { type: 'Unknown', count: 0, percentage: 0 };
      }
    });

    // Calculate severity distribution with safe access
    const severityCounts: { [key: string]: number } = {};
    results.forEach(result => {
      try {
        const severity = result?.severity || 'unknown';
        if (typeof severity === 'string') {
      severityCounts[severity] = (severityCounts[severity] || 0) + 1;
        }
      } catch (error) {
        // console.warn('Error processing severity:', error);
      }
    });

    const severityDistribution = Object.entries(severityCounts).map(([severity, count]) => {
      try {
        return {
          severity: typeof severity === 'string' && severity.length > 0 
            ? severity.charAt(0).toUpperCase() + severity.slice(1) 
            : 'Unknown',
          count: typeof count === 'number' ? count : 0,
          percentage: totalAnalyses > 0 ? ((typeof count === 'number' ? count : 0) / totalAnalyses) * 100 : 0
        };
      } catch (error) {
        // console.warn('Error formatting severity:', error);
        return { severity: 'Unknown', count: 0, percentage: 0 };
      }
    });

    // Calculate monthly trends (last 8 months) with safe date handling
    const monthlyTrends = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      try {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        const monthThreads = threads.filter(t => {
          try {
            if (!t?.uploaded_at) return false;
            const threadDate = new Date(t.uploaded_at);
            return threadDate.getMonth() === date.getMonth() && threadDate.getFullYear() === date.getFullYear();
          } catch (error) {
            // console.warn('Invalid date in thread for monthly trends:', t?.uploaded_at);
            return false;
          }
        });
        
        const monthCompleted = monthThreads.filter(t => t?.status === 'completed').length;
        const monthSuccessRate = monthThreads.length > 0 ? (monthCompleted / monthThreads.length) * 100 : 0;
        
        monthlyTrends.push({
          month: monthName,
          analyses: monthThreads.length,
          successRate: isNaN(monthSuccessRate) ? 0 : monthSuccessRate
        });
      } catch (error) {
        // console.error('Error calculating monthly trend for month', i, error);
        monthlyTrends.push({
          month: 'Unknown',
          analyses: 0,
          successRate: 0
        });
      }
    }

    // Calculate top recommendations with safe access
    const recommendationCounts: { [key: string]: number } = {};
    results.forEach(result => {
      try {
        if (result?.recommendations && Array.isArray(result.recommendations)) {
          result.recommendations.forEach((rec: any) => {
            if (typeof rec === 'string' && rec.trim()) {
        recommendationCounts[rec] = (recommendationCounts[rec] || 0) + 1;
            }
      });
        }
      } catch (error) {
        // console.warn('Error processing recommendations:', error);
      }
    });

    const topRecommendations = Object.entries(recommendationCounts)
      .sort(([,a], [,b]) => (typeof b === 'number' ? b : 0) - (typeof a === 'number' ? a : 0))
      .slice(0, 5)
      .map(([recommendation, count]) => {
        try {
          return {
            recommendation: typeof recommendation === 'string' ? recommendation : 'Unknown',
            frequency: totalAnalyses > 0 ? ((typeof count === 'number' ? count : 0) / totalAnalyses) * 100 : 0,
        effectiveness: 85 + Math.random() * 15 // Placeholder effectiveness
          };
        } catch (error) {
          // console.warn('Error formatting recommendation:', error);
          return { recommendation: 'Unknown', frequency: 0, effectiveness: 0 };
        }
      });


      return {
        totalAnalyses,
        successRate,
        averageProcessingTime: avgProcessingTime,
        woundTypes,
        severityDistribution,
        monthlyTrends,
        topRecommendations,
        highPriorityAnalyses
      };
    } catch (error) {
      // console.error('Error calculating analytics:', error);
      return getFallbackAnalytics();
    }
  };

  // Fallback analytics data when Supabase is not available
  const getFallbackAnalytics = (): AnalyticsData => ({
    totalAnalyses: 0,
    successRate: 0,
    averageProcessingTime: 0,
    highPriorityAnalyses: 0,
    woundTypes: [],
    severityDistribution: [],
    monthlyTrends: [],
    topRecommendations: []
  });

  // Calculate trends and changes for dashboard stats
  const calculateTrends = () => {
    try {
      if (!analyticsData || !analysisThreads || !Array.isArray(analysisThreads) || analysisThreads.length === 0) return null;
      
      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Calculate recent vs previous period trends with safe date handling
      const recentThreads = analysisThreads.filter(t => {
        try {
          return t?.uploaded_at && new Date(t.uploaded_at) >= lastWeek;
        } catch (error) {
          // console.warn('Invalid date in thread:', t?.uploaded_at);
          return false;
        }
      });
      
      const previousWeekThreads = analysisThreads.filter(t => {
        try {
          if (!t?.uploaded_at) return false;
          const threadDate = new Date(t.uploaded_at);
          return threadDate >= new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) && threadDate < lastWeek;
        } catch (error) {
          // console.warn('Invalid date in thread:', t?.uploaded_at);
          return false;
        }
      });
      
      const recentCompleted = recentThreads.filter(t => t?.status === 'completed').length;
      const previousCompleted = previousWeekThreads.filter(t => t?.status === 'completed').length;
      
      const totalChange = previousWeekThreads.length > 0 
        ? ((recentThreads.length - previousWeekThreads.length) / previousWeekThreads.length) * 100
        : 0;
      
      const successRateChange = (recentThreads.length > 0 && previousWeekThreads.length > 0)
        ? ((recentCompleted / recentThreads.length) - (previousCompleted / previousWeekThreads.length)) * 100
        : 0;
      
      // Calculate high priority trend
      const recentHighPriority = recentThreads.filter(t => t?.priority === 'high').length;
      const previousHighPriority = previousWeekThreads.filter(t => t?.priority === 'high').length;
      const highPriorityChange = previousHighPriority > 0 
        ? ((recentHighPriority - previousHighPriority) / previousHighPriority) * 100
        : 0;
      
      return {
        totalChange: isNaN(totalChange) ? 0 : totalChange,
        successRateChange: isNaN(successRateChange) ? 0 : successRateChange,
        highPriorityChange: isNaN(highPriorityChange) ? 0 : highPriorityChange
      };
    } catch (error) {
      // console.error('Error calculating trends:', error);
      return {
        totalChange: 0,
        successRateChange: 0,
        highPriorityChange: 0
      };
    }
  };

  const trends = calculateTrends();

  const dashboardStats = analyticsData ? [
    {
      title: 'Total Analyses',
      value: analyticsData.totalAnalyses.toLocaleString(),
      change: trends ? `${trends.totalChange >= 0 ? '+' : ''}${trends.totalChange.toFixed(1)}%` : '+0%',
      changeType: trends && trends.totalChange >= 0 ? 'positive' as const : 'negative' as const,
      icon: BarChart3,
      color: 'blue'
    },
    {
      title: 'Success Rate',
      value: `${analyticsData.successRate.toFixed(1)}%`,
      change: trends ? `${trends.successRateChange >= 0 ? '+' : ''}${trends.successRateChange.toFixed(1)}%` : '+0%',
      changeType: trends && trends.successRateChange >= 0 ? 'positive' as const : 'negative' as const,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Avg Processing Time',
      value: `${analyticsData.averageProcessingTime.toFixed(1)}s`,
      change: analyticsData.averageProcessingTime < 5 ? '-0.3s' : '+0.2s',
      changeType: analyticsData.averageProcessingTime < 5 ? 'positive' as const : 'negative' as const,
      icon: Clock,
      color: 'purple'
    },
    {
      title: 'High Priority Cases',
      value: analyticsData.highPriorityAnalyses.toLocaleString(),
      change: trends ? `${trends.highPriorityChange >= 0 ? '+' : ''}${trends.highPriorityChange.toFixed(1)}%` : '+0%',
      changeType: trends && trends.highPriorityChange >= 0 ? 'negative' as const : 'positive' as const, // High priority increase is bad
      icon: AlertTriangle,
      color: 'orange'
    }
  ] : [
    {
      title: 'Total Analyses',
      value: '0',
      change: '+0%',
      changeType: 'positive' as const,
      icon: BarChart3,
      color: 'blue'
    },
    {
      title: 'Success Rate',
      value: '0%',
      change: '+0%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Avg Processing Time',
      value: '0s',
      change: '+0s',
      changeType: 'positive' as const,
      icon: Clock,
      color: 'purple'
    },
    {
      title: 'High Priority Cases',
      value: '0',
      change: '+0',
      changeType: 'positive' as const,
      icon: AlertTriangle,
      color: 'orange'
    }
  ];

  // Generate real recent activity from user data
  const generateRecentActivity = () => {
    try {
      if (!analysisThreads || !Array.isArray(analysisThreads)) {
        return [{
          id: 1,
          type: 'analysis',
          title: 'No recent activity',
          description: 'Upload images to see your analysis history',
          timestamp: 'N/A',
          icon: Eye,
          color: 'gray'
        }];
      }

      const activities: any[] = [];
      
      // Add recent completed analyses
      const recentCompletedThreads = analysisThreads
        .filter(thread => thread?.status === 'completed')
        .sort((a, b) => {
          try {
            const aTime = new Date(a?.analysis_completed_at || a?.updated_at || a?.created_at || 0).getTime();
            const bTime = new Date(b?.analysis_completed_at || b?.updated_at || b?.created_at || 0).getTime();
            return bTime - aTime;
          } catch (error) {
            // console.warn('Error sorting threads by date:', error);
            return 0;
          }
        })
        .slice(0, 3);
    
      recentCompletedThreads.forEach((thread) => {
        try {
          const timeAgo = getTimeAgo(new Date(thread?.analysis_completed_at || thread?.updated_at || thread?.created_at || Date.now()));
          activities.push({
            id: `analysis-${thread?.id || Math.random()}`,
            type: 'analysis',
            title: 'Analysis completed',
            description: `${thread?.patient_name || 'Unknown Patient'} - ${thread?.priority || 'unknown'} priority`,
            timestamp: timeAgo,
            icon: Eye,
            color: thread?.priority === 'high' ? 'red' : thread?.priority === 'medium' ? 'orange' : 'green'
          });
        } catch (error) {
          // console.warn('Error processing completed thread:', error);
        }
      });
      
      // Add recent uploads
      const recentUploads = analysisThreads
        .sort((a, b) => {
          try {
            const aTime = new Date(a?.uploaded_at || 0).getTime();
            const bTime = new Date(b?.uploaded_at || 0).getTime();
            return bTime - aTime;
          } catch (error) {
            // console.warn('Error sorting uploads by date:', error);
            return 0;
          }
        })
        .slice(0, 2);
      
      recentUploads.forEach(thread => {
        try {
          const timeAgo = getTimeAgo(new Date(thread?.uploaded_at || Date.now()));
          activities.push({
            id: `upload-${thread?.id || Math.random()}`,
            type: 'upload',
            title: 'New image uploaded',
            description: `${thread?.patient_name || 'Unknown Patient'} - ${thread?.status || 'unknown'}`,
            timestamp: timeAgo,
            icon: FileText,
            color: 'blue'
          });
        } catch (error) {
          // console.warn('Error processing upload thread:', error);
        }
      });
      
      // Sort all activities by timestamp and return top 4
      return activities
        .sort((a, b) => {
          try {
            const aTime = new Date(a.timestamp.includes('minute') ? Date.now() - parseInt(a.timestamp) * 60000 : 
                                  a.timestamp.includes('hour') ? Date.now() - parseInt(a.timestamp) * 3600000 :
                                  Date.now() - parseInt(a.timestamp) * 86400000).getTime();
            const bTime = new Date(b.timestamp.includes('minute') ? Date.now() - parseInt(b.timestamp) * 60000 :
                                  b.timestamp.includes('hour') ? Date.now() - parseInt(b.timestamp) * 3600000 :
                                  Date.now() - parseInt(b.timestamp) * 86400000).getTime();
            return bTime - aTime;
          } catch (error) {
            // console.warn('Error sorting activities:', error);
            return 0;
          }
        })
        .slice(0, 4);
    } catch (error) {
      // console.error('Error generating recent activity:', error);
      return [{
        id: 1,
        type: 'analysis',
        title: 'No recent activity',
        description: 'Upload images to see your analysis history',
        timestamp: 'N/A',
        icon: Eye,
        color: 'gray'
      }];
    }
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Generate and download detailed PDF report (same format as Result page)
  const generateDetailedReport = async () => {
    if (!selectedAnalysisResult) return;
    
    try {
      // Get the thread to access thread_id properly
      const thread = analysisThreads.find(t => {
        const results = analysisResults.filter(r => r.thread_id === t.id);
        return results.some(r => r.id === selectedAnalysisResult.id);
      });
      
      const threadId = thread?.id || selectedAnalysisResult.thread_id;
      
      // Fetch treatment plans and doctor recommendations (same as Result page)
      let treatmentPlans: any[] = [];
      let doctorRecommendations: any[] = [];
      
      if (selectedAnalysisResult.id && currentUser?.id) {
        try {
          [treatmentPlans, doctorRecommendations] = await Promise.all([
            supabaseCRUDService.getTreatmentPlansByResult(selectedAnalysisResult.id, currentUser.id),
            supabaseCRUDService.getDoctorRecommendationsByThread(threadId, currentUser.id)
          ]);
          // console.log('✅ Fetched treatment plans:', treatmentPlans.length);
          // console.log('✅ Fetched doctor recommendations:', doctorRecommendations.length);
        } catch (err) {
          // console.warn('Failed to fetch treatment plans or doctor recommendations:', err);
        }
      }
      
      // Parse processing_metadata (same as Result page)
      let backendData: any = null;
      if (selectedAnalysisResult.processing_metadata) {
        try {
          backendData = typeof selectedAnalysisResult.processing_metadata === 'string' 
            ? JSON.parse(selectedAnalysisResult.processing_metadata) 
            : selectedAnalysisResult.processing_metadata;
        } catch (e) {
          // console.warn('Failed to parse processing_metadata:', e);
        }
      }
      
      // Extract data from database fields (exactly as Result page does)
      const severity = selectedAnalysisResult.severity || 'mild';
      const diagnosis = selectedAnalysisResult.diagnosis || 'unknown';
      const woundDescription = selectedAnalysisResult.wound_description || '';
      const characteristics = woundDescription ? woundDescription.split(',').map((s: string) => s.trim()) : [];
      const recommendations = Array.isArray(selectedAnalysisResult.recommendations) ? selectedAnalysisResult.recommendations : [];
      const woundType = selectedAnalysisResult.healing_stage || diagnosis || 'Wound Assessment';
      
      const treatmentPlanData = treatmentPlans.length > 0 ? treatmentPlans[0] : null;
      
      // Determine image URLs (same as Result page)
      const backendBaseUrl = API_CONFIG.BACKEND.getBaseUrl();
      let imageUrl = '/images/sample-wound-analysis.jpg'; // Default placeholder
      let originalImageUrl: string | undefined;
      let segmentedImageUrl: string | undefined;
      
      if (selectedAnalysisResult.segmented_image_url) {
        segmentedImageUrl = selectedAnalysisResult.segmented_image_url.startsWith('http') 
          ? selectedAnalysisResult.segmented_image_url 
          : `${backendBaseUrl}${selectedAnalysisResult.segmented_image_url}`;
        imageUrl = segmentedImageUrl || imageUrl; // Prefer segmented
        // console.log('Using segmented image:', imageUrl);
      }
      
      if (selectedAnalysisResult.original_image_url) {
        originalImageUrl = selectedAnalysisResult.original_image_url.startsWith('http')
          ? selectedAnalysisResult.original_image_url
          : `${backendBaseUrl}${selectedAnalysisResult.original_image_url}`;
        if (!segmentedImageUrl) {
          imageUrl = originalImageUrl || imageUrl; // Fallback to original
          // console.log('Using original image:', imageUrl);
        }
      }
      
      if (!originalImageUrl && !segmentedImageUrl) {
        // console.log('No stored images found, using placeholder');
      }
      
      // Transform Supabase data to match PDF generator format (EXACTLY as Result page)
      const formattedResult = {
        id: threadId, // Use threadId from URL params (same as Result page)
        imageUrl: imageUrl,
        originalImageUrl,
        segmentedImageUrl,
        woundType: woundType,
        severity: severity as any,
        confidence: Math.round((selectedAnalysisResult.confidence_score || 0) * 100),
        isInfected: selectedAnalysisResult.infection_probability ? selectedAnalysisResult.infection_probability > 0.5 : false,
        infectionType: diagnosis !== 'unknown' && diagnosis !== 'not_infected' ? diagnosis : null,
        woundArea: selectedAnalysisResult.area_cm2 || 0,
        characteristics: characteristics.length > 0 ? characteristics : ['Wound characteristics not available'],
        description: woundDescription || 'No description available',
        recommendations: recommendations,
        timestamp: selectedAnalysisResult.analyzed_at || selectedAnalysisResult.created_at || new Date().toISOString(),
        analyzedBy: `DermaIQ AI ${selectedAnalysisResult.model_version || 'v2.1'}`,
        processingTime: backendData?.processing_time,
        treatmentPlan: treatmentPlanData,
        doctorRecommendations: doctorRecommendations
      };
      
      // Use the same PDF generator as Result page
      await downloadPDFReport(formattedResult);
      // console.log('PDF report downloaded successfully');
    } catch (error) {
      // console.error('Error generating PDF report:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  const recentActivity = analyticsData && analysisThreads.length > 0 ? generateRecentActivity() : [
    {
      id: 1,
      type: 'analysis',
      title: 'No recent activity',
      description: 'Upload images to see your analysis history',
      timestamp: 'N/A',
      icon: Eye,
      color: 'gray'
    }
  ];

  const quickActions = [
    {
      title: 'Upload New Image',
      description: 'Start a new wound analysis',
      icon: Eye,
      action: () => window.location.href = '/demo/upload',
      color: 'blue'
    },
    {
      title: 'View Treatment Plans',
      description: 'Review AI-generated recommendations',
      icon: FileText,
      action: () => window.location.href = '/demo/treatment',
      color: 'orange'
    },
    {
      title: 'Find Consultant',
      description: 'Connect with wound care specialists',
      icon: User,
      action: () => window.location.href = '/demo/consultant',
      color: 'purple'
    }
  ];

  // Helper functions for analytics display
  const getSeverityColorForChart = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'bg-green-500';
      case 'Moderate':
        return 'bg-yellow-500';
      case 'High':
        return 'bg-orange-500';
      case 'Critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };


  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      red: 'bg-red-100 text-red-600 border-red-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };


  return (
    <DemoLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back! Here's an overview of your wound analysis platform with comprehensive analytics.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'positive' ? '↗' : '↘'} {stat.change}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'trends', label: 'Trends', icon: TrendingUp },
                { id: 'recommendations', label: 'Recommendations', icon: CheckCircle },
                { id: 'threads', label: 'Thread Analytics', icon: Eye }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedMetric(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedMetric === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading analytics...</span>
              </div>
            ) : (
              <ErrorBoundary>
                {selectedMetric === 'overview' && analyticsData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Wound Types Distribution */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Wound Types Distribution</h3>
                  <div className="space-y-3">
                    {analyticsData.woundTypes && analyticsData.woundTypes.length > 0 ? analyticsData.woundTypes.map((wound, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <span className="text-sm text-gray-700">{wound.type || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{wound.count || 0}</span>
                          <span className="text-sm text-gray-500">({(wound.percentage || 0).toFixed(1)}%)</span>
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-sm">No wound type data available</p>
                    )}
                  </div>
                </div>

                {/* Severity Distribution */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Severity Distribution</h3>
                  <div className="space-y-3">
                    {analyticsData.severityDistribution && analyticsData.severityDistribution.length > 0 ? analyticsData.severityDistribution.map((severity, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 ${getSeverityColorForChart(severity.severity || 'Unknown')} rounded`}></div>
                          <span className="text-sm text-gray-700">{severity.severity || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{severity.count || 0}</span>
                          <span className="text-sm text-gray-500">({(severity.percentage || 0).toFixed(1)}%)</span>
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-sm">No severity data available</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {selectedMetric === 'trends' && (() => {
              try {
                if (!analyticsData || !analyticsData.monthlyTrends || !Array.isArray(analyticsData.monthlyTrends) || analyticsData.monthlyTrends.length === 0) {
                  return (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <p className="text-gray-500">No trend data available. Upload some analyses to see trends.</p>
                      </div>
                    </div>
                  );
                }

                return (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-8 gap-4">
                    {analyticsData.monthlyTrends.map((trend, index) => {
                      try {
                        // Safe calculation for bar height with proper null checks
                        const analysesValues = analyticsData.monthlyTrends
                              .map(t => {
                                const val = t?.analyses;
                                return typeof val === 'number' && !isNaN(val) && val >= 0 ? val : 0;
                              })
                              .filter(val => val >= 0);
                        
                        const maxAnalyses = analysesValues.length > 0 ? Math.max(...analysesValues, 1) : 1;
                            const currentAnalyses = typeof trend?.analyses === 'number' ? trend.analyses : 0;
                        const barHeight = maxAnalyses > 0 ? Math.max((currentAnalyses / maxAnalyses) * 100, 10) : 10;
                            const successRate = typeof trend?.successRate === 'number' ? trend.successRate : 0;
                        
                        return (
                          <div key={index} className="text-center">
                                <div className="text-sm font-medium text-gray-900 mb-2">{typeof trend?.month === 'string' ? trend.month : 'Unknown'}</div>
                            <div className="bg-blue-500 rounded-t" style={{ height: `${barHeight}px` }}></div>
                            <div className="text-xs text-gray-600 mt-2">{currentAnalyses}</div>
                                <div className="text-xs text-green-600">{successRate.toFixed(1)}%</div>
                          </div>
                        );
                      } catch (error) {
                        // console.error('Error rendering trend item:', error);
                        return (
                          <div key={index} className="text-center">
                            <div className="text-sm font-medium text-gray-900 mb-2">Error</div>
                            <div className="bg-gray-300 rounded-t" style={{ height: '10px' }}></div>
                            <div className="text-xs text-gray-600 mt-2">0</div>
                            <div className="text-xs text-gray-600">0.0%</div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
                );
              } catch (error) {
                // console.error('Error rendering trends section:', error);
                return (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
                    <div className="bg-red-50 rounded-lg p-8 text-center border border-red-200">
                      <p className="text-red-600">Error loading trends data. Please try refreshing the page.</p>
                    </div>
                  </div>
                );
              }
            })()}
            

            

            {selectedMetric === 'recommendations' && (() => {
              try {
                if (!analyticsData || !analyticsData.topRecommendations || !Array.isArray(analyticsData.topRecommendations) || analyticsData.topRecommendations.length === 0) {
                  return (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Recommendations</h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <p className="text-gray-500">No recommendation data available. Complete some analyses to see recommendations.</p>
                </div>
              </div>
                  );
                }

                return (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Recommendations</h3>
                <div className="space-y-4">
                  {analyticsData.topRecommendations.map((rec: any, index) => {
                    try {
                          const recommendation = typeof rec?.recommendation === 'string' ? rec.recommendation : 'Unknown Recommendation';
                          const frequency = typeof rec?.frequency === 'number' ? rec.frequency : 0;
                          const effectiveness = typeof rec?.effectiveness === 'number' ? rec.effectiveness : 0;
                      const safeFrequency = Math.min(Math.max(frequency, 0), 100);
                      const safeEffectiveness = Math.min(Math.max(effectiveness, 0), 100);
                      
                      return (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{recommendation}</span>
                            <span className="text-sm text-gray-600">{safeFrequency.toFixed(1)}% frequency</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Frequency</span>
                                <span>{safeFrequency.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${safeFrequency}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Effectiveness</span>
                                <span>{safeEffectiveness.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${safeEffectiveness}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    } catch (error) {
                      // console.error('Error rendering recommendation item:', error);
                      return (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">Error loading recommendation</span>
                            <span className="text-sm text-gray-600">0.0% frequency</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Frequency</span>
                                <span>0.0%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Effectiveness</span>
                                <span>0.0%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
                );
              } catch (error) {
                // console.error('Error rendering recommendations section:', error);
                return (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Recommendations</h3>
                    <div className="bg-red-50 rounded-lg p-8 text-center border border-red-200">
                      <p className="text-red-600">Error loading recommendations data. Please try refreshing the page.</p>
                </div>
              </div>
                );
              }
            })()}


            {selectedMetric === 'threads' && (() => {
              try {
                return (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Thread Reports</h3>
                
                {/* Thread Selection */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Select Analysis Thread</h4>
                      {analysisThreads && Array.isArray(analysisThreads) && analysisThreads.filter(t => t?.status === 'completed').length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {analysisThreads.filter(t => t?.status === 'completed').map((thread) => {
                        try {
                          const result = analysisResults.find(r => r?.thread_id === thread?.id);
                          const patientName = thread?.patient_name || 'Unknown Patient';
                          const uploadedDate = thread?.uploaded_at;
                          const severity = result?.severity || 'unknown';
                          const diagnosis = result?.diagnosis || 'unknown';
                          
                          let formattedDate = 'Unknown Date';
                          try {
                            if (uploadedDate) {
                              formattedDate = new Date(uploadedDate).toLocaleDateString();
                            }
                          } catch (error) {
                            // console.warn('Invalid date format:', uploadedDate);
                          }
                          
                          return (
                            <div 
                              key={thread?.id || `thread-${Math.random()}`} 
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedAnalysisResult && selectedAnalysisResult.thread_id === thread?.id ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => {
                                if (result) {
                                  setSelectedAnalysisResult(result);
                                }
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900">{patientName}</span>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              </div>
                              <p className="text-sm text-gray-500 mb-2">
                                {formattedDate}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  severity === 'high' ? 'bg-red-100 text-red-700' :
                                  severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {severity} severity
                                </span>
                                <span className="text-xs text-gray-500">
                                  {diagnosis.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                          );
                        } catch (error) {
                          // console.error('Error rendering thread item:', error);
                          return (
                            <div key={`error-${Math.random()}`} className="p-4 border border-red-200 rounded-lg bg-red-50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-red-700">Error loading thread</span>
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                              </div>
                              <p className="text-sm text-red-500 mb-2">Unable to load thread data</p>
                              <div className="text-xs text-red-500">Please try refreshing the page</div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-500">No completed analysis threads available. Complete some analyses to see thread reports.</p>
                    </div>
                  )}
                </div>

                {selectedAnalysisResult ? (
                  <div className="space-y-6">
                    {/* Thread-Specific Analytics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      {(() => {
                        try {
                          const confidenceScore = selectedAnalysisResult?.confidence_score || 0;
                          // Convert milliseconds to seconds
                          const processingTime = (selectedAnalysisResult?.processing_metadata?.processing_time || 0) / 1000;
                          const woundArea = selectedAnalysisResult?.area_cm2 || 0;
                          const severity = selectedAnalysisResult?.severity || 'unknown';
                          
                          const stats = [
                            { 
                              title: 'Analysis Accuracy', 
                              value: `${(confidenceScore * 100).toFixed(1)}%`, 
                              change: '+5.2%', 
                              icon: TrendingUp,
                              color: 'text-green-600'
                            },
                            { 
                              title: 'Processing Time', 
                              value: `${processingTime.toFixed(1)}s`, 
                              change: '-0.8s', 
                              icon: Clock,
                              color: 'text-blue-600'
                            },
                            { 
                              title: 'Wound Area', 
                              value: `${woundArea} cm²`, 
                              change: woundArea > 5 ? '+2.1 cm²' : '-0.5 cm²', 
                              icon: Eye,
                              color: 'text-purple-600'
                            },
                            { 
                              title: 'Risk Level', 
                              value: severity === 'high' ? 'High' : severity === 'medium' ? 'Medium' : 'Low', 
                              change: severity === 'high' ? 'Critical' : 'Stable', 
                              icon: AlertTriangle,
                              color: severity === 'high' ? 'text-red-600' : severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                            }
                          ];
                          
                          return stats.map((stat, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-gray-600">{stat.title}</p>
                                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                  <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                                </div>
                                <stat.icon className="w-8 h-8 text-blue-500" />
                              </div>
                            </div>
                          ));
                        } catch (error) {
                          // console.error('Error rendering analysis stats:', error);
                          return (
                            <div className="col-span-full bg-red-50 rounded-lg p-4 border border-red-200">
                              <div className="flex items-center space-x-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                <span className="text-red-700">Error loading analysis statistics</span>
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Analysis Details</h4>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h5 className="font-medium text-gray-900 mb-2">Diagnosis Summary</h5>
                            <div className="space-y-2 text-sm">
                              {(() => {
                                try {
                                  const diagnosis = selectedAnalysisResult?.diagnosis || 'Unknown';
                                  const severity = selectedAnalysisResult?.severity || 'Unknown';
                                  const infectionProbability = selectedAnalysisResult?.infection_probability;
                                  const confidenceScore = selectedAnalysisResult?.confidence_score || 0;
                                  
                                  return (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Primary Diagnosis:</span>
                                        <span className="font-medium capitalize">{diagnosis.replace('_', ' ')}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Severity Level:</span>
                                        <span className="font-medium capitalize">{severity}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Infection Risk:</span>
                                        <span className="font-medium">
                                          {infectionProbability !== undefined && infectionProbability !== null 
                                            ? (infectionProbability > 0.5 ? 'High' : 'Low') 
                                            : 'Unknown'}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">Confidence Score:</span>
                                        <span className="font-medium">{(confidenceScore * 100).toFixed(1)}%</span>
                                      </div>
                                    </>
                                  );
                                } catch (error) {
                                  // console.error('Error rendering diagnosis summary:', error);
                                  return (
                                    <div className="text-red-600 text-sm">
                                      Error loading diagnosis details
                                    </div>
                                  );
                                }
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Recommendations & Actions</h4>
                        <div className="space-y-4">
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <h5 className="font-medium text-gray-900 mb-2">Treatment Priority</h5>
                            <div className="space-y-2">
                              {(() => {
                                try {
                                  const severity = selectedAnalysisResult?.severity || 'unknown';
                                  const diagnosis = selectedAnalysisResult?.diagnosis || 'unknown';
                                  
                                  return (
                                    <>
                                      {severity === 'high' && (
                                        <div className="flex items-center space-x-2">
                                          <AlertTriangle className="w-4 h-4 text-red-500" />
                                          <span className="text-sm text-red-700">Immediate medical attention required</span>
                                        </div>
                                      )}
                                      {diagnosis === 'infected' && (
                                        <div className="flex items-center space-x-2">
                                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                                          <span className="text-sm text-orange-700">Antibiotic treatment recommended</span>
                                        </div>
                                      )}
                                      <div className="flex items-center space-x-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span className="text-sm text-green-700">Regular monitoring advised</span>
                                      </div>
                                    </>
                                  );
                                } catch (error) {
                                  // console.error('Error rendering treatment priority:', error);
                                  return (
                                    <div className="text-red-600 text-sm">
                                      Error loading treatment recommendations
                                    </div>
                                  );
                                }
                              })()}
                            </div>
                          </div>

                          <div className="p-4 bg-orange-50 rounded-lg">
                            <h5 className="font-medium text-gray-900 mb-2">Next Steps</h5>
                            <div className="space-y-2">
                              <button 
                                onClick={generateDetailedReport}
                                className="w-full flex items-center justify-between p-2 bg-white rounded hover:bg-gray-50 transition-colors hover:shadow-md"
                              >
                                <span className="text-gray-700">Generate Detailed Report</span>
                                <Download className="w-4 h-4 text-gray-400" />
                              </button>
                              <button className="w-full flex items-center justify-between p-2 bg-white rounded hover:bg-gray-50 transition-colors">
                                <span className="text-gray-700">Schedule Follow-up</span>
                                <Calendar className="w-4 h-4 text-gray-400" />
                              </button>
                              <button className="w-full flex items-center justify-between p-2 bg-white rounded hover:bg-gray-50 transition-colors">
                                <span className="text-gray-700">Share with Care Team</span>
                                <Share2 className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Analysis Data Selected</h4>
                    <p className="text-gray-500 mb-4">Select a completed analysis thread to view detailed reports and analytics</p>
                  </div>
                )}
              </div>
                );
              } catch (error) {
                // console.error('Error rendering threads section:', error);
                return (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Thread Reports</h3>
                    <div className="bg-red-50 rounded-lg p-8 text-center border border-red-200">
                      <p className="text-red-600">Error loading thread analytics. Please try refreshing the page.</p>
                    </div>
                  </div>
                );
              }
            })()}
              </ErrorBoundary>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`w-full p-4 rounded-lg border-2 transition-all hover:shadow-md text-left ${getColorClasses(action.color)}`}
                  >
                    <div className="flex items-center space-x-3">
                      <action.icon className="w-5 h-5" />
                      <div>
                        <p className="font-medium">{action.title}</p>
                        <p className="text-xs opacity-75">{action.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorClasses(activity.color)}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">AI Analysis Engine</p>
                  <p className="text-sm text-gray-600">All systems operational</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">MCP Server</p>
                  <p className="text-sm text-gray-600">Connected and responsive</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Knowledge Base</p>
                  <p className="text-sm text-gray-600">Up to date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
};

export default Dashboard;
