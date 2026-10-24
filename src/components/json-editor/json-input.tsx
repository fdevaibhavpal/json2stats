'use client';

import { Editor, type Monaco } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useCallback } from 'react';
import { Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate: (value: string) => void;
  onCopy?: () => void;
  onClear?: () => void;
}

function defineJson2StatsThemes(monaco: Monaco) {
  monaco.editor.defineTheme('json2stats-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'string.key.json', foreground: '45a049' },
      { token: 'string.value.json', foreground: '555555' },
      { token: 'number.json', foreground: '555555' },
      { token: 'keyword.json', foreground: '45a049' },
    ],
    colors: {
      'editor.background': '#fafaf7',
      'editor.foreground': '#1a1a1a',
      'editorLineNumber.foreground': '#999999',
      'editorLineNumber.activeForeground': '#1a1a1a',
      'editor.lineHighlightBackground': '#00000008',
      'editorCursor.foreground': '#45a049',
      'editorIndentGuide.background': '#e0e0dc',
    },
  });
  monaco.editor.defineTheme('json2stats-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'string.key.json', foreground: '6fd97f' },
      { token: 'string.value.json', foreground: 'cccccc' },
      { token: 'number.json', foreground: 'cccccc' },
      { token: 'keyword.json', foreground: '6fd97f' },
    ],
    colors: {
      'editor.background': '#1a1a18',
      'editor.foreground': '#f0f0ee',
      'editorLineNumber.foreground': '#666666',
      'editorLineNumber.activeForeground': '#f0f0ee',
      'editor.lineHighlightBackground': '#ffffff08',
      'editorCursor.foreground': '#6fd97f',
      'editorIndentGuide.background': '#333331',
    },
  });
}

export function JsonInput({ value, onChange, onValidate, onCopy, onClear }: JsonInputProps) {
  const { resolvedTheme } = useTheme();

  const handleBeforeMount = useCallback((monaco: Monaco) => {
    defineJson2StatsThemes(monaco);
  }, []);

  return (
    <div className="relative border border-border rounded-md overflow-hidden flex-1 min-h-0">
      {(onCopy || onClear) && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
          {onCopy && (
            <Button
              variant="outline"
              size="icon-sm"
              onClick={onCopy}
              disabled={!value.trim()}
              title="Copy"
              className="bg-card/90 backdrop-blur-sm"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          )}
          {onClear && (
            <Button
              variant="outline"
              size="icon-sm"
              onClick={onClear}
              disabled={!value.trim()}
              title="Clear"
              className="bg-card/90 backdrop-blur-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}
      <div className="h-full">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={value}
          beforeMount={handleBeforeMount}
          onChange={(newValue) => {
            onChange(newValue || '');
            onValidate(newValue || '');
          }}
          theme={resolvedTheme === 'dark' ? 'json2stats-dark' : 'json2stats-light'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'var(--font-geist-mono), monospace',
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'line',
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
            },
            suggest: {
              showKeywords: true,
              showSnippets: true,
            },
            quickSuggestions: true,
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  );
}
