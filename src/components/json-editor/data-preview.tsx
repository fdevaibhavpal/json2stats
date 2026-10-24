'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { JsonData, ColumnSchema } from '@/types';
import { formatValue } from '@/lib/utils';

interface DataPreviewProps {
  data: JsonData[];
  columns: ColumnSchema[];
}

export function DataPreview({ data, columns }: DataPreviewProps) {
  const [tab, setTab] = useState<'table' | 'schema'>('table');
  const previewRows = data.slice(0, 5);
  const previewColumns = columns.slice(0, 6);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Data Preview</CardTitle>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="table">Table Preview</TabsTrigger>
            <TabsTrigger value="schema">Schema</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {tab === 'table' ? (
          <div className="overflow-x-auto rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  {previewColumns.map((col) => (
                    <TableHead key={col.key} className="font-mono text-xs uppercase">
                      {col.key}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewRows.map((row, i) => (
                  <TableRow key={i}>
                    {previewColumns.map((col) => (
                      <TableCell key={col.key} className="font-mono text-sm">
                        {formatValue(row[col.key], col.type)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {columns.map((col) => (
              <div key={col.key} className="border border-border rounded-md px-3 py-2 bg-muted">
                <div className="text-sm font-semibold font-mono">{col.key}</div>
                <div className="text-xs text-muted-foreground font-mono">{col.type}</div>
              </div>
            ))}
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-3 font-mono">
          Showing {previewRows.length} of {data.length} records
        </div>
      </CardContent>
    </Card>
  );
}
