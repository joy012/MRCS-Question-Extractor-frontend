import React from 'react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import type { Intake } from '../../../types/question';

interface DeleteIntakeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intake: Intake | null;
  onSubmit: () => void;
  submitting: boolean;
}

export const DeleteIntakeDialog: React.FC<DeleteIntakeDialogProps> = ({
  open,
  onOpenChange,
  intake,
  onSubmit,
  submitting,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Intake</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{intake?.displayName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onSubmit} disabled={submitting}>
            {submitting ? 'Deleting...' : 'Delete Intake'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 