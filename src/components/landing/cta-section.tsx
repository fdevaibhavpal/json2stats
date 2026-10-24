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
              <div
                key={benefit.title}
                className="group relative border border-border rounded-md p-6 overflow-hidden transition-colors hover:bg-muted/40"
              >
                {/* Abstract light background, revealed on hover */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      'radial-gradient(circle at 85% 15%, color-mix(in oklch, var(--primary) 18%, transparent) 0%, transparent 55%), radial-gradient(circle at 10% 90%, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 50%)',
                  }}
                />

                <div className="relative w-10 h-10 rounded-md border border-border bg-muted flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110">
                  <Icon className="h-5 w-5 text-foreground transition-colors group-hover:text-primary" />
                </div>
                <h3 className="relative font-semibold mb-1">{benefit.title}</h3>
                <p className="relative text-sm text-muted-foreground">{benefit.description}</p>
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
