'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useTableStore } from '@/store/table-store';
import { useJsonValidation } from '@/hooks/use-json-validation';
import { useFileHandler } from '@/hooks/use-file-handler';
import { JsonInput } from './json-input';
import { JsonValidator } from './json-validator';
import { JsonActions } from './json-actions';
import { DataPreview } from './data-preview';
import { JsonParser } from '@/lib/json-parser';

interface JsonEditorProps {
  onDataLoaded?: () => void;
}

const SAMPLE_DATA = [
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

export function JsonEditor({ onDataLoaded }: JsonEditorProps) {
  const [jsonValue, setJsonValue] = useState('');
  const { loadJsonData } = useTableStore();
  const { isValidating, validationResult, validateJson } = useJsonValidation();
  const { handleFileUpload } = useFileHandler();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const content = await handleFileUpload(file);
      setJsonValue(content);
    } catch (error) {
      console.error('Failed to read file:', error);
    }
  };

  const handleLoadSample = useCallback(() => {
    setJsonValue(JSON.stringify(SAMPLE_DATA, null, 2));
  }, []);

  const handleFormatJson = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonValue);
      setJsonValue(JSON.stringify(parsed, null, 2));
    } catch {
      // Error will be caught by validation
    }
  }, [jsonValue]);

  const handleMinify = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonValue);
      setJsonValue(JSON.stringify(parsed));
    } catch {
      // Error will be caught by validation
    }
  }, [jsonValue]);

  const handleClear = useCallback(() => {
    setJsonValue('');
  }, []);

  return (
    <div className="flex flex-col h-full min-h-0 space-y-3">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold">JSON Input</h2>
          <p className="text-sm text-muted-foreground">Paste or type your JSON data below.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Load File
          </Button>
          <Button variant="outline" size="sm" onClick={handleLoadSample}>
            Sample
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.ndjson,.jsonl,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          <JsonActions
            value={jsonValue}
            onProcess={handleLoadData}
            onMinify={handleMinify}
            onFormat={handleFormatJson}
            onClear={handleClear}
            processDisabled={!validationResult.isValid || !jsonValue.trim()}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Editor */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <JsonInput
            value={jsonValue}
            onChange={setJsonValue}
            onValidate={validateJson}
          />
        </div>

        {/* Side panels */}
        <div className="space-y-4 overflow-y-auto min-h-0">
          <div>
            <h3 className="text-sm font-semibold mb-2 px-1">Validation</h3>
            <JsonValidator
              isValidating={isValidating}
              isValid={validationResult.isValid}
              error={validationResult.error}
              value={jsonValue}
              data={validationResult.data}
            />
          </div>
          {validationResult.isValid && validationResult.data && (
            <DataPreview
              key={jsonValue}
              data={validationResult.data}
              columns={JsonParser.inferSchema(validationResult.data)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
