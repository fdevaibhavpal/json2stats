'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Table,
  PieChart,
  Settings,
} from 'lucide-react';
import { useTableStore } from '@/store/table-store';
import { Logo } from '@/components/landing/logo';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { data, getProcessedData } = useTableStore();

  const processedData = getProcessedData();
  const hasData = data.length > 0;

  const menuItems = [
    {
      id: 'data',
      label: 'Data',
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
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Preferences'
    }
  ];

  return (
    <div className="bg-sidebar border-r border-sidebar-border flex flex-col w-64">
      <div className="p-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <Logo />
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <div key={item.id} className="relative">
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-full" />
                )}
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start h-auto p-3 pl-4',
                    isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent'
                  )}
                  onClick={() => !item.disabled && onTabChange(item.id)}
                  disabled={item.disabled}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Icon className="h-4 w-4 shrink-0" />
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
                  </div>
                </Button>
              </div>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Footer signature */}
        <div className="mt-6 pt-4 border-t border-sidebar-border text-xs text-muted-foreground font-mono space-y-0.5">
          <div className="font-semibold text-foreground mb-1">JSON DASH</div>
          <div>Open source</div>
          <div>Client side</div>
          <div>No database</div>
        </div>
      </div>
    </div>
  );
}
