'use client';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer, Cell } from 'recharts';
import { ChartData, ChartOptions } from '@/types/chart.types';
import { CHART_COLORS } from '@/lib/chart-colors';

interface BarChartProps {
  data: ChartData[];
  title: string;
  xAxis: string;
  yAxis: string;
  onDataClick?: (data: ChartData) => void;
  options?: ChartOptions;
}

export function BarChart({ data, title, xAxis, yAxis, onDataClick, options = {} }: BarChartProps) {
  const colors = options.colors || CHART_COLORS;

  const handleBarClick = (data: any) => {
    if (onDataClick && data) {
      onDataClick(data);
    }
  };

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <div className="text-lg font-medium">No data available</div>
          <div className="text-sm">Try adjusting your filters or data selection</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {data.length} categories • Total: {data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onClick={handleBarClick}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-popover text-popover-foreground p-3 border border-border rounded-md font-mono">
                    <p className="font-medium">{label}</p>
                    <p className="text-primary">
                      {yAxis}: {payload[0].value?.toLocaleString()}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          {options.showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            stackId={options.stackedBars ? 'stack' : undefined}
          >
            {options.showDataLabels && (
              <LabelList dataKey="value" position="top" style={{ fontSize: 12, fill: 'var(--foreground)' }} />
            )}
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors.length > 1 ? colors[index % colors.length] : colors[0]}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
