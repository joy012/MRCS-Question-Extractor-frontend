import { Download, Plus } from 'lucide-react';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
  useDeleteQuestion,
  useQuestionCategories,
  useQuestions,
  useQuestionStatistics,
  useUpdateQuestionStatus
} from '../../hooks/useQuestions';
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
  const questionsQuery = useQuestions({
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

  const { data: categories } = useQuestionCategories();
  const { data: questionStats } = useQuestionStatistics();
  const deleteMutation = useDeleteQuestion();
  const approveMutation = useUpdateQuestionStatus();
  const rejectMutation = useUpdateQuestionStatus();

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
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Questions Management</h1>
          <p className="text-muted-foreground">
            Browse, filter, and manage extracted questions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link to="/questions/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Link>
          </Button>
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
      <Card>
        <CardContent className='py-2'>
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