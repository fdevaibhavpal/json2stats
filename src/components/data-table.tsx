'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  MoreHorizontal,
  Eye,
  EyeOff,
  ExternalLink,
  Copy,
  Download,
  FileText,
  Database,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { useTableStore } from '@/store/table-store';
import { formatValue } from '@/lib/utils';
import { DataProcessor } from '@/lib/data-processor';
import * as XLSX from 'xlsx';

interface DataTableProps {
  className?: string;
  onViewCharts?: () => void;
}

export function DataTable({ className, onViewCharts }: DataTableProps) {
  const {
    data,
    columns,
    searchQuery,
    sortBy,
    sortDirection,
    pageSize,
    currentPage,
    selectedRows,
    setSearchQuery,
    setSort,
    setPageSize,
    setCurrentPage,
    toggleColumnVisibility,
    selectRow,
    selectAllRows,
    clearSelection,
    getProcessedData,
  } = useTableStore();

  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-muted-foreground mb-2">No data loaded</div>
            <div className="text-sm text-muted-foreground">
              Paste or upload JSON data to get started
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const processedData = getProcessedData();
  const visibleColumns = columns.filter(col => !col.hidden);
  const isAllSelected = selectedRows.length === processedData.data.length && processedData.data.length > 0;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < processedData.data.length;

  const numericFieldCount = columns.filter(c => c.type === 'number').length;
  const textFieldCount = columns.filter(c => c.type === 'string').length;

  const handleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      setSort(columnKey, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(columnKey, 'asc');
    }
  };

  const getSortIcon = (columnKey: string) => {
    if (sortBy !== columnKey) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === 'asc' ?
      <ArrowUp className="h-4 w-4" /> :
      <ArrowDown className="h-4 w-4" />;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const exportToCSV = () => {
    const processor = new DataProcessor(data, columns);
    const csvContent = processor.exportToCSV(processedData.data, visibleColumns);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToXLSX = () => {
    const headers = visibleColumns.map(col => col.label);
    const rows = processedData.data.map(row => visibleColumns.map(col => row[col.key]));
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
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

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Data Table</h2>
          <p className="text-sm text-muted-foreground">
            View, search, sort and filter your JSON data.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground font-mono">
            {processedData.totalItems.toLocaleString()} records
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToCSV}>
                <FileText className="h-4 w-4 mr-2" />
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToXLSX}>
                <Table className="h-4 w-4 mr-2" />
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToJSON}>
                <Database className="h-4 w-4 mr-2" />
                JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => copyToClipboard(JSON.stringify(processedData.data, null, 2))}>
                <Copy className="h-4 w-4 mr-2" />
                Copy as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {onViewCharts && (
            <Button size="sm" onClick={onViewCharts}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Charts
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search in all columns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Columns ({visibleColumns.length}/{columns.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {columns.map((column) => (
                  <DropdownMenuItem
                    key={column.key}
                    onClick={() => toggleColumnVisibility(column.key)}
                    className="flex items-center gap-2"
                  >
                    {column.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {column.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedRows.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Clear Selection ({selectedRows.length})
              </Button>
            )}
          </div>

          {/* Table */}
          <div className="rounded-md border border-border overflow-hidden">
            <div className="max-h-[60vh] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 bg-muted sticky top-0 z-10">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        ref={(input) => {
                          if (input) input.indeterminate = isIndeterminate;
                        }}
                        onChange={() => isAllSelected ? clearSelection() : selectAllRows()}
                        className="rounded-sm"
                      />
                    </TableHead>
                    {visibleColumns.map((column) => (
                      <TableHead key={column.key} className="min-w-[100px] bg-muted sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort(column.key)}
                            disabled={!column.sortable}
                            className="h-8 px-2 font-mono uppercase text-xs"
                          >
                            {column.label}
                            {column.sortable && getSortIcon(column.key)}
                          </Button>
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="w-12 bg-muted sticky top-0 z-10">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedData.data.map((row, index) => (
                    <TableRow key={`row-${index}`} className="hover:bg-muted/50">
                      <TableCell className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(`row-${index}`)}
                          onChange={() => selectRow(`row-${index}`)}
                          className="rounded-sm"
                        />
                      </TableCell>
                      {visibleColumns.map((column) => (
                        <TableCell key={column.key} className="max-w-[200px]">
                          <div className="flex items-center gap-2">
                            {column.type === 'string' && row[column.key] ? (
                              <Badge variant="secondary" className="font-mono font-normal">
                                {formatValue(row[column.key], column.type)}
                              </Badge>
                            ) : (
                              <span className="truncate font-mono">
                                {formatValue(row[column.key], column.type)}
                              </span>
                            )}
                            {column.type === 'url' && row[column.key] && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openUrl(row[column.key])}
                                className="h-6 w-6 p-0"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      ))}
                      <TableCell className="w-12">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => copyToClipboard(JSON.stringify(row, null, 2))}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Row
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4">
            <div className="text-sm text-muted-foreground">
              {selectedRows.length} of {processedData.data.length} rows selected
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {processedData.totalItems === 0
                  ? '0 results'
                  : `${((currentPage - 1) * pageSize) + 1}–${Math.min(currentPage * pageSize, processedData.totalItems)} of ${processedData.totalItems}`}
              </div>

              {processedData.totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ArrowUp className="h-3 w-3 -rotate-90" />
                  </Button>

                  {Array.from({ length: Math.min(processedData.totalPages, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={currentPage === pageNum ? 'border-primary text-primary' : ''}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  {processedData.totalPages > 5 && (
                    <>
                      <span className="text-muted-foreground px-1">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(processedData.totalPages)}
                        className={currentPage === processedData.totalPages ? 'border-primary text-primary' : ''}
                      >
                        {processedData.totalPages}
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === processedData.totalPages}
                  >
                    <ArrowUp className="h-3 w-3 rotate-90" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats + Detected Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Records</div>
                <div className="text-2xl font-bold">{data.length.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Columns</div>
                <div className="text-2xl font-bold">{columns.length}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Numeric Fields</div>
                <div className="text-2xl font-bold">{numericFieldCount}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Text Fields</div>
                <div className="text-2xl font-bold">{textFieldCount}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detected Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {columns.map((column) => (
                <div
                  key={column.key}
                  className="border border-border rounded-md px-3 py-2 bg-muted"
                >
                  <div className="text-sm font-semibold font-mono">{column.key}</div>
                  <div className="text-xs text-muted-foreground font-mono">{column.type}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
