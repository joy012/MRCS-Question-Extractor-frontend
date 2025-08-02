import { Plus, RotateCcw } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import type { CreateIntakeDto, UpdateIntakeDto } from '../../api/intakes';
import { intakesApi } from '../../api/intakes';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { useIntakes } from '../../hooks/useIntakes';
import type { Intake } from '../../types/question';
import {
  CreateIntakeDialog,
  DeleteIntakeDialog,
  EditIntakeDialog,
  IntakeCard,
  ResetIntakesDialog,
} from './components';
import type { IntakeFormData } from './components/IntakeForm/types';

const IntakesPage: React.FC = () => {
  const { data: intakes = [], isLoading: loading, refetch } = useIntakes();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [selectedIntake, setSelectedIntake] = useState<Intake | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (formData: IntakeFormData) => {
    try {
      setSubmitting(true);
      const createData: CreateIntakeDto = {
        name: formData.name.toLowerCase().replace(/\s+/g, '-'),
        type: formData.type,
        displayName: formData.displayName,
        isActive: formData.isActive,
      };

      await intakesApi.create(createData);
      toast.success('Intake created successfully');
      setIsCreateDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create intake');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (formData: IntakeFormData) => {
    if (!selectedIntake) return;

    try {
      setSubmitting(true);
      const updateData: UpdateIntakeDto = {
        displayName: formData.displayName,
        isActive: formData.isActive,
      };

      await intakesApi.update(selectedIntake._id, updateData);
      toast.success('Intake updated successfully');
      setIsEditDialogOpen(false);
      setSelectedIntake(null);
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update intake');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedIntake) return;

    try {
      setSubmitting(true);
      await intakesApi.delete(selectedIntake._id);
      toast.success('Intake deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedIntake(null);
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete intake');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async () => {
    try {
      setSubmitting(true);
      await intakesApi.reset();
      toast.success('Intakes reset to default successfully');
      setIsResetDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset intakes');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (intake: Intake) => {
    setSelectedIntake(intake);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (intake: Intake) => {
    setSelectedIntake(intake);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Intakes</h1>
          <p className="text-gray-600 mt-1">Manage exam intakes and their settings</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsResetDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Intake
          </Button>
        </div>
      </div>

      {/* Intakes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {intakes.map((intake) => (
          <IntakeCard
            key={intake._id}
            intake={intake}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        ))}
      </div>

      {/* Dialogs */}
      <CreateIntakeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreate}
        submitting={submitting}
      />

      <EditIntakeDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        intake={selectedIntake!}
        onSubmit={handleUpdate}
        submitting={submitting}
      />

      <DeleteIntakeDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        intake={selectedIntake}
        onSubmit={handleDelete}
        submitting={submitting}
      />

      <ResetIntakesDialog
        open={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
        onSubmit={handleReset}
        submitting={submitting}
      />
    </div>
  );
};

export default IntakesPage; 