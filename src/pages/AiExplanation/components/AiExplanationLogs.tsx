import { Activity, AlertCircle, CheckCircle, Clock, Terminal } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';

interface AiExplanationLogsProps {
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
      {/* Awesome AI processing indicator */}
      <div className="bg-black/95 backdrop-blur-sm border border-green-500/50 rounded-lg p-3 text-center shadow-xl">
        <div className="text-green-400 text-xs font-mono mb-2">🤖 AI WORKING HARD</div>

        {/* Fun animated emojis */}
        <div className="flex justify-center space-x-1 mb-2">
          <div className="text-base animate-bounce">⚡</div>
          <div className="text-base animate-bounce" style={{ animationDelay: '200ms' }}>🤯</div>
          <div className="text-base animate-bounce" style={{ animationDelay: '400ms' }}></div>
        </div>

        <div className="text-green-400 text-xs">HANG TIGHT! 🎉</div>
      </div>
    </div>
  );
};

export const AiExplanationLogs: React.FC<AiExplanationLogsProps> = ({
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
  const isProcessing = status === 'processing';

  return (
    <div className="w-full">
      <Card className="border-0 shadow-2xl bg-black/95 backdrop-blur-sm relative overflow-hidden w-full">
        {/* Matrix Rain Effect */}
        <MatrixRain />

        {/* Fun Animations */}
        <ProcessingAnimation isProcessing={isProcessing} />

        <CardHeader className="pb-3 border-b border-gray-800 relative z-10 bg-black/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <Terminal className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-green-400 font-mono">AI_EXPLANATION_TERMINAL</h2>
              <p className="text-xs text-gray-400 font-mono">
                Terminal logs: {terminalLogs.length}
                {isRefetching && ' | 🔄 FETCHING NEW DATA...'}
                {status === 'processing' && ' | ⚡ PROCESSING...'}
                {status === 'stopped' && ' | ⏹️ STOPPED'}
                {status === 'failed' && ' | ❌ FAILED'}
                {status === 'completed' && ' | ✅ COMPLETED'}
                {status === 'idle' && ' | 💤 IDLE'}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status === 'processing' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
              <span className="text-xs font-mono">
                {isProcessing ? 'PROCESSING' :
                  isRefetching ? 'FETCHING' :
                    hasLogs ? 'LIVE' : 'IDLE'}
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
                url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%2300ff00" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>'),
                radial-gradient(circle at 20% 50%, rgba(0, 255, 0, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(0, 255, 255, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(255, 0, 255, 0.08) 0%, transparent 50%),
                linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 20, 0, 0.8) 100%)
              `
            }}
          >
            {/* Terminal Header */}
            <div className="mb-4 text-green-400 text-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-500">root@ai-terminal:~$</span>
                <span>{hasLogs ? 'tail -f ai_explanation.logs' : 'echo "No logs available"'}</span>
              </div>
              <div className="text-gray-500 border-b border-gray-700 pb-2">
                === 🤖 AI EXPLANATION PROCESSING TERMINAL ===
                <br />
                {hasLogs ? (
                  <span className="text-green-400">[INFO]</span>
                ) : (
                  <span className="text-yellow-400">[IDLE]</span>
                )} {hasLogs ? 'Monitoring AI explanation generation...' : 'Terminal ready. No AI explanation process started.'}
                {isRefetching && (
                  <span className="text-blue-400 ml-2">[FETCHING] 📡 New logs incoming... ⚡</span>
                )}
                {isProcessing && (
                  <span className="text-green-400 ml-2">[PROCESSING] 🤖 AI is working hard! 🚀</span>
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
                    <Terminal className="h-8 w-8 mx-auto text-gray-600 mb-2" />
                  </div>
                  <div className="text-gray-400 font-mono">
                    No logs available
                  </div>
                  <div className="text-gray-600 text-xs mt-1">
                    Start AI explanation process to see logs here
                  </div>
                </div>
              )}
            </div>

            {/* Status Messages */}
            {status === 'processing' && (
              <div className="mt-2 text-blue-400 text-xs animate-pulse">
                [PROCESSING] 🤖 Generating AI explanations... ⚡
              </div>
            )}

            {status === 'completed' && (
              <div className="mt-2 text-green-400 text-xs">
                [COMPLETED] ✅ AI explanation process finished! 🎉
              </div>
            )}

            {status === 'stopped' && (
              <div className="mt-2 text-yellow-400 text-xs">
                [STOPPED] ⏹️ AI explanation process was stopped
              </div>
            )}

            {status === 'failed' && (
              <div className="mt-2 text-red-400 text-xs">
                [FAILED] ❌ AI explanation process failed 😢
              </div>
            )}

            {status === 'idle' && (
              <div className="mt-2 text-yellow-400 text-xs">
                [IDLE] 💤 AI explanation process not yet started
              </div>
            )}

            {/* Enhanced background effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* Scan lines effect */}
              <div className="absolute inset-0 opacity-5">
                <div className="h-full bg-gradient-to-b from-transparent via-green-500/10 to-transparent bg-[length:100%_4px] animate-pulse"></div>
              </div>

              {/* Corner glitch effect */}
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-green-500/20"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-green-500/20"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 