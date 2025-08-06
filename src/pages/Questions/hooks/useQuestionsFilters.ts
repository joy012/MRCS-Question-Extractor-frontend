import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FilterState, UrlParamsUpdates } from '../types';

export const useQuestionsFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );
  const [statusFilter, setStatusFilter] = useState(() => {
    const status = searchParams.get('status') || 'all';
    return status === 'all' ? 'all' : status.toUpperCase();
  });
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get('category') || 'all'
  );
  const [intakeFilter, setIntakeFilter] = useState(
    searchParams.get('intake') || 'all'
  );
  const [yearFilter, setYearFilter] = useState(
    searchParams.get('year') || 'all'
  );
  const [confidenceFilter, setConfidenceFilter] = useState(
    searchParams.get('minConfidence') || 'all'
  );
  const [explanationFilter, setExplanationFilter] = useState(
    searchParams.get('explanation') || 'all'
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get('sortBy') || 'createdAt'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  );
  const [itemsPerPage] = useState(50);

  // Update URL params when filters change
  const updateUrlParams = useCallback(
    (updates: UrlParamsUpdates) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value.toString());
        } else {
          newParams.delete(key);
        }
      });
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  // Handlers
  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      setCurrentPage(1);
      updateUrlParams({ search: value, page: '1' });
    },
    [updateUrlParams]
  );

  const handleStatusFilter = useCallback(
    (value: string) => {
      const normalizedValue = value === 'all' ? 'all' : value.toUpperCase();
      setStatusFilter(normalizedValue);
      setCurrentPage(1);
      updateUrlParams({
        status: normalizedValue === 'all' ? '' : normalizedValue,
        page: '1',
      });
    },
    [updateUrlParams]
  );

  const handleCategoryFilter = useCallback(
    (value: string) => {
      setCategoryFilter(value);
      setCurrentPage(1);
      updateUrlParams({ category: value === 'all' ? '' : value, page: '1' });
    },
    [updateUrlParams]
  );

  const handleIntakeFilter = useCallback(
    (value: string) => {
      setIntakeFilter(value);
      setCurrentPage(1);
      updateUrlParams({ intake: value === 'all' ? '' : value, page: '1' });
    },
    [updateUrlParams]
  );

  const handleYearFilter = useCallback(
    (value: string) => {
      setYearFilter(value);
      setCurrentPage(1);
      updateUrlParams({ year: value === 'all' ? '' : value, page: '1' });
    },
    [updateUrlParams]
  );

  const handleConfidenceFilter = useCallback(
    (value: string) => {
      setConfidenceFilter(value);
      setCurrentPage(1);
      updateUrlParams({
        minConfidence: value === 'all' ? '' : value,
        page: '1',
      });
    },
    [updateUrlParams]
  );

  const handleExplanationFilter = useCallback(
    (value: string) => {
      setExplanationFilter(value);
      setCurrentPage(1);
      updateUrlParams({
        explanation: value === 'all' ? '' : value,
        page: '1',
      });
    },
    [updateUrlParams]
  );

  const handleSort = useCallback(
    (value: string) => {
      setSortBy(value);
      updateUrlParams({ sortBy: value });
    },
    [updateUrlParams]
  );

  const handleSortOrder = useCallback(
    (value: 'asc' | 'desc') => {
      setSortOrder(value);
      updateUrlParams({ sortOrder: value });
    },
    [updateUrlParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      updateUrlParams({ page: page.toString() });
    },
    [updateUrlParams]
  );

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setIntakeFilter('all');
    setYearFilter('all');
    setConfidenceFilter('all');
    setExplanationFilter('all');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);

    // Clear all URL parameters
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const filterState: FilterState = {
    searchTerm,
    statusFilter,
    categoryFilter,
    intakeFilter,
    yearFilter,
    confidenceFilter,
    explanationFilter,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
  };

  return {
    filterState,
    handlers: {
      handleSearch,
      handleStatusFilter,
      handleCategoryFilter,
      handleIntakeFilter,
      handleYearFilter,
      handleConfidenceFilter,
      handleExplanationFilter,
      handleSort,
      handleSortOrder,
      handlePageChange,
      handleResetFilters,
    },
  };
};
