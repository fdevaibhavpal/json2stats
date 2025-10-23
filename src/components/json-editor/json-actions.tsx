'use client';

import { Button } from '@/components/ui/button';
import { Upload, FileText, Play, Copy, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useFileHandler } from '@/hooks/use-file-handler';
import { useRef, useState } from 'react';

interface JsonActionsProps {
  value: string;
  onFileUpload: (content: string) => void;
  onLoadExample: () => void;
  onFormat: () => void;
}

export function JsonActions({ value, onFileUpload, onLoadExample, onFormat }: JsonActionsProps) {
  const { handleFileUpload, downloadFile, copyToClipboard } = useFileHandler();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showFormats, setShowFormats] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await handleFileUpload(file);
      onFileUpload(content);
    } catch (error) {
      console.error('Failed to read file:', error);
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(value);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    downloadFile(value, 'data.json', 'application/json');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
        >
          <Upload className="h-4 w-4" />
          Upload File
        </Button>
        
        <Button
          variant="outline"
          onClick={onLoadExample}
          className="flex items-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
        >
          <Play className="h-4 w-4" />
          Load Sample Data
        </Button>
        
        <Button
          variant="outline"
          onClick={onFormat}
          disabled={!value.trim()}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Format JSON
        </Button>
        
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={!value.trim()}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
        
        <Button
          variant="outline"
          onClick={handleDownload}
          disabled={!value.trim()}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setShowFormats(!showFormats)}
          className="flex items-center gap-2"
        >
          {showFormats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showFormats ? 'Hide' : 'Show'} JSON Formats
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.ndjson,.jsonl,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Format Examples - Collapsible */}
      {showFormats && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Supported JSON Formats:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <div className="font-medium text-slate-600 dark:text-slate-400">JSON Array</div>
              <div className="font-mono bg-white dark:bg-slate-900 p-2 rounded border text-slate-600 dark:text-slate-400">
                {`[{`}<br />
                &nbsp;&nbsp;{`"name": "value"`}<br />
                {`}]`}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-slate-600 dark:text-slate-400">NDJSON</div>
              <div className="font-mono bg-white dark:bg-slate-900 p-2 rounded border text-slate-600 dark:text-slate-400">
                {`{"name": "value"}`}<br />
                {`{"name": "value"}`}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-slate-600 dark:text-slate-400">Single Object</div>
              <div className="font-mono bg-white dark:bg-slate-900 p-2 rounded border text-slate-600 dark:text-slate-400">
                {`{`}<br />
                &nbsp;&nbsp;{`"name": "value"`}<br />
                {`}`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
