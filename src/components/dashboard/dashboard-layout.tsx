'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sidebar } from './sidebar';
import { JsonEditor } from '@/components/json-editor';
import { DataTable } from '@/components/data-table';
import { StatsCards } from '@/components/stats-cards';
import { SimpleAnalytics } from '@/components/charts/simple-analytics';
import { Welcome } from '@/components/welcome';
import { useTableStore } from '@/store/table-store';

export function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('input');
  const { data, columns } = useTableStore();

  const handleDataLoaded = () => {
    setActiveTab('table');
  };

  const handleGetStarted = () => {
    setActiveTab('input');
  };

  // Show welcome screen if no data is loaded
  if (data.length === 0 && activeTab !== 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <Welcome onGetStarted={handleGetStarted} />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'input':
        return <JsonEditor onDataLoaded={handleDataLoaded} />;
      case 'table':
        return <DataTable />;
      case 'charts':
        return (
          <SimpleAnalytics 
            data={data} 
            columns={columns}
            onFilter={(filters) => {
              console.log('Chart filters applied:', filters);
            }}
            onDrillDown={(field, value) => {
              console.log('Drill down:', field, value);
            }}
          />
        );
      case 'stats':
        return <StatsCards />;
      default:
        return <JsonEditor onDataLoaded={handleDataLoaded} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-linear-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                JsonDash
              </h1>
              {data.length > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {data.length} records loaded
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
