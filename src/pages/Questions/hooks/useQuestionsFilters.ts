import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FilterState, UrlParamsUpdates } from '../types';

export const useQuestionsFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || 'all'
  );
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get('category') || 'all'
  );
  const [intakeFilter, setIntakeFilter] = useState(
    searchParams.get('intake') || 'all'
  );
  const [yearFilter, setYearFilter] = useState(
    searchParams.get('year') || 'all'
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get('sortBy') || 'examYear'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  );
  const [itemsPerPage] = useState(10);

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
      setStatusFilter(value);
      setCurrentPage(1);
      updateUrlParams({ status: value === 'all' ? '' : value, page: '1' });
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

  const filterState: FilterState = {
    searchTerm,
    statusFilter,
    categoryFilter,
    intakeFilter,
    yearFilter,
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
      handleSort,
      handleSortOrder,
      handlePageChange,
    },
  };
};
