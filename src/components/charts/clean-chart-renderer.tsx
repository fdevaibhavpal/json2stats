'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart } from './bar-chart';
import { LineChart as LineChartComponent } from './line-chart';
import { PieChart as PieChartComponent } from './pie-chart';
import { ChartConfig } from '@/types/chart.types';
import { useChartData } from '@/hooks/use-chart-data';
import { JsonData } from '@/types';

interface CleanChartRendererProps {
  config: ChartConfig;
  data: JsonData[];
  onDataClick?: (data: any) => void;
  className?: string;
}

export function CleanChartRenderer({ 
  config, 
  data, 
  onDataClick, 
  className = '' 
}: CleanChartRendererProps) {
  const { data: chartData, stats, isEmpty } = useChartData(data, [], config, []);

  // Handle loading state
  if (!config || !data || data.length === 0) {
    return (
      <Card className={`${className}`}>
        <CardContent className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="text-muted-foreground mb-2">No data available</div>
            <div className="text-sm text-muted-foreground">
              Load data to create charts
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isEmpty || !chartData || chartData.length === 0) {
    return (
      <Card className={`${className}`}>
        <CardContent className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="text-muted-foreground mb-2">No data available</div>
            <div className="text-sm text-muted-foreground">
              Try selecting different data or adjusting your configuration
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
      animation: true,
      clean: true, // Ensure clean rendering
      showLegend: true,
      showGrid: true,
      padding: 20
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Stats Cards - Moved to Top */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted rounded-md border border-border">
            <div className="text-xl font-bold text-primary">
              {stats.categories}
            </div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-md border border-border">
            <div className="text-xl font-bold">
              {stats.total.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-md border border-border">
            <div className="text-xl font-bold">
              {stats.average.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Average</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-md border border-border">
            <div className="text-xl font-bold">
              {stats.max.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Maximum</div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="capitalize">
            {config.type} chart
          </Badge>
          <Badge variant="secondary">
            {stats.categories} categories
          </Badge>
        </div>
      </div>

      {/* Chart Container with Clean Styling */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="h-80 w-full">
            {config.type === 'bar' && (
              <BarChart 
                {...commonProps}
                options={{
                  ...commonProps.options,
                  showLegend: true,
                  showTooltip: true,
                  interactive: true
                }}
              />
            )}
            {config.type === 'line' && (
              <LineChartComponent 
                {...commonProps}
                options={{
                  ...commonProps.options,
                  showLegend: true,
                  showTooltip: true,
                  interactive: true
                }}
              />
            )}
            {config.type === 'pie' && (
              <PieChartComponent 
                {...commonProps}
                options={{
                  ...commonProps.options,
                  showLegend: true,
                  showTooltip: true,
                  interactive: true
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
