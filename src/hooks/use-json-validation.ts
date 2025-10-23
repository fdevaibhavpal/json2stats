import { useState, useCallback } from 'react';
import { JsonParser } from '@/lib/json-parser';

interface ValidationResult {
  isValid: boolean;
  error: string | null;
  format: 'json' | 'ndjson' | 'jsonl' | 'single';
  data?: any[];
}

export function useJsonValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    error: null,
    format: 'json'
  });

  const validateJson = useCallback(async (jsonString: string): Promise<ValidationResult> => {
    if (!jsonString.trim()) {
      const result = { isValid: false, error: null, format: 'json' as const };
      setValidationResult(result);
      return result;
    }

    setIsValidating(true);

    try {
      const data = JsonParser.parseJson(jsonString);
      const result = {
        isValid: true,
        error: null,
        format: 'json' as const,
        data
      };
      setValidationResult(result);
      return result;
    } catch (error) {
      const result = {
        isValid: false,
        error: error instanceof Error ? error.message : 'Validation failed',
        format: 'json' as const
      };
      setValidationResult(result);
      return result;
    } finally {
      setIsValidating(false);
    }
  }, []);

  return {
    isValidating,
    validationResult,
    validateJson
  };
}
