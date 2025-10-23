'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  LineChart, 
  PieChart,
  TrendingUp,
  Plus,
  Eye,
  Check,
  ArrowRight,
  Zap
} from 'lucide-react';
import { JsonData, ColumnSchema } from '@/types';
import { ChartConfig } from '@/types/chart.types';
import { useChartData } from '@/hooks/use-chart-data';
import { BarChart } from './bar-chart';
import { LineChart as LineChartComponent } from './line-chart';
import { PieChart as PieChartComponent } from './pie-chart';
import { TemplateGallery } from './template-gallery';
import { AdvancedBuilder } from './advanced-builder';
import { CleanChartRenderer } from './clean-chart-renderer';
import { useToast } from '@/hooks/use-toast';
import { ToastContainer } from '@/components/ui/toast';
import { ChartTemplate } from '@/lib/templates';

interface SimpleAnalyticsProps {
  data: JsonData[];
  columns: ColumnSchema[];
  onFilter?: (filters: any[]) => void;
  onDrillDown?: (field: string, value: any) => void;
}

export function SimpleAnalytics({ data, columns, onFilter, onDrillDown }: SimpleAnalyticsProps) {
  const [activeCharts, setActiveCharts] = useState<ChartConfig[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quick' | 'templates' | 'advanced'>('quick');
  const { toasts, removeToast, success, error } = useToast();

  // Get the best columns for charts
  const numericColumns = columns.filter(col => col.type === 'number');
  const categoricalColumns = columns.filter(col => 
    col.type === 'string' || col.type === 'boolean' || col.type === 'date'
  );

  const quickChartOptions = [
    {
      id: 'count-by-category',
      title: 'Count by Category',
      description: 'See how many items in each category',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
      type: 'bar' as const,
      xAxis: categoricalColumns[0]?.key || '',
      yAxis: 'count'
    },
    {
      id: 'value-by-category',
      title: 'Value by Category',
      description: 'Compare values across categories',
      icon: BarChart3,
      color: 'from-green-500 to-green-600',
      type: 'bar' as const,
      xAxis: categoricalColumns[0]?.key || '',
      yAxis: numericColumns[0]?.key || ''
    },
    {
      id: 'trend-over-time',
      title: 'Trend Over Time',
      description: 'Show how values change over time',
      icon: LineChart,
      color: 'from-purple-500 to-purple-600',
      type: 'line' as const,
      xAxis: columns.find(c => c.type === 'date')?.key || categoricalColumns[0]?.key || '',
      yAxis: numericColumns[0]?.key || 'count'
    },
    {
      id: 'distribution',
      title: 'Distribution',
      description: 'Show proportion of each category',
      icon: PieChart,
      color: 'from-orange-500 to-orange-600',
      type: 'pie' as const,
      xAxis: categoricalColumns[0]?.key || '',
      yAxis: 'count'
    }
  ].filter(option => option.xAxis && option.yAxis);

  const handleQuickChart = (option: typeof quickChartOptions[0]) => {
    try {
      // Validate that we have the required columns
      if (!option.xAxis || !option.yAxis) {
        error('Missing Configuration', 'Required columns are not available for this chart type.');
        return;
      }

      const xAxisColumn = columns.find(c => c.key === option.xAxis);
      const yAxisColumn = option.yAxis === 'count' ? 'Count' : columns.find(c => c.key === option.yAxis);
      
      if (!xAxisColumn) {
        error('Invalid X-Axis', 'The selected X-axis column is not available in your data.');
        return;
      }

      if (option.yAxis !== 'count' && !yAxisColumn) {
        error('Invalid Y-Axis', 'The selected Y-axis column is not available in your data.');
        return;
      }
      
      const config: ChartConfig = {
        id: `${option.id}-${Date.now()}`,
        title: `${typeof yAxisColumn === 'object' ? yAxisColumn?.label : 'Value'} by ${typeof xAxisColumn === 'object' ? xAxisColumn?.label : 'Category'}`,
        type: option.type,
        xAxis: option.xAxis,
        yAxis: option.yAxis,
        description: option.description
      };

      setActiveCharts(prev => [...prev, config]);
      setSelectedChart(config.id);
      success('Chart Created!', `Your ${option.title} chart has been created successfully.`);
    } catch (err) {
      console.error('Chart creation error:', err);
      error('Chart Creation Failed', 'There was an error creating your chart. Please try again.');
    }
  };

  const handleChartRemove = (chartId: string) => {
    setActiveCharts(prev => prev.filter(c => c.id !== chartId));
    if (selectedChart === chartId) {
      setSelectedChart(prev => prev === chartId ? null : prev);
    }
  };

  const handleTemplateSelect = (template: ChartTemplate) => {
    try {
      // Find the best matching columns for this template
      const categoricalColumns = columns.filter(col => 
        col.type === 'string' || col.type === 'boolean' || col.type === 'date'
      );
      const numericColumns = columns.filter(col => col.type === 'number');
      
      if (categoricalColumns.length === 0) {
        error('No Categorical Data', 'This template requires categorical data (text, boolean, or date columns).');
        return;
      }
      
      // Use the first available column of the required type
      const xAxis = categoricalColumns[0]?.key || '';
      const yAxis = template.config.yAxis === 'count' ? 'count' : (numericColumns[0]?.key || 'count');
      
      const xAxisColumn = columns.find(c => c.key === xAxis);
      const yAxisColumn = yAxis === 'count' ? 'Count' : columns.find(c => c.key === yAxis);
      
      const config: ChartConfig = {
        id: `${template.id}-${Date.now()}`,
        title: template.config.title || `${typeof yAxisColumn === 'object' ? yAxisColumn?.label : 'Value'} by ${typeof xAxisColumn === 'object' ? xAxisColumn?.label : 'Category'}`,
        type: template.config.type || 'bar',
        xAxis: xAxis,
        yAxis: yAxis,
        description: template.description
      };

      setActiveCharts(prev => [...prev, config]);
      setSelectedChart(config.id);
      setActiveTab('quick');
      success('Template Applied!', `Your ${template.name} chart has been created.`);
    } catch (err) {
      error('Template Error', 'There was an error applying the template. Please try again.');
    }
  };

  const handleAdvancedCreate = (config: ChartConfig) => {
    setActiveCharts(prev => [...prev, config]);
    setSelectedChart(config.id);
    setActiveTab('quick');
    success('Custom Chart Created!', 'Your advanced chart has been created successfully.');
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
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
     

      {/* Navigation Tabs */}
      <div className="flex justify-center">
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('quick')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'quick'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Quick Charts
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'templates'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'advanced'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'quick' && (
        <>
          {/* Quick Chart Options */}
          {activeCharts.length === 0 || selectedChart === null ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickChartOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card
                    key={option.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    onClick={() => handleQuickChart(option)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg bg-linear-to-r ${option.color} flex items-center justify-center`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{option.title}</h3> 
                          <p className="text-muted-foreground text-sm">{option.description}</p> 
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Chart Tabs */}
              <div className="flex flex-wrap gap-2">
                {activeCharts.map((chart) => (
                  <Button
                    key={chart.id}
                    variant={selectedChart === chart.id ? 'default' : 'outline'}
                    onClick={() => setSelectedChart(chart.id)}
                    className="flex items-center gap-2"
                  >
                    {chart.type === 'bar' && <BarChart3 className="h-4 w-4" />}
                    {chart.type === 'line' && <LineChart className="h-4 w-4" />}
                    {chart.type === 'pie' && <PieChart className="h-4 w-4" />}
                    <span className="truncate max-w-32">{chart.title}</span> 
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChartRemove(chart.id);
                      }}
                      className="h-4 w-4 p-0 ml-1"
                    >
                      ×
                    </Button>
                  </Button>
                ))}
              </div>

              {/* Selected Chart */}
              {selectedChart && (
                <CleanChartRenderer
                  config={activeCharts.find(c => c.id === selectedChart)!}
                  data={data}
                  onDataClick={(data) => onDrillDown?.(activeCharts.find(c => c.id === selectedChart)!.xAxis, data.name)}
                />
              )}
            </div>
          )}
        </>
      )}

      {activeTab === 'templates' && (
        <TemplateGallery
          columns={columns}
          onTemplateSelect={handleTemplateSelect}
          onCustomCreate={handleAdvancedCreate}
        />
      )}

      {activeTab === 'advanced' && (
        <AdvancedBuilder 
          columns={columns}
          data={data}
          onChartCreate={handleAdvancedCreate}
        />
      )}

      {/* Add More Charts */}
      {activeCharts.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => {
              console.log('Create Another Chart clicked');
              setSelectedChart(null);
              setActiveTab('quick');
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Another Chart
          </Button>
        </div>
      )}
    </div>
  );
}

interface ChartRendererProps {
  config: ChartConfig;
  data: JsonData[];
  onDataClick?: (data: any) => void;
}

function ChartRenderer({ config, data, onDataClick }: ChartRendererProps) {
  const { data: chartData, stats, isEmpty } = useChartData(data, [], config, []);

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-muted-foreground mb-2">No data available</div>
            <div className="text-sm text-muted-foreground">
              Try selecting different data or adjusting your filters
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
          {config.type === 'pie' && <PieChartComponent {...commonProps} />}
        </CardContent>
      </Card>
    </div>
  );
}
