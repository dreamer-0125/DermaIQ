import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { networkTester, NetworkTestResult } from './networkTest';

interface NetworkDebugPanelProps {
  className?: string;
}

const NetworkDebugPanel: React.FC<NetworkDebugPanelProps> = ({ className = '' }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<NetworkTestResult[]>([]);
  const [networkInfo, setNetworkInfo] = useState<any>(null);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      const testResults = await networkTester.runAllTests();
      setResults(testResults);
      setNetworkInfo(networkTester.getNetworkInfo());
    } catch (error) {
      // console.error('Network tests failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getTestIcon = (result: NetworkTestResult) => {
    if (result.success) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getTestColor = (result: NetworkTestResult) => {
    if (result.success) {
      return 'border-green-200 bg-green-50';
    } else {
      return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wifi className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Network Diagnostics</h3>
        </div>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Testing...' : 'Run Tests'}</span>
        </button>
      </div>

      {/* Network Info */}
      {networkInfo && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Network Information</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Status: <span className={navigator.onLine ? 'text-green-600' : 'text-red-600'}>{navigator.onLine ? 'Online' : 'Offline'}</span></div>
            <div>Backend URL: <code className="bg-gray-200 px-1 rounded">{networkInfo.backendUrl}</code></div>
            <div>Current URL: <code className="bg-gray-200 px-1 rounded">{networkInfo.currentUrl}</code></div>
            {networkInfo.connection && networkInfo.connection !== 'Not available' && (
              <div>Connection: {networkInfo.connection.effectiveType} ({networkInfo.connection.downlink}Mbps)</div>
            )}
          </div>
        </div>
      )}

      {/* Test Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Test Results</h4>
          {results.map((result, index) => (
            <div key={index} className={`border rounded-lg p-3 ${getTestColor(result)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getTestIcon(result)}
                  <span className="font-medium text-gray-900">{result.test}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {result.responseTime && `${result.responseTime}ms`}
                </div>
              </div>
              
              {result.error && (
                <div className="text-sm text-red-600 mb-2">
                  <strong>Error:</strong> {result.error}
                </div>
              )}
              
              {result.details && (
                <details className="text-sm text-gray-600">
                  <summary className="cursor-pointer hover:text-gray-800">Details</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Status */}
      {results.length === 0 && !isRunning && (
        <div className="text-center py-8 text-gray-500">
          <WifiOff className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>Click "Run Tests" to diagnose network connectivity issues</p>
        </div>
      )}

      {/* Summary */}
      {results.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Summary</span>
          </div>
          <div className="text-sm text-blue-800">
            {results.filter(r => r.success).length} of {results.length} tests passed
            {results.filter(r => !r.success).length > 0 && (
              <div className="mt-1">
                <strong>Issues found:</strong>
                <ul className="list-disc list-inside mt-1">
                  {results.filter(r => !r.success).map((result, index) => (
                    <li key={index}>{result.test}: {result.error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkDebugPanel;
