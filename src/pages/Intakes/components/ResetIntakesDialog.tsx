import React from 'react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

interface ResetIntakesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export const ResetIntakesDialog: React.FC<ResetIntakesDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  submitting,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Intakes to Default</DialogTitle>
          <DialogDescription>
            This will delete all custom intakes and restore the default intakes. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onSubmit} disabled={submitting}>
            {submitting ? 'Resetting...' : 'Reset to Default'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 