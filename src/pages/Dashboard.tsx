import {
  Activity,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  Download,
  FileText
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExtractionService } from '../api/extraction';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { useCategories } from '../hooks/useCategories';
import { useIntakes } from '../hooks/useIntakes';
import { useQuestionStatistics, useRecentQuestions } from '../hooks/useQuestions';

// Loading skeleton for stat cards
const StatCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-4 rounded" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-24" />
    </CardContent>
  </Card>
);

// Loading skeleton for activity items
const ActivitySkeleton = () => (
  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
    <Skeleton className="h-5 w-5 rounded-full" />
    <div className="flex-1">
      <Skeleton className="h-4 w-48 mb-1" />
      <Skeleton className="h-3 w-32" />
    </div>
    <Skeleton className="h-3 w-12" />
  </div>
);

const Dashboard = () => {
  // API hooks
  const { data: questionStats, isLoading: questionStatsLoading } = useQuestionStatistics();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: intakes } = useIntakes();
  const { data: recentQuestions, isLoading: recentLoading } = useRecentQuestions(5);

  // Extraction status state
  const [extractionStatus, setExtractionStatus] = useState<any>(null);
  const [isExtractionPolling, setIsExtractionPolling] = useState(false);

  // Calculate derived data
  const totalQuestions = questionStats?.total || 0;
  const approvedQuestions = questionStats?.byStatus?.approved || 0;
  const pendingQuestions = questionStats?.byStatus?.pending || 0;
  const rejectedQuestions = questionStats?.byStatus?.rejected || 0;
  const totalCategories = categories?.length || 0;
  const totalIntakes = intakes?.length || 0;

  // Calculate approval rate
  const approvalRate = totalQuestions > 0 ? ((approvedQuestions / totalQuestions) * 100).toFixed(1) : '0';

  // Poll extraction status
  useEffect(() => {
    const pollExtractionStatus = async () => {
      try {
        const status = await ExtractionService.getStatus();
        setExtractionStatus(status);

        // If extraction is running, start polling
        if (status.status === 'processing' && !isExtractionPolling) {
          setIsExtractionPolling(true);
        } else if (status.status !== 'processing' && isExtractionPolling) {
          setIsExtractionPolling(false);
        }
      } catch (error) {
        console.error('Failed to get extraction status:', error);
      }
    };

    // Initial poll
    pollExtractionStatus();

    // Set up polling interval
    const interval = setInterval(pollExtractionStatus, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, [isExtractionPolling]);

  // Get extraction status display
  const getExtractionStatusDisplay = () => {
    if (!extractionStatus) return { status: 'idle', text: 'No extraction', color: 'text-gray-500' };

    switch (extractionStatus.status) {
      case 'processing':
        return { status: 'processing', text: 'Extraction Running', color: 'text-blue-600' };
      case 'completed':
        return { status: 'completed', text: 'Extraction Complete', color: 'text-green-600' };
      case 'failed':
        return { status: 'failed', text: 'Extraction Failed', color: 'text-red-600' };
      default:
        return { status: 'idle', text: 'No extraction', color: 'text-gray-500' };
    }
  };

  const extractionStatusDisplay = getExtractionStatusDisplay();

  return (
    <div className="space-y-6 w-full">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          MRCS Question Extractor Dashboard
        </h1>
        <p className="text-muted-foreground">
          Monitor your question bank, track statistics, and manage your medical exam preparation data.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {/* Total Questions */}
        {questionStatsLoading ? (
          <StatCardSkeleton />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Questions</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalQuestions.toLocaleString()}</div>
              <p className="text-xs text-green-600">
                {approvedQuestions} approved
              </p>
            </CardContent>
          </Card>
        )}

        {/* Approval Rate */}
        {questionStatsLoading ? (
          <StatCardSkeleton />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approval Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvalRate}%</div>
              <p className="text-xs text-muted-foreground">
                {pendingQuestions} pending review
              </p>
            </CardContent>
          </Card>
        )}

        {/* Categories */}
        {categoriesLoading ? (
          <StatCardSkeleton />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalCategories}</div>
              <p className="text-xs text-muted-foreground">
                Active categories
              </p>
            </CardContent>
          </Card>
        )}

        {/* Extraction Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Extraction Status</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${extractionStatusDisplay.color}`}>
              {extractionStatusDisplay.status === 'processing' ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Running
                </div>
              ) : (
                extractionStatusDisplay.text
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {extractionStatusDisplay.status === 'processing' && extractionStatus?.selectedPdf
                ? `Processing ${extractionStatus.selectedPdf}`
                : 'No active extraction'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and navigation shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/questions">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Questions ({totalQuestions.toLocaleString()})
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/extraction">
                <FileText className="mr-2 h-4 w-4" />
                Extract PDF Questions
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/categories">
                <BarChart3 className="mr-2 h-4 w-4" />
                Manage Categories ({totalCategories})
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/intakes">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Intakes ({totalIntakes})
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              <Download className="mr-2 h-4 w-4" />
              Export Data (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        {/* Question Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Question Status Overview
            </CardTitle>
            <CardDescription>
              Current status of all questions in the database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {questionStatsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Approved</span>
                  </div>
                  <Badge variant="secondary">{approvedQuestions}</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Pending Review</span>
                  </div>
                  <Badge variant="secondary">{pendingQuestions}</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Rejected</span>
                  </div>
                  <Badge variant="secondary">{rejectedQuestions}</Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Questions
          </CardTitle>
          <CardDescription>
            Latest questions added to the database
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <ActivitySkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentQuestions?.data && recentQuestions.data.length > 0 ? (
                recentQuestions.data.map((question) => (
                  <div key={question._id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {question.question.substring(0, 100)}...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {question.categories?.map(cat => cat.name).join(', ')} • {question.year}
                      </p>
                    </div>
                    <Badge variant={question.status === 'approved' ? 'default' : 'secondary'}>
                      {question.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No questions found</p>
                  <p className="text-sm">Start extracting questions to see them here</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard; 