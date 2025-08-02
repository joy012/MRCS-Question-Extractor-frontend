import { Filter, Search, SortAsc, SortDesc, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useQuestionCategories, useQuestionIntakes, useQuestionYears } from '../../../hooks/useQuestions';
import type { QuestionsFiltersProps } from '../types';

// Search input component
const SearchInput = ({ searchTerm, onSearchChange }: Pick<QuestionsFiltersProps, 'searchTerm' | 'onSearchChange'>) => (
  <div className="relative flex-1 lg:flex-none lg:w-80">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
    <Input
      placeholder="Search questions..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="pl-10"
    />
    {searchTerm && (
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
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
    <SelectTrigger className="w-36">
      <Filter className="w-4 h-4 mr-2" />
      <SelectValue placeholder="Status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Questions</SelectItem>
      <SelectItem value="verified">Approved Only</SelectItem>
      <SelectItem value="pending">Pending Review</SelectItem>
      <SelectItem value="rejected">Rejected</SelectItem>
    </SelectContent>
  </Select>
);

// Category filter component
const CategoryFilter = ({ categoryFilter, onCategoryFilterChange, categories }: Pick<QuestionsFiltersProps, 'categoryFilter' | 'onCategoryFilterChange' | 'categories'>) => (
  <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
    <SelectTrigger className="w-40">
      <SelectValue placeholder="Category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Categories</SelectItem>
      {Array.isArray(categories) && categories.map((category) => (
        <SelectItem key={category.category} value={category.category}>
          {category.category} ({category.count})
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

// Intake filter component
const IntakeFilter = ({ intakeFilter, onIntakeFilterChange, intakes }: Pick<QuestionsFiltersProps, 'intakeFilter' | 'onIntakeFilterChange' | 'intakes'>) => (
  <Select value={intakeFilter} onValueChange={onIntakeFilterChange}>
    <SelectTrigger className="w-40">
      <SelectValue placeholder="Intake" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Intakes</SelectItem>
      {Array.isArray(intakes) && intakes.map((intake) => (
        <SelectItem key={intake.intake} value={intake.intake}>
          {intake.intake} ({intake.count})
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

// Year filter component
const YearFilter = ({ yearFilter, onYearFilterChange, years }: Pick<QuestionsFiltersProps, 'yearFilter' | 'onYearFilterChange' | 'years'>) => (
  <Select value={yearFilter} onValueChange={onYearFilterChange}>
    <SelectTrigger className="w-32">
      <SelectValue placeholder="Year" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Years</SelectItem>
      {Array.isArray(years) && years.map((year) => (
        <SelectItem key={year.year} value={year.year.toString()}>
          {year.year} ({year.count})
        </SelectItem>
      ))}
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
  <>
    <Select value={sortBy} onValueChange={onSortChange}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="examYear">Exam Year</SelectItem>
        <SelectItem value="createdAt">Date Added</SelectItem>
        <SelectItem value="confidence">Confidence</SelectItem>
        <SelectItem value="pageNumber">Page Number</SelectItem>
      </SelectContent>
    </Select>

    <Button
      variant="outline"
      size="sm"
      onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
    >
      {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
    </Button>
  </>
);

// Main QuestionsFilters component
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
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
}: QuestionsFiltersProps) => {
  // Fetch filter options
  const { data: categoryOptions = [] } = useQuestionCategories();
  const { data: intakeOptions = [] } = useQuestionIntakes();
  const { data: yearOptions = [] } = useQuestionYears();

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
      {/* Search Bar */}
      <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} />

      {/* Filter Controls */}
      <div className="flex gap-2 flex-wrap lg:flex-nowrap">
        <StatusFilter statusFilter={statusFilter} onStatusFilterChange={onStatusFilterChange} />
        <CategoryFilter
          categoryFilter={categoryFilter}
          onCategoryFilterChange={onCategoryFilterChange}
          categories={categoryOptions}
        />
        <IntakeFilter
          intakeFilter={intakeFilter}
          onIntakeFilterChange={onIntakeFilterChange}
          intakes={intakeOptions}
        />
        <YearFilter
          yearFilter={yearFilter}
          onYearFilterChange={onYearFilterChange}
          years={yearOptions}
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