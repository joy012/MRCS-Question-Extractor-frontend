import type { Question } from '@/types';
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import { EmptyState } from '../../../components/common/EmptyState';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';
import type { QuestionActions } from '../types';
import { QuestionCard } from './QuestionCard';

// Skeleton loader for questions grid
const QuestionsGridSkeleton = () => (
  <div className="space-y-4">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-16" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-28" />
              </div>
              <Skeleton className="h-16 w-full" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, j) => (
                  <Skeleton key={j} className="h-8 w-full" />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Error state component
const QuestionsError = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100/50">
    <CardContent className="pt-6">
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load questions</h3>
        <p className="text-sm text-red-600 mb-4">{error.message}</p>
        <Button
          variant="outline"
          onClick={onRetry}
          className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Empty state component
const QuestionsEmpty = ({ searchTerm, statusFilter }: { searchTerm: string; statusFilter: string }) => (
  <EmptyState
    icon={BookOpen}
    title="No questions found"
    description={
      searchTerm || statusFilter !== 'all'
        ? "Try adjusting your filters or search terms"
        : "Start extracting questions from the PDF to see them here"
    }
    action={{
      label: "Start Extraction",
      onClick: () => window.location.href = "/extraction"
    }}
  />
);

interface QuestionsListProps {
  questions: Question[];
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  searchTerm: string;
  statusFilter: string;
  onRetry: () => void;
  actions: QuestionActions;
}

export const QuestionsList = ({
  questions,
  isLoading,
  error,
  currentPage,
  totalItems,
  itemsPerPage,
  searchTerm,
  statusFilter,
  onRetry,
  actions
}: QuestionsListProps) => {
  if (isLoading) {
    return <QuestionsGridSkeleton />;
  }

  if (error) {
    return <QuestionsError error={error} onRetry={onRetry} />;
  }

  if (questions.length === 0) {
    return <QuestionsEmpty searchTerm={searchTerm} statusFilter={statusFilter} />;
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Question Results</h3>
            <p className="text-sm text-gray-500">
              Showing {questions.length} of {totalItems} questions
            </p>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            onEdit={actions.onEdit}
            onDelete={actions.onDelete}
            onApprove={actions.onApprove}
            onReject={actions.onReject}
            serialNumber={(currentPage - 1) * itemsPerPage + index + 1}
          />
        ))}
      </div>
    </div>
  );
}; 