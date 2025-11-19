/**
 * Utility functions for wound-related operations
 */

import { WoundDiagnosis } from '../types/analysis';

/**
 * Get user-friendly display name for wound diagnosis
 * @param diagnosis - The wound diagnosis type
 * @returns Human-readable wound type name
 */
export const getWoundTypeDisplayName = (diagnosis: WoundDiagnosis | string): string => {
  const woundTypeNames: Record<string, string> = {
    'infected': 'Infected Wound',
    'not_infected': 'Non-Infected Wound',
    'diabetic_ulcer': 'Diabetic Ulcer',
    'pressure_ulcer': 'Pressure Ulcer (Bed Sore)',
    'venous_ulcer': 'Venous Ulcer'
  };
  return woundTypeNames[diagnosis] || diagnosis;
};

/**
 * Get severity color class for UI display
 * @param severity - The wound severity level
 * @returns Tailwind CSS color class
 */
export const getSeverityColor = (severity: 'low' | 'medium' | 'high'): string => {
  switch (severity) {
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

/**
 * Get confidence level description
 * @param confidence - Confidence score (0-1)
 * @returns Human-readable confidence level
 */
export const getConfidenceLevel = (confidence: number): string => {
  if (confidence >= 0.9) return 'Very High';
  if (confidence >= 0.8) return 'High';
  if (confidence >= 0.7) return 'Moderate';
  if (confidence >= 0.6) return 'Low';
  return 'Very Low';
};

/**
 * Format wound area for display
 * @param areaCm2 - Area in square centimeters
 * @returns Formatted area string
 */
export const formatWoundArea = (areaCm2: number): string => {
  if (areaCm2 < 1) {
    return `${(areaCm2 * 100).toFixed(1)} mm²`;
  }
  return `${areaCm2.toFixed(2)} cm²`;
};
