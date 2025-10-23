'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Table, Database, Copy, Check } from 'lucide-react';
import { useTableStore } from '@/store/table-store';
import { DataProcessor } from '@/lib/data-processor';
import { JsonData, ColumnSchema } from '@/types';
import * as XLSX from 'xlsx';

interface ExportControlsProps {
  className?: string;
}

export function ExportControls({ className }: ExportControlsProps) {
  const { data, columns, getProcessedData } = useTableStore();
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  
  const processedData = getProcessedData();

  if (data.length === 0) {
    return null;
  }

  const exportToCSV = () => {
    const processor = new DataProcessor(data, columns);
    const csvContent = processor.exportToCSV(processedData.data, columns.filter(col => !col.hidden));
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToXLSX = () => {
    const visibleColumns = columns.filter(col => !col.hidden);
    const headers = visibleColumns.map(col => col.label);
    const rows = processedData.data.map(row => 
      visibleColumns.map(col => row[col.key])
    );

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // Add stats sheet if available
    if (processedData.stats.length > 0) {
      const statsData = [
        ['Label', 'Value', 'Type', 'Column'],
        ...processedData.stats.map(stat => [
          stat.label,
          stat.value,
          stat.type,
          stat.column || 'N/A'
        ])
      ];
      const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
      XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistics');
    }

    XLSX.writeFile(workbook, `data-export-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(processedData.data, null, 2);
    
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (format: string) => {
    let content = '';
    
    switch (format) {
      case 'csv':
        const processor = new DataProcessor(data, columns);
        content = processor.exportToCSV(processedData.data, columns.filter(col => !col.hidden));
        break;
      case 'json':
        content = JSON.stringify(processedData.data, null, 2);
        break;
      case 'stats':
        content = JSON.stringify(processedData.stats, null, 2);
        break;
      default:
        return;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getExportStats = () => {
    return {
      totalItems: processedData.totalItems,
      visibleColumns: columns.filter(col => !col.hidden).length,
      hasFilters: data.length !== processedData.totalItems,
      hasStats: processedData.stats.length > 0,
    };
  };

  const exportStats = getExportStats();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export Stats */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {exportStats.totalItems} items
          </Badge>
          <Badge variant="secondary">
            {exportStats.visibleColumns} columns
          </Badge>
          {exportStats.hasFilters && (
            <Badge variant="outline">
              Filtered
            </Badge>
          )}
          {exportStats.hasStats && (
            <Badge variant="outline">
              With Stats
            </Badge>
          )}
        </div>

        {/* Export Actions */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={exportToCSV} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            CSV
          </Button>
          
          <Button onClick={exportToXLSX} className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Excel
          </Button>
          
          <Button onClick={exportToJSON} className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            JSON
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => copyToClipboard('csv')}>
                <FileText className="h-4 w-4 mr-2" />
                Copy as CSV
                {copiedFormat === 'csv' && <Check className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => copyToClipboard('json')}>
                <Database className="h-4 w-4 mr-2" />
                Copy as JSON
                {copiedFormat === 'json' && <Check className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
              {exportStats.hasStats && (
                <DropdownMenuItem onClick={() => copyToClipboard('stats')}>
                  <Table className="h-4 w-4 mr-2" />
                  Copy Statistics
                  {copiedFormat === 'stats' && <Check className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Export Info */}
        <div className="text-sm text-muted-foreground">
          <p>Exports include currently filtered and sorted data.</p>
          {exportStats.hasFilters && (
            <p className="text-amber-600">
              ⚠️ Exporting filtered data ({processedData.totalItems} of {data.length} items)
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
