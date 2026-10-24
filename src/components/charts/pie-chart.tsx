'use client';

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartData, ChartOptions } from '@/types/chart.types';
import { CHART_COLORS } from '@/lib/chart-colors';

interface PieChartProps {
  data: ChartData[];
  title: string;
  xAxis: string;
  yAxis: string;
  onDataClick?: (data: ChartData) => void;
  options?: ChartOptions;
}

export function PieChart({ data, title, xAxis, yAxis, onDataClick, options = {} }: PieChartProps) {
  const colors = options.colors || CHART_COLORS;

  const handlePieClick = (data: any) => {
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

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={400}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            onClick={handlePieClick}
            className="cursor-pointer"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
                className="hover:opacity-80 transition-opacity"
              />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0];
                const percentage = ((data.value / total) * 100).toFixed(1);
                return (
                  <div className="bg-popover text-popover-foreground p-3 border border-border rounded-md font-mono">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-primary">
                      Value: {data.value?.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Percentage: {percentage}%
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '30px', paddingBottom: '50px' }}
            formatter={(value, entry) => (
              <span className="text-sm">
                {value.length > 20 ? `${value.substring(0, 20)}...` : value}
              </span>
            )}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
