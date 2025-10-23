import { JsonData, ColumnSchema, StatCard } from '@/types';
import { FilterGroup, FilterCondition } from '@/types/filter.types';
import Fuse from 'fuse.js';

export class DataProcessor {
  private data: JsonData[];
  private columns: ColumnSchema[];
  private fuse!: Fuse<JsonData>;

  constructor(data: JsonData[], columns: ColumnSchema[]) {
    this.data = data;
    this.columns = columns;
    this.initializeFuse();
  }

  /**
   * Initialize Fuse.js for fuzzy search
   */
  private initializeFuse(): void {
    const searchableColumns = this.columns
      .filter(col => col.searchable)
      .map(col => col.key);

    this.fuse = new Fuse(this.data, {
      keys: searchableColumns.map(key => ({
        name: key,
        weight: this.getFieldWeight(key)
      })),
      threshold: 0.3,
      includeScore: true,
    });
  }

  /**
   * Get field weight for search relevance
   */
  private getFieldWeight(key: string): number {
    const weights: Record<string, number> = {
      'name': 1.0,
      'title': 1.0,
      'email': 0.9,
      'id': 0.8,
      'description': 0.7,
      'category': 0.6,
      'type': 0.6,
    };

    return weights[key.toLowerCase()] || 0.5;
  }

  /**
   * Search data with fuzzy matching
   */
  search(query: string): JsonData[] {
    if (!query.trim()) return this.data;

    const results = this.fuse.search(query);
    return results.map(result => result.item);
  }

  /**
   * Sort data by column
   */
  sort(data: JsonData[], column: string, direction: 'asc' | 'desc'): JsonData[] {
    return [...data].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      if (aVal === null || aVal === undefined) return direction === 'asc' ? 1 : -1;
      if (bVal === null || bVal === undefined) return direction === 'asc' ? -1 : 1;

      // Handle different data types
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (aVal instanceof Date && bVal instanceof Date) {
        return direction === 'asc' 
          ? aVal.getTime() - bVal.getTime()
          : bVal.getTime() - aVal.getTime();
      }

      // Convert to string for comparison
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      return direction === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }

  /**
   * Filter data by multiple criteria using advanced filter groups
   */
  filter(data: JsonData[], filterGroups: FilterGroup[]): JsonData[] {
    if (filterGroups.length === 0) return data;

    return data.filter(item => {
      return filterGroups.some(group => {
        if (group.conditions.length === 0) return true;
        
        const conditionResults = group.conditions.map(condition => 
          this.applyCondition(item, condition)
        );
        
        return group.operator === 'AND' 
          ? conditionResults.every(result => result)
          : conditionResults.some(result => result);
      });
    });
  }

