export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'scatter';

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: ChartType;
  xAxis: string;
  yAxis: string;
  color?: string;
  description?: string;
}

export interface ChartFilter {
  field: string;
  value: any;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
}

export interface ChartState {
  activeCharts: ChartConfig[];
  selectedData: ChartData[];
  filters: ChartFilter[];
  drillDownLevel: number;
}

export interface ChartInteraction {
  onDataClick?: (data: ChartData) => void;
  onDataHover?: (data: ChartData) => void;
  onFilter?: (filters: ChartFilter[]) => void;
  onDrillDown?: (field: string, value: any) => void;
}

export interface ChartOptions {
  width?: number;
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  showDataLabels?: boolean;
  stackedBars?: boolean;
  interactive?: boolean;
  colors?: string[];
  animation?: boolean;
}
