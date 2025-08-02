import { Activity, AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { ScrollArea } from '../../../components/ui/scroll-area';

interface ExtractionLogsProps {
  logs: string[];
  isProcessing: boolean;
}

export const ExtractionLogs: React.FC<ExtractionLogsProps> = ({
  logs,
  isProcessing
}) => {
  // Only show logs when processing and logs exist
  if (!isProcessing || !logs || logs.length === 0) {
    return null;
  }

  const getLogIcon = (log: string) => {
    if (log.includes('Error') || log.includes('Failed')) {
      return <AlertCircle className="h-3 w-3 text-red-500" />;
    }
    if (log.includes('Completed') || log.includes('Success')) {
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    }
    if (log.includes('Processing') || log.includes('Starting')) {
      return <Activity className="h-3 w-3 text-blue-500" />;
    }
    return <Clock className="h-3 w-3 text-gray-500" />;
  };

  const getLogColor = (log: string) => {
    if (log.includes('Error') || log.includes('Failed')) {
      return 'border-red-200 bg-red-50';
    }
    if (log.includes('Completed') || log.includes('Success')) {
      return 'border-green-200 bg-green-50';
    }
    if (log.includes('Processing') || log.includes('Starting')) {
      return 'border-blue-200 bg-blue-50';
    }
    return 'border-gray-200 bg-gray-50';
  };

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Live Activity Logs</h2>
          <p className="text-xs text-gray-600">Real-time extraction activity monitoring</p>
        </div>
      </div>

      {/* Compact Logs Container */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center">
                <Activity className="h-3 w-3 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Activity Stream
                </CardTitle>
                <p className="text-xs text-gray-600">
                  {logs.length} log entries • Live monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Live</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="h-60">
            <div className="space-y-2 pr-4">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 p-2 rounded-lg border ${getLogColor(log)} backdrop-blur-sm transition-all duration-200 hover:shadow-sm`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getLogIcon(log)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-gray-800 leading-tight">
                      {log}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
                      <span className="text-xs text-gray-500">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Compact Log Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
                <Activity className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">{logs.length}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-3 w-3 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">
                  {logs.filter(log => log.includes('Success') || log.includes('Completed')).length}
                </div>
                <div className="text-xs text-gray-600">Success</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="h-3 w-3 text-red-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">
                  {logs.filter(log => log.includes('Error') || log.includes('Failed')).length}
                </div>
                <div className="text-xs text-gray-600">Errors</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 