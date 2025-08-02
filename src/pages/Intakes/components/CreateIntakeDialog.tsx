import React from 'react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { IntakeForm } from './IntakeForm';
import type { IntakeFormData } from './IntakeForm/types';

interface CreateIntakeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: IntakeFormData) => void;
  submitting: boolean;
}

export const CreateIntakeDialog: React.FC<CreateIntakeDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  submitting,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Intake</DialogTitle>
          <DialogDescription>
            Add a new intake for organizing questions by examination period.
          </DialogDescription>
        </DialogHeader>
        <IntakeForm
          onSubmit={onSubmit}
          isEdit={false}
          isLoading={submitting}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="intake-form" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Intake'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 