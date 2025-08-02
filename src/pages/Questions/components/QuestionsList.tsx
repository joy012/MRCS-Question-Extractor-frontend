import { BookOpen, FileText } from 'lucide-react';
import { EmptyState } from '../../../components/common/EmptyState';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';
import type { ExtendedQuestion, QuestionActions } from '../types';
import { Pagination } from './Pagination';
import { QuestionCard } from './QuestionCard';

// Skeleton loader for questions grid
const QuestionsGridSkeleton = () => (
  <div className="space-y-4">
    {[...Array(6)].map((_, i) => (
      <Card key={i}>
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
  <Card>
    <CardContent className="pt-6">
      <div className="text-center py-8">
        <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground mb-2">Failed to load questions</p>
        <p className="text-sm text-destructive">{error.message}</p>
        <Button
          variant="outline"
          onClick={onRetry}
          className="mt-4"
        >
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
  questions: ExtendedQuestion[];
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  searchTerm: string;
  statusFilter: string;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  actions: QuestionActions;
}

export const QuestionsList = ({
  questions,
  isLoading,
  error,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  searchTerm,
  statusFilter,
  onPageChange,
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
    <div>
      {/* Pagination - Always visible at top */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuestionCard
            key={question._id}
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