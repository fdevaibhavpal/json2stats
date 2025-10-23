'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Target,
  DollarSign,
} from 'lucide-react';
import { ColumnSchema } from '@/types';
import { ChartTemplate, getTemplatesForData, createTemplateFromConfig } from '@/lib/templates';
import { ChartConfig } from '@/types/chart.types';

interface TemplateGalleryProps {
  columns: ColumnSchema[];
  onTemplateSelect: (template: ChartTemplate) => void;
  onCustomCreate?: (config: ChartConfig) => void;
}

export function TemplateGallery({ columns, onTemplateSelect, onCustomCreate }: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'templates' | 'custom'>('templates');

  const availableTemplates = getTemplatesForData(columns);
  
  const filteredTemplates = availableTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'All Templates', icon: Filter },
    { id: 'business', name: 'Business', icon: TrendingUp },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'marketing', name: 'Marketing', icon: Target },
    { id: 'finance', name: 'Finance', icon: DollarSign }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business': return TrendingUp;
      case 'analytics': return BarChart3;
      case 'marketing': return Target;
      case 'finance': return DollarSign;
      default: return Filter;
    }
  };

  const getChartTypeIcon = (type: string) => {
    switch (type) {
      case 'bar': return BarChart3;
      case 'line': return LineChart;
      case 'pie': return PieChart;
      default: return BarChart3;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Chart Templates</h2>
        <p className="text-muted-foreground">
          Choose from pre-built templates or create your own
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Data Requirements Info */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-sm font-medium">Data Requirements</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Templates work with your current data structure. They automatically use:
            <ul className="mt-2 space-y-1">
              <li>• <strong>Text/Boolean columns</strong> for categories (X-axis)</li>
              <li>• <strong>Number columns</strong> for values (Y-axis)</li>
              <li>• <strong>Date columns</strong> for time-based charts</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const ChartIcon = getChartTypeIcon(template.config.type || 'bar');
          const CategoryIcon = getCategoryIcon(template.category);
          
          return (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              onClick={() => onTemplateSelect(template)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-linear-to-r ${template.color} flex items-center justify-center`}>
                    <span className="text-lg">{template.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChartIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground capitalize">
                      {template.config.type} chart
                    </span>
                  </div>
                  <Button size="sm" variant="outline">
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <div className="text-muted-foreground">No templates found</div>
              <div className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    
    </div>
  );
}
