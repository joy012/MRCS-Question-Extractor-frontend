import {
  Calendar,
  Clock,
  Filter,
  Search,
  Tag,
  Target,
  X
} from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { DEFAULT_CATEGORIES } from '../../../constants/categories';
import { DEFAULT_INTAKES } from '../../../constants/intakes';
import { useGetQuestionCategoriesQuery, useGetQuestionIntakesQuery, useGetQuestionYearsQuery } from '../../../services/queries/useQuestions';
import type { QuestionsFiltersProps } from '../types';
import { Pagination } from './Pagination';

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

// Compact search input component
const SearchInput = ({ searchTerm, onSearchChange }: Pick<QuestionsFiltersProps, 'searchTerm' | 'onSearchChange'>) => (
  <div className="relative flex-1 min-w-0 group">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
    </div>
    <Input
      placeholder="Search questions..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="pl-9 pr-8 h-9 bg-white/90 backdrop-blur-sm border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 rounded-lg shadow-sm"
    />
    {searchTerm && (
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 rounded-md"
        onClick={() => onSearchChange('')}
      >
        <X className="h-3 w-3" />
      </Button>
    )}
  </div>
);

// Compact filter wrapper with active indicator
const FilterWrapper = ({ children, active = false }: { children: React.ReactNode; active?: boolean }) => (
  <div className="relative">
    {children}
    {active && (
      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-500 rounded-full border border-white shadow-sm"></div>
    )}
  </div>
);

// Compact status filter
const StatusFilter = ({ statusFilter, onStatusFilterChange }: Pick<QuestionsFiltersProps, 'statusFilter' | 'onStatusFilterChange'>) => (
  <FilterWrapper active={statusFilter !== 'all'}>
    <Select value={statusFilter} onValueChange={onStatusFilterChange}>
      <SelectTrigger className="w-32 h-9 bg-white/90 backdrop-blur-sm border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 rounded-lg shadow-sm">
        <Filter className="w-3.5 h-3.5 mr-2 text-gray-500" />
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent className="rounded-lg border-gray-200 shadow-lg">
        <SelectItem value="all" className="hover:bg-gray-50 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            <span className="text-sm">All Q</span>
          </div>
        </SelectItem>
        <SelectItem value="APPROVED" className="hover:bg-green-50 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-sm">Approved</span>
          </div>
        </SelectItem>
        <SelectItem value="PENDING" className="hover:bg-yellow-50 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">Pending</span>
          </div>
        </SelectItem>
        <SelectItem value="REJECTED" className="hover:bg-red-50 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            <span className="text-sm">Rejected</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  </FilterWrapper>
);

