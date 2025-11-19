// Core Layout Components
export * from './layout';

// Feature-Specific Components
export { WoundAnalysis, WoundImageUpload, TreatmentPlan } from './features';

// Marketing/Landing Components
export * from './marketing';

// UI/Shared Components
export { LoadingState, ErrorState, EmptyState, FaviconIcon } from './ui';
// Export Section and PageHeader from layout only to avoid conflicts
export { Section, PageHeader } from './layout';

// Authentication Components
export * from './auth';

// Business Logic Components
export * from './business';

// Design System Components
export * from '../design-system/components';

// Utility Components
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as ScrollToTop } from './ScrollToTop';
export { default as ConnectionStatus } from './ConnectionStatus';

// Layout Components
export { default as Header } from './Header';
export { default as Footer } from './Footer';
