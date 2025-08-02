import { RotateCcw } from 'lucide-react';
import React from 'react';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

interface ResetCategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export const ResetCategoriesDialog: React.FC<ResetCategoriesDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  submitting,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Categories</DialogTitle>
          <DialogDescription>
            Are you sure you want to reset all categories to their default values? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Alert>
          <RotateCcw className="h-4 w-4" />
          <AlertDescription>
            This will reset all categories to their default state. All custom categories will be removed and replaced with the default categories.
          </AlertDescription>
        </Alert>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onSubmit} disabled={submitting}>
            {submitting ? 'Resetting...' : 'Reset Categories'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 