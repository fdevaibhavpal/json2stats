'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bookmark, MoreHorizontal, Trash2, Play, Save } from 'lucide-react';
import { FilterPreset } from '@/types/filter.types';

interface FilterPresetsProps {
  presets: FilterPreset[];
  selectedPreset?: string;
  onLoadPreset: (presetId: string) => void;
  onDeletePreset: (presetId: string) => void;
  onSaveCurrentAsPreset: (name: string) => void;
}

export function FilterPresetsComponent({
  presets,
  selectedPreset,
  onLoadPreset,
  onDeletePreset,
  onSaveCurrentAsPreset
}: FilterPresetsProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');

  const handleSavePreset = () => {
    if (presetName.trim()) {
      onSaveCurrentAsPreset(presetName.trim());
      setPresetName('');
      setShowSaveDialog(false);
    }
  };

  if (presets.length === 0 && !showSaveDialog) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No saved filter presets</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveDialog(true)}
              className="mt-2"
            >
              <Save className="h-3 w-3 mr-1" />
              Save Current Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Filter Presets
          </CardTitle>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
            className="text-xs"
          >
            <Save className="h-3 w-3 mr-1" />
            Save Current
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {presets.map((preset) => (
          <div
            key={preset.id}
            className={`flex items-center justify-between p-2 rounded-lg border ${
              selectedPreset === preset.id 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                : 'bg-slate-50 dark:bg-slate-800'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">{preset.name}</h4>
                {selectedPreset === preset.id && (
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
              {preset.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {preset.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {preset.filterGroup.conditions.length} condition{preset.filterGroup.conditions.length !== 1 ? 's' : ''} • 
                Created {preset.createdAt.toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLoadPreset(preset.id)}
                className="h-6 w-6 p-0"
              >
                <Play className="h-3 w-3" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onLoadPreset(preset.id)}>
                    <Play className="h-3 w-3 mr-2" />
                    Load
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDeletePreset(preset.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}

        {showSaveDialog && (
          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <input
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border rounded"
            />
            <Button size="sm" onClick={handleSavePreset} disabled={!presetName.trim()}>
              Save
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setShowSaveDialog(false);
                setPresetName('');
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
