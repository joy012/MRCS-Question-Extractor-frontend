import { Activity, AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';

interface ExtractionLogsProps {
  logs: string[];
  isProcessing: boolean;
  status?: 'idle' | 'processing' | 'completed' | 'failed' | 'stopped';
}

interface TerminalLog {
  id: string;
  text: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'processing';
  timestamp: string;
  originalIndex: number;
}

// Enhanced Matrix Rain Effect Component
const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");

    const fontSize = 12;
    const columns = canvas.width / fontSize;

    const drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px 'Courier New', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
      style={{ zIndex: 1 }}
    />
  );
};


// Fun Processing Animation Component
const ProcessingAnimation: React.FC<{ isProcessing: boolean }> = ({ isProcessing }) => {
  if (!isProcessing) return null;

  return (
    <div className="absolute bottom-4 right-4 z-20">
      {/* Awesome extraction processing indicator */}
      <div className="bg-black/95 backdrop-blur-sm border border-blue-500/50 rounded-lg p-3 text-center shadow-xl">
        <div className="text-blue-400 text-xs font-mono mb-2">📄 EXTRACTION AI WORKING HARD</div>

        {/* Fun animated emojis */}
        <div className="flex justify-center space-x-1 mb-2">
          <div className="text-base animate-bounce">📄</div>
          <div className="text-base animate-bounce" style={{ animationDelay: '200ms' }}>🔍</div>
          <div className="text-base animate-bounce" style={{ animationDelay: '400ms' }}>⚡</div>
        </div>

        <div className="text-blue-400 text-xs">HANG TIGHT! 🎉</div>
      </div>
    </div>
  );
};