  /**
   * Apply single condition to item
   */
  private applyCondition(item: JsonData, condition: FilterCondition): boolean {
    const value = item[condition.column];
    
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'not_equals':
        return value !== condition.value;
      case 'contains':
        return String(value).toLowerCase().includes(String(condition.value).toLowerCase());
      case 'not_contains':
        return !String(value).toLowerCase().includes(String(condition.value).toLowerCase());
      case 'starts_with':
        return String(value).toLowerCase().startsWith(String(condition.value).toLowerCase());
      case 'ends_with':
        return String(value).toLowerCase().endsWith(String(condition.value).toLowerCase());
      case 'greater_than':
        return Number(value) > Number(condition.value);
      case 'less_than':
        return Number(value) < Number(condition.value);
      case 'greater_equal':
        return Number(value) >= Number(condition.value);
      case 'less_equal':
        return Number(value) <= Number(condition.value);
      case 'between':
        if (!Array.isArray(condition.value) || condition.value.length !== 2) return false;
        const [min, max] = condition.value;
        return Number(value) >= Number(min) && Number(value) <= Number(max);
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value);
      case 'not_in':
        return Array.isArray(condition.value) && !condition.value.includes(value);
      case 'is_empty':
        return value === null || value === undefined || value === '';
      case 'is_not_empty':
        return value !== null && value !== undefined && value !== '';
      default:
        return true;
    }
  }

  /**
   * Paginate data
   */
  paginate(data: JsonData[], page: number, pageSize: number): {
    data: JsonData[];
    totalPages: number;
    totalItems: number;
  } {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / pageSize);

    return {
      data: paginatedData,
      totalPages,
      totalItems: data.length,
    };
  }

  /**
   * Get unique values for a column
   */
  getUniqueValues(column: string): any[] {
    const values = this.data
      .map(item => item[column])
      .filter(value => value !== null && value !== undefined);

    return [...new Set(values)];
  }

  /**
   * Get category counts for a column
   */
  getCategoryCounts(column: string): Record<string, number> {
    const counts: Record<string, number> = {};
    
    this.data.forEach(item => {
      const value = item[column];
      if (value !== null && value !== undefined) {
        const key = String(value);
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    return counts;
  }

  /**
   * Generate statistics cards
   */
  generateStats(data: JsonData[]): StatCard[] {
    const stats: StatCard[] = [];

    // Total count
    stats.push({
      label: 'Total Items',
      value: data.length,
      type: 'count',
    });

    // Column-specific stats
    this.columns.forEach(column => {
      if (column.type === 'number') {
        const values = data
          .map(item => item[column.key])
          .filter(value => typeof value === 'number');

        if (values.length > 0) {
          const sum = values.reduce((a, b) => a + b, 0);
          const avg = sum / values.length;
          const min = Math.min(...values);
          const max = Math.max(...values);

          stats.push({
            label: `${column.label} (Sum)`,
            value: sum.toLocaleString(),
            type: 'sum',
            column: column.key,
          });

          stats.push({
            label: `${column.label} (Avg)`,
            value: avg.toFixed(2),
            type: 'avg',
            column: column.key,
          });

          stats.push({
            label: `${column.label} (Min)`,
            value: min.toLocaleString(),
            type: 'min',
            column: column.key,
          });

          stats.push({
            label: `${column.label} (Max)`,
            value: max.toLocaleString(),
            type: 'max',
            column: column.key,
          });
        }
      } else if (column.type === 'string') {
        const uniqueValues = new Set(
          data.map(item => item[column.key]).filter(value => value !== null && value !== undefined)
        );

        stats.push({
          label: `${column.label} (Unique)`,
          value: uniqueValues.size,
          type: 'distinct',
          column: column.key,
        });
      }
    });

    return stats;
  }

  /**
   * Export data to CSV format
   */
  exportToCSV(data: JsonData[], columns: ColumnSchema[]): string {
    const headers = columns.map(col => col.label).join(',');
    const rows = data.map(item => 
      columns.map(col => {
        const value = item[col.key];
        if (value === null || value === undefined) return '';
        
        // Escape CSV values
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    );

    return [headers, ...rows].join('\n');
  }

  /**
   * Export data to JSON format
   */
  exportToJSON(data: JsonData[]): string {
    return JSON.stringify(data, null, 2);
  }

  /**
   * Get processed data with all operations applied
   */
  getProcessedData(options: {
    searchQuery?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    filterGroups?: FilterGroup[];
    page?: number;
    pageSize?: number;
  }): {
    data: JsonData[];
    totalPages: number;
    totalItems: number;
    stats: StatCard[];
  } {
    let processedData = this.data;

    // Apply search
    if (options.searchQuery) {
      processedData = this.search(options.searchQuery);
    }

    // Apply filters
    if (options.filterGroups && options.filterGroups.length > 0) {
      processedData = this.filter(processedData, options.filterGroups);
    }

    // Apply sorting
    if (options.sortBy) {
      processedData = this.sort(
        processedData, 
        options.sortBy, 
        options.sortDirection || 'asc'
      );
    }

    // Generate stats from filtered data
    const stats = this.generateStats(processedData);

    // Apply pagination
    const page = options.page || 1;
    const pageSize = options.pageSize || 20;
    const pagination = this.paginate(processedData, page, pageSize);

    return {
      ...pagination,
      stats,
    };
  }
}
