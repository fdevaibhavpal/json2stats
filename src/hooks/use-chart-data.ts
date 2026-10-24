import { useMemo } from 'react';
import { JsonData, ColumnSchema } from '@/types';
import { ChartData, ChartConfig, ChartFilter } from '@/types/chart.types';

export function useChartData(
  data: JsonData[],
  columns: ColumnSchema[],
  config: ChartConfig,
  filters: ChartFilter[] = []
) {
  const processedData = useMemo(() => {
    if (!data.length || !config.xAxis || !config.yAxis) {
      return [];
    }

    // Apply filters first
    let filteredData = data;
    if (filters.length > 0) {
      filteredData = data.filter(item => {
        return filters.every(filter => {
          const value = item[filter.field];
          switch (filter.operator) {
            case 'equals':
              return value === filter.value;
            case 'contains':
              return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
            case 'greater_than':
              return Number(value) > Number(filter.value);
            case 'less_than':
              return Number(value) < Number(filter.value);
            case 'between':
              if (Array.isArray(filter.value) && filter.value.length === 2) {
                return Number(value) >= Number(filter.value[0]) && Number(value) <= Number(filter.value[1]);
              }
              return false;
            default:
              return true;
          }
        });
      });
    }

    // Group and aggregate data based on chart type
    const groupedData = new Map<string, number>();

    filteredData.forEach(item => {
      const xValue = item[config.xAxis];
      let yValue = item[config.yAxis];

      // Handle count-based charts
      if (config.yAxis === 'count') {
        yValue = 1; // Count each occurrence
      }

      if (xValue !== null && xValue !== undefined && yValue !== null && yValue !== undefined) {
        const key = String(xValue);
        const numericValue = Number(yValue);

        if (!isNaN(numericValue)) {
          if (groupedData.has(key)) {
            groupedData.set(key, groupedData.get(key)! + numericValue);
          } else {
            groupedData.set(key, numericValue);
          }
        }
      }
    });

    // Convert to chart data format
    const chartData: ChartData[] = Array.from(groupedData.entries()).map(([name, value]) => ({
      name,
      value,
      originalData: filteredData.filter(item => String(item[config.xAxis]) === name)
    }));

    // Sort data for better visualization
    return chartData.sort((a, b) => {
      if (config.type === 'pie') {
        return b.value - a.value; // Sort by value descending for pie charts
      }
      return a.name.localeCompare(b.name); // Sort alphabetically for other charts
    });
  }, [data, config, filters]);

  const chartStats = useMemo(() => {
    if (!processedData.length) {
      return {
        total: 0,
        average: 0,
        max: 0,
        min: 0,
        categories: 0
      };
    }

    const values = processedData.map(d => d.value);
    const total = values.reduce((sum, val) => sum + val, 0);
    const max = Math.max(...values);
    const min = Math.min(...values);

    return {
      total,
      average: total / values.length,
      max,
      min,
      categories: processedData.length
    };
  }, [processedData]);

  return {
    data: processedData,
    stats: chartStats,
    isEmpty: processedData.length === 0
  };
}
