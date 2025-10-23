'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle } from 'lucide-react';
import { useTableStore } from '@/store/table-store';
import { useJsonValidation } from '@/hooks/use-json-validation';
import { JsonInput } from './json-input';
import { JsonValidator } from './json-validator';
import { JsonActions } from './json-actions';

interface JsonEditorProps {
  onDataLoaded?: () => void;
}

export function JsonEditor({ onDataLoaded }: JsonEditorProps) {
  const [jsonValue, setJsonValue] = useState('');
  const { loadJsonData } = useTableStore();
  const { isValidating, validationResult, validateJson } = useJsonValidation();

  // Auto-validate JSON as user types
  useEffect(() => {
    if (jsonValue.trim()) {
      const timeoutId = setTimeout(() => {
        validateJson(jsonValue);
      }, 500); // Debounce validation

      return () => clearTimeout(timeoutId);
    }
  }, [jsonValue, validateJson]);

  const handleLoadData = useCallback(async () => {
    if (!validationResult.isValid || !jsonValue.trim()) return;

    try {
      loadJsonData(jsonValue);
      onDataLoaded?.();
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }, [validationResult.isValid, jsonValue, loadJsonData, onDataLoaded]);

  const handleFileUpload = useCallback((content: string) => {
    setJsonValue(content);
  }, []);

  const handleLoadExample = useCallback(() => {
    const exampleData = [
      {
        id: 1,
        name: "Bright Agency",
        city: "Noida",
        services: ["web", "saas"],
        annual_revenue: 1200000,
        founded: "2019-06-15",
        category: "agency",
        website: "https://bright.example",
        employees: 25,
        is_active: true,
        last_updated: "2024-01-15T10:30:00Z",
        tags: ["startup", "tech", "growing"],
        location: {
          country: "India",
          state: "Uttar Pradesh",
          coordinates: [28.5355, 77.3910]
        }
      },
      {
        id: 2,
        name: "Fresh Labs",
        city: "Gurgaon",
        services: ["mobile", "web"],
        annual_revenue: 450000,
        founded: "2021-02-01",
        category: "studio",
        website: "https://fresh.example",
        employees: 12,
        is_active: true,
        last_updated: "2024-01-10T14:20:00Z",
        tags: ["design", "creative", "mobile-first"],
        location: {
          country: "India",
          state: "Haryana",
          coordinates: [28.4595, 77.0266]
        }
      },
      {
        id: 3,
        name: "Tech Solutions",
        city: "Mumbai",
        services: ["consulting", "development"],
        annual_revenue: 800000,
        founded: "2020-03-10",
        category: "consultancy",
        website: "https://tech.example",
        employees: 18,
        is_active: false,
        last_updated: "2023-12-20T09:15:00Z",
        tags: ["enterprise", "consulting", "established"],
        location: {
          country: "India",
          state: "Maharashtra",
          coordinates: [19.0760, 72.8777]
        }
      },
      {
        id: 4,
        name: "Data Insights Co",
        city: "Bangalore",
        services: ["analytics", "ai", "ml"],
        annual_revenue: 1500000,
        founded: "2018-11-05",
        category: "analytics",
        website: "https://data.example",
        employees: 35,
        is_active: true,
        last_updated: "2024-01-20T16:45:00Z",
        tags: ["ai", "data", "enterprise"],
        location: {
          country: "India",
          state: "Karnataka",
          coordinates: [12.9716, 77.5946]
        }
      }
    ];

    setJsonValue(JSON.stringify(exampleData, null, 2));
  }, []);

  const handleFormatJson = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonValue);
      setJsonValue(JSON.stringify(parsed, null, 2));
    } catch {
      // Error will be caught by validation
    }
  }, [jsonValue]);

  return (
    <Card className="w-full max-w-6xl mx-auto border-0 shadow-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">JSON Editor</CardTitle>
              <CardDescription className="text-base mt-1">
                Professional JSON editor with syntax highlighting and validation
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isValidating && (
              <Badge variant="secondary" className="animate-pulse">
                Validating...
              </Badge>
            )}
            {validationResult.isValid && (
              <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Valid JSON
              </Badge>
            )}
            {validationResult.error && (
              <Badge variant="destructive">
                Invalid
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Action Buttons */}
        <JsonActions
          value={jsonValue}
          onFileUpload={handleFileUpload}
          onLoadExample={handleLoadExample}
          onFormat={handleFormatJson}
        />

        {/* Monaco Editor */}
        <JsonInput
          value={jsonValue}
          onChange={setJsonValue}
          onValidate={validateJson}
        />

        {/* Validation Display */}
        

        {/* Load Data Button */}
        <div className="flex justify-between items-center">
        <JsonValidator
          isValidating={isValidating}
          isValid={validationResult.isValid}
          error={validationResult.error}
          value={jsonValue}
        />
          <Button
            onClick={handleLoadData}
            disabled={!validationResult.isValid || !jsonValue.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            <CheckCircle className="h-4 w-4" />
            Load Data into Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
