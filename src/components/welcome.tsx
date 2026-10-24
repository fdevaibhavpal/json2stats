'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  FileText,
  BarChart3,
  Table,
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface WelcomeProps {
  onGetStarted: () => void;
}

export function Welcome({ onGetStarted }: WelcomeProps) {
  const steps = [
    {
      icon: Upload,
      title: 'Upload JSON Data',
      description: 'Paste your JSON or upload a file',
    },
    {
      icon: Table,
      title: 'View Your Data',
      description: 'See your data in a clean table format',
    },
    {
      icon: BarChart3,
      title: 'Create Charts',
      description: 'Generate insights with one-click charts',
    },
    {
      icon: TrendingUp,
      title: 'Export & Share',
      description: 'Export your data and insights',
    }
  ];

  const features = [
    'No registration required',
    'Works with any JSON data',
    'One-click chart generation',
    'Export to CSV, Excel, JSON',
    'Real-time data processing',
    'Mobile-friendly interface'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl font-mono font-bold text-muted-foreground">{'{ }'}</span>
          <h1 className="text-4xl font-bold">Json2Stats</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your JSON data into beautiful, interactive dashboards in seconds.
          No coding required.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" onClick={onGetStarted} className="flex items-center gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Badge variant="outline" className="text-sm">
            Free Forever
          </Badge>
        </div>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center space-y-3">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-md border border-border bg-muted flex items-center justify-center mx-auto">
                      <Icon className="h-7 w-7 text-foreground" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-border -translate-x-1/2" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Why Choose Json2Stats?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perfect For</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md border border-border bg-muted flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <div className="font-medium">Data Analysts</div>
                  <div className="text-sm text-muted-foreground">Quick data exploration</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md border border-border bg-muted flex items-center justify-center">
                  <FileText className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <div className="font-medium">Developers</div>
                  <div className="text-sm text-muted-foreground">API response visualization</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md border border-border bg-muted flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <div className="font-medium">Business Users</div>
                  <div className="text-sm text-muted-foreground">No-code data insights</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Button size="lg" onClick={onGetStarted} className="flex items-center gap-2 mx-auto">
          Start Creating Dashboards
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
