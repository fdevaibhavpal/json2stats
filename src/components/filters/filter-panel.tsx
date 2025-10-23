'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, X, Plus, Bookmark } from 'lucide-react';
import { FilterGroup, FilterPreset } from '@/types/filter.types';
import { FilterGroupComponent } from './filter-group';
import { FilterPresetsComponent } from './filter-presets';
import { useFilterManager } from '@/hooks/use-filter-manager';
import { ColumnSchema } from '@/types';

interface FilterPanelProps {
  columns: ColumnSchema[];
  onFiltersChange: (filters: FilterGroup[]) => void;
}

export function FilterPanel({ columns, onFiltersChange }: FilterPanelProps) {
  const {
    filterState,
    filterConfigs,
    addFilter,
    removeFilter,
    updateFilter,
    clearAllFilters,
    savePreset,
    loadPreset,
    deletePreset,
  } = useFilterManager(columns);

  const [activeTab, setActiveTab] = useState('filters');

  const handleAddFilterGroup = () => {
    const newFilterGroup: FilterGroup = {
      id: `group_${Date.now()}`,
      conditions: [],
      operator: 'AND',
    };
    addFilter(newFilterGroup);
  };

  const handleFilterChange = () => {
    onFiltersChange(filterState.activeFilters);
  };

  const handleSavePreset = (name: string) => {
    savePreset(name);
  };

  const handleLoadPreset = (presetId: string) => {
    loadPreset(presetId);
    onFiltersChange(filterState.activeFilters);
  };

  const handleDeletePreset = (presetId: string) => {
    deletePreset(presetId);
  };

  const activeFiltersCount = filterState.activeFilters.reduce(
    (total, group) => total + group.conditions.length,
    0
  );

  return (
    <div className="space-y-3">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs h-6 px-2"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Compact Filter Groups */}
      <div className="space-y-2">
        {filterState.activeFilters.map((filterGroup) => (
          <div key={filterGroup.id} className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-800/50">
            <FilterGroupComponent
              filterGroup={filterGroup}
              filterConfigs={filterConfigs}
              onChange={(updatedGroup) => {
                updateFilter(filterGroup.id, updatedGroup);
                handleFilterChange();
              }}
              onRemove={() => {
                removeFilter(filterGroup.id);
                handleFilterChange();
              }}
              onSaveAsPreset={handleSavePreset}
            />
          </div>
        ))}
        
        <Button
          variant="outline"
          onClick={handleAddFilterGroup}
          className="w-full h-8 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Filter
        </Button>
      </div>

      {/* Compact Presets */}
      {filterState.presets.length > 0 && (
        <div className="border-t pt-3">
          <div className="flex items-center gap-2 mb-2">
            <Bookmark className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Presets</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {filterState.presets.slice(0, 3).map((preset) => (
              <Button
                key={preset.id}
                variant="ghost"
                size="sm"
                onClick={() => handleLoadPreset(preset.id)}
                className="h-6 px-2 text-xs"
              >
                {preset.name}
              </Button>
            ))}
            {filterState.presets.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('presets')}
                className="h-6 px-2 text-xs"
              >
                +{filterState.presets.length - 3} more
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
