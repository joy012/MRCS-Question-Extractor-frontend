import {
  AlertTriangle,
  CheckCircle,
  Edit,
  Plus,
  RotateCcw,
  Trash2,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { CategoriesService } from '../../api/categories';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import { useCategories } from '../../hooks/useCategories';
import { getCardColorClasses } from '../../lib/utils';
import type { Category } from '../../types/question';
import {
  CreateCategoryDialog,
  DeleteCategoryDialog,
  EditCategoryDialog,
  ResetCategoriesDialog,
} from './components';

const CategoriesPage: React.FC = () => {
  const { data: categories = [], isLoading: loading, refetch } = useCategories();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isPreseeded = (category: Category) => {
    return DEFAULT_CATEGORIES.some((defaultCategory) => defaultCategory.name === category.name);
  };

  const handleCreate = async (data: any) => {
    setSubmitting(true);
    try {
      await CategoriesService.createCategory(data);
      toast.success('Category created successfully');
      setIsCreateDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error('Failed to create category');
      console.error('Error creating category:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedCategory) return;

    setSubmitting(true);
    try {
      await CategoriesService.updateCategory(selectedCategory._id, data);
      toast.success('Category updated successfully');
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      refetch();
    } catch (error) {
      toast.error('Failed to update category');
      console.error('Error updating category:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    setSubmitting(true);
    try {
      await CategoriesService.deleteCategory(selectedCategory._id);
      toast.success('Category deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
      refetch();
    } catch (error) {
      toast.error('Failed to delete category');
      console.error('Error deleting category:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async () => {
    setSubmitting(true);
    try {
      await CategoriesService.resetCategories();
      toast.success('Categories reset to default successfully');
      setIsResetDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error('Failed to reset categories');
      console.error('Error resetting categories:', error);
    } finally {
      setSubmitting(false);
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
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage question categories and their settings</p>
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
            Add Category
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const colorClasses = getCardColorClasses(category.name);

          return (
            <Card key={category._id} className={`relative ${colorClasses.border}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {category.displayName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={getTypeColor(category.type)}>
                        {category.type}
                      </Badge>
                      {getStatusIcon(category.isActive)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!isPreseeded(category) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(category)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{category.questionCount} questions</span>
                </div>
                {isPreseeded(category) && (
                  <Alert className="mt-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>This is a default category and cannot be deleted.</AlertDescription>
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
        submitting={submitting}
      />

      <EditCategoryDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        category={selectedCategory!}
        onSubmit={handleUpdate}
        submitting={submitting}
      />

      <DeleteCategoryDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        category={selectedCategory}
        onSubmit={handleDelete}
        submitting={submitting}
      />

      <ResetCategoriesDialog
        open={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
        onSubmit={handleReset}
        submitting={submitting}
      />
    </div>
  );
};

export default CategoriesPage; 