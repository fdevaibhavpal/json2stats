'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useTableStore } from '@/store/table-store';
import { JsonParser } from '@/lib/json-parser';

interface JsonInputProps {
  onDataLoaded?: () => void;
}

export function JsonInput({ onDataLoaded }: JsonInputProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { loadJsonData } = useTableStore();

  const handleInputChange = (value: string) => {
    setJsonInput(value);
    setValidationError(null);
    setIsValid(false);
  };

  const validateJson = async () => {
    if (!jsonInput.trim()) return;

    setIsValidating(true);
    setValidationError(null);

    try {
      const validation = JsonParser.validateJson(jsonInput);
      
      if (validation.isValid) {
        setIsValid(true);
        setValidationError(null);
      } else {
        setIsValid(false);
        setValidationError(validation.error || 'Invalid JSON');
      }
    } catch (error) {
      setIsValid(false);
      setValidationError(error instanceof Error ? error.message : 'Validation failed');
    } finally {
      setIsValidating(false);
    }
  };

  const handleLoadData = async () => {
    if (!isValid || !jsonInput.trim()) return;

    try {
      loadJsonData(jsonInput);
      onDataLoaded?.();
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Failed to load data');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
      setValidationError(null);
      setIsValid(false);
    };
    reader.readAsText(file);
  };

  const handleExampleData = () => {
    const exampleData = [
      {
        id: 1,
        name: "Bright Agency",
        city: "Noida",
        services: ["web", "saas"],
        annual_revenue: 1200000,
        founded: "2019-06-15",
        category: "agency",
        website: "https://bright.example"
      },
      {
        id: 2,
        name: "Fresh Labs",
        city: "Gurgaon",
        services: ["mobile", "web"],
        annual_revenue: 450000,
        founded: "2021-02-01",
        category: "studio",
        website: "https://fresh.example"
      },
      {
        id: 3,
        name: "Tech Solutions",
        city: "Mumbai",
        services: ["consulting", "development"],
        annual_revenue: 800000,
        founded: "2020-03-10",
        category: "consultancy",
        website: "https://tech.example"
      }
    ];

    setJsonInput(JSON.stringify(exampleData, null, 2));
    setValidationError(null);
    setIsValid(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          JSON Data Input
        </CardTitle>
        <CardDescription>
          Paste your JSON data or upload a file to get started. Supports arrays of objects and newline-delimited JSON.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
          <Button
            variant="outline"
            onClick={handleExampleData}
            className="flex items-center gap-2"
          >
            Load Example
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.ndjson,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="json-input" className="text-sm font-medium">
              JSON Data
            </label>
            <div className="flex items-center gap-2">
              {isValidating && (
                <Badge variant="secondary" className="animate-pulse">
                  Validating...
                </Badge>
              )}
              {isValid && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Valid JSON
                </Badge>
              )}
              {validationError && (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Invalid
                </Badge>
              )}
            </div>
          </div>
          
          <Textarea
            id="json-input"
            placeholder="Paste your JSON data here..."
            value={jsonInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={validateJson}
            className="min-h-[200px] font-mono text-sm"
          />
          
          {validationError && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {validationError}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {jsonInput.length > 0 && (
              <span>{jsonInput.length} characters</span>
            )}
          </div>
          
          <Button
            onClick={handleLoadData}
            disabled={!isValid || !jsonInput.trim()}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Load Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
