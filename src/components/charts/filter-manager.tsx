'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  Plus,
  Search,
  Calendar,
  Hash,
  Type
} from 'lucide-react';
import { ColumnSchema } from '@/types';
import { ChartFilter } from '@/types/chart.types';

interface FilterManagerProps {
  columns: ColumnSchema[];
  filters: ChartFilter[];
  onFiltersChange: (filters: ChartFilter[]) => void;
}

export function FilterManager({ columns, filters, onFiltersChange }: FilterManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newFilter, setNewFilter] = useState({
    field: '',
    operator: 'equals' as const,
    value: ''
  });

  const addFilter = () => {
    if (newFilter.field && newFilter.value) {
      const filter: ChartFilter = {
        field: newFilter.field,
        operator: newFilter.operator,
        value: newFilter.value
      };
      onFiltersChange([...filters, filter]);
      setNewFilter({ field: '', operator: 'equals', value: '' });
    }
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
  };

  const getColumnIcon = (type: string) => {
    switch (type) {
      case 'number':
        return <Hash className="h-3 w-3" />;
      case 'date':
        return <Calendar className="h-3 w-3" />;
      default:
        return <Type className="h-3 w-3" />;
    }
  };

  const getOperatorLabel = (operator: string) => {
    switch (operator) {
      case 'equals': return 'equals';
      case 'contains': return 'contains';
      case 'greater_than': return 'greater than';
      case 'less_than': return 'less than';
      case 'between': return 'between';
      default: return operator;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            Filters
            {filters.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filters.length}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {filters.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Active Filters */}
      {filters.length > 0 && (
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => {
              const column = columns.find(c => c.key === filter.field);
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-1">
                    {column && getColumnIcon(column.type)}
                    <span className="text-sm font-medium">{column?.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {getOperatorLabel(filter.operator)}
                  </span>
                  <span className="text-sm font-medium">
                    {Array.isArray(filter.value) ? filter.value.join(' - ') : filter.value}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(index)}
                    className="h-5 w-5 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      )}

      {/* Add Filter Form */}
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Field Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Field</label>
                <select
                  value={newFilter.field}
                  onChange={(e) => setNewFilter({ ...newFilter, field: e.target.value })}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="">Select field</option>
                  {columns.map((col) => (
                    <option key={col.key} value={col.key}>
                      {col.label} ({col.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Operator Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Operator</label>
                <select
                  value={newFilter.operator}
                  onChange={(e) => setNewFilter({ ...newFilter, operator: e.target.value as any })}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="equals">equals</option>
                  <option value="contains">contains</option>
                  <option value="greater_than">greater than</option>
                  <option value="less_than">less than</option>
                  <option value="between">between</option>
                </select>
              </div>

              {/* Value Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Value</label>
                <Input
                  value={newFilter.value}
                  onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                  placeholder="Enter value"
                  className="text-sm"
                />
              </div>
            </div>

            <Button
              onClick={addFilter}
              disabled={!newFilter.field || !newFilter.value}
              size="sm"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Filter
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
