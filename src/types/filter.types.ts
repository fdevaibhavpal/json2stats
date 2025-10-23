export type FilterOperator = 
  | 'equals' 
  | 'not_equals'
  | 'contains' 
  | 'not_contains'
  | 'starts_with' 
  | 'ends_with'
  | 'greater_than' 
  | 'less_than'
  | 'greater_equal'
  | 'less_equal'
  | 'between'
  | 'in'
  | 'not_in'
  | 'is_empty'
  | 'is_not_empty';

export type FilterType = 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean';

export interface FilterCondition {
  id: string;
  column: string;
  operator: FilterOperator;
  value: any;
  type: FilterType;
}

export interface FilterGroup {
  id: string;
  conditions: FilterCondition[];
  operator: 'AND' | 'OR';
}

export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  filterGroup: FilterGroup;
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterState {
  activeFilters: FilterGroup[];
  presets: FilterPreset[];
  selectedPreset?: string;
}

export interface FilterConfig {
  column: string;
  type: FilterType;
  operators: FilterOperator[];
  options?: Array<{ label: string; value: any }>;
  min?: number;
  max?: number;
  step?: number;
}
