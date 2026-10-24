'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  FileText,
  Clock,
  Shield,
  Zap,
} from 'lucide-react';

interface CTASectionProps {
  onGetStarted: () => void;
  onViewExamples?: () => void;
}

export function CTASection({ onGetStarted, onViewExamples }: CTASectionProps) {
  const benefits = [
    {
      icon: Clock,
      title: "Instant results",
      description: "Get your data analyzed in seconds, not hours"
    },
    {
      icon: Shield,
      title: "100% private",
      description: "Your data never leaves your device"
    },
    {
      icon: Zap,
      title: "No setup",
      description: "Works immediately, no installation required"
    }
  ];

  return (
    <div className="border-b border-border px-6 sm:px-8 lg:px-16 xl:px-24 py-20">
      <div className="max-w-5xl mx-auto text-center">
        <Badge variant="outline" className="mb-6">
          Ready to get started?
        </Badge>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
          Transform your JSON data into beautiful dashboards.
        </h2>

        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Paste or upload your JSON and start exploring it as a table, chart, or
          export — entirely in your browser.
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="border border-border rounded-md p-6">
                <div className="w-10 h-10 rounded-md border border-border bg-muted flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Main CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
          <Button size="lg" onClick={onGetStarted}>
            Start Analyzing Now
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button size="lg" variant="outline" onClick={onViewExamples}>
            <FileText className="h-4 w-4 mr-2" />
            View Examples
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-xl mx-auto border-t border-border pt-10">
          <div>
            <div className="text-2xl font-bold">10K+</div>
            <div className="text-sm text-muted-foreground">Files Processed</div>
          </div>
          <div>
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm text-muted-foreground">Client-Side</div>
          </div>
          <div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Registration Required</div>
          </div>
        </div>
      </div>
    </div>
  );
}
