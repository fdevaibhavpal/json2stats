'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart,
  Eye,
  Zap,
  Check
} from 'lucide-react';
import { ColumnSchema } from '@/types';
import { ChartType } from '@/types/chart.types';

interface DimensionBuilderProps {
  columns: ColumnSchema[];
  chartType: ChartType;
  onDimensionsSelect: (xAxis: string, yAxis: string, groupBy?: string) => void;
  dataPreview?: {
    categories: number;
    total: number;
  };
}

export function DimensionBuilder({ columns, chartType, onDimensionsSelect }: DimensionBuilderProps) {
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [groupBy, setGroupBy] = useState<string>('none');

  const numericColumns = columns.filter(col => col.type === 'number');
  const categoricalColumns = columns.filter(col => 
    col.type === 'string' || col.type === 'boolean' || col.type === 'date'
  );
  const dateColumns = columns.filter(col => col.type === 'date');

  const smartSuggestions = useMemo(() => {
    const suggestions = [];

    // Bar chart suggestions
    if (chartType === 'bar') {
      if (categoricalColumns.length > 0 && numericColumns.length > 0) {
        suggestions.push({
          name: 'Value by Category',
          description: 'Compare numeric values across categories',
          xAxis: categoricalColumns[0]?.key,
          yAxis: numericColumns[0]?.key,
          icon: BarChart3,
          color: 'from-blue-500 to-blue-600'
        });
      }
      if (categoricalColumns.length > 0) {
        suggestions.push({
          name: 'Count by Category',
          description: 'Count occurrences in each category',
          xAxis: categoricalColumns[0]?.key,
          yAxis: 'count',
          icon: BarChart3,
          color: 'from-green-500 to-green-600'
        });
      }
    }

    // Line chart suggestions
    if (chartType === 'line' && dateColumns.length > 0 && numericColumns.length > 0) {
      suggestions.push({
        name: 'Trend Over Time',
        description: 'Show how values change over time',
        xAxis: dateColumns[0]?.key,
        yAxis: numericColumns[0]?.key,
        icon: TrendingUp,
        color: 'from-green-500 to-green-600'
      });
    }

    // Pie chart suggestions
    if (chartType === 'pie' && categoricalColumns.length > 0) {
      suggestions.push({
        name: 'Distribution',
        description: 'Show proportion of each category',
        xAxis: categoricalColumns[0]?.key,
        yAxis: 'count',
        icon: PieChart,
        color: 'from-purple-500 to-purple-600'
      });
    }

    return suggestions;
  }, [chartType, categoricalColumns, numericColumns, dateColumns]);

  const handleSuggestionClick = (suggestion: {
    xAxis: string;
    yAxis: string;
  }) => {
    setXAxis(suggestion.xAxis);
    setYAxis(suggestion.yAxis);
    setGroupBy('none');
  };

  const handleCreateChart = () => {
    if (xAxis && yAxis) {
      onDimensionsSelect(xAxis, yAxis, groupBy === 'none' ? undefined : groupBy);
    }
  };

  const canCreateChart = xAxis && yAxis;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Configure Dimensions</h3>
        <p className="text-sm text-muted-foreground">
          Choose what data to visualize and how
        </p>
      </div>

      {/* Smart Suggestions */}
      {smartSuggestions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Smart Suggestions</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {smartSuggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-all duration-200"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-linear-to-r ${suggestion.color} flex items-center justify-center`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{suggestion.name}</h4>
                        <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Manual Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* X-Axis Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">X-Axis (Categories)</label>
              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category column" />
                </SelectTrigger>
                <SelectContent>
                  {categoricalColumns.map((col) => (
                    <SelectItem key={col.key} value={col.key}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        {col.label}
                        <Badge variant="outline" className="text-xs">
                          {col.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Y-Axis Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Y-Axis (Values)</label>
              <Select value={yAxis} onValueChange={setYAxis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select value column" />
                </SelectTrigger>
                <SelectContent>
                  {numericColumns.map((col) => (
                    <SelectItem key={col.key} value={col.key}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        {col.label}
                        <Badge variant="outline" className="text-xs">
                          {col.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="count">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      Count
                      <Badge variant="outline" className="text-xs">
                        calculated
                      </Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Group By (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Group By (Optional)</label>
            <Select value={groupBy} onValueChange={setGroupBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select grouping column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No grouping</SelectItem>
                {categoricalColumns.map((col) => (
                  <SelectItem key={col.key} value={col.key}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      {col.label}
                      <Badge variant="outline" className="text-xs">
                        {col.type}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          {xAxis && yAxis && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Preview</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {chartType === 'bar' && 'Bar chart showing '}
                {chartType === 'line' && 'Line chart showing '}
                {chartType === 'pie' && 'Pie chart showing '}
                <strong>{yAxis === 'count' ? 'count' : columns.find(c => c.key === yAxis)?.label}</strong>
                {' by '}
                <strong>{columns.find(c => c.key === xAxis)?.label}</strong>
                {groupBy && (
                  <>
                    {' grouped by '}
                    <strong>{columns.find(c => c.key === groupBy)?.label}</strong>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Create Chart Button */}
          <Button 
            onClick={handleCreateChart}
            disabled={!canCreateChart}
            className="w-full"
          >
            <Check className="h-4 w-4 mr-2" />
            Create Chart
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
