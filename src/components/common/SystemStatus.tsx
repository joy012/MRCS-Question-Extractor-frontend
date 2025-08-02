import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

import { useValidateSystemQuery } from '@/services/queries/useExtraction';
import { Badge } from '../ui/badge';

export interface SystemStatusProps {
  showDetails?: boolean;
  className?: string;
}

export const SystemStatus = ({ showDetails = false, className = '' }: SystemStatusProps) => {

  const { data: systemValidation, isLoading: validationLoading } = useValidateSystemQuery();

  // Determine overall system status
  const getSystemStatus = () => {
    if (validationLoading) return 'loading';

    // Check system validation
    if (!systemValidation?.ready) return 'issues';

    return 'healthy';
  };

  const systemStatus = getSystemStatus();

  // Get status details
  const getStatusDetails = () => {
    switch (systemStatus) {
      case 'loading':
        return {
          icon: <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" />,
          label: 'Checking...',
          variant: 'secondary' as const,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };

      case 'healthy':
        return {
          icon: <CheckCircle className="w-3 h-3 text-green-600" />,
          label: 'System Active',
          variant: 'secondary' as const,
          color: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };



      case 'issues':
        return {
          icon: <AlertTriangle className="w-3 h-3 text-yellow-600" />,
          label: 'System Issues',
          variant: 'destructive' as const,
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
        };

      default:
        return {
          icon: <XCircle className="w-3 h-3 text-gray-600" />,
          label: 'Unknown',
          variant: 'secondary' as const,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  const statusDetails = getStatusDetails();



  if (showDetails) {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Overall System Status */}
        <div className={`flex items-center justify-between p-3 rounded-lg border ${statusDetails.bgColor} ${statusDetails.borderColor}`}>
          <div className="flex items-center gap-3">
            {statusDetails.icon}
            <div>
              <p className={`font-medium text-sm ${statusDetails.color}`}>
                {statusDetails.label}
              </p>
              <p className="text-xs text-gray-500">
                {systemStatus === 'healthy' ? 'All systems operational' : 'Check system configuration'}
              </p>
            </div>
          </div>
          <Badge variant={statusDetails.variant} className="text-xs">
            {systemStatus === 'healthy' ? 'Active' : systemStatus === 'loading' ? 'Checking' : 'Inactive'}
          </Badge>
        </div>



        {/* System Components */}
        {!validationLoading && systemValidation && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">PDF Access</span>
              <div className="flex items-center gap-2">
                {systemValidation.pdf?.valid ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-600" />
                )}
                <span className={systemValidation.pdf?.valid ? 'text-green-600' : 'text-red-600'}>
                  {systemValidation.pdf?.valid ? 'Available' : 'Not Found'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Ollama Service</span>
              <div className="flex items-center gap-2">
                {systemValidation.ollama?.healthy ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <XCircle className="w-3 h-3 text-red-600" />
                )}
                <span className={systemValidation.ollama?.healthy ? 'text-green-600' : 'text-red-600'}>
                  {systemValidation.ollama?.healthy ? 'Running' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Compact version for header/topbar
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusDetails.bgColor} ${statusDetails.borderColor} ${className}`}>
      {statusDetails.icon}
      <span className={`text-xs font-medium ${statusDetails.color}`}>
        {statusDetails.label}
      </span>
    </div>
  );
};

export default SystemStatus; 