import { useState, useCallback, useMemo } from 'react';
import { FilterCondition, FilterGroup, FilterPreset, FilterState, FilterConfig, FilterOperator } from '@/types/filter.types';
import { ColumnSchema } from '@/types';

export function useFilterManager(columns: ColumnSchema[]) {
  const [filterState, setFilterState] = useState<FilterState>({
    activeFilters: [],
    presets: [],
  });

  // Generate filter configurations based on column types
  const filterConfigs = useMemo((): Record<string, FilterConfig> => {
    const configs: Record<string, FilterConfig> = {};
    
    columns.forEach(column => {
      const baseConfig: FilterConfig = {
        column: column.key,
        type: column.type === 'number' ? 'number' : 
              column.type === 'date' ? 'date' :
              column.type === 'boolean' ? 'boolean' : 'text',
        operators: getOperatorsForType(column.type),
      };

      // Add specific configurations based on column type
      if (column.type === 'number') {
        configs[column.key] = {
          ...baseConfig,
          type: 'number',
          operators: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_equal', 'less_equal', 'between', 'is_empty', 'is_not_empty'],
        };
      } else if (column.type === 'date') {
        configs[column.key] = {
          ...baseConfig,
          type: 'date',
          operators: ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_equal', 'less_equal', 'between', 'is_empty', 'is_not_empty'],
        };
      } else if (column.type === 'boolean') {
        configs[column.key] = {
          ...baseConfig,
          type: 'boolean',
          operators: ['equals', 'not_equals'],
          options: [
            { label: 'True', value: true },
            { label: 'False', value: false },
          ],
        };
      } else {
        configs[column.key] = {
          ...baseConfig,
          type: 'text',
          operators: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty'],
        };
      }
    });

    return configs;
  }, [columns]);

  const addFilter = useCallback((filterGroup: FilterGroup) => {
    setFilterState(prev => ({
      ...prev,
      activeFilters: [...prev.activeFilters, filterGroup],
    }));
  }, []);

  const removeFilter = useCallback((filterId: string) => {
    setFilterState(prev => ({
      ...prev,
      activeFilters: prev.activeFilters.filter(f => f.id !== filterId),
    }));
  }, []);

  const updateFilter = useCallback((filterId: string, updatedFilter: FilterGroup) => {
    setFilterState(prev => ({
      ...prev,
      activeFilters: prev.activeFilters.map(f => 
        f.id === filterId ? updatedFilter : f
      ),
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilterState(prev => ({
      ...prev,
      activeFilters: [],
      selectedPreset: undefined,
    }));
  }, []);

  const savePreset = useCallback((name: string, description?: string) => {
    const newPreset: FilterPreset = {
      id: `preset_${Date.now()}`,
      name,
      description,
      filterGroup: {
        id: `group_${Date.now()}`,
        conditions: filterState.activeFilters.flatMap(f => f.conditions),
        operator: 'AND',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setFilterState(prev => ({
      ...prev,
      presets: [...prev.presets, newPreset],
    }));
  }, [filterState.activeFilters]);

  const loadPreset = useCallback((presetId: string) => {
    const preset = filterState.presets.find(p => p.id === presetId);
    if (preset) {
      setFilterState(prev => ({
        ...prev,
        activeFilters: [preset.filterGroup],
        selectedPreset: presetId,
      }));
    }
  }, [filterState.presets]);

  const deletePreset = useCallback((presetId: string) => {
    setFilterState(prev => ({
      ...prev,
      presets: prev.presets.filter(p => p.id !== presetId),
      selectedPreset: prev.selectedPreset === presetId ? undefined : prev.selectedPreset,
    }));
  }, []);

  return {
    filterState,
    filterConfigs,
    addFilter,
    removeFilter,
    updateFilter,
    clearAllFilters,
    savePreset,
    loadPreset,
    deletePreset,
  };
}

function getOperatorsForType(columnType: string): FilterOperator[] {
  switch (columnType) {
    case 'number':
      return ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_equal', 'less_equal', 'between', 'is_empty', 'is_not_empty'];
    case 'date':
      return ['equals', 'not_equals', 'greater_than', 'less_than', 'greater_equal', 'less_equal', 'between', 'is_empty', 'is_not_empty'];
    case 'boolean':
      return ['equals', 'not_equals'];
    default:
      return ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty'];
  }
}
