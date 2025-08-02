import {
  Edit,
  Tag
} from 'lucide-react';
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

  if (!category) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] border-0 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <Edit className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Edit Category
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                Update the category information and settings
              </DialogDescription>
            </div>
          </div>

          {/* Category Info */}
          <div className="p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Tag className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{category.displayName}</p>
                <p className="text-xs text-gray-500">{category.name} • {category.type}</p>
              </div>
            </div>
          </div>


        </DialogHeader>

        <div className="py-6">
          <CategoryForm
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
            form="category-form"
            disabled={submitting}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Update Category
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 