import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorInfo } from 'react';
import { AppProvider } from './contexts';
import { routes, RouteConfig } from './config/routes';
import { ScrollToTop, ProtectedRoute, ErrorBoundary } from './components';
import { initializeAuth } from './utils/authHelper';

function App() {
  // Initialize authentication on app startup
  React.useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <ErrorBoundary
      onError={(error: Error, errorInfo: ErrorInfo) => {
        console.error('Application error:', error, errorInfo);
        // You can add error reporting service here
      }}
    >
      <Router>
        <AppProvider>
          <ScrollToTop />
          <Routes>
            {routes.map((route: RouteConfig) => {
              // Check if this is a demo route that needs protection
              // Protect all demo routes to ensure users are redirected to main website when logged out
              const isProtectedDemoRoute = route.path.startsWith('/demo');

              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    isProtectedDemoRoute ? (
                      <ProtectedRoute>
                        <route.element />
                      </ProtectedRoute>
                    ) : (
                      <route.element />
                    )
                  }
                />
              );
            })}
          </Routes>
        </AppProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;