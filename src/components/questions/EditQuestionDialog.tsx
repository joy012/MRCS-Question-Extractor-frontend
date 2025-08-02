import React from 'react';
import type { Category, Intake, Question } from '../../types/question';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { QuestionForm } from './QuestionForm/QuestionForm';
import type { QuestionFormData } from './QuestionForm/types';

interface EditQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: Question;
  categories: Category[];
  intakes: Intake[];
  onSubmit: (data: QuestionFormData) => void;
  submitting: boolean;
}

export const EditQuestionDialog: React.FC<EditQuestionDialogProps> = ({
  open,
  onOpenChange,
  question,
  categories,
  intakes,
  onSubmit,
  submitting,
}) => {
  const defaultValues: QuestionFormData = {
    question: question.question,
    options: question.options,
    correctAnswer: question.correctAnswer as 'A' | 'B' | 'C' | 'D' | 'E',
    description: question.description || '',
    year: question.year,
    intake: question.intake.id,
    categories: question.categories.map(cat => cat.id),
    explanation: question.explanation || '',
    status: question.status as 'PENDING' | 'APPROVED' | 'REJECTED',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
          <DialogDescription>
            Update the question information.
          </DialogDescription>
        </DialogHeader>
        <QuestionForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          categories={categories}
          intakes={intakes}
          isEdit={true}
          isLoading={submitting}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="question-form" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Question'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 