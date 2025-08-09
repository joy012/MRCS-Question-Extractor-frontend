import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Download,
  Filter,
  Plus,
  RotateCcw
} from 'lucide-react';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
  useDeleteQuestionMutation,
  useGetQuestionCategoriesQuery,
  useGetQuestionsQuery
} from '../../services/queries/useQuestions';
import { QuestionStatus, type Question } from '../../types';
import { CustomPagination } from './components/CustomPagination';
import { QuestionsFilters } from './components/QuestionsFilters';
import { QuestionsList } from './components/QuestionsList';
import { useQuestionsFilters } from './hooks/useQuestionsFilters';

const QuestionsPage = () => {
  // Custom hooks
  const { filterState, handlers } = useQuestionsFilters();
  const { searchTerm, statusFilter, categoryFilter, intakeFilter, yearFilter, confidenceFilter, explanationFilter, sortBy, sortOrder, currentPage, itemsPerPage, rephrasingFilter } = filterState;
  const { handleSearch, handleStatusFilter, handleCategoryFilter, handleIntakeFilter, handleYearFilter, handleExplanationFilter, handleSort, handleSortOrder, handlePageChange, handleResetFilters, handleRphrasingFilter } = handlers;

  // API hooks
  const questionsQuery = useGetQuestionsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: statusFilter === 'all' ? undefined : statusFilter.toUpperCase() as QuestionStatus,
    categories: categoryFilter !== 'all' ? [categoryFilter] : undefined,
    intake: intakeFilter !== 'all' ? intakeFilter : undefined,
    year: yearFilter !== 'all' ? parseInt(yearFilter) : undefined,
    explanation: explanationFilter !== 'all' ? (explanationFilter as 'with_explanation' | 'without_explanation') : undefined,
    rephrasing: rephrasingFilter !== 'all' ? (rephrasingFilter as 'with_rephrasing' | 'without_rephrasing') : undefined,
    sortBy,
    sortOrder
  });

  const { data: categories } = useGetQuestionCategoriesQuery();
  const deleteMutation = useDeleteQuestionMutation();

  // Handlers
  const handleEdit = useCallback((question: Question) => {
    // TODO: Implement edit modal
    console.log('Edit question:', question);
  }, []);

  const handleDelete = useCallback((questionId: string) => {
    deleteMutation.mutate(questionId);
  }, [deleteMutation]);

  const handleExport = useCallback(() => {
    // TODO: Implement export functionality
    console.log('Export questions');
  }, []);

  // Data
  const totalQuestions = questionsQuery.data?.pagination?.total || 0;
  const totalPages = questionsQuery.data?.pagination?.totalPages || 1;
  const questions = questionsQuery.data?.data || [];

  const actions = {
    onEdit: handleEdit,
    onDelete: handleDelete
  };

  // Count active filters
  const activeFiltersCount = [
    searchTerm,
    statusFilter !== 'all',
    categoryFilter !== 'all',
    intakeFilter !== 'all',
    yearFilter !== 'all',
    confidenceFilter !== 'all',
    explanationFilter !== 'all'
  ].filter(Boolean).length;

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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Questions Management
                </h1>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleExport}
                disabled
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

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100/50">
        <CardContent className='p-6'>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className='flex items-center gap-2'>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Filter className="h-4 w-4 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            </div>
            <div className="flex items-center justify-end gap-2">
              {activeFiltersCount > 0 && (
                <Badge variant="default" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-8 px-3 text-xs border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                >
                  <RotateCcw className="w-3 h-3 mr-1.5" />
                  Reset
                </Button>
              )}
            </div>
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
            explanationFilter={explanationFilter}
            onExplanationFilterChange={handleExplanationFilter}
            sortBy={sortBy}
            onSortChange={handleSort}
            sortOrder={sortOrder}
            onSortOrderChange={handleSortOrder}
            categories={categories || []}
            rephrasingFilter={rephrasingFilter}
            onRphrasingFilterChange={handleRphrasingFilter}
          />
        </CardContent>
      </Card>

      {/* Questions List */}
      <QuestionsList
        questions={questions as Question[]}
        isLoading={questionsQuery.isLoading}
        error={questionsQuery.error as Error | null}
        currentPage={currentPage}
        totalItems={totalQuestions}
        itemsPerPage={itemsPerPage}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onRetry={() => questionsQuery.refetch()}
        actions={actions}
      />
      {totalPages > 1 ? (
        <div className="bg-white border border-gray-200 rounded-lg py-3 px-10 shadow-sm">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalQuestions}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </div>
  );
};

export default QuestionsPage;