import { AlertTriangle } from 'lucide-react';
import React from 'react';
import type { Question } from '../../types/question';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

interface DeleteQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: Question | null;
  onSubmit: () => void;
  submitting: boolean;
}

export const DeleteQuestionDialog: React.FC<DeleteQuestionDialogProps> = ({
  open,
  onOpenChange,
  question,
  onSubmit,
  submitting,
}) => {
  if (!question) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Question</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this question? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You are about to delete the question: "{question.question.substring(0, 100)}...". This action cannot be undone.
          </AlertDescription>
        </Alert>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onSubmit} disabled={submitting}>
            {submitting ? 'Deleting...' : 'Delete Question'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 