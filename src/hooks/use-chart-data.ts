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

export function useChartConfigs(columns: ColumnSchema[]): ChartConfig[] {
  return useMemo(() => {
    const numericColumns = columns.filter(col => col.type === 'number');
    const categoricalColumns = columns.filter(col => 
      col.type === 'string' || col.type === 'boolean' || col.type === 'date'
    );

    const configs: ChartConfig[] = [];

    // If we have both numeric and categorical columns, create charts
    if (numericColumns.length > 0 && categoricalColumns.length > 0) {
      // Generate bar chart configs
      categoricalColumns.forEach(catCol => {
        numericColumns.forEach(numCol => {
          configs.push({
            id: `bar-${catCol.key}-${numCol.key}`,
            title: `${numCol.label} by ${catCol.label}`,
            type: 'bar',
            xAxis: catCol.key,
            yAxis: numCol.key,
            description: `Bar chart showing ${numCol.label} distribution by ${catCol.label}`
          });
        });
      });

      // Generate line chart configs (for date columns)
      const dateColumns = columns.filter(col => col.type === 'date');
      dateColumns.forEach(dateCol => {
        numericColumns.forEach(numCol => {
          configs.push({
            id: `line-${dateCol.key}-${numCol.key}`,
            title: `${numCol.label} over ${dateCol.label}`,
            type: 'line',
            xAxis: dateCol.key,
            yAxis: numCol.key,
            description: `Line chart showing ${numCol.label} trends over ${dateCol.label}`
          });
        });
      });

      // Generate pie chart configs
      categoricalColumns.forEach(catCol => {
        numericColumns.forEach(numCol => {
          configs.push({
            id: `pie-${catCol.key}-${numCol.key}`,
            title: `${numCol.label} by ${catCol.label}`,
            type: 'pie',
            xAxis: catCol.key,
            yAxis: numCol.key,
            description: `Pie chart showing ${numCol.label} distribution by ${catCol.label}`
          });
        });
      });
    }

    // If we only have categorical columns, create count charts
    if (numericColumns.length === 0 && categoricalColumns.length > 0) {
      categoricalColumns.forEach(catCol => {
        configs.push({
          id: `bar-count-${catCol.key}`,
          title: `Count by ${catCol.label}`,
          type: 'bar',
          xAxis: catCol.key,
          yAxis: 'count',
          description: `Bar chart showing count distribution by ${catCol.label}`
        });
      });
    }

    // If we only have numeric columns, create distribution charts
    if (categoricalColumns.length === 0 && numericColumns.length > 0) {
      numericColumns.forEach(numCol => {
        configs.push({
          id: `histogram-${numCol.key}`,
          title: `${numCol.label} Distribution`,
          type: 'bar',
          xAxis: numCol.key,
          yAxis: 'count',
          description: `Histogram showing ${numCol.label} distribution`
        });
      });
    }

    return configs;
  }, [columns]);
}
