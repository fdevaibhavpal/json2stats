import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format value for display based on type
 */
export function formatValue(value: unknown, type: string): string {
  if (value === null || value === undefined) {
    return '';
  }

  switch (type) {
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : String(value);
    case 'date':
      if (typeof value === 'string') {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      }
      return String(value);
    case 'boolean':
      return value ? 'Yes' : 'No';
    case 'array':
      if (Array.isArray(value)) {
        return value.length > 0 ? `[${value.length} items]` : '[]';
      }
      return String(value);
    case 'object':
      if (typeof value === 'object' && value !== null) {
        return `{${Object.keys(value).length} keys}`;
      }
      return String(value);
    case 'url':
      return String(value);
    default:
      return String(value);
  }
}
