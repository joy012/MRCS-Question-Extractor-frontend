import {
  BarChart3,
  Calendar,
  Clock,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Tag,
  Target,
  X
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { DEFAULT_CATEGORIES } from '../../../constants/categories';
import { DEFAULT_INTAKES } from '../../../constants/intakes';
import { useGetQuestionCategoriesQuery, useGetQuestionIntakesQuery, useGetQuestionYearsQuery } from '../../../services/queries/useQuestions';
import type { QuestionsFiltersProps } from '../types';

// Utility function to get category display name
const getCategoryDisplayName = (categoryName: string): string => {
  const category = DEFAULT_CATEGORIES.find(cat => cat.name === categoryName);
  if (!category) return categoryName;

  return `${category.type}-${category.displayName}`;
};

// Utility function to get intake display name
const getIntakeDisplayName = (intakeName: string): string => {
  const intake = DEFAULT_INTAKES.find(int => int.name === intakeName);
  return intake ? intake.displayName : intakeName;
};

// Search input component
const SearchInput = ({ searchTerm, onSearchChange }: Pick<QuestionsFiltersProps, 'searchTerm' | 'onSearchChange'>) => (
  <div className="relative flex-1 min-w-0">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
    <Input
      placeholder="Search questions..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="pl-10 pr-8 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200 h-9"
    />
    {searchTerm && (
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
        onClick={() => onSearchChange('')}
      >
        <X className="h-3 w-3" />
      </Button>
    )}
  </div>
);

// Status filter component
const StatusFilter = ({ statusFilter, onStatusFilterChange }: Pick<QuestionsFiltersProps, 'statusFilter' | 'onStatusFilterChange'>) => (
  <Select value={statusFilter} onValueChange={onStatusFilterChange}>
    <SelectTrigger className="w-32 h-9 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200">
      <Filter className="w-4 h-4 mr-2 text-gray-500" />
      <SelectValue placeholder="Status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all" className="hover:bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          All Questions
        </div>
      </SelectItem>
      <SelectItem value="APPROVED" className="hover:bg-green-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Approved Only
        </div>
      </SelectItem>
      <SelectItem value="PENDING" className="hover:bg-yellow-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          Pending Review
        </div>
      </SelectItem>
      <SelectItem value="REJECTED" className="hover:bg-red-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          Rejected
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
);

// Category filter component
const CategoryFilter = ({ categoryFilter, onCategoryFilterChange, categories }: Pick<QuestionsFiltersProps, 'categoryFilter' | 'onCategoryFilterChange' | 'categories'>) => (
  <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
    <SelectTrigger className="w-36 h-9 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200">
      <Tag className="w-4 h-4 mr-2 text-gray-500" />
      <SelectValue placeholder="Category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all" className="hover:bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          All Categories
        </div>
      </SelectItem>
      {Array.isArray(categories) && categories.map((category) => (
        <SelectItem key={category.category} value={category.category} className="hover:bg-blue-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            {getCategoryDisplayName(category.category)} ({category.count})
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

// Intake filter component
const IntakeFilter = ({ intakeFilter, onIntakeFilterChange, intakes }: Pick<QuestionsFiltersProps, 'intakeFilter' | 'onIntakeFilterChange' | 'intakes'>) => (
  <Select value={intakeFilter} onValueChange={onIntakeFilterChange}>
    <SelectTrigger className="w-36 h-9 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200">
      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
      <SelectValue placeholder="Intake" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all" className="hover:bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          All Intakes
        </div>
      </SelectItem>
      {Array.isArray(intakes) && intakes.map((intake) => (
        <SelectItem key={intake.intake} value={intake.intake} className="hover:bg-green-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {getIntakeDisplayName(intake.intake)} ({intake.count})
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

// Year filter component
const YearFilter = ({ yearFilter, onYearFilterChange, years }: Pick<QuestionsFiltersProps, 'yearFilter' | 'onYearFilterChange' | 'years'>) => (
  <Select value={yearFilter} onValueChange={onYearFilterChange}>
    <SelectTrigger className="w-28 h-9 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200">
      <Clock className="w-4 h-4 mr-2 text-gray-500" />
      <SelectValue placeholder="Year" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all" className="hover:bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          All Years
        </div>
      </SelectItem>
      {Array.isArray(years) && years.map((year) => (
        <SelectItem key={year.year} value={year.year.toString()} className="hover:bg-purple-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            {year.year} ({year.count})
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

// Confidence filter component
const ConfidenceFilter = ({ confidenceFilter, onConfidenceFilterChange }: Pick<QuestionsFiltersProps, 'confidenceFilter' | 'onConfidenceFilterChange'>) => (
  <Select value={confidenceFilter} onValueChange={onConfidenceFilterChange}>
    <SelectTrigger className="w-32 h-9 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200">
      <Target className="w-4 h-4 mr-2 text-gray-500" />
      <SelectValue placeholder="Confidence" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all" className="hover:bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          All Confidence
        </div>
      </SelectItem>
      <SelectItem value="90" className="hover:bg-green-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          High (90%+)
        </div>
      </SelectItem>
      <SelectItem value="70" className="hover:bg-yellow-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          Medium (70%+)
        </div>
      </SelectItem>
      <SelectItem value="50" className="hover:bg-orange-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          Low (50%+)
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
);

// Sort controls component
const SortControls = ({
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange
}: Pick<QuestionsFiltersProps, 'sortBy' | 'onSortChange' | 'sortOrder' | 'onSortOrderChange'>) => (
  <div className="flex items-center gap-2">
    <Select value={sortBy} onValueChange={onSortChange}>
      <SelectTrigger className="w-28 h-9 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all duration-200">
        <BarChart3 className="w-4 h-4 mr-2 text-gray-500" />
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="createdAt" className="hover:bg-gray-50">Date Created</SelectItem>
        <SelectItem value="updatedAt" className="hover:bg-gray-50">Date Updated</SelectItem>
        <SelectItem value="question" className="hover:bg-gray-50">Question Text</SelectItem>
        <SelectItem value="status" className="hover:bg-gray-50">Status</SelectItem>
        <SelectItem value="year" className="hover:bg-gray-50">Year</SelectItem>
      </SelectContent>
    </Select>

    <Button
      variant="outline"
      size="sm"
      onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
      className="h-9 w-9 p-0 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-gray-300"
    >
      {sortOrder === 'asc' ? (
        <SortAsc className="w-4 h-4" />
      ) : (
        <SortDesc className="w-4 h-4" />
      )}
    </Button>
  </div>
);

export const QuestionsFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  intakeFilter,
  onIntakeFilterChange,
  yearFilter,
  onYearFilterChange,
  confidenceFilter,
  onConfidenceFilterChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  categories: propCategories,
  intakes: propIntakes,
  years: propYears,
}: QuestionsFiltersProps) => {
  const { data: categories = [] } = useGetQuestionCategoriesQuery();
  const { data: intakes = [] } = useGetQuestionIntakesQuery();
  const { data: years = [] } = useGetQuestionYearsQuery();

  const finalCategories = (propCategories && propCategories.length > 0) ? propCategories : categories;
  const finalIntakes = (propIntakes && propIntakes.length > 0) ? propIntakes : intakes;
  const finalYears = (propYears && propYears.length > 0) ? propYears : years;

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search Input - Takes remaining space */}
      <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} />

      {/* Filter Controls - Compact horizontal layout */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <StatusFilter statusFilter={statusFilter} onStatusFilterChange={onStatusFilterChange} />
        <CategoryFilter
          categoryFilter={categoryFilter}
          onCategoryFilterChange={onCategoryFilterChange}
          categories={finalCategories}
        />
        <IntakeFilter
          intakeFilter={intakeFilter}
          onIntakeFilterChange={onIntakeFilterChange}
          intakes={finalIntakes}
        />
        <YearFilter
          yearFilter={yearFilter}
          onYearFilterChange={onYearFilterChange}
          years={finalYears}
        />
        <ConfidenceFilter
          confidenceFilter={confidenceFilter}
          onConfidenceFilterChange={onConfidenceFilterChange}
        />
        <SortControls
          sortBy={sortBy}
          onSortChange={onSortChange}
          sortOrder={sortOrder}
          onSortOrderChange={onSortOrderChange}
        />
      </div>
    </div>
  );
}; 