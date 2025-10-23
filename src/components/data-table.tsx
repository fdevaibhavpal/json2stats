'use client';

import { useState } from 'react';
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
  Filter,
} from 'lucide-react';
import { useTableStore } from '@/store/table-store';
import { formatValue } from '@/lib/utils';
import { FilterPanel } from './filters/filter-panel';

interface DataTableProps {
  className?: string;
}

export function DataTable({ className }: DataTableProps) {
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
    setFilterGroups,
    toggleColumnVisibility,
    selectRow,
    selectAllRows,
    clearSelection,
    getProcessedData,
  } = useTableStore();

  const [columnSearch, setColumnSearch] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

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

  const handleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      setSort(columnKey, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(columnKey, 'asc');
    }
  };

  const handleColumnSearch = (columnKey: string, value: string) => {
    setColumnSearch(prev => ({ ...prev, [columnKey]: value }));
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

  return (
    <div className={`${className}`}>
      {/* Controls */}
      <Card className="mb-0">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="flex items-center gap-4 justify-between">
              <div className="flex items-center gap-2">
                Data Table
                <Badge variant="secondary">
                  {processedData.totalItems} items
                </Badge>
              </div>
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search all columns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              
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
              <div className="flex items-center gap-2">
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
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Advanced Filters - Compact */}
          {showFilters && (
            <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
              <FilterPanel
                columns={columns}
                onFiltersChange={setFilterGroups}
              />
            </div>
          )}

         

          {/* Table with Fixed Header */}
          <div className="rounded-md border overflow-hidden">
            {/* Fixed Header */}
            <div className="bg-slate-50 dark:bg-slate-800 border-b">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        ref={(input) => {
                          if (input) input.indeterminate = isIndeterminate;
                        }}
                        onChange={() => isAllSelected ? clearSelection() : selectAllRows()}
                        className="rounded"
                      />
                    </TableHead>
                    {visibleColumns.map((column) => (
                      <TableHead key={column.key} className="min-w-[100px] bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort(column.key)}
                            disabled={!column.sortable}
                            className="h-8 px-2"
                          >
                            {column.label}
                            {column.sortable && getSortIcon(column.key)}
                          </Button>
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="w-12 bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            
            {/* Scrollable Body */}
            <div className="max-h-[60vh] overflow-y-auto">
              <Table>
                <TableBody>
                  {processedData.data.map((row, index) => (
                    <TableRow key={`row-${index}`} className="hover:bg-muted/50">
                      <TableCell className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(`row-${index}`)}
                          onChange={() => selectRow(`row-${index}`)}
                          className="rounded"
                        />
                      </TableCell>
                      {visibleColumns.map((column) => (
                        <TableCell key={column.key} className="max-w-[200px]">
                          <div className="flex items-center gap-2">
                            <span className="truncate">
                              {formatValue(row[column.key], column.type)}
                            </span>
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
          {processedData.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, processedData.totalItems)} of {processedData.totalItems} entries
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <span className="text-sm">
                  Page {currentPage} of {processedData.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === processedData.totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(processedData.totalPages)}
                  disabled={currentPage === processedData.totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
