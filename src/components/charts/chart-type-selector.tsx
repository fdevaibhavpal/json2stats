'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp,
  Activity,
  Target,
  Zap
} from 'lucide-react';
import { ChartType } from '@/types/chart.types';

interface ChartTypeSelectorProps {
  selectedType: ChartType | null;
  onTypeSelect: (type: ChartType) => void;
  dataPreview?: any;
}

const chartTypes = [
  {
    type: 'bar' as ChartType,
    name: 'Bar Chart',
    icon: BarChart3,
    description: 'Compare values across categories',
    color: 'from-blue-500 to-blue-600',
    bestFor: ['Categories', 'Comparisons', 'Rankings']
  },
  {
    type: 'line' as ChartType,
    name: 'Line Chart',
    icon: LineChart,
    description: 'Show trends over time',
    color: 'from-green-500 to-green-600',
    bestFor: ['Time Series', 'Trends', 'Progress']
  },
  {
    type: 'pie' as ChartType,
    name: 'Pie Chart',
    icon: PieChart,
    description: 'Show parts of a whole',
    color: 'from-purple-500 to-purple-600',
    bestFor: ['Proportions', 'Percentages', 'Distribution']
  },
  {
    type: 'area' as ChartType,
    name: 'Area Chart',
    icon: TrendingUp,
    description: 'Show cumulative data over time',
    color: 'from-orange-500 to-orange-600',
    bestFor: ['Cumulative', 'Volume', 'Growth']
  },
  {
    type: 'scatter' as ChartType,
    name: 'Scatter Plot',
    icon: Target,
    description: 'Show relationships between variables',
    color: 'from-red-500 to-red-600',
    bestFor: ['Correlations', 'Patterns', 'Outliers']
  }
];

export function ChartTypeSelector({ selectedType, onTypeSelect, dataPreview }: ChartTypeSelectorProps) {
  const [hoveredType, setHoveredType] = useState<ChartType | null>(null);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Choose Chart Type</h3>
        <p className="text-sm text-muted-foreground">
          Select the best visualization for your data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chartTypes.map((chart) => {
          const Icon = chart.icon;
          const isSelected = selectedType === chart.type;
          const isHovered = hoveredType === chart.type;

          return (
            <Card
              key={chart.type}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => onTypeSelect(chart.type)}
              onMouseEnter={() => setHoveredType(chart.type)}
              onMouseLeave={() => setHoveredType(null)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-linear-to-r ${chart.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{chart.name}</h4>
                    <p className="text-xs text-muted-foreground">{chart.description}</p>
                  </div>
                  {isSelected && (
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Best for:</div>
                  <div className="flex flex-wrap gap-1">
                    {chart.bestFor.map((use) => (
                      <Badge key={use} variant="secondary" className="text-xs">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Preview indicator */}
                {dataPreview && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                      Preview: {dataPreview.categories} categories, {dataPreview.total} total
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Smart Recommendation */}
      {dataPreview && (
        <Card className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Smart Recommendation</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on your data structure, we recommend starting with a{' '}
              <strong>Bar Chart</strong> for the best visualization experience.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
