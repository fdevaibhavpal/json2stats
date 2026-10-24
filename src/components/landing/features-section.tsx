'use client';

import { Table, BarChart3, LayoutGrid, Download } from 'lucide-react';

const FEATURES = [
  {
    number: '01',
    title: 'Interactive tables',
    description: 'Explore your JSON data in a clean, searchable, and filterable table.',
    icon: Table,
  },
  {
    number: '02',
    title: 'Beautiful charts',
    description: 'Create bar, line, pie and more charts with just a few clicks.',
    icon: BarChart3,
  },
  {
    number: '03',
    title: 'Chart templates',
    description: 'Start fast with ready-made templates for business, analytics, and finance.',
    icon: LayoutGrid,
  },
  {
    number: '04',
    title: 'Export anywhere',
    description: 'Export your data and charts as CSV, JSON, Excel or copy to clipboard.',
    icon: Download,
  },
];

export function FeaturesSection() {
  return (
    <div id="features" className="border-b border-border">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y divide-border sm:divide-y-0 lg:divide-x">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.number}
              className="group relative px-6 py-10 sm:border-b lg:border-b-0 border-border overflow-hidden transition-colors hover:bg-muted/40"
            >
              {/* Abstract light background, revealed on hover */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    'radial-gradient(circle at 85% 15%, color-mix(in oklch, var(--primary) 18%, transparent) 0%, transparent 55%), radial-gradient(circle at 10% 90%, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 50%)',
                }}
              />

              <div className="relative flex items-center justify-between mb-6">
                <span className="text-2xl font-bold text-muted-foreground font-mono">{feature.number}</span>
                <Icon className="h-6 w-6 text-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:text-primary" />
              </div>
              <h3 className="relative font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="relative text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
