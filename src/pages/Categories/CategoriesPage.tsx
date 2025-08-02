import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Edit,
  Plus,
  RefreshCw,
  RotateCcw,
  Shield,
  Trash2,
  XCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import { getCardColorClasses } from '../../lib/utils';
import type { Category } from '../../services/api/categories';
import { CategoriesService } from '../../services/api/categories';
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useResetCategoriesMutation,
  useUpdateCategoryMutation
} from '../../services/queries/useCategories';
import {
  CreateCategoryDialog,
  DeleteCategoryDialog,
  EditCategoryDialog,
  ResetCategoriesDialog,
} from './components';

const CategoriesPage: React.FC = () => {
  const { data: categories = [], isLoading: loading, refetch } = useGetCategoriesQuery();
  const createCategoryMutation = useCreateCategoryMutation();
  const updateCategoryMutation = useUpdateCategoryMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();
  const resetCategoriesMutation = useResetCategoriesMutation();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync question counts on page load
  useEffect(() => {
    const syncQuestionCounts = async () => {
      try {
        setIsSyncing(true);
        await CategoriesService.syncQuestionCounts();
        await refetch(); // Refetch categories to get updated counts
        toast.success('Question counts synced successfully');
      } catch (error) {
        console.error('Failed to sync question counts:', error);
        toast.error('Failed to sync question counts');
      } finally {
        setIsSyncing(false);
      }
    };

    if (!loading && categories.length > 0) {
      syncQuestionCounts();
    }
  }, [loading, categories.length, refetch]);

  const handleSyncQuestionCounts = async () => {
    try {
      setIsSyncing(true);
      await CategoriesService.syncQuestionCounts();
      await refetch(); // Refetch categories to get updated counts
      toast.success('Question counts synced successfully');
    } catch (error) {
      console.error('Failed to sync question counts:', error);
      toast.error('Failed to sync question counts');
    } finally {
      setIsSyncing(false);
    }
  };

  const isPreseeded = (category: Category) => {
    return DEFAULT_CATEGORIES.some((defaultCategory) => defaultCategory.name === category.name);
  };

  const handleCreate = async (data: any) => {
    try {
      await createCategoryMutation.mutateAsync(data);
      toast.success('Category created successfully');
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create category');
      console.error('Error creating category:', error);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedCategory) return;

    try {
      await updateCategoryMutation.mutateAsync({ id: selectedCategory._id, data });
      toast.success('Category updated successfully');
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      toast.error('Failed to update category');
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategoryMutation.mutateAsync(selectedCategory._id);
      toast.success('Category deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      toast.error('Failed to delete category');
      console.error('Error deleting category:', error);
    }
  };

  const handleReset = async () => {
    try {
      await resetCategoriesMutation.mutateAsync();
      toast.success('Categories reset to default successfully');
      setIsResetDialogOpen(false);
    } catch (error) {
      toast.error('Failed to reset categories');
      console.error('Error resetting categories:', error);
    }
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const getTypeColor = (type: string) => {
    return type === 'basic' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
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
            <Card key={i} className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100/50">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100/50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Categories Management
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Organize and manage question categories for better exam preparation
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleSyncQuestionCounts}
                disabled={isSyncing}
                className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300 shadow-sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Question Counts'}
              </Button>
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
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
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
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Total Categories</span>
              </div>
            </div>
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active categories</p>
          </div>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Active Categories</span>
              </div>
            </div>
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold text-gray-900">
              {categories.filter(cat => cat.isActive).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Currently active</p>
          </div>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">Default Categories</span>
              </div>
            </div>
          </CardHeader>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold text-gray-900">
              {categories.filter(cat => isPreseeded(cat)).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Preseeded</p>
          </div>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const colorClasses = getCardColorClasses(category.name);

          return (
            <Card key={category._id} className={`relative border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100/50 hover:shadow-xl transition-all duration-200 ${colorClasses.border}`}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-indigo-600" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {category.displayName}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className={getTypeColor(category.type)}>
                        {category.type}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(category.isActive)}
                        <span className="text-xs text-gray-500">
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(category)}
                      className="hover:bg-white/80"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!isPreseeded(category) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(category)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <span>{category.questionCount} questions</span>
                </div>
                {isPreseeded(category) && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      This is a default category and cannot be deleted.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialogs */}
      <CreateCategoryDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreate}
        submitting={createCategoryMutation.isPending}
      />

      <EditCategoryDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        category={selectedCategory!}
        onSubmit={handleUpdate}
        submitting={updateCategoryMutation.isPending}
      />

      <DeleteCategoryDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        category={selectedCategory}
        onSubmit={handleDelete}
        submitting={deleteCategoryMutation.isPending}
      />

      <ResetCategoriesDialog
        open={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
        onSubmit={handleReset}
        submitting={resetCategoriesMutation.isPending}
      />
    </div>
  );
};

export default CategoriesPage; 