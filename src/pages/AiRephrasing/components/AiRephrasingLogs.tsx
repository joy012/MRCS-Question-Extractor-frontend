import { Activity, AlertCircle, CheckCircle, Clock, Terminal } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';

interface AiRephrasingLogsProps {
  logs: string[];
  maxHeight?: string;
  status?: 'idle' | 'processing' | 'completed' | 'stopped' | 'failed';
  isRefetching?: boolean;
}

interface TerminalLog {
  id: string;
  text: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'processing';
  timestamp: string;
  originalIndex: number;
}

const AiRephrasingLogs: React.FC<AiRephrasingLogsProps> = ({
  logs,
  status = 'idle',
  isRefetching = false,
}) => {
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Convert logs to terminal format
  useEffect(() => {
    if (!logs || logs.length === 0) {
      setTerminalLogs([]);
      return;
    }

    // Convert all logs to terminal format immediately
    const terminalLogsData = logs.map((logText, index) => {
      const type = getLogType(logText);
      return {
        id: `log-${index}`,
        text: logText,
        type,
        timestamp: new Date().toISOString(),
        originalIndex: index
      };
    });

    setTerminalLogs(terminalLogsData);
  }, [logs]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      setTerminalLogs([]);
    };
  }, []);

  const getLogType = (log: string): 'info' | 'success' | 'error' | 'warning' | 'processing' => {
    if (log.includes('Error') || log.includes('Failed')) return 'error';
    if (log.includes('Completed') || log.includes('Success')) return 'success';
    if (log.includes('Processing') || log.includes('Starting')) return 'processing';
    if (log.includes('Warning') || log.includes('Skipped')) return 'warning';
    return 'info';
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'processing':
        return 'text-blue-400';
      default:
        return 'text-gray-300';
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-400" />;
      case 'success':
        return <CheckCircle className="h-3 w-3 text-green-400" />;
      case 'warning':
        return <AlertCircle className="h-3 w-3 text-yellow-400" />;
      case 'processing':
        return <Activity className="h-3 w-3 text-blue-400" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-gray-600" />
            <h3 className="text-base font-semibold text-gray-900">AI Rephrasing Logs</h3>
          </div>
          <div className="flex items-center gap-2">
            {isRefetching && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Live
              </div>
            )}
            <div className="text-xs text-gray-500">
              {terminalLogs.length} entries
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          ref={scrollRef}
          className="bg-gray-900 rounded-lg p-4 font-mono text-sm h-96 overflow-y-auto"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          }}
        >
          {terminalLogs.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No logs available</p>
              <p className="text-xs mt-1">
                {status === 'processing' ? 'Logs will appear here as processing continues...' : 'Start AI rephrasing to see logs'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {terminalLogs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start gap-2 ${getLogColor(log.type)}`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="whitespace-pre-wrap break-words">
                      {log.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { AiRephrasingLogs };
