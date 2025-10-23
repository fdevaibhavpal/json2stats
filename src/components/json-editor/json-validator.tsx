'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';

interface JsonValidatorProps {
  isValidating: boolean;
  isValid: boolean;
  error: string | null;
  value: string;
}

export function JsonValidator({ isValidating, isValid, error, value }: JsonValidatorProps) {
  if (!value.trim()) {
    return null;
  }

  if (isValidating) {
    return (
      <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
        <span className="text-sm text-yellow-600 dark:text-yellow-400">Validating JSON...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
        <div className="flex-1">
          <div className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
            Invalid JSON Format
          </div>
          <div className="text-sm text-red-600 dark:text-red-400 mb-2">
            {error}
          </div>
          <div className="text-xs text-red-500 dark:text-red-300">
            <strong>Supported formats:</strong> JSON, NDJSON, JSONL, or single objects
          </div>
        </div>
      </div>
    );
  }

  if (isValid) {
    return (
      <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm text-blue-600 dark:text-blue-400">
          Valid JSON detected • {value.split('\n').length} lines • {value.length} characters
        </span>
      </div>
    );
  }

  return null;
}
