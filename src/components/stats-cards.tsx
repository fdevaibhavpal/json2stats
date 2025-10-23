'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, TrendingUp, Hash, DollarSign, Calendar } from 'lucide-react';
import { useTableStore } from '@/store/table-store';
import { DataProcessor } from '@/lib/data-processor';
import { JsonData, ColumnSchema } from '@/types';

interface StatsCardsProps {
  className?: string;
}

export function StatsCards({ className }: StatsCardsProps) {
  const { data, columns, getProcessedData } = useTableStore();
  
  const processedData = getProcessedData();
  const stats = processedData.stats;

  if (data.length === 0) {
    return null;
  }

  const getStatIcon = (type: string) => {
    switch (type) {
      case 'count':
        return <Hash className="h-4 w-4" />;
      case 'sum':
      case 'avg':
        return <DollarSign className="h-4 w-4" />;
      case 'min':
      case 'max':
        return <TrendingUp className="h-4 w-4" />;
      case 'distinct':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Hash className="h-4 w-4" />;
    }
  };

  const getStatColor = (type: string) => {
    switch (type) {
      case 'count':
        return 'bg-blue-100 text-blue-800';
      case 'sum':
        return 'bg-green-100 text-green-800';
      case 'avg':
        return 'bg-purple-100 text-purple-800';
      case 'min':
        return 'bg-orange-100 text-orange-800';
      case 'max':
        return 'bg-red-100 text-red-800';
      case 'distinct':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportStats = () => {
    const statsData = stats.map(stat => ({
      Label: stat.label,
      Value: stat.value,
      Type: stat.type,
      Column: stat.column || 'N/A'
    }));

    const csvContent = [
      'Label,Value,Type,Column',
      ...statsData.map(stat => 
        `"${stat.Label}","${stat.Value}","${stat.Type}","${stat.Column}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stats-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (stats.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-8 w-8 mx-auto mb-2" />
            <p>No statistics available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Data Statistics
            </CardTitle>
            <Button variant="outline" size="sm" onClick={exportStats}>
              <Download className="h-4 w-4 mr-2" />
              Export Stats
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">
                      {typeof stat.value === 'number' 
                        ? stat.value.toLocaleString() 
                        : stat.value
                      }
                    </p>
                  </div>
                  <Badge className={getStatColor(stat.type)}>
                    {getStatIcon(stat.type)}
                    <span className="ml-1 capitalize">{stat.type}</span>
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
