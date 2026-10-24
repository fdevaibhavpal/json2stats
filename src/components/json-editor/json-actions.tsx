'use client';

import { Button } from '@/components/ui/button';
import { Minimize2, Braces, Download } from 'lucide-react';
import { useFileHandler } from '@/hooks/use-file-handler';

interface JsonActionsProps {
  value: string;
  onMinify: () => void;
  onFormat: () => void;
}

export function JsonActions({ value, onMinify, onFormat }: JsonActionsProps) {
  const { downloadFile } = useFileHandler();

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
    </div>
  );
}
