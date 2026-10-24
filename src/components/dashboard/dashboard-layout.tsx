'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sidebar } from './sidebar';
import { SettingsView } from './settings-view';
import { JsonEditor } from '@/components/json-editor';
import { DataTable } from '@/components/data-table';
import { SimpleAnalytics } from '@/components/charts/simple-analytics';
import { Welcome } from '@/components/welcome';
import { Logo } from '@/components/landing/logo';
import { useTableStore } from '@/store/table-store';
import { cn } from '@/lib/utils';

const TAB_LABELS: Record<string, string> = {
  data: 'JSON Input',
  table: 'Table',
  charts: 'Charts',
  settings: 'Settings',
};

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('data');
  const [chartsInitialTab, setChartsInitialTab] = useState<'quick' | 'templates' | 'advanced'>('quick');
  const { data, columns } = useTableStore();

  const handleDataLoaded = () => {
    setActiveTab('table');
  };

  const handleGetStarted = () => {
    setActiveTab('data');
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'charts') {
      setChartsInitialTab('quick');
    }
    setActiveTab(tab);
  };

  // Show welcome screen if no data is loaded
  if (data.length === 0 && !['data', 'settings'].includes(activeTab)) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Welcome onGetStarted={handleGetStarted} />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'data':
        return <JsonEditor onDataLoaded={handleDataLoaded} />;
      case 'table':
        return <DataTable onViewCharts={() => handleTabChange('charts')} />;
      case 'charts':
        return (
          <SimpleAnalytics
            data={data}
            columns={columns}
            initialTab={chartsInitialTab}
            onDrillDown={() => {}}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return <JsonEditor onDataLoaded={handleDataLoaded} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-background border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo />
              <span className="text-sm text-muted-foreground font-mono hidden sm:inline">
                Data <span className="mx-1">&gt;</span> {TAB_LABELS[activeTab] ?? activeTab}
              </span>
              {data.length > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {data.length} records loaded
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <a
                href="https://github.com/fdevaibhavpal/json2stats"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div
          className={cn(
            'flex-1 min-h-0 p-4',
            activeTab === 'data' ? 'flex flex-col overflow-hidden' : 'overflow-auto'
          )}
        >
          <div className={cn('max-w-7xl mx-auto w-full', activeTab === 'data' && 'flex-1 min-h-0 flex flex-col')}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
