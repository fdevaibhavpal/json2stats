'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTableStore } from '@/store/table-store';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function DebugPanel() {
  const { data, columns } = useTableStore();
  const [testResults, setTestResults] = useState<any[]>([]);

  const runTests = () => {
    const results = [];

    // Test 1: Data availability
    results.push({
      name: 'Data Available',
      status: data.length > 0 ? 'pass' : 'fail',
      message: data.length > 0 ? `${data.length} records loaded` : 'No data loaded'
    });

    // Test 2: Column structure
    results.push({
      name: 'Column Structure',
      status: columns.length > 0 ? 'pass' : 'fail',
      message: columns.length > 0 ? `${columns.length} columns detected` : 'No columns detected'
    });

    // Test 3: Data types
    const numericColumns = columns.filter(c => c.type === 'number');
    const categoricalColumns = columns.filter(c => 
      c.type === 'string' || c.type === 'boolean' || c.type === 'date'
    );

    results.push({
      name: 'Numeric Columns',
      status: numericColumns.length > 0 ? 'pass' : 'warn',
      message: numericColumns.length > 0 
        ? `${numericColumns.length} numeric columns found` 
        : 'No numeric columns - only count charts available'
    });

    results.push({
      name: 'Categorical Columns',
      status: categoricalColumns.length > 0 ? 'pass' : 'fail',
      message: categoricalColumns.length > 0 
        ? `${categoricalColumns.length} categorical columns found` 
        : 'No categorical columns - charts cannot be created'
    });

    // Test 4: Sample data validation
    if (data.length > 0) {
      const sampleItem = data[0];
      const hasValidStructure = typeof sampleItem === 'object' && sampleItem !== null;
      
      results.push({
        name: 'Data Structure',
        status: hasValidStructure ? 'pass' : 'fail',
        message: hasValidStructure 
          ? 'Data structure is valid' 
          : 'Invalid data structure'
      });
    }

    setTestResults(results);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warn':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100';
      case 'fail':
        return 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100';
      case 'warn':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-100';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-100';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          System Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTests} className="w-full">
          Run System Tests
        </Button>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Test Results</h4>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{result.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {result.status}
                  </Badge>
                </div>
                <p className="text-sm mt-1">{result.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Data Preview */}
        {data.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Data Preview</h4>
            <div className="text-sm text-muted-foreground">
              <p>Records: {data.length}</p>
              <p>Columns: {columns.length}</p>
              <p>Numeric: {columns.filter(c => c.type === 'number').length}</p>
              <p>Categorical: {columns.filter(c => 
                c.type === 'string' || c.type === 'boolean' || c.type === 'date'
              ).length}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
