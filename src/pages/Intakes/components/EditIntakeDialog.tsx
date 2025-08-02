import {
  Calendar,
  Edit
} from 'lucide-react';
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
    displayName: intake?.displayName,
    isActive: intake?.isActive,
  };

  if (!intake) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] border-0 shadow-2x">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <Edit className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Edit Intake
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                Update the intake information and settings
              </DialogDescription>
            </div>
          </div>

          {/* Intake Info */}
          <div className="p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl border border-green-200/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{intake.displayName}</p>
                <p className="text-xs text-gray-500">{intake.name} • {intake.type}</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="py-6">
          <IntakeForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            isEdit={true}
            isLoading={submitting}
          />
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="intake-form"
            disabled={submitting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Update Intake
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 