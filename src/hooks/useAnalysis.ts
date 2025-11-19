import { useState, useCallback, useRef, useEffect } from 'react';
import { TIMEOUT_CONFIG } from '../config/timeouts';

interface AnalysisState {
  isAnalyzing: boolean;
  currentStep: string;
  progress: number;
  error: string | null;
  result: any | null;
}

interface UseAnalysisOptions {
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
  onProgress?: (step: string, progress: number) => void;
}

export const useAnalysis = (options: UseAnalysisOptions = {}) => {
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    currentStep: 'preparing',
    progress: 0,
    error: null,
    result: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startAnalysis = useCallback(async (
    analysisFn: (onProgress: (step: string, progress: number) => void) => Promise<any>
  ) => {
    // Cleanup any existing analysis
    cleanup();

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState({
      isAnalyzing: true,
      currentStep: 'preparing',
      progress: 0,
      error: null,
      result: null,
    });

    try {
      // Set timeout for analysis
      timeoutRef.current = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          error: `Analysis timed out after ${TIMEOUT_CONFIG.ANALYSIS.OVERALL / 1000 / 60} minutes`,
        }));
        options.onError?.(`Analysis timed out after ${TIMEOUT_CONFIG.ANALYSIS.OVERALL / 1000 / 60} minutes`);
      }, TIMEOUT_CONFIG.ANALYSIS.OVERALL);

      const result = await analysisFn((step: string, progress: number) => {
        setState(prev => ({
          ...prev,
          currentStep: step,
          progress,
        }));
        options.onProgress?.(step, progress);
      });

      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        result,
      }));

      options.onComplete?.(result);
      return result;
    } catch (error) {
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage,
      }));

      options.onError?.(errorMessage);
      throw error;
    }
  }, [cleanup, options]);

  const retry = useCallback((analysisFn: (onProgress: (step: string, progress: number) => void) => Promise<any>) => {
    return startAnalysis(analysisFn);
  }, [startAnalysis]);

  const reset = useCallback(() => {
    cleanup();
    setState({
      isAnalyzing: false,
      currentStep: 'preparing',
      progress: 0,
      error: null,
      result: null,
    });
  }, [cleanup]);

  const cancel = useCallback(() => {
    cleanup();
    setState(prev => ({
      ...prev,
      isAnalyzing: false,
      error: 'Analysis cancelled by user',
    }));
  }, [cleanup]);

  return {
    ...state,
    startAnalysis,
    retry,
    reset,
    cancel,
    isAborted: abortControllerRef.current?.signal.aborted || false,
  };
};

