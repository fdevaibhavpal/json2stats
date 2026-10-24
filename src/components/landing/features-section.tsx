'use client';

import { Table, BarChart3, Filter, Download } from 'lucide-react';

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
    title: 'Advanced filters',
    description: 'Filter, group and analyze your data with powerful conditions.',
    icon: Filter,
  },
  {
    number: '04',
    title: 'Export anywhere',
    description: 'Export your data and charts as CSV, JSON, PNG or share a link.',
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
            <div key={feature.number} className="px-6 py-10 sm:border-b lg:border-b-0 border-border">
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold text-muted-foreground font-mono">{feature.number}</span>
                <Icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
