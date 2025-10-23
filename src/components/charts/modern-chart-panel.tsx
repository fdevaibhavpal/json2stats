'use client';

import { useState } from 'react';
import { Card, CardContent} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  LineChart, 
  PieChart as PieChartIcon, 
  Plus, 
  X, 
  Target
} from 'lucide-react';
import { JsonData, ColumnSchema } from '@/types';
import { ChartConfig, ChartFilter } from '@/types/chart.types';
import { useChartData } from '@/hooks/use-chart-data';
import { BarChart } from './bar-chart';
import { LineChart as LineChartComponent } from './line-chart';
import { PieChart } from './pie-chart';
import { AnalyticsBuilder } from './analytics-builder';
import { FilterManager } from './filter-manager';

interface ModernChartPanelProps {
  data: JsonData[];
  columns: ColumnSchema[];
  onFilter?: (filters: ChartFilter[]) => void;
  onDrillDown?: (field: string, value: string) => void;
}

export function ModernChartPanel({ data, columns, onFilter, onDrillDown }: ModernChartPanelProps) {
  const [activeCharts, setActiveCharts] = useState<ChartConfig[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [chartFilters, setChartFilters] = useState<ChartFilter[]>([]);
  const [activeTab, setActiveTab] = useState<'builder' | 'charts'>('builder');

  const handleChartCreate = (config: ChartConfig) => {
    // Ensure proper title generation
    const xAxisColumn = columns.find(c => c.key === config.xAxis);
    const yAxisColumn = config.yAxis === 'count' ? 'Count' : columns.find(c => c.key === config.yAxis)?.label;
    
    const updatedConfig = {
      ...config,
      title: `${yAxisColumn || 'Value'} by ${xAxisColumn?.label || 'Category'}`
    };
    
    setActiveCharts(prev => [...prev, updatedConfig]);
    setSelectedChart(updatedConfig.id);
    setActiveTab('charts');
  };

  const handleChartRemove = (chartId: string) => {
    setActiveCharts(prev => prev.filter(c => c.id !== chartId));
    if (selectedChart === chartId) {
      setSelectedChart(prev => prev === chartId ? null : prev);
    }
  };

  const handleFiltersChange = (filters: ChartFilter[]) => {
    setChartFilters(filters);
    onFilter?.(filters);
  };

  const handleDataClick = (chartData: JsonData, config: ChartConfig) => {
    if (onDrillDown && chartData) {
      onDrillDown(config.xAxis, chartData.name);
    }
  };

  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-muted-foreground mb-2">No data available for charts</div>
            <div className="text-sm text-muted-foreground">
              Load JSON data to create visualizations
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {activeCharts.length} charts
          </Badge>
          {activeCharts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveCharts([])}
            >
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filter Manager */}
      <FilterManager
        columns={columns}
        filters={chartFilters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'builder' | 'charts')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Charts
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2" disabled={activeCharts.length === 0}>
            <BarChart3 className="h-4 w-4" />
            View Charts ({activeCharts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="mt-6">
          <AnalyticsBuilder
            columns={columns}
            data={data}
            onChartCreate={handleChartCreate}
          />
        </TabsContent>

        <TabsContent value="charts" className="mt-6">
          {activeCharts.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="text-muted-foreground mb-2">No charts created yet</div>
                  <div className="text-sm text-muted-foreground">
                    Use the Create Charts tab to build your first visualization
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Chart Tabs */}
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
                          handleChartRemove(chart.id);
                        }}
                        className="h-4 w-4 p-0 ml-1"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {activeCharts.map((chart) => (
                  <TabsContent key={chart.id} value={chart.id} className="mt-6">
                    <ChartRenderer
                      config={chart}
                      data={data}
                      filters={chartFilters}
                      onDataClick={(data) => handleDataClick(data, chart)}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ChartRendererProps {
  config: ChartConfig;
  data: JsonData[];
  filters: ChartFilter[];
  onDataClick?: (data: JsonData) => void;
}

function ChartRenderer({ config, data, filters, onDataClick }: ChartRendererProps) {
  const { data: chartData, stats, isEmpty } = useChartData(data, [], config, filters);

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-muted-foreground mb-2">No data available</div>
            <div className="text-sm text-muted-foreground">
              Try adjusting your filters or data selection
            </div>
          </div>
        </CardContent>
      </Card>
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
