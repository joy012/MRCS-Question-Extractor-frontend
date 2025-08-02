import {
  Activity,
  CheckCircle,
  Clock,
  FileText,
  Play,
  Square,
  XCircle,
  Zap
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ExtractionService } from '../api/extraction';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { ScrollArea } from '../components/ui/scroll-area';
import { useToast } from '../components/ui/toast';

// Real-time status component
const StatusIndicator = ({
  status
}: {
  isRunning: boolean;
  status: string;
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Idle';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="text-sm font-medium">
          {getStatusText()}
        </span>
      </div>
    </div>
  );
};

// Processing log component
const ProcessingLog = ({ logs }: { logs: string[] }) => {
  return (
    <ScrollArea className="h-96 w-full border rounded-md p-4">
      <div className="space-y-1">
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No logs available</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="text-xs font-mono text-muted-foreground">
              {log}
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};

// PDF selection component
const PdfSelection = ({
  pdfs,
  selectedPdf,
  onSelectPdf,
  onStartExtraction,
  isRunning
}: {
  pdfs: string[];
  selectedPdf: string;
  onSelectPdf: (pdf: string) => void;
  onStartExtraction: () => void;
  isRunning: boolean;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Select PDF for Extraction
        </CardTitle>
        <CardDescription>
          Choose a PDF file to extract questions from
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pdfs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No PDF files found</p>
            <p className="text-sm">Please add PDF files to the data folder</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pdfs.map((pdf) => (
                <div
                  key={pdf}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPdf === pdf
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                    }`}
                  onClick={() => onSelectPdf(pdf)}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium">{pdf}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onStartExtraction}
                disabled={!selectedPdf || isRunning}
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Extraction
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const ExtractionMonitor = () => {
  const [pdfs, setPdfs] = useState<string[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string>('');
  const [extractionStatus, setExtractionStatus] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const { addToast } = useToast();

  // Fetch PDFs on component mount
  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const pdfList = await ExtractionService.listPdfs();
        setPdfs(pdfList);
      } catch (error) {
        addToast({
          title: 'Error',
          description: 'Failed to fetch PDFs',
          type: 'error',
        });
      }
    };
    fetchPdfs();
  }, [addToast]);

  // Polling effect for real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPolling) {
      interval = setInterval(async () => {
        try {
          // Get status
          const status = await ExtractionService.getStatus();
          setExtractionStatus(status);

          // Get logs
          const logsData = await ExtractionService.getLogs();
          setLogs(logsData.logs);

          // Stop polling if extraction is completed or failed
          if (status.status === 'completed' || status.status === 'failed') {
            setIsPolling(false);
            addToast({
              title: 'Extraction Complete',
              description: `Extraction ${status.status === 'completed' ? 'completed successfully' : 'failed'}`,
              type: status.status === 'completed' ? 'success' : 'error',
            });
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, 2000); // Poll every 2 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPolling, addToast]);

  // Control functions
  const handleStartExtraction = useCallback(async () => {
    if (!selectedPdf) return;

    try {
      await ExtractionService.startExtraction(selectedPdf);
      setIsPolling(true);
      setLogs([]);
      addToast({
        title: 'Extraction Started',
        description: `Started extraction for ${selectedPdf}`,
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to start extraction',
        type: 'error',
      });
    }
  }, [selectedPdf, addToast]);

  const handleStopExtraction = useCallback(async () => {
    try {
      await ExtractionService.stopExtraction();
      setIsPolling(false);
      addToast({
        title: 'Extraction Stopped',
        description: 'Extraction has been stopped',
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to stop extraction',
        type: 'error',
      });
    }
  }, [addToast]);

  // Calculate derived data
  const isRunning = extractionStatus?.status === 'processing';
  const progressPercentage = extractionStatus?.progress || 0;
  const processedPages = extractionStatus?.processedPages || 0;
  const totalPages = extractionStatus?.totalPages || 0;
  const extractedQuestions = extractionStatus?.extractedQuestions || 0;

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Extract Questions</h1>
          <p className="text-muted-foreground">
            Extract questions from PDF files using AI
          </p>
        </div>
        <StatusIndicator isRunning={isRunning} status={extractionStatus?.status || 'idle'} />
      </div>

      {/* PDF Selection */}
      <PdfSelection
        pdfs={pdfs}
        selectedPdf={selectedPdf}
        onSelectPdf={setSelectedPdf}
        onStartExtraction={handleStartExtraction}
        isRunning={isRunning}
      />

      {/* Extraction Controls */}
      {isRunning && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Extraction Controls
            </CardTitle>
            <CardDescription>
              Control the extraction process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                onClick={handleStopExtraction}
                disabled={!isRunning}
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Extraction
              </Button>
              <Badge variant="default">
                {extractionStatus?.selectedPdf}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Overview */}
      {extractionStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Progress
              </CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {progressPercentage.toFixed(1)}%
              </div>
              <Progress value={progressPercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {processedPages} of {totalPages} pages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Questions Extracted
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {extractedQuestions.toLocaleString()}
              </div>
              <p className="text-xs text-green-600">
                Questions found
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Status
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground capitalize">
                {extractionStatus.status}
              </div>
              <p className="text-xs text-muted-foreground">
                Current state
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Processing Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Extraction Logs
          </CardTitle>
          <CardDescription>
            Real-time logs from the extraction process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProcessingLog logs={logs} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExtractionMonitor; 