export const ExtractionLogs: React.FC<ExtractionLogsProps> = ({
  logs,
  isProcessing,
  status = 'idle',
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
      case 'processing':
        return <Activity className="h-3 w-3 text-blue-400 animate-pulse" />;
      case 'warning':
        return <AlertCircle className="h-3 w-3 text-yellow-400" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  // Show terminal even when no logs exist
  const hasLogs = logs && logs.length > 0;

  // Get status display info
  const getStatusDisplay = () => {
    switch (status) {
      case 'processing':
        return { text: 'PROCESSING', color: 'bg-blue-500', indicatorColor: 'bg-blue-500' };
      case 'completed':
        return { text: 'COMPLETED', color: 'bg-green-500', indicatorColor: 'bg-green-500' };
      case 'failed':
        return { text: 'FAILED', color: 'bg-red-500', indicatorColor: 'bg-red-500' };
      case 'stopped':
        return { text: 'STOPPED', color: 'bg-yellow-500', indicatorColor: 'bg-yellow-500' };
      default:
        return { text: 'IDLE', color: 'bg-yellow-500', indicatorColor: 'bg-yellow-500' };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="w-full">
      <Card className="border-0 shadow-2xl bg-black/95 backdrop-blur-sm relative overflow-hidden w-full">
        {/* Matrix Rain Effect */}
        <MatrixRain />

        {/* Fun Animations */}
        <ProcessingAnimation isProcessing={isProcessing} />

        <CardHeader className="pb-3 border-b border-gray-800 relative z-10 bg-black/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-blue-400 font-mono">EXTRACTION_TERMINAL</h2>
              <p className="text-xs text-gray-400 font-mono">
                Terminal logs: {terminalLogs.length}
                {status === 'processing' && ' | ⚡ PROCESSING...'}
                {status === 'completed' && ' | ✅ COMPLETED'}
                {status === 'failed' && ' | ❌ FAILED'}
                {status === 'stopped' && ' | ⏹️ STOPPED'}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusDisplay.indicatorColor} ${status === 'processing' ? 'animate-pulse' : ''}`}></div>
              <span className="text-xs font-mono">
                {statusDisplay.text}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 p-0 relative z-10">
          <div
            ref={scrollRef}
            className="h-96 overflow-y-auto bg-black/90 p-4 font-mono text-sm relative"
            style={{
              backgroundImage: `
                url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%230000ff" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>'),
                radial-gradient(circle at 20% 50%, rgba(0, 0, 255, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(128, 0, 255, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(0, 255, 255, 0.08) 0%, transparent 50%),
                linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 20, 0.8) 100%)
              `
            }}
          >
            {/* Terminal Header */}
            <div className="mb-4 text-blue-400 text-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-500">root@extraction-terminal:~$</span>
                <span>{hasLogs ? 'tail -f extraction.logs' : 'echo "No logs available"'}</span>
              </div>
              <div className="text-gray-500 border-b border-gray-700 pb-2">
                === 📄 PDF EXTRACTION PROCESSING TERMINAL ===
                <br />
                {hasLogs ? (
                  <span className="text-blue-400">[INFO]</span>
                ) : (
                  <span className="text-yellow-400">[IDLE]</span>
                )} {hasLogs ? 'Monitoring PDF extraction process...' : 'Terminal ready. No extraction process started.'}
                {status === 'processing' && (
                  <span className="text-blue-400 ml-2">[PROCESSING] 📄 PDF extraction in progress! 🚀</span>
                )}
                {status === 'completed' && (
                  <span className="text-green-400 ml-2">[COMPLETED] ✅ PDF extraction finished! 🎉</span>
                )}
                {status === 'failed' && (
                  <span className="text-red-400 ml-2">[FAILED] ❌ PDF extraction failed! 😢</span>
                )}
                {status === 'stopped' && (
                  <span className="text-yellow-400 ml-2">[STOPPED] ⏹️ PDF extraction was stopped</span>
                )}
              </div>
            </div>

            {/* Logs */}
            <div className="space-y-1">
              {hasLogs ? (
                terminalLogs.slice().reverse().map((log, index) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-2 p-1 rounded transition-all duration-200 hover:bg-gray-900/50"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getLogIcon(log.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs font-mono">
                          [{new Date(log.timestamp).toLocaleTimeString()}]
                        </span>
                        <span className="text-gray-600 text-xs">#{index + 1}</span>
                      </div>
                      <div className={`${getLogColor(log.type)} leading-relaxed`}>
                        {log.text}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm py-8 text-center">
                  <div className="mb-2">
                    <FileText className="h-8 w-8 mx-auto text-gray-600 mb-2" />
                  </div>
                  <div className="text-gray-400 font-mono">
                    No logs available
                  </div>
                  <div className="text-gray-600 text-xs mt-1">
                    Start extraction process to see logs here
                  </div>
                </div>
              )}
            </div>

            {/* Status Messages */}
            {status === 'processing' && (
              <div className="mt-2 text-blue-400 text-xs animate-pulse">
                [PROCESSING] 📄 Extracting questions from PDF... ⚡
              </div>
            )}

            {status === 'completed' && (
              <div className="mt-2 text-green-400 text-xs">
                [COMPLETED] ✅ PDF extraction process finished! 🎉
              </div>
            )}

            {status === 'stopped' && (
              <div className="mt-2 text-yellow-400 text-xs">
                [STOPPED] ⏹️ PDF extraction process was stopped
              </div>
            )}

            {status === 'failed' && (
              <div className="mt-2 text-red-400 text-xs">
                [FAILED] ❌ PDF extraction process failed 😢
              </div>
            )}

            {status === 'idle' && (
              <div className="mt-2 text-yellow-400 text-xs">
                [IDLE] 💤 PDF extraction process not yet started
              </div>
            )}

            {/* Enhanced background effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* Scan lines effect */}
              <div className="absolute inset-0 opacity-5">
                <div className="h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent bg-[length:100%_4px] animate-pulse"></div>
              </div>

              {/* Corner glitch effect */}
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-blue-500/20"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-blue-500/20"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 