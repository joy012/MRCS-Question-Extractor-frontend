import {
  BarChart3,
  Calendar,
  Plus,
  RotateCcw,
  Users
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Card, CardHeader } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import {
  useCreateIntakeMutation,
  useDeleteIntakeMutation,
  useGetIntakesQuery,
  useResetIntakesMutation,
  useUpdateIntakeMutation
} from '../../services/queries/useIntakes';
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
  const { data: intakes = [], isLoading: loading } = useGetIntakesQuery();
  const createIntakeMutation = useCreateIntakeMutation();
  const updateIntakeMutation = useUpdateIntakeMutation();
  const deleteIntakeMutation = useDeleteIntakeMutation();
  const resetIntakesMutation = useResetIntakesMutation();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [selectedIntake, setSelectedIntake] = useState<Intake | null>(null);

  const handleCreate = async (formData: IntakeFormData) => {
    try {
      const createData = {
        name: formData.name.toLowerCase().replace(/\s+/g, '-'),
        type: formData.type,
        displayName: formData.displayName,
        isActive: formData.isActive,
      };

      await createIntakeMutation.mutateAsync(createData);
      toast.success('Intake created successfully');
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create intake');
    }
  };

  const handleUpdate = async (formData: IntakeFormData) => {
    if (!selectedIntake) return;

    try {
      const updateData = {
        displayName: formData.displayName,
        isActive: formData.isActive,
      };

      await updateIntakeMutation.mutateAsync({ id: selectedIntake.id, data: updateData });
      toast.success('Intake updated successfully');
      setIsEditDialogOpen(false);
      setSelectedIntake(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update intake');
    }
  };

  const handleDelete = async () => {
    if (!selectedIntake) return;

    try {
      await deleteIntakeMutation.mutateAsync(selectedIntake.id);
      toast.success('Intake deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedIntake(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete intake');
    }
  };

  const handleReset = async () => {
    try {
      await resetIntakesMutation.mutateAsync();
      toast.success('Intakes reset to default successfully');
      setIsResetDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset intakes');
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
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-100/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Intakes Management
                </h1>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsResetDialogOpen(true)}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300 shadow-sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Intake
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Total Intakes</span>
              </div>
            </div>
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold text-gray-900">{intakes.length}</div>
            <p className="text-xs text-gray-500 mt-1">Exam periods</p>
          </div>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Active Intakes</span>
              </div>
            </div>
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold text-gray-900">
              {intakes.filter(intake => intake.isActive).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Currently active</p>
          </div>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Default Intakes</span>
              </div>
            </div>
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold text-gray-900">3</div>
            <p className="text-xs text-gray-500 mt-1">Preseeded</p>
          </div>
        </Card>
      </div>

      {/* Intakes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {intakes.map((intake) => (
          <IntakeCard
            key={intake.id}
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
        submitting={createIntakeMutation.isPending}
      />

      <EditIntakeDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        intake={selectedIntake!}
        onSubmit={handleUpdate}
        submitting={updateIntakeMutation.isPending}
      />

      <DeleteIntakeDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        intake={selectedIntake}
        onSubmit={handleDelete}
        submitting={deleteIntakeMutation.isPending}
      />

      <ResetIntakesDialog
        open={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
        onSubmit={handleReset}
        submitting={resetIntakesMutation.isPending}
      />
    </div>
  );
};

export default IntakesPage; 