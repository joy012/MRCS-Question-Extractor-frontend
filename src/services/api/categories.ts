import { api } from './client';

export interface Category {
  _id: string;
  name: string;
  displayName: string;
  type: 'basic' | 'clinical';
  description: string;
  questionCount: number;
  isActive: boolean;
  order: number;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryStats {
  [key: string]: number;
}

export interface CreateCategoryDto {
  name: string;
  displayName: string;
  type: 'basic' | 'clinical';
  description?: string;
  order?: number;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  displayName?: string;
  description?: string;
  order?: number;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

export class CategoriesService {
  // Get all active categories
  static async getCategories(): Promise<Category[]> {
    return api.get<Category[]>('/categories/all');
  }

  // Get category by ID
  static async getCategoryById(id: string): Promise<Category> {
    return api.get<Category>(`/categories/${id}`);
  }

  // Create a new category
  static async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    return api.post<Category>('/categories', categoryData);
  }

  // Update a category
  static async updateCategory(id: string, categoryData: UpdateCategoryDto): Promise<Category> {
    return api.put<Category>(`/categories/${id}`, categoryData);
  }

  // Delete a category
  static async deleteCategory(id: string): Promise<void> {
    return api.delete(`/categories/${id}`);
  }

  // Reset categories to default
  static async resetCategories(): Promise<{ message: string }> {
    return api.post<{ message: string }>('/categories/reset');
  }

  // Get basic science categories
  static async getBasicCategories(): Promise<Category[]> {
    return api.get<Category[]>('/categories/basic');
  }

  // Get clinical categories
  static async getClinicalCategories(): Promise<Category[]> {
    return api.get<Category[]>('/categories/clinical');
  }

  // Get category statistics
  static async getCategoryStats(): Promise<CategoryStats> {
    return api.get<CategoryStats>('/categories/stats');
  }

  // Get active category names
  static async getActiveCategoryNames(): Promise<string[]> {
    return api.get<string[]>('/categories/names');
  }

  // Manually trigger category seeding
  static async seedCategories(): Promise<{ message: string }> {
    return api.post<{ message: string }>('/categories/seed');
  }

  // Sync question counts for all categories
  static async syncQuestionCounts(): Promise<{ message: string }> {
    return api.post<{ message: string }>('/categories/sync-question-counts');
  }
}

export default CategoriesService;
