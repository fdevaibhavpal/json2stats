'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  LineChart, 
  PieChart,
  TrendingUp,
  Activity,
  Target,
  Plus,
  Settings,
  Save,
  Play,
  Eye
} from 'lucide-react';
import { ColumnSchema } from '@/types';
import { ChartType, ChartConfig } from '@/types/chart.types';
import { ChartTypeSelector } from './chart-type-selector';
import { DimensionBuilder } from './dimension-builder';

interface AnalyticsBuilderProps {
  columns: ColumnSchema[];
  data: any[];
  onChartCreate: (config: ChartConfig) => void;
  onPreview?: (config: ChartConfig) => void;
}

export function AnalyticsBuilder({ columns, data, onChartCreate, onPreview }: AnalyticsBuilderProps) {
  const [activeTab, setActiveTab] = useState('guided');
  const [selectedType, setSelectedType] = useState<ChartType | null>(null);
  const [step, setStep] = useState<'type' | 'dimensions'>('type');

  const handleTypeSelect = (type: ChartType) => {
    setSelectedType(type);
    setStep('dimensions');
  };

  const handleDimensionsSelect = (xAxis: string, yAxis: string, groupBy?: string) => {
    if (selectedType) {
      const config: ChartConfig = {
        id: `${selectedType}-${xAxis}-${yAxis}-${Date.now()}`,
        title: `${columns.find(c => c.key === yAxis)?.label} by ${columns.find(c => c.key === xAxis)?.label}`,
        type: selectedType,
        xAxis,
        yAxis,
        description: `${selectedType} chart showing ${yAxis} by ${xAxis}`
      };
      
      onChartCreate(config);
      
      // Reset for next chart
      setSelectedType(null);
      setStep('type');
    }
  };

  const handlePreview = (config: ChartConfig) => {
    onPreview?.(config);
  };

  const dataPreview = {
    categories: columns.filter(c => c.type === 'string').length,
    numeric: columns.filter(c => c.type === 'number').length,
    total: data.length
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Analytics Builder</h2>
        <p className="text-muted-foreground">
          Create powerful visualizations from your data
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guided" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Guided Builder
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced Mode
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guided" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Guided Analytics Builder
              </CardTitle>
            </CardHeader>
            <CardContent>
              {step === 'type' && (
                <ChartTypeSelector
                  selectedType={selectedType}
                  onTypeSelect={handleTypeSelect}
                  dataPreview={dataPreview}
                />
              )}

              {step === 'dimensions' && selectedType && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStep('type')}
                    >
                      ← Back
                    </Button>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {selectedType.toUpperCase()} Chart
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Step 2 of 2
                      </span>
                    </div>
                  </div>
                  
                  <DimensionBuilder
                    columns={columns}
                    chartType={selectedType}
                    onDimensionsSelect={handleDimensionsSelect}
                    dataPreview={dataPreview}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Advanced Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Advanced Mode</h3>
                <p className="text-muted-foreground mb-4">
                  Drag-and-drop interface for complex analytics
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium">Quick Bar Chart</h3>
            <p className="text-sm text-muted-foreground">Compare categories</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <LineChart className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium">Trend Analysis</h3>
            <p className="text-sm text-muted-foreground">Show time series</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all">
          <CardContent className="p-4 text-center">
            <PieChart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-medium">Distribution</h3>
            <p className="text-sm text-muted-foreground">Show proportions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
