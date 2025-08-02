import type {
  BulkActionResponse,
  CategoryInfo,
  CreateQuestionData,
  IntakeInfo,
  Question,
  QuestionSearchParams,
  QuestionsResponse,
  QuestionStatistics,
  QuestionStatus,
  UpdateQuestionData,
  YearInfo,
} from '@/types';
import { api } from './client';

export class QuestionsService {
  // Get all questions with pagination and filtering
  static async getQuestions(
    params: QuestionSearchParams = {}
  ): Promise<QuestionsResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.categories?.length)
      searchParams.append('categories', params.categories.join(','));
    if (params.year) searchParams.append('year', params.year.toString());
    if (params.intake) searchParams.append('intake', params.intake);
    if (params.status) searchParams.append('status', params.status);
    if (params.search) searchParams.append('search', params.search);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const queryString = searchParams.toString();
    const url = queryString ? `/questions?${queryString}` : '/questions';

    return api.get<QuestionsResponse>(url);
  }

  // Get a single question by ID
  static async getQuestion(id: string): Promise<Question> {
    return api.get<Question>(`/questions/${id}`);
  }

  // Create a new question
  static async createQuestion(data: CreateQuestionData): Promise<Question> {
    return api.post<Question>('/questions', data);
  }

  // Create multiple questions
  static async createQuestions(questions: CreateQuestionData[]): Promise<{
    created: number;
    skipped: number;
    errors: string[];
  }> {
    return api.post('/questions/bulk', questions);
  }

  // Update an existing question
  static async updateQuestion(
    id: string,
    data: UpdateQuestionData
  ): Promise<Question> {
    return api.patch<Question>(`/questions/${id}`, data);
  }

  // Delete a question
  static async deleteQuestion(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/questions/${id}`);
  }

  // Get question statistics
  static async getStatistics(): Promise<QuestionStatistics> {
    return api.get<QuestionStatistics>('/questions/statistics');
  }

  // Get all available categories
  static async getCategories(): Promise<CategoryInfo[]> {
    return api.get<CategoryInfo[]>('/questions/categories');
  }

  // Get all available years
  static async getYears(): Promise<YearInfo[]> {
    return api.get<YearInfo[]>('/questions/years');
  }

  // Get all available intakes
  static async getIntakes(): Promise<IntakeInfo[]> {
    return api.get<IntakeInfo[]>('/questions/intakes');
  }

  // Search questions by text
  static async searchQuestions(
    query: string,
    options: {
      limit?: number;
      categories?: string[];
      year?: number;
      intake?: string;
      status?: QuestionStatus;
    } = {}
  ): Promise<QuestionsResponse> {
    return this.getQuestions({
      search: query,
      limit: options.limit || 20,
      categories: options.categories,
      year: options.year,
      intake: options.intake,
      status: options.status,
    });
  }

  // Get questions by category
  static async getQuestionsByCategory(
    categoryId: string,
    options: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<QuestionsResponse> {
    return this.getQuestions({
      categories: [categoryId],
      page: options.page,
      limit: options.limit,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder,
    });
  }

  // Get questions by year
  static async getQuestionsByYear(
    year: number,
    options: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<QuestionsResponse> {
    return this.getQuestions({
      year,
      page: options.page,
      limit: options.limit,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder,
    });
  }

  // Get questions by intake
  static async getQuestionsByIntake(
    intakeId: string,
    options: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<QuestionsResponse> {
    return this.getQuestions({
      intake: intakeId,
      page: options.page,
      limit: options.limit,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder,
    });
  }

  // Get questions by status
  static async getQuestionsByStatus(
    status: QuestionStatus,
    options: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<QuestionsResponse> {
    return this.getQuestions({
      status,
      page: options.page,
      limit: options.limit,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder,
    });
  }

  // Update question status
  static async updateQuestionStatus(
    id: string,
    status: QuestionStatus
  ): Promise<Question> {
    return api.post<Question>(`/questions/${id}/status`, { status });
  }

  // Bulk update question status
  static async bulkUpdateStatus(
    questionIds: string[],
    status: QuestionStatus
  ): Promise<BulkActionResponse> {
    return api.post<BulkActionResponse>('/questions/bulk-status', {
      ids: questionIds,
      status,
    });
  }

  // Get recent questions
  static async getRecentQuestions(
    limit: number = 10
  ): Promise<QuestionsResponse> {
    return this.getQuestions({
      limit,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }

  // Get questions statistics by category
  static async getCategoryStatistics(): Promise<
    Record<
      string,
      {
        total: number;
        approved: number;
        pending: number;
        rejected: number;
        percentage: number;
      }
    >
  > {
    const [categories, statistics] = await Promise.all([
      this.getCategories(),
      this.getStatistics(),
    ]);

    return categories.reduce((acc, category) => {
      const total = statistics.byCategory?.[category.category] || 0;
      const approved = Math.round(total * 0.6); // Approximate
      const pending = Math.round(total * 0.3);
      const rejected = total - approved - pending;

      acc[category.category] = {
        total,
        approved,
        pending,
        rejected,
        percentage: category.percentage,
      };

      return acc;
    }, {} as Record<string, any>);
  }
}

export default QuestionsService;
