import React from 'react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import type { Category } from '../../../types/question';
import { CategoryForm } from './CategoryForm/CategoryForm';
import type { CategoryFormData } from './CategoryForm/types';

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
  onSubmit: (data: CategoryFormData) => void;
  submitting: boolean;
}

export const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
  open,
  onOpenChange,
  category,
  onSubmit,
  submitting,
}) => {
  const defaultValues: CategoryFormData = {
    name: category?.name,
    type: category?.type as 'BASIC' | 'CLINICAL',
    displayName: category?.displayName,
    isActive: category?.isActive,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the category information.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isEdit={true}
          isLoading={submitting}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="category-form" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 