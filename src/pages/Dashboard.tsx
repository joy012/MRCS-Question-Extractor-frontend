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
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import {
  useGetCategoriesQuery
} from '../services/queries/useCategories';
import { useGetExtractionStatusQuery } from '../services/queries/useExtraction';
import { useGetIntakesQuery } from '../services/queries/useIntakes';
import {
  useGetQuestionStatisticsQuery,
  useGetRecentQuestionsQuery
} from '../services/queries/useQuestions';
import type { Question } from '../types/question';

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

// Loading skeleton for activity items
const ActivitySkeleton = () => (
  <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50">
    <Skeleton className="h-5 w-5 rounded-full" />
    <div className="flex-1">
      <Skeleton className="h-4 w-48 mb-1" />
      <Skeleton className="h-3 w-32" />
    </div>
    <Skeleton className="h-6 w-16 rounded-full" />
  </div>
);

const Dashboard = () => {
  // API hooks
  const { data: questionStats, isLoading: questionStatsLoading } = useGetQuestionStatisticsQuery();
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: intakes } = useGetIntakesQuery();
  const { data: recentQuestions, isLoading: recentLoading } = useGetRecentQuestionsQuery(5);
  const { data: extractionStatus } = useGetExtractionStatusQuery();

  // Calculate derived data
  const totalQuestions = questionStats?.total || 0;
  const approvedQuestions = questionStats?.byStatus?.approved || 0;
  const pendingQuestions = questionStats?.byStatus?.pending || 0;
  const rejectedQuestions = questionStats?.byStatus?.rejected || 0;
  const totalCategories = categories?.length || 0;
  const totalIntakes = intakes?.length || 0;

  // Calculate approval rate
  const approvalRate = totalQuestions > 0 ? ((approvedQuestions / totalQuestions) * 100).toFixed(1) : '0';

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
      case 'stopped':
        return { status: 'stopped', text: 'Extraction Stopped', color: 'text-yellow-600' };
      default:
        return { status: 'idle', text: 'No extraction', color: 'text-gray-500' };
    }
  };

  const extractionStatusDisplay = getExtractionStatusDisplay();

  return (
    <div className="space-y-8 w-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    MRCS Question Extractor
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Advanced medical exam preparation platform with AI-powered question extraction
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300 shadow-sm"
                asChild
              >
                <Link to="/extraction">
                  <FileText className="h-4 w-4 mr-2" />
                  Start Extraction
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                asChild
              >
                <Link to="/questions">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Questions
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {/* Total Questions */}
        {questionStatsLoading ? (
          <StatCardSkeleton />
        ) : (
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Total Questions</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-gray-900">{totalQuestions.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">
                {approvedQuestions} approved
              </p>
            </CardContent>
          </Card>
        )}

        {/* Approval Rate */}
        {questionStatsLoading ? (
          <StatCardSkeleton />
        ) : (
          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Approval Rate</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-green-600">{approvalRate}%</div>
              <p className="text-xs text-gray-500 mt-1">
                {pendingQuestions} pending review
              </p>
            </CardContent>
          </Card>
        )}

        {/* Categories */}
        {categoriesLoading ? (
          <StatCardSkeleton />
        ) : (
          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Categories</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-gray-900">{totalCategories}</div>
              <p className="text-xs text-gray-500 mt-1">
                Active categories
              </p>
            </CardContent>
          </Card>
        )}

        {/* Extraction Status */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Extraction Status</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
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
            <p className="text-xs text-gray-500 mt-1">
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
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                <CardDescription className="text-gray-600">
                  Common tasks and navigation shortcuts
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300" asChild>
              <Link to="/questions">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Questions ({totalQuestions.toLocaleString()})
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300" asChild>
              <Link to="/extraction">
                <FileText className="mr-2 h-4 w-4" />
                Extract PDF Questions
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300" asChild>
              <Link to="/categories">
                <BarChart3 className="mr-2 h-4 w-4" />
                Manage Categories ({totalCategories})
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300" asChild>
              <Link to="/intakes">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Intakes ({totalIntakes})
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300" disabled>
              <Download className="mr-2 h-4 w-4" />
              Export Data (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        {/* Question Status Overview */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Database className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Question Status Overview</CardTitle>
                <CardDescription className="text-gray-600">
                  Current status of all questions in the database
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {questionStatsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100/50 border border-green-200/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">Approved</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">{approvedQuestions}</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100/50 border border-yellow-200/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span className="font-medium text-gray-900">Pending Review</span>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">{pendingQuestions}</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-medium text-gray-900">Rejected</span>
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-800">{rejectedQuestions}</Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Questions */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Questions</CardTitle>
              <CardDescription className="text-gray-600">
                Latest questions added to the database
              </CardDescription>
            </div>
          </div>
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
                recentQuestions.data.map((question: Question) => (
                  <div key={question._id} className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 transition-all duration-200 hover:shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {question.question.substring(0, 100)}...
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {question.categories?.map((cat: any) => cat.name).join(', ')} • {question.year}
                      </p>
                    </div>
                    <Badge
                      variant={question.status === 'approved' ? 'default' : 'secondary'}
                      className={question.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {question.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="font-medium text-gray-900 mb-1">No questions found</p>
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