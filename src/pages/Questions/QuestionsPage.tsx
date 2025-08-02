import {
  BookOpen,
  Download,
  Filter,
  Plus
} from 'lucide-react';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
  useDeleteQuestionMutation,
  useGetQuestionCategoriesQuery,
  useGetQuestionsQuery,
  useGetQuestionStatisticsQuery,
  useUpdateQuestionStatusMutation
} from '../../services/queries/useQuestions';
import { QuestionStatus } from '../../types';
import { QuestionsFilters } from './components/QuestionsFilters';
import { QuestionsList } from './components/QuestionsList';
import { QuestionsStats } from './components/QuestionsStats';
import { useQuestionsFilters } from './hooks/useQuestionsFilters';
import type { ExtendedQuestion } from './types';

const QuestionsPage = () => {
  // Custom hooks
  const { filterState, handlers } = useQuestionsFilters();
  const { searchTerm, statusFilter, categoryFilter, intakeFilter, yearFilter, sortBy, sortOrder, currentPage, itemsPerPage } = filterState;
  const { handleSearch, handleStatusFilter, handleCategoryFilter, handleIntakeFilter, handleYearFilter, handleSort, handleSortOrder, handlePageChange } = handlers;

  // API hooks
  const questionsQuery = useGetQuestionsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: statusFilter === 'all' ? undefined : statusFilter as QuestionStatus,
    categories: categoryFilter !== 'all' ? [categoryFilter] : undefined,
    intake: intakeFilter !== 'all' ? intakeFilter : undefined,
    year: yearFilter !== 'all' ? parseInt(yearFilter) : undefined,
    sortBy,
    sortOrder
  });

  const { data: categories } = useGetQuestionCategoriesQuery();
  const { data: questionStats } = useGetQuestionStatisticsQuery();
  const deleteMutation = useDeleteQuestionMutation();
  const approveMutation = useUpdateQuestionStatusMutation();
  const rejectMutation = useUpdateQuestionStatusMutation();

  // Handlers
  const handleEdit = useCallback((question: ExtendedQuestion) => {
    // TODO: Implement edit modal
    console.log('Edit question:', question);
  }, []);

  const handleDelete = useCallback((questionId: string) => {
    deleteMutation.mutate(questionId);
  }, [deleteMutation]);

  const handleApprove = useCallback((questionId: string) => {
    approveMutation.mutate({ id: questionId, status: QuestionStatus.APPROVED });
  }, [approveMutation]);

  const handleReject = useCallback((questionId: string) => {
    rejectMutation.mutate({ id: questionId, status: QuestionStatus.REJECTED });
  }, [rejectMutation]);

  const handleExport = useCallback(() => {
    // TODO: Implement export functionality
    console.log('Export questions');
  }, []);

  // Data
  const totalQuestions = questionsQuery.data?.meta?.total || 0;
  const totalPages = questionsQuery.data?.meta?.totalPages || 1;
  const questions = questionsQuery.data?.data || [];
  const verifiedCount = questionStats?.byStatus?.approved || 0;
  const pendingCount = questionStats?.byStatus?.pending || 0;

  const actions = {
    onEdit: handleEdit,
    onDelete: handleDelete,
    onApprove: handleApprove,
    onReject: handleReject
  };

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
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Questions Management
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Browse, filter, and manage extracted questions with advanced AI-powered insights
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleExport}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300 shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link to="/questions/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <QuestionsStats
        totalQuestions={totalQuestions}
        verifiedCount={verifiedCount}
        pendingCount={pendingCount}
        isLoading={questionsQuery.isLoading}
      />

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100/50">
        <CardContent className='p-6'>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Filter className="h-4 w-4 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
          </div>
          <QuestionsFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={handleCategoryFilter}
            intakeFilter={intakeFilter}
            onIntakeFilterChange={handleIntakeFilter}
            yearFilter={yearFilter}
            onYearFilterChange={handleYearFilter}
            sortBy={sortBy}
            onSortChange={handleSort}
            sortOrder={sortOrder}
            onSortOrderChange={handleSortOrder}
            categories={categories || []}
          />
        </CardContent>
      </Card>

      {/* Questions List */}
      <QuestionsList
        questions={questions as ExtendedQuestion[]}
        isLoading={questionsQuery.isLoading}
        error={questionsQuery.error as Error | null}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalQuestions}
        itemsPerPage={itemsPerPage}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onPageChange={handlePageChange}
        onRetry={() => questionsQuery.refetch()}
        actions={actions}
      />
    </div>
  );
};

export default QuestionsPage;