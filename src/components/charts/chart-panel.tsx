'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, LineChart, PieChart as PieChartIcon, X } from 'lucide-react';
import { JsonData, ColumnSchema } from '@/types';
import { ChartConfig, ChartFilter } from '@/types/chart.types';
import { useChartData, useChartConfigs } from '@/hooks/use-chart-data';
import { BarChart } from './bar-chart';
import { LineChart as LineChartComponent } from './line-chart';
import { PieChart } from './pie-chart';

interface ChartPanelProps {
  data: JsonData[];
  columns: ColumnSchema[];
  onFilter?: (filters: ChartFilter[]) => void;
  onDrillDown?: (field: string, value: any) => void;
}

export function ChartPanel({ data, columns, onFilter, onDrillDown }: ChartPanelProps) {
  const [activeCharts, setActiveCharts] = useState<ChartConfig[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [chartFilters, setChartFilters] = useState<ChartFilter[]>([]);
  
  const availableConfigs = useChartConfigs(columns);
  
  // Debug: Log available configs
  console.log('Available chart configs:', availableConfigs);
  console.log('Columns:', columns);

  const handleAddChart = (configId: string) => {
    const config = availableConfigs.find(c => c.id === configId);
    if (config && !activeCharts.find(c => c.id === configId)) {
      setActiveCharts(prev => [...prev, config]);
      setSelectedChart(configId);
    }
  };

  const handleRemoveChart = (configId: string) => {
    setActiveCharts(prev => prev.filter(c => c.id !== configId));
    if (selectedChart === configId) {
      setSelectedChart(prev => prev === configId ? null : prev);
    }
  };

  const handleDataClick = (chartData: any, config: ChartConfig) => {
    if (onDrillDown && chartData) {
      onDrillDown(config.xAxis, chartData.name);
    }
  };

  const handleFilter = (field: string, value: any) => {
    const newFilter: ChartFilter = {
      field,
      value,
      operator: 'equals'
    };
    
    const updatedFilters = [...chartFilters.filter(f => f.field !== field), newFilter];
    setChartFilters(updatedFilters);
    onFilter?.(updatedFilters);
  };

  const clearFilters = () => {
    setChartFilters([]);
    onFilter?.([]);
  };

  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-muted-foreground mb-2">No data available for charts</div>
            <div className="text-sm text-muted-foreground">
              Load JSON data to create visualizations
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Debug: Show available configs when no charts are active
  if (availableConfigs.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-muted-foreground mb-2">No chart configurations available</div>
            <div className="text-sm text-muted-foreground">
              Your data needs both categorical and numeric columns to create charts
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Columns: {columns.length} | Numeric: {columns.filter(c => c.type === 'number').length} | Categorical: {columns.filter(c => ['string', 'boolean', 'date'].includes(c.type)).length}
            </div>
            <div className="mt-4">
              <Button 
                onClick={() => {
                  // Create a simple count chart using the first string column
                  const firstStringCol = columns.find(c => c.type === 'string');
                  if (firstStringCol) {
                    const config = {
                      id: `count-${firstStringCol.key}`,
                      title: `Count by ${firstStringCol.label}`,
                      type: 'bar' as const,
                      xAxis: firstStringCol.key,
                      yAxis: 'count' as const,
                      description: `Count chart for ${firstStringCol.label}`
                    };
                    setActiveCharts([config]);
                  }
                }}
                variant="outline"
                size="sm"
              >
                Create Count Chart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {/* Chart Controls */}
      <Card className="mb-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Data Visualizations
              <Badge variant="secondary">
                {activeCharts.length} active
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              {chartFilters.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Filters ({chartFilters.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Add Chart */}
          <div className="flex items-center gap-2">
            <Select onValueChange={handleAddChart}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Add a chart..." />
              </SelectTrigger>
              <SelectContent>
                {availableConfigs.map((config) => (
                  <SelectItem key={config.id} value={config.id}>
                    <div className="flex items-center gap-2">
                      {config.type === 'bar' && <BarChart3 className="h-4 w-4" />}
                      {config.type === 'line' && <LineChart className="h-4 w-4" />}
                      {config.type === 'pie' && <PieChartIcon className="h-4 w-4" />}
                      <span>{config.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveCharts([])}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          </div>

          {/* Active Charts */}
          {activeCharts.length > 0 && (
            <div className="space-y-4">
              <Tabs value={selectedChart || activeCharts[0]?.id} onValueChange={setSelectedChart}>
                <TabsList className="grid w-full grid-cols-3">
                  {activeCharts.map((chart) => (
                    <TabsTrigger key={chart.id} value={chart.id} className="flex items-center gap-2">
                      {chart.type === 'bar' && <BarChart3 className="h-3 w-3" />}
                      {chart.type === 'line' && <LineChart className="h-3 w-3" />}
                      {chart.type === 'pie' && <PieChartIcon className="h-3 w-3" />}
                      <span className="truncate">{chart.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveChart(chart.id);
                        }}
                        className="h-4 w-4 p-0 ml-1"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {activeCharts.map((chart) => (
                  <TabsContent key={chart.id} value={chart.id} className="mt-4">
                    <ChartRenderer
                      config={chart}
                      data={data}
                      filters={chartFilters}
                      onDataClick={(data) => handleDataClick(data, chart)}
                      onFilter={handleFilter}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface ChartRendererProps {
  config: ChartConfig;
  data: JsonData[];
  filters: ChartFilter[];
  onDataClick?: (data: any) => void;
  onFilter?: (field: string, value: any) => void;
}

function ChartRenderer({ config, data, filters, onDataClick, onFilter }: ChartRendererProps) {
  const { data: chartData, stats, isEmpty } = useChartData(data, [], config, filters);

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <div className="text-lg font-medium">No data available</div>
          <div className="text-sm">Try adjusting your filters or data selection</div>
        </div>
      </div>
    );
  }

  const commonProps = {
    data: chartData,
    title: config.title,
    xAxis: config.xAxis,
    yAxis: config.yAxis,
    onDataClick,
    options: {
      interactive: true,
      showTooltip: true,
      animation: true
    }
  };

  return (
    <div className="space-y-4">
      {/* Chart Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.categories}
          </div>
          <div className="text-sm text-muted-foreground">Categories</div>
        </div>
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.total.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Total</div>
        </div>
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.average.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">Average</div>
        </div>
        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.max.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Maximum</div>
        </div>
      </div>

      {/* Chart Component */}
      <Card>
        <CardContent className="p-6">
          {config.type === 'bar' && <BarChart {...commonProps} />}
          {config.type === 'line' && <LineChartComponent {...commonProps} />}
          {config.type === 'pie' && <PieChart {...commonProps} />}
        </CardContent>
      </Card>
    </div>
  );
}
