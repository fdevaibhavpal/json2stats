import { ChartConfig } from '@/types/chart.types';
import { ColumnSchema } from '@/types';

export interface ChartTemplate {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'analytics' | 'marketing' | 'finance' | 'custom';
  icon: string;
  color: string;
  config: Partial<ChartConfig>;
  requiredColumns: {
    numeric?: number;
    categorical?: number;
    date?: number;
  };
  preview?: string;
}

export const DEFAULT_TEMPLATES: ChartTemplate[] = [
  // Business Templates
  {
    id: 'revenue-analysis',
    name: 'Revenue Analysis',
    description: 'Analyze revenue by category with trend insights',
    category: 'business',
    icon: '💰',
    color: 'from-green-500 to-green-600',
    config: {
      type: 'bar',
      title: 'Revenue Analysis',
      description: 'Compare values across different categories'
    },
    requiredColumns: { numeric: 1, categorical: 1 }
  },
  {
    id: 'sales-trend',
    name: 'Sales Trend',
    description: 'Track sales performance over time',
    category: 'business',
    icon: '📈',
    color: 'from-blue-500 to-blue-600',
    config: {
      type: 'line',
      title: 'Sales Trend',
      description: 'Show sales performance over time'
    },
    requiredColumns: { numeric: 1, date: 1 }
  },
  {
    id: 'customer-segments',
    name: 'Customer Segments',
    description: 'Visualize customer distribution by segments',
    category: 'business',
    icon: '👥',
    color: 'from-purple-500 to-purple-600',
    config: {
      type: 'pie',
      title: 'Customer Segments',
      description: 'Distribution of customers by segments'
    },
    requiredColumns: { categorical: 1 }
  },

  // Analytics Templates
  {
    id: 'performance-metrics',
    name: 'Performance Metrics',
    description: 'Compare key performance indicators',
    category: 'analytics',
    icon: '📊',
    color: 'from-orange-500 to-orange-600',
    config: {
      type: 'bar',
      title: 'Performance Metrics',
      description: 'Compare key performance indicators'
    },
    requiredColumns: { numeric: 1, categorical: 1 }
  },
  {
    id: 'conversion-funnel',
    name: 'Conversion Funnel',
    description: 'Track user journey through conversion stages',
    category: 'analytics',
    icon: '🔄',
    color: 'from-red-500 to-red-600',
    config: {
      type: 'bar',
      title: 'Conversion Funnel',
      description: 'Track conversion through different stages'
    },
    requiredColumns: { categorical: 1 }
  },
  {
    id: 'user-engagement',
    name: 'User Engagement',
    description: 'Analyze user engagement patterns over time',
    category: 'analytics',
    icon: '📱',
    color: 'from-indigo-500 to-indigo-600',
    config: {
      type: 'line',
      title: 'User Engagement',
      description: 'Track user engagement over time'
    },
    requiredColumns: { numeric: 1, date: 1 }
  },

  // Marketing Templates
  {
    id: 'campaign-performance',
    name: 'Campaign Performance',
    description: 'Compare marketing campaign effectiveness',
    category: 'marketing',
    icon: '🎯',
    color: 'from-pink-500 to-pink-600',
    config: {
      type: 'bar',
      title: 'Campaign Performance',
      description: 'Compare marketing campaign effectiveness'
    },
    requiredColumns: { numeric: 1, categorical: 1 }
  },
  {
    id: 'traffic-sources',
    name: 'Traffic Sources',
    description: 'Analyze website traffic by source',
    category: 'marketing',
    icon: '🌐',
    color: 'from-teal-500 to-teal-600',
    config: {
      type: 'pie',
      title: 'Traffic Sources',
      description: 'Distribution of traffic by source'
    },
    requiredColumns: { categorical: 1 }
  },
  {
    id: 'conversion-rates',
    name: 'Conversion Rates',
    description: 'Track conversion rates over time',
    category: 'marketing',
    icon: '📈',
    color: 'from-cyan-500 to-cyan-600',
    config: {
      type: 'line',
      title: 'Conversion Rates',
      description: 'Track conversion rates over time'
    },
    requiredColumns: { numeric: 1, date: 1 }
  },

  // Finance Templates
  {
    id: 'expense-breakdown',
    name: 'Expense Breakdown',
    description: 'Visualize expenses by category',
    category: 'finance',
    icon: '💸',
    color: 'from-yellow-500 to-yellow-600',
    config: {
      type: 'pie',
      title: 'Expense Breakdown',
      description: 'Distribution of expenses by category'
    },
    requiredColumns: { numeric: 1, categorical: 1 }
  },
  {
    id: 'profit-margin',
    name: 'Profit Margin',
    description: 'Analyze profit margins by product/service',
    category: 'finance',
    icon: '📊',
    color: 'from-emerald-500 to-emerald-600',
    config: {
      type: 'bar',
      title: 'Profit Margin',
      description: 'Analyze profit margins by product/service'
    },
    requiredColumns: { numeric: 1, categorical: 1 }
  },
  {
    id: 'cash-flow',
    name: 'Cash Flow',
    description: 'Track cash flow over time',
    category: 'finance',
    icon: '💹',
    color: 'from-lime-500 to-lime-600',
    config: {
      type: 'line',
      title: 'Cash Flow',
      description: 'Track cash flow over time'
    },
    requiredColumns: { numeric: 1, date: 1 }
  }
];

export function getTemplatesForData(columns: ColumnSchema[]): ChartTemplate[] {
  const numericCount = columns.filter(c => c.type === 'number').length;
  const categoricalCount = columns.filter(c => 
    c.type === 'string' || c.type === 'boolean'
  ).length;
  const dateCount = columns.filter(c => c.type === 'date').length;

  return DEFAULT_TEMPLATES.filter(template => {
    const { requiredColumns } = template;
    return (
      (!requiredColumns.numeric || numericCount >= requiredColumns.numeric) &&
      (!requiredColumns.categorical || categoricalCount >= requiredColumns.categorical) &&
      (!requiredColumns.date || dateCount >= requiredColumns.date)
    );
  });
}

export function createTemplateFromConfig(
  config: ChartConfig,
  name: string,
  description: string,
  category: ChartTemplate['category'] = 'custom'
): ChartTemplate {
  return {
    id: `custom-${Date.now()}`,
    name,
    description,
    category,
    icon: '⭐',
    color: 'from-gray-500 to-gray-600',
    config,
    requiredColumns: {
      numeric: config.yAxis === 'count' ? 0 : 1,
      categorical: 1
    }
  };
}
