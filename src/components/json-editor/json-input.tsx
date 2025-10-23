'use client';

import { Editor } from '@monaco-editor/react';
import { useState, useEffect } from 'react';

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate: (value: string) => void;
  theme?: 'vs-dark' | 'light';
}

export function JsonInput({ value, onChange, onValidate, theme = 'vs-dark' }: JsonInputProps) {
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>(theme);

  // Update editor theme based on system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      setEditorTheme(mediaQuery.matches ? 'vs-dark' : 'light');
    };
    
    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, []);

  return (
    <div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-lg">
      <div className="h-[400px]">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={value}
          onChange={(newValue) => {
            onChange(newValue || '');
            onValidate(newValue || '');
          }}
          theme={editorTheme}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
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
