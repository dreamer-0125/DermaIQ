import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Database, 
  Server, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { enhancedMCPService } from '../demo/services/mcpService';
import { BackendHealthCheck } from '../types/analysis';

interface ConnectionStatusProps {
  className?: string;
}

interface ServiceStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'checking' | 'error';
  lastCheck: number;
  error?: string;
  details?: BackendHealthCheck;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Backend API', status: 'checking', lastCheck: 0 },
    { name: 'AI Services', status: 'checking', lastCheck: 0 },
  ]);

  const checkServiceStatus = async (serviceName: string): Promise<{ status: ServiceStatus['status']; details?: BackendHealthCheck; error?: string }> => {
    try {
      if (serviceName === 'Backend API' || serviceName === 'AI Services') {
        // Use the enhanced MCP service for health checks
        try {
          const isHealthy = await enhancedMCPService.checkHealth();
          if (isHealthy) {
            return { status: 'connected' };
          } else {
            return { status: 'error', error: `${serviceName} not healthy` };
          }
        } catch (error) {
          // console.warn(`${serviceName} health check failed:`, error);
          return { status: 'error', error: error instanceof Error ? error.message : 'Health check failed' };
        }
      }
      
      return { status: 'error' };
    } catch (error) {
      // console.warn(`Service check failed for ${serviceName}:`, error);
      return { status: 'error' };
    }
  };

  const updateServiceStatus = async (serviceName: string) => {
    setServices(prev => prev.map(service => 
      service.name === serviceName 
        ? { ...service, status: 'checking', lastCheck: Date.now() }
        : service
    ));

    const result = await checkServiceStatus(serviceName);
    
    setServices(prev => prev.map(service => 
      service.name === serviceName 
        ? { 
            ...service, 
            status: result.status, 
            lastCheck: Date.now(),
            error: result.status === 'error' ? 'Connection failed' : undefined,
            details: result.details
          }
        : service
    ));
  };

  useEffect(() => {
    // Initial check
    services.forEach(service => {
      updateServiceStatus(service.name);
    });

    // Periodic health checks every 30 seconds
    const interval = setInterval(() => {
      services.forEach(service => {
        updateServiceStatus(service.name);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-gray-400" />;
      case 'checking':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'disconnected':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'checking':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName) {
      case 'Backend API':
        return <Server className="w-4 h-4" />;
      case 'AI Services':
        return <Database className="w-4 h-4" />;
      default:
        return <Wifi className="w-4 h-4" />;
    }
  };

  const allConnected = services.every(service => service.status === 'connected');
  const anyError = services.some(service => service.status === 'error');

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Service Status</h3>
        <div className={`flex items-center space-x-1 ${
          allConnected ? 'text-green-600' : anyError ? 'text-red-600' : 'text-blue-600'
        }`}>
          {allConnected ? (
            <CheckCircle className="w-4 h-4" />
          ) : anyError ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          <span className="text-xs font-medium">
            {allConnected ? 'All Connected' : anyError ? 'Issues Detected' : 'Checking...'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {services.map((service) => (
          <div
            key={service.name}
            className={`flex items-center justify-between p-2 rounded-md border text-xs ${getStatusColor(service.status)}`}
          >
            <div className="flex items-center space-x-2">
              {getServiceIcon(service.name)}
              <span className="font-medium">{service.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              {getStatusIcon(service.status)}
              <span className="capitalize">{service.status}</span>
            </div>
          </div>
        ))}
      </div>

      {anyError && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-xs text-red-700">
            Some services are experiencing issues. The application will use fallback modes when possible.
          </p>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;

