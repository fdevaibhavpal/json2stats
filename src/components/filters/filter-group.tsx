'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, Filter } from 'lucide-react';
import { FilterGroup as FilterGroupType, FilterCondition, FilterConfig } from '@/types/filter.types';
import { FilterConditionComponent } from './filter-condition';

interface FilterGroupProps {
  filterGroup: FilterGroupType;
  filterConfigs: Record<string, FilterConfig>;
  onChange: (filterGroup: FilterGroupType) => void;
  onRemove: () => void;
  onSaveAsPreset?: (name: string) => void;
}

export function FilterGroupComponent({
  filterGroup,
  filterConfigs,
  onChange,
  onRemove,
  onSaveAsPreset
}: FilterGroupProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');

  const addCondition = () => {
    const newCondition: FilterCondition = {
      id: `condition_${Date.now()}`,
      column: Object.keys(filterConfigs)[0] || '',
      operator: 'equals',
      value: '',
      type: 'text',
    };

    onChange({
      ...filterGroup,
      conditions: [...filterGroup.conditions, newCondition],
    });
  };

  const updateCondition = (conditionId: string, updatedCondition: FilterCondition) => {
    onChange({
      ...filterGroup,
      conditions: filterGroup.conditions.map(c => 
        c.id === conditionId ? updatedCondition : c
      ),
    });
  };

  const removeCondition = (conditionId: string) => {
    onChange({
      ...filterGroup,
      conditions: filterGroup.conditions.filter(c => c.id !== conditionId),
    });
  };

  const handleSavePreset = () => {
    if (presetName.trim() && onSaveAsPreset) {
      onSaveAsPreset(presetName.trim());
      setPresetName('');
      setShowSaveDialog(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Compact Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs whitespace-nowrap">
            {filterGroup.conditions.length} filter{filterGroup.conditions.length !== 1 ? 's' : ''}
          </Badge>
          <Select 
            value={filterGroup.operator} 
            onValueChange={(value) => onChange({ ...filterGroup, operator: value as 'AND' | 'OR' })}
          >
            <SelectTrigger className="w-20 h-6 text-xs min-w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">AND</SelectItem>
              <SelectItem value="OR">OR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-1">
          {onSaveAsPreset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSaveDialog(true)}
              className="h-6 w-6 p-0"
            >
              <Save className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Compact Conditions */}
      <div className="space-y-1">
        {filterGroup.conditions.map((condition, index) => (
          <div key={condition.id} className="flex items-center gap-1">
            {index > 0 && (
              <span className="text-xs text-muted-foreground px-1">
                {filterGroup.operator}
              </span>
            )}
            
            <FilterConditionComponent
              condition={condition}
              config={filterConfigs[condition.column]}
              onChange={(updatedCondition) => updateCondition(condition.id, updatedCondition)}
              onRemove={() => removeCondition(condition.id)}
            />
          </div>
        ))}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={addCondition}
          className="w-full h-6 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Condition
        </Button>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded border">
          <Input
            placeholder="Preset name"
            value={presetName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPresetName(e.target.value)}
            className="flex-1 h-6 text-xs"
          />
          <Button size="sm" onClick={handleSavePreset} disabled={!presetName.trim()} className="h-6 text-xs">
            Save
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setShowSaveDialog(false);
              setPresetName('');
            }}
            className="h-6 text-xs"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
