'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData, ChartOptions } from '@/types/chart.types';
import { CHART_COLORS } from '@/lib/chart-colors';

interface LineChartProps {
  data: ChartData[];
  title: string;
  xAxis: string;
  yAxis: string;
  onDataClick?: (data: ChartData) => void;
  options?: ChartOptions;
}

export function LineChart({ data, title, xAxis, yAxis, onDataClick, options = {} }: LineChartProps) {
  const colors = options.colors || CHART_COLORS;

  const handleLineClick = (data: any) => {
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
          {data.length} data points • Trend over {xAxis}
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onClick={handleLineClick}
        >
          <defs>
            <linearGradient id="lineChartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[0]} stopOpacity={0.25} />
              <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="value"
            stroke={colors[0]}
            strokeWidth={2}
            fill="url(#lineChartFill)"
            dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
            className="cursor-pointer"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
