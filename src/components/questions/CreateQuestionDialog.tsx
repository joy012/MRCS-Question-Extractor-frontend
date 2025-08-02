import React from 'react';
import type { Category, Intake } from '../../types/question';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { QuestionForm } from './QuestionForm/QuestionForm';
import type { QuestionFormData } from './QuestionForm/types';

interface CreateQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: QuestionFormData) => void;
  categories: Category[];
  intakes: Intake[];
  submitting: boolean;
}

export const CreateQuestionDialog: React.FC<CreateQuestionDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  categories,
  intakes,
  submitting,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Question</DialogTitle>
          <DialogDescription>
            Add a new question to the MRCS question bank.
          </DialogDescription>
        </DialogHeader>
        <QuestionForm
          onSubmit={onSubmit}
          categories={categories}
          intakes={intakes}
          isEdit={false}
          isLoading={submitting}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="question-form" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Question'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 