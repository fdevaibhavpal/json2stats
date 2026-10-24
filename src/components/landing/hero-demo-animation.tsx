'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Step = 'input' | 'table' | 'charts';

const SIDEBAR_ITEMS: { label: string; step: Step }[] = [
  { label: 'Data', step: 'input' },
  { label: 'Table', step: 'table' },
  { label: 'Charts', step: 'charts' },
  { label: 'Filters', step: 'input' },
  { label: 'Templates', step: 'input' },
  { label: 'Settings', step: 'input' },
];

const BREADCRUMB: Record<Step, string> = {
  input: 'Data > JSON Input',
  table: 'Data > Table',
  charts: 'Data > Charts',
};

const STEP_ORDER: Step[] = ['input', 'table', 'charts'];
const STEP_DURATION_MS = 2600;

const TABLE_ROWS = [
  { name: 'Laptop', category: 'Electronics', price: 999 },
  { name: 'Phone', category: 'Electronics', price: 699 },
  { name: 'Headphones', category: 'Audio', price: 199 },
];

const CHART_BARS = [
  { label: 'Electronics', value: 92 },
  { label: 'Audio', value: 46 },
  { label: 'Wearables', value: 28 },
  { label: 'Accessories', value: 20 },
];

export function HeroDemoAnimation() {
  const [stepIndex, setStepIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEP_ORDER.length);
    }, STEP_DURATION_MS);
    return () => clearInterval(timer);
  }, [paused]);

  const step = STEP_ORDER[stepIndex];

  return (
    <div
      className="w-full border border-border rounded-md overflow-hidden bg-card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="font-mono font-bold text-sm">{'{ }'} JsonDash</span>
        <span className="text-xs text-muted-foreground font-mono transition-all duration-500">
          {BREADCRUMB[step]}
        </span>
      </div>
      <div className="flex">
        <div className="w-28 border-r border-border p-2 space-y-1 text-xs font-mono text-muted-foreground hidden sm:block">
          {SIDEBAR_ITEMS.map((item) => (
            <div
              key={item.label}
              className={cn(
                'px-2 py-1.5 rounded-sm transition-colors duration-500',
                item.step === step ? 'bg-muted text-foreground' : ''
              )}
            >
              {item.label}
            </div>
          ))}
        </div>

        <div className="flex-1 p-4 min-h-[220px] relative overflow-hidden">
          {/* JSON Input step */}
          <div
            className={cn(
              'transition-all duration-500',
              step === 'input'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2 pointer-events-none absolute inset-4'
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">JSON Input</span>
              <span className="text-xs bg-foreground text-background rounded-sm px-2 py-1 font-mono">
                Process JSON →
              </span>
            </div>
            <div className="rounded-md border border-border bg-muted p-3 font-mono text-xs leading-relaxed text-muted-foreground">
              <div><span className="text-primary">{'['}</span></div>
              <div className="pl-3">{'{'}</div>
              <div className="pl-6">&quot;id&quot;: 1,</div>
              <div className="pl-6">&quot;name&quot;: &quot;Laptop&quot;,</div>
              <div className="pl-6">&quot;price&quot;: 999</div>
              <div className="pl-3">{'},'}</div>
              <div><span className="text-primary">{']'}</span></div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs font-mono text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Valid JSON
            </div>
          </div>

          {/* Table step */}
          <div
            className={cn(
              'transition-all duration-500',
              step === 'table'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 pointer-events-none absolute inset-4'
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Data Table</span>
              <span className="text-xs text-muted-foreground font-mono">3 records</span>
            </div>
            <div className="rounded-md border border-border overflow-hidden">
              <div className="grid grid-cols-3 bg-muted text-xs font-mono uppercase text-muted-foreground px-3 py-1.5">
                <span>Name</span>
                <span>Category</span>
                <span className="text-right">Price</span>
              </div>
              {TABLE_ROWS.map((row, i) => (
                <div
                  key={row.name}
                  className="grid grid-cols-3 px-3 py-1.5 text-xs font-mono border-t border-border"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span>{row.name}</span>
                  <span>
                    <span className="bg-muted rounded-sm px-1.5 py-0.5 text-muted-foreground">{row.category}</span>
                  </span>
                  <span className="text-right">{row.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Charts step */}
          <div
            className={cn(
              'transition-all duration-500',
              step === 'charts'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 pointer-events-none absolute inset-4'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">Value by Category</span>
              <span className="text-xs text-muted-foreground font-mono">bar chart</span>
            </div>
            <div className="flex items-end gap-3 h-28 px-1">
              {CHART_BARS.map((bar) => (
                <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center h-24">
                    <div
                      className="w-full bg-primary rounded-t-sm transition-all duration-700 ease-out"
                      style={{
                        height: step === 'charts' ? `${bar.value}%` : '0%',
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground truncate w-full text-center">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step indicator dots */}
      <div className="flex items-center justify-center gap-1.5 py-3 border-t border-border">
        {STEP_ORDER.map((s, i) => (
          <span
            key={s}
            className={cn(
              'h-1.5 rounded-full transition-all duration-500',
              i === stepIndex ? 'w-5 bg-primary' : 'w-1.5 bg-border'
            )}
          />
        ))}
      </div>
    </div>
  );
}