// Compact category filter
const CategoryFilter = ({ categoryFilter, onCategoryFilterChange, categories }: Pick<QuestionsFiltersProps, 'categoryFilter' | 'onCategoryFilterChange' | 'categories'>) => (
  <FilterWrapper active={categoryFilter !== 'all'}>
    <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
      <SelectTrigger className="w-36 h-9 bg-white/90 backdrop-blur-sm border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 rounded-lg shadow-sm">
        <Tag className="w-3.5 h-3.5 mr-2 text-gray-500" />
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent className="rounded-lg border-gray-200 shadow-lg max-h-48">
        <SelectItem value="all" className="hover:bg-gray-50 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            <span className="text-sm">All Cate</span>
          </div>
        </SelectItem>
        {Array.isArray(categories) && categories.map((category) => (
          <SelectItem key={category.category} value={category.id} className="hover:bg-blue-50 rounded-md">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span className="text-sm flex-1">{getCategoryDisplayName(category.category)}</span>
              <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0.5">
                {category.count}
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </FilterWrapper>
);

// Compact intake filter
const IntakeFilter = ({ intakeFilter, onIntakeFilterChange, intakes }: Pick<QuestionsFiltersProps, 'intakeFilter' | 'onIntakeFilterChange' | 'intakes'>) => (
  <FilterWrapper active={intakeFilter !== 'all'}>
    <Select value={intakeFilter} onValueChange={onIntakeFilterChange}>
      <SelectTrigger className="w-36 h-9 bg-white/90 backdrop-blur-sm border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 rounded-lg shadow-sm">
        <Calendar className="w-3.5 h-3.5 mr-2 text-gray-500" />
        <SelectValue placeholder="Intake" />
      </SelectTrigger>
      <SelectContent className="rounded-lg border-gray-200 shadow-lg max-h-48">
        <SelectItem value="all" className="hover:bg-gray-50 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            <span className="text-sm">All Intal</span>
          </div>
        </SelectItem>
        {Array.isArray(intakes) && intakes.map((intake) => (
          <SelectItem key={intake.intake} value={intake.id} className="hover:bg-green-50 rounded-md">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-sm flex-1">{getIntakeDisplayName(intake.intake)}</span>
              <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0.5">
                {intake.count}
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </FilterWrapper>
);

// Compact year filter
const YearFilter = ({ yearFilter, onYearFilterChange, years }: Pick<QuestionsFiltersProps, 'yearFilter' | 'onYearFilterChange' | 'years'>) => (
  <FilterWrapper active={yearFilter !== 'all'}>
    <Select value={yearFilter} onValueChange={onYearFilterChange}>
      <SelectTrigger className="w-28 h-9 bg-white/90 backdrop-blur-sm border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 rounded-lg shadow-sm">
        <Clock className="w-3.5 h-3.5 mr-2 text-gray-500" />
        <SelectValue placeholder="Year" />
      </SelectTrigger>
      <SelectContent className="rounded-lg border-gray-200 shadow-lg max-h-48">
        <SelectItem value="all" className="hover:bg-gray-50 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            <span className="text-sm">All</span>
          </div>
        </SelectItem>
        {Array.isArray(years) && years.map((year) => (
          <SelectItem key={year.year} value={year.year.toString()} className="hover:bg-purple-50 rounded-md">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
              <span className="text-sm flex-1">{year.year}</span>
              <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0.5">
                {year.count}
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </FilterWrapper>
);

// Compact confidence filter
const ConfidenceFilter = ({ confidenceFilter, onConfidenceFilterChange }: Pick<QuestionsFiltersProps, 'confidenceFilter' | 'onConfidenceFilterChange'>) => (
  <FilterWrapper active={confidenceFilter !== 'all'}>
    <Select value={confidenceFilter} onValueChange={onConfidenceFilterChange}>
      <SelectTrigger className="w-32 h-9 bg-white/90 backdrop-blur-sm border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 rounded-lg shadow-sm">
        <Target className="w-3.5 h-3.5 mr-2 text-gray-500" />
        <SelectValue placeholder="Confidence" />
      </SelectTrigger>
      <SelectContent className="rounded-lg border-gray-200 shadow-lg">
        <SelectItem value="all" className="hover:bg-gray-50 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            <span className="text-sm">All</span>
          </div>
        </SelectItem>
        <SelectItem value="0.9" className="hover:bg-green-50 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-sm">High (90%+)</span>
          </div>
        </SelectItem>
        <SelectItem value="0.7" className="hover:bg-yellow-50 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">Medium (70%+)</span>
          </div>
        </SelectItem>
        <SelectItem value="0.5" className="hover:bg-orange-50 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
            <span className="text-sm">Low (50%+)</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  </FilterWrapper>
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
  categories: propCategories,
  intakes: propIntakes,
  years: propYears,
  // Pagination props
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: QuestionsFiltersProps) => {
  const { data: categories = [] } = useGetQuestionCategoriesQuery();
  const { data: intakes = [] } = useGetQuestionIntakesQuery();
  const { data: years = [] } = useGetQuestionYearsQuery();

  const finalCategories = (propCategories && propCategories.length > 0) ? propCategories : categories;
  const finalIntakes = (propIntakes && propIntakes.length > 0) ? propIntakes : intakes;
  const finalYears = (propYears && propYears.length > 0) ? propYears : years;



  return (
    <div className="space-y-3">
      {/* Compact Search and Filters Row */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} />

          {/* Filter Controls */}
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
          </div>
        </div>
      </div>

      {/* Compact Pagination Section */}
      {(currentPage && totalPages && totalItems && itemsPerPage && onPageChange && totalPages > 1) ? (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
          />
        </div>
      ) : null}
    </div>
  );
}; 