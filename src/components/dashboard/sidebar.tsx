'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Table, 
  BarChart3, 
  PieChart, 
  Download,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useTableStore } from '@/store/table-store';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { data, getProcessedData } = useTableStore();
  
  const processedData = getProcessedData();
  const hasData = data.length > 0;

  const menuItems = [
    {
      id: 'input',
      label: 'Input',
      icon: FileText,
      description: 'Load JSON data'
    },
    {
      id: 'table',
      label: 'Table',
      icon: Table,
      description: 'View data table',
      disabled: !hasData,
      badge: hasData ? processedData.totalItems : null
    },
    {
      id: 'charts',
      label: 'Charts',
      icon: PieChart,
      description: 'Data visualizations',
      disabled: !hasData
    },
    {
      id: 'stats',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Data insights',
      disabled: !hasData
    }
  ];

  return (
    <div className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold">JSON Dashboard</h2>
              <p className="text-sm text-muted-foreground">Data Analytics</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-3 ${
                  isActive 
                    ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => !item.disabled && onTabChange(item.id)}
                disabled={item.disabled}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </Button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        {hasData && !collapsed && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  const exportEvent = new CustomEvent('export-data');
                  window.dispatchEvent(exportEvent);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
             
            </div>
          </div>
        )}

        {/* Footer */}
        {!collapsed && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <HelpCircle className="h-4 w-4" />
              <span>Help & Support</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
