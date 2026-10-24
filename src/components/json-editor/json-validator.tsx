'use client';

import { AlertCircle, CheckCircle, Circle, Loader2 } from 'lucide-react';
import { JsonData } from '@/types';

interface JsonValidatorProps {
  isValidating: boolean;
  isValid: boolean;
  error: string | null;
  value: string;
  data?: JsonData[];
}

function hasConsistentStructure(data: JsonData[]): boolean {
  if (data.length <= 1) return true;
  const firstKeys = Object.keys(data[0]).sort().join(',');
  return data.every((item) => Object.keys(item).sort().join(',') === firstKeys);
}

export function JsonValidator({ isValidating, isValid, error, value, data }: JsonValidatorProps) {
  if (!value.trim()) {
    return null;
  }

  if (isValidating) {
    return (
      <div className="flex items-center gap-2 p-3 bg-muted border border-border rounded-md">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Validating JSON...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-md">
        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
        <div className="flex-1">
          <div className="text-sm font-medium text-destructive mb-1">
            Invalid JSON Format
          </div>
          <div className="text-sm text-destructive/80 mb-2">
            {error}
          </div>
          <div className="text-xs text-muted-foreground">
            <strong>Supported formats:</strong> JSON, NDJSON, JSONL, or single objects
          </div>
        </div>
      </div>
    );
  }

  if (isValid) {
    const consistent = data ? hasConsistentStructure(data) : true;
    const checks = [
      { label: 'Valid JSON syntax', ok: true },
      { label: `${data?.length ?? 0} record${data?.length === 1 ? '' : 's'} (array)`, ok: true },
      { label: 'Consistent structure', ok: consistent },
      { label: 'No parsing errors', ok: true },
    ];

    return (
      <div className="p-3 bg-muted border border-border rounded-md space-y-1.5">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-2 text-sm">
            {check.ok ? (
              <CheckCircle className="h-4 w-4 text-primary shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className={check.ok ? '' : 'text-muted-foreground'}>{check.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
