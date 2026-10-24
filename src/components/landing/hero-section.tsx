'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, FileText } from 'lucide-react';
import { HeroDemoAnimation } from './hero-demo-animation';

interface HeroSectionProps {
  onGetStarted: () => void;
  onViewDemo?: () => void;
}

export function HeroSection({ onGetStarted, onViewDemo }: HeroSectionProps) {
  return (
    <div className="border-b border-border">
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-border lg:divide-x lg:divide-border">
        {/* Left: copy */}
        <div className="px-6 sm:px-8 lg:px-16 xl:px-24 py-16 lg:py-24 flex flex-col justify-center">
          <Badge variant="outline" className="w-fit mb-6">
            Open source / Client side / No signup
          </Badge>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Explore JSON data visually.
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
            Paste your JSON, explore it as a table, create charts, and export
            — all in your browser. No setup. No database. No hassle.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" onClick={onGetStarted}>
              Open Json2Stats
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={onViewDemo}>
              <FileText className="h-4 w-4 mr-2" />
              View Demo
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 mt-10 text-sm text-muted-foreground font-mono">
            <span>✓ 100% free</span>
            <span>✓ Open source</span>
            <span>✓ Works offline</span>
            <span>✓ Privacy first</span>
          </div>
        </div>

        {/* Right: animated dashboard demo */}
        <div className="px-6 sm:px-8 lg:px-10 xl:px-12 py-10 lg:py-12 flex items-center bg-muted/40">
          <HeroDemoAnimation />
        </div>
      </div>
    </div>
  );
}
