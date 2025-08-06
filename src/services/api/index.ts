// Export all API services
export { CategoriesService } from './categories';
export { api, apiClient, checkApiHealth } from './client';
export { ExtractionService } from './extraction';
export { QuestionsService } from './questions';
export { SettingsService } from './settings';
export { AiExplanationService } from './ai-explanation';

// Re-export for convenience
import { CategoriesService } from './categories';
import { ExtractionService } from './extraction';
import { QuestionsService } from './questions';
import { AiExplanationService } from './ai-explanation';

export default {
  categories: CategoriesService,
  questions: QuestionsService,
  extraction: ExtractionService,
  aiExplanation: AiExplanationService,
};
