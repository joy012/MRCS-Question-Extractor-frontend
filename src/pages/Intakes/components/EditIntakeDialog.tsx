import React from 'react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import type { Intake } from '../../../types/question';
import { IntakeForm } from './IntakeForm';
import type { IntakeFormData } from './IntakeForm/types';

interface EditIntakeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intake: Intake;
  onSubmit: (data: IntakeFormData) => void;
  submitting: boolean;
}

export const EditIntakeDialog: React.FC<EditIntakeDialogProps> = ({
  open,
  onOpenChange,
  intake,
  onSubmit,
  submitting,
}) => {
  const defaultValues: IntakeFormData = {
    name: intake?.name,
    type: intake?.type as 'JANUARY' | 'APRIL_MAY' | 'SEPTEMBER',
    displayName: intake?.displayName || '',
    isActive: intake?.isActive,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Intake</DialogTitle>
          <DialogDescription>
            Update the intake information.
          </DialogDescription>
        </DialogHeader>
        <IntakeForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isEdit={true}
          isLoading={submitting}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="intake-form" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Intake'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 