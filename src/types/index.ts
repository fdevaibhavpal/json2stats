import { FilterGroup } from './filter.types';

export interface JsonData {
  [key: string]: any;
}

export interface ColumnSchema {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object' | 'url';
  sortable: boolean;
  filterable: boolean;
  searchable: boolean;
  width?: number;
  hidden?: boolean;
}

export interface TableState {
  data: JsonData[];
  columns: ColumnSchema[];
  searchQuery: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  pageSize: number;
  currentPage: number;
  filterGroups: FilterGroup[];
  selectedRows: string[];
}

export interface FilterConfig {
  column: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
  value: any;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between';
}

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'json';
  includeHeaders: boolean;
  filtered: boolean;
  sorted: boolean;
}

export interface StatCard {
  label: string;
  value: string | number;
  type: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'distinct';
  column?: string;
}
