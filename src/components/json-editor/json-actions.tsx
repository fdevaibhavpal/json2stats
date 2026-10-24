'use client';

import { Button } from '@/components/ui/button';
import { Play, Minimize2, Braces, Download, Copy, Trash2 } from 'lucide-react';
import { useFileHandler } from '@/hooks/use-file-handler';

interface JsonActionsProps {
  value: string;
  onProcess: () => void;
  onMinify: () => void;
  onFormat: () => void;
  onClear: () => void;
  processDisabled?: boolean;
}

export function JsonActions({ value, onProcess, onMinify, onFormat, onClear, processDisabled }: JsonActionsProps) {
  const { downloadFile, copyToClipboard } = useFileHandler();

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
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onMinify} disabled={!value.trim()}>
        <Minimize2 className="h-4 w-4 mr-2" />
        Minify
      </Button>
      <Button variant="outline" size="sm" onClick={onFormat} disabled={!value.trim()}>
        <Braces className="h-4 w-4 mr-2" />
        Format
      </Button>
      <Button variant="outline" size="sm" onClick={handleDownload} disabled={!value.trim()}>
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopy} disabled={!value.trim()}>
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button variant="outline" size="sm" onClick={onClear} disabled={!value.trim()}>
        <Trash2 className="h-4 w-4 mr-2" />
        Clear
      </Button>
      <Button size="sm" onClick={onProcess} disabled={processDisabled}>
        <Play className="h-4 w-4 mr-2" />
        Process JSON
      </Button>
    </div>
  );
}
