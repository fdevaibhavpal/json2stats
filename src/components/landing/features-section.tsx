'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Table, 
  BarChart3, 
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  SortAsc,
  SortDesc,
  PieChart,
  LineChart,
  TrendingUp,
  Zap,
  Shield,
  Smartphone,
  Monitor
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      title: "Smart Data Processing",
      description: "Automatically detect data types, infer schemas, and handle complex JSON structures",
      icon: Upload,
      color: "blue",
      features: [
        "Supports JSON, NDJSON, and JSONL formats",
        "Auto-detects string, number, date, boolean types",
        "Handles nested objects and arrays",
        "Schema validation and error reporting"
      ]
    },
    {
      title: "Advanced Table Features",
      description: "Professional table with sorting, filtering, pagination, and column management",
      icon: Table,
      color: "green",
      features: [
        "Multi-column sorting (asc/desc)",
        "Global and column-specific search",
        "Advanced filtering with multiple conditions",
        "Column show/hide and resizing",
        "Pagination with customizable page sizes"
      ]
    },
    {
      title: "Rich Analytics & Charts",
      description: "Interactive charts and statistics to understand your data better",
      icon: BarChart3,
      color: "purple",
      features: [
        "Bar, Line, and Pie charts",
        "Quick chart templates",
        "Custom chart builder",
        "Real-time statistics",
        "Interactive drill-down"
      ]
    },
    {
      title: "Export & Share",
      description: "Export your processed data in multiple formats with filters applied",
      icon: Download,
      color: "orange",
      features: [
        "Export to CSV, Excel, JSON",
        "Apply current filters and sorting",
        "Copy individual rows",
        "Share filtered views"
      ]
    },
    {
      title: "Responsive Design",
      description: "Works perfectly on desktop, tablet, and mobile devices",
      icon: Smartphone,
      color: "indigo",
      features: [
        "Mobile-optimized interface",
        "Touch-friendly controls",
        "Responsive table layout",
        "Dark/light mode support"
      ]
    },
    {
      title: "Privacy & Security",
      description: "Your data stays on your device - no server processing required",
      icon: Shield,
      color: "emerald",
      features: [
        "100% client-side processing",
        "No data sent to servers",
        "Works offline",
        "No registration required"
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      green: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      purple: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      orange: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
      indigo: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
      emerald: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Zap className="h-4 w-4 mr-2" />
            Powerful Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Everything You Need to Analyze JSON Data
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            From simple data viewing to advanced analytics, our tool provides all the features 
            you need to make sense of your JSON data.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${getColorClasses(feature.color)}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Use Cases Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Perfect For Every Use Case
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Whether you're a developer, analyst, or business user, our tool adapts to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "API Responses",
                description: "Analyze API data, debug responses, and understand structure",
                icon: TrendingUp,
                color: "blue"
              },
              {
                title: "Data Analysis",
                description: "Quick insights from datasets, CSV imports, and exports",
                icon: BarChart3,
                color: "green"
              },
              {
                title: "Log Analysis",
                description: "Parse and analyze application logs and error reports",
                icon: FileText,
                color: "purple"
              },
              {
                title: "Business Reports",
                description: "Transform business data into actionable insights",
                icon: PieChart,
                color: "orange"
              }
            ].map((useCase, index) => {
              const IconComponent = useCase.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${getColorClasses(useCase.color)}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {useCase.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {useCase.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
