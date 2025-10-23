'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Calendar, Hash, Type, CheckSquare } from 'lucide-react';
import { FilterCondition, FilterConfig } from '@/types/filter.types';

interface FilterConditionProps {
  condition: FilterCondition;
  config: FilterConfig;
  onChange: (condition: FilterCondition) => void;
  onRemove: () => void;
}

export function FilterConditionComponent({ 
  condition, 
  config, 
  onChange, 
  onRemove 
}: FilterConditionProps) {
  const [value, setValue] = useState(condition.value);

  const handleOperatorChange = (operator: string) => {
    onChange({
      ...condition,
      operator: operator as any,
    });
  };

  const handleValueChange = (newValue: any) => {
    setValue(newValue);
    onChange({
      ...condition,
      value: newValue,
    });
  };

  const getOperatorLabel = (operator: string) => {
    const labels: Record<string, string> = {
      equals: 'equals',
      not_equals: 'not equals',
      contains: 'contains',
      not_contains: 'not contains',
      starts_with: 'starts with',
      ends_with: 'ends with',
      greater_than: 'greater than',
      less_than: 'less than',
      greater_equal: 'greater or equal',
      less_equal: 'less or equal',
      between: 'between',
      in: 'in',
      not_in: 'not in',
      is_empty: 'is empty',
      is_not_empty: 'is not empty',
    };
    return labels[operator] || operator;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'number': return <Hash className="h-4 w-4" />;
      case 'date': return <Calendar className="h-4 w-4" />;
      case 'boolean': return <CheckSquare className="h-4 w-4" />;
      default: return <Type className="h-4 w-4" />;
    }
  };

  const renderValueInput = () => {
    if (condition.operator === 'is_empty' || condition.operator === 'is_not_empty') {
      return null;
    }

    if (condition.operator === 'between') {
    return (
      <div className="flex items-center gap-1">
        <Input
          type={config.type === 'number' ? 'number' : 'text'}
          placeholder="Min"
          value={Array.isArray(value) ? value[0] || '' : ''}
          onChange={(e) => {
            const newValue = Array.isArray(value) ? [e.target.value, value[1]] : [e.target.value, ''];
            handleValueChange(newValue);
          }}
          className="w-20 h-6 text-xs min-w-20"
        />
        <span className="text-xs text-muted-foreground">to</span>
        <Input
          type={config.type === 'number' ? 'number' : 'text'}
          placeholder="Max"
          value={Array.isArray(value) ? value[1] || '' : ''}
          onChange={(e) => {
            const newValue = Array.isArray(value) ? [value[0], e.target.value] : ['', e.target.value];
            handleValueChange(newValue);
          }}
          className="w-20 h-6 text-xs min-w-20"
        />
      </div>
    );
    }

    if (config.options) {
      return (
        <Select value={String(value)} onValueChange={handleValueChange}>
          <SelectTrigger className="w-24 h-6 text-xs min-w-24">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {config.options.map((option) => (
              <SelectItem key={String(option.value)} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        type={config.type === 'number' ? 'number' : config.type === 'date' ? 'date' : 'text'}
        value={String(value || '')}
        onChange={(e) => handleValueChange(e.target.value)}
        placeholder="Value"
        className="w-24 h-6 text-xs min-w-24"
      />
    );
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded border text-xs min-w-fit">
      <div className="flex items-center gap-1 flex-shrink-0">
        {getTypeIcon(config.type)}
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
          {config.column}
        </span>
      </div>
      
      <Select value={condition.operator} onValueChange={handleOperatorChange}>
        <SelectTrigger className="w-24 h-6 text-xs min-w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {config.operators.map((operator) => (
            <SelectItem key={operator} value={operator}>
              {getOperatorLabel(operator)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {renderValueInput()}

      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
