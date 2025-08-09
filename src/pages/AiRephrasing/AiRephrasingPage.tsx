import {
  Activity,
  AlertCircle,
  BarChart3,
  Brain,
  CheckCircle,
  FileText,
  Play,
  Sparkles,
  Square,
  Target,
  Timer,
  TrendingUp
} from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Skeleton } from '../../components/ui/skeleton';
import {
  useGetAiRephrasingLogsQuery,
  useGetAiRephrasingStatisticsQuery,
  useGetAiRephrasingStatusQuery,
  useStartAiRephrasingMutation,
  useStopAiRephrasingMutation
} from '../../services/queries/useAiRephrasing';
import { AiRephrasingLogs } from './components/AiRephrasingLogs';

// Loading skeleton for stat cards
const StatCardSkeleton = () => (
  <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100/50">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-4 w-24" />
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-24" />
    </CardContent>
  </Card>
);

const AiRephrasingPage = () => {
  // API hooks
  const { data: status } = useGetAiRephrasingStatusQuery();
  const { data: statistics, isLoading: statisticsLoading } = useGetAiRephrasingStatisticsQuery(status?.status === 'processing');
  const { data: logs, isFetching: logsFetching } = useGetAiRephrasingLogsQuery(status?.status === 'processing');

  // Mutations
  const startMutation = useStartAiRephrasingMutation();
  const stopMutation = useStopAiRephrasingMutation();

  // Calculate derived data
  const isProcessing = status?.status === 'processing';
  const progress = statistics?.rephrasingCoverage
    || 0;
  const estimatedTimeRemaining = status?.estimatedTimeRemaining || 0;

  // Format time remaining
  const formatTimeRemaining = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`;
  };

  // Format time since last rephrasing
  const formatTimeSince = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const last = new Date(timestamp);
    const diffMs = now.getTime() - last.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  // Get status display
  const getStatusDisplay = () => {
    if (!status) return { status: 'idle', text: 'Not Started', color: 'text-gray-500', bgColor: 'bg-gray-100' };

    switch (status.status) {
      case 'processing':
        return { status: 'processing', text: 'Processing', color: 'text-blue-600', bgColor: 'bg-blue-100' };
      case 'completed':
        return { status: 'completed', text: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100' };
      case 'stopped':
        return { status: 'stopped', text: 'Stopped', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      case 'failed':
        return { status: 'failed', text: 'Failed', color: 'text-red-600', bgColor: 'bg-red-100' };
      default:
        return { status: 'idle', text: 'Idle', color: 'text-gray-500', bgColor: 'bg-gray-100' };
    }
  };

  const statusDisplay = getStatusDisplay();

  const handleStartRephrasing = () => {
    startMutation.mutate({ model: 'llama3.1' });
  };

  const handleStopRephrasing = () => {
    stopMutation.mutate();
  };

  return (
    <div className="space-y-8 w-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border border-purple-100/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  AI Question Rephrasing
                </h1>
              </div>
            </div>

            <div className="flex gap-3">
              {isProcessing ? (
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/80 backdrop-blur-sm border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm"
                  onClick={handleStopRephrasing}
                  disabled={stopMutation.isPending}
                >
                  <Square className="h-4 w-4 mr-2" />
                  {stopMutation.isPending ? 'Stopping...' : 'Stop Processing'}
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={handleStartRephrasing}
                  disabled={startMutation.isPending}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {startMutation.isPending ? 'Starting...' : 'Start AI Rephrasing'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {isProcessing && (
        <Alert className="border-blue-200 bg-blue-50/50">
          <Activity className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            AI rephrasing process is running. Processing {status?.processedQuestions || 0} of {status?.totalQuestions || 0} questions.
            {estimatedTimeRemaining > 0 && (
              <span className="ml-2 font-medium">
                Estimated time remaining: {formatTimeRemaining(estimatedTimeRemaining)}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {/* Total Questions */}
        {statisticsLoading ? (
          <StatCardSkeleton />
        ) : (
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Total Questions</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-gray-900">
                {statistics?.totalQuestions?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-blue-600 mt-1">
                In database
              </p>
            </CardContent>
          </Card>
        )}

        {/* Questions with Rephrased Titles */}
        {statisticsLoading ? (
          <StatCardSkeleton />
        ) : (
          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Rephrased</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-green-600">
                {statistics?.questionsWithRephrasedTitle?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-green-600 mt-1">
                {statistics?.rephrasingCoverage ? `${statistics.rephrasingCoverage.toFixed(1)}%` : '0%'} coverage
              </p>
            </CardContent>
          </Card>
        )}

        {/* Questions without Rephrased Titles */}
        {statisticsLoading ? (
          <StatCardSkeleton />
        ) : (
          <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Need Rephrasing</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-orange-600">
                {statistics?.questionsWithoutRephrasedTitle?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-orange-600 mt-1">
                Pending AI processing
              </p>
            </CardContent>
          </Card>
        )}

        {/* Processing Status */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">AI Status</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-2xl font-bold ${statusDisplay.color}`}>
              {statusDisplay.status === 'processing' ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  Active
                </div>
              ) : (
                statusDisplay.text
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1 capitalize">
              {status?.model || 'Llama3.1'} model
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      {isProcessing && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Processing Progress</CardTitle>
                <CardDescription className="text-gray-600">
                  AI rephrasing generation in progress
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">{progress.toFixed(1)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{status?.processedQuestions || 0}</div>
                <div className="text-xs text-gray-500">Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{status?.skippedQuestions || 0}</div>
                <div className="text-xs text-gray-500">Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{status?.failedQuestions || 0}</div>
                <div className="text-xs text-gray-500">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">AI Rephrasing Management</CardTitle>
              <CardDescription className="text-gray-600">
                Monitor and manage AI-powered question rephrasing
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Real-time AI Data */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Real-time AI Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {statisticsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-indigo-100/50 border border-indigo-200/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Timer className="h-4 w-4 text-indigo-600" />
                        <span className="font-medium text-gray-900">Last Rephrasing</span>
                      </div>
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                        {formatTimeSince(statistics?.lastRephrasingAdded)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Target className="h-4 w-4 text-emerald-600" />
                        <span className="font-medium text-gray-900">Processing Rate</span>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                        {isProcessing ? 'Active' : 'Idle'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-4 w-4 text-amber-600" />
                        <span className="font-medium text-gray-900">Success Rate</span>
                      </div>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        {statistics?.successRate ? `${Math.round(statistics.successRate)}%` : '100%'}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Live Logs */}
            <AiRephrasingLogs logs={logs?.logs || []} status={status?.status} isRefetching={logsFetching} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AiRephrasingPage;
