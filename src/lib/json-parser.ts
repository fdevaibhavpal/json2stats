import { JsonData, ColumnSchema } from '@/types';

export class JsonParser {
  /**
   * Parse JSON string and return array of objects
   * Supports: JSON, NDJSON, JSONL, and single objects
   */
  static parseJson(jsonString: string): JsonData[] {
    try {
      // Try parsing as regular JSON first
      let parsedData;
      let format = 'json';
      
      try {
        parsedData = JSON.parse(jsonString);
        format = 'json';
      } catch {
        // Try parsing as NDJSON (newline-delimited JSON)
        try {
          const lines = jsonString.trim().split('\n').filter(line => line.trim());
          parsedData = lines.map(line => JSON.parse(line));
          format = 'ndjson';
        } catch {
          // Try parsing as JSONL (JSON Lines)
          try {
            const lines = jsonString.trim().split('\n').filter(line => line.trim());
            parsedData = lines.map(line => {
              const trimmed = line.trim();
              return trimmed ? JSON.parse(trimmed) : null;
            }).filter(item => item !== null);
            format = 'jsonl';
          } catch {
            throw new Error('Invalid JSON format. Expected valid JSON, NDJSON, or JSONL.');
          }
        }
      }

      // Handle single object
      if (typeof parsedData === 'object' && !Array.isArray(parsedData) && parsedData !== null) {
        return [parsedData];
      }
      
      // Handle array of objects
      if (Array.isArray(parsedData)) {
        if (parsedData.length === 0) {
          throw new Error('JSON array is empty. Please provide data.');
        }
        
        // Filter out null/undefined items and ensure all are objects
        const validItems = parsedData.filter(item => 
          typeof item === 'object' && item !== null
        );
        
        if (validItems.length === 0) {
          throw new Error('No valid objects found in the data.');
        }
        
        if (validItems.length !== parsedData.length) {
          console.warn(`Filtered out ${parsedData.length - validItems.length} invalid items.`);
        }
        
        return validItems;
      }
      
      throw new Error('Data must be an object or array of objects.');
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse newline-delimited JSON
   */
  static parseNDJson(jsonString: string): JsonData[] {
    try {
      const lines = jsonString.trim().split('\n');
      const objects: JsonData[] = [];
      
      for (const line of lines) {
        if (line.trim()) {
          const parsed = JSON.parse(line);
          if (typeof parsed === 'object' && parsed !== null) {
            objects.push(parsed);
          }
        }
      }
      
      return objects;
    } catch (error) {
      throw new Error(`Failed to parse NDJSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Infer column schema from data
   */
  static inferSchema(data: JsonData[]): ColumnSchema[] {
    if (data.length === 0) return [];

    const allKeys = new Set<string>();
    
    // Collect all unique keys
    data.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });

    const columns: ColumnSchema[] = [];

    allKeys.forEach(key => {
      const column = this.inferColumnType(key, data);
      columns.push(column);
    });

    return columns.sort((a, b) => {
      // Prioritize common fields
      const priorityFields = ['id', 'name', 'title', 'email', 'date', 'created_at', 'updated_at'];
      const aIndex = priorityFields.indexOf(a.key);
      const bIndex = priorityFields.indexOf(b.key);
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      
      return a.key.localeCompare(b.key);
    });
  }

  /**
   * Infer column type and properties
   */
  private static inferColumnType(key: string, data: JsonData[]): ColumnSchema {
    const values = data
      .map(item => item[key])
      .filter(value => value !== null && value !== undefined);

    if (values.length === 0) {
      return {
        key,
        label: this.formatLabel(key),
        type: 'string',
        sortable: true,
        filterable: true,
        searchable: true,
      };
    }

    const type = this.detectType(values);
    const isUrl = this.isUrlField(key, values);
    const isArray = Array.isArray(values[0]);

    return {
      key,
      label: this.formatLabel(key),
      type: isUrl ? 'url' : isArray ? 'array' : type,
      sortable: !isArray && (type === 'string' || type === 'number' || type === 'date'),
      filterable: true,
      searchable: true,
    };
  }

  /**
   * Detect the most common type in values
   */
  private static detectType(values: any[]): 'string' | 'number' | 'date' | 'boolean' | 'object' {
    const typeCounts = {
      string: 0,
      number: 0,
      boolean: 0,
      date: 0,
      object: 0,
    };

    values.forEach(value => {
      if (typeof value === 'boolean') {
        typeCounts.boolean++;
      } else if (typeof value === 'number') {
        typeCounts.number++;
      } else if (typeof value === 'object' && value !== null) {
        typeCounts.object++;
      } else if (typeof value === 'string') {
        if (this.isDateString(value)) {
          typeCounts.date++;
        } else {
          typeCounts.string++;
        }
      }
    });

    // Return the most common type
    return Object.entries(typeCounts).reduce((a, b) => 
      typeCounts[a[0] as keyof typeof typeCounts] > typeCounts[b[0] as keyof typeof typeCounts] ? a : b
    )[0] as 'string' | 'number' | 'date' | 'boolean' | 'object';
  }

  /**
   * Check if a string is a date
   */
  private static isDateString(value: string): boolean {
    if (typeof value !== 'string') return false;
    
    // Common date patterns
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // ISO datetime
      /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
      /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
    ];

    return datePatterns.some(pattern => pattern.test(value)) || !isNaN(Date.parse(value));
  }

  /**
   * Check if field contains URLs
   */
  private static isUrlField(key: string, values: any[]): boolean {
    const urlPattern = /^https?:\/\/.+/;
    const urlKeys = ['url', 'website', 'link', 'href', 'src'];
    
    return urlKeys.includes(key.toLowerCase()) || 
           values.some(value => typeof value === 'string' && urlPattern.test(value));
  }

  /**
   * Format label from key
   */
  private static formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Flatten nested objects
   */
  static flattenObject(obj: any, prefix = ''): JsonData {
    const flattened: JsonData = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(flattened, this.flattenObject(obj[key], newKey));
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }
    
    return flattened;
  }

  /**
   * Validate JSON structure
   */
  static validateJson(jsonString: string): { isValid: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      
      if (typeof parsed === 'object' && parsed !== null) {
        return { isValid: true };
      }
      
      return { isValid: false, error: 'JSON must be an object or array of objects' };
    } catch (error) {
      return { 
        isValid: false, 
        error: error instanceof Error ? error.message : 'Invalid JSON format' 
      };
    }
  }
}
