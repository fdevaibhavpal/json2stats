'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  LineChart,
  PieChart,
  Settings,
  Eye,
  Check
} from 'lucide-react';
import { ColumnSchema } from '@/types';
import { ChartConfig } from '@/types/chart.types';
import { useToast } from '@/hooks/use-toast';
import { useChartData } from '@/hooks/use-chart-data';
import { BarChart } from './bar-chart';
import { LineChart as LineChartComponent } from './line-chart';
import { PieChart as PieChartComponent } from './pie-chart';
import { CHART_COLORS } from '@/lib/chart-colors';

interface AdvancedBuilderProps {
  columns: ColumnSchema[];
  data: any[];
  onChartCreate: (config: ChartConfig) => void;
}

export function AdvancedBuilder({ columns, data, onChartCreate }: AdvancedBuilderProps) {
  const [config, setConfig] = useState<Partial<ChartConfig>>({
    type: 'bar',
    title: 'Custom Chart',
    xAxis: columns.find(c => c.type === 'string')?.key || '',
    yAxis: columns.find(c => c.type === 'number')?.key || 'count'
  });
  const [activeTab, setActiveTab] = useState<'data' | 'style' | 'layout'>('data');
  const [showLegend, setShowLegend] = useState(true);
  const [showDataLabels, setShowDataLabels] = useState(true);
  const [stackedBars, setStackedBars] = useState(false);
  const { success, error } = useToast();

  const numericColumns = columns.filter(col => col.type === 'number');
  const categoricalColumns = columns.filter(col => 
    col.type === 'string' || col.type === 'boolean' || col.type === 'date'
  );

  const handleCreateChart = () => {
    try {
      if (!config.xAxis || !config.yAxis) {
        error('Missing Configuration', 'Please select both X-axis and Y-axis columns.');
        return;
      }

      const xAxisColumn = columns.find(c => c.key === config.xAxis);
      const yAxisColumn = config.yAxis === 'count' ? 'Count' : columns.find(c => c.key === config.yAxis);

      if (!xAxisColumn) {
        error('Invalid X-Axis', 'The selected X-axis column is not available in your data.');
        return;
      }

      if (config.yAxis !== 'count' && !yAxisColumn) {
        error('Invalid Y-Axis', 'The selected Y-axis column is not available in your data.');
        return;
      }

      const finalConfig: ChartConfig = {
        id: `custom-${Date.now()}`,
        title: config.title || `${typeof yAxisColumn === 'object' ? yAxisColumn?.label : 'Value'} by ${typeof xAxisColumn === 'object' ? xAxisColumn?.label : 'Category'}`,
        type: config.type || 'bar',
        xAxis: config.xAxis,
        yAxis: config.yAxis,
        description: config.description || `Custom ${config.type} chart`
      };

      onChartCreate(finalConfig);
      success('Chart Created!', 'Your custom chart has been created successfully.');
    } catch (err) {
      console.error('Chart creation error:', err);
      error('Chart Creation Failed', 'There was an error creating your chart. Please try again.');
    }
  };

  const getChartTypeIcon = (type: string) => {
    switch (type) {
      case 'bar': return BarChart3;
      case 'line': return LineChart;
      case 'pie': return PieChart;
      default: return BarChart3;
    }
  };

  const previewConfig: ChartConfig = {
    id: 'preview',
    title: config.title || 'Custom Chart',
    type: config.type || 'bar',
    xAxis: config.xAxis || '',
    yAxis: config.yAxis || 'count',
  };
  const { data: previewData, isEmpty: previewIsEmpty } = useChartData(data, columns, previewConfig);
  const previewOptions = {
    showLegend,
    showDataLabels,
    stackedBars,
    colors: [CHART_COLORS[0]],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
   

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="data" className="text-xs">Data</TabsTrigger>
                  <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
                  <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
                </TabsList>

                <TabsContent value="data" className="space-y-4 mt-4">
                  {/* Chart Type */}
                  <div className="space-y-2">
                    <Label>Chart Type</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['bar', 'line', 'pie'].map((type) => {
                        const Icon = getChartTypeIcon(type);
                        return (
                          <Button
                            key={type}
                            variant={config.type === type ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setConfig({ ...config, type: type as any })}
                            className="flex items-center gap-2"
                          >
                            <Icon className="h-4 w-4" />
                            {type}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* X-Axis */}
                  <div className="space-y-2">
                    <Label>X-Axis (Categories)</Label>
                    <Select value={config.xAxis} onValueChange={(value) => setConfig({ ...config, xAxis: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category column" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoricalColumns.map((col) => (
                          <SelectItem key={col.key} value={col.key}>
                            <div className="flex items-center gap-2">
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

                  {/* Y-Axis */}
                  <div className="space-y-2">
                    <Label>Y-Axis (Values)</Label>
                    <Select value={config.yAxis} onValueChange={(value) => setConfig({ ...config, yAxis: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select value column" />
                      </SelectTrigger>
                      <SelectContent>
                        {numericColumns.map((col) => (
                          <SelectItem key={col.key} value={col.key}>
                            <div className="flex items-center gap-2">
                              {col.label}
                              <Badge variant="outline" className="text-xs">
                                {col.type}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="count">
                          <div className="flex items-center gap-2">
                            Count
                            <Badge variant="outline" className="text-xs">
                              calculated
                            </Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="style" className="space-y-4 mt-4">
                  {/* Chart Title */}
                  <div className="space-y-2">
                    <Label>Chart Title</Label>
                    <Input
                      value={config.title || ''}
                      onChange={(e) => setConfig({ ...config, title: e.target.value })}
                      placeholder="Enter chart title"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={config.description || ''}
                      onChange={(e) => setConfig({ ...config, description: e.target.value })}
                      placeholder="Enter chart description"
                    />
                  </div>

                </TabsContent>

                <TabsContent value="layout" className="space-y-4 mt-4">
                  {/* Show Data Labels */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="data-labels"
                      checked={showDataLabels}
                      onChange={(e) => setShowDataLabels(e.target.checked)}
                      className="rounded-sm"
                    />
                    <Label htmlFor="data-labels">Show data labels</Label>
                  </div>

                  {/* Show Legend */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="legend"
                      checked={showLegend}
                      onChange={(e) => setShowLegend(e.target.checked)}
                      className="rounded-sm"
                    />
                    <Label htmlFor="legend">Show legend</Label>
                  </div>

                  {/* Stacked Bars */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="stacked"
                      checked={stackedBars}
                      onChange={(e) => setStackedBars(e.target.checked)}
                      disabled={config.type !== 'bar'}
                      className="rounded-sm"
                    />
                    <Label htmlFor="stacked" className={config.type !== 'bar' ? 'text-muted-foreground' : ''}>
                      Stacked bars
                    </Label>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Create Button */}
              <Button onClick={handleCreateChart} className="w-full mt-6">
                <Check className="h-4 w-4 mr-2" />
                Create Chart
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chart Preview */}
                <div className="h-72 bg-muted rounded-md border border-border p-2">
                  {previewIsEmpty || !config.xAxis ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        {(() => {
                          const Icon = getChartTypeIcon(config.type || 'bar');
                          return <Icon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />;
                        })()}
                        <p className="text-sm text-muted-foreground">
                          Select X and Y axis columns to preview
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {config.type === 'bar' && (
                        <BarChart
                          data={previewData}
                          title={previewConfig.title}
                          xAxis={previewConfig.xAxis}
                          yAxis={previewConfig.yAxis}
                          options={previewOptions}
                        />
                      )}
                      {config.type === 'line' && (
                        <LineChartComponent
                          data={previewData}
                          title={previewConfig.title}
                          xAxis={previewConfig.xAxis}
                          yAxis={previewConfig.yAxis}
                          options={previewOptions}
                        />
                      )}
                      {config.type === 'pie' && (
                        <PieChartComponent
                          data={previewData}
                          title={previewConfig.title}
                          xAxis={previewConfig.xAxis}
                          yAxis={previewConfig.yAxis}
                          options={previewOptions}
                        />
                      )}
                    </>
                  )}
                </div>

                {/* Configuration Summary */}
                <div className="space-y-2">
                  <h4 className="font-medium">Configuration Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="outline" className="ml-2">
                        {config.type}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">X-Axis:</span>
                      <span className="ml-2 font-medium">
                        {columns.find(c => c.key === config.xAxis)?.label || 'Not selected'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Y-Axis:</span>
                      <span className="ml-2 font-medium">
                        {config.yAxis === 'count' ? 'Count' : columns.find(c => c.key === config.yAxis)?.label || 'Not selected'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Data Points:</span>
                      <span className="ml-2 font-medium">{data.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
