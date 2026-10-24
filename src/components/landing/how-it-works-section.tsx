'use client';

const STEPS = [
  {
    number: '1',
    title: 'Paste JSON',
    description: 'Paste your JSON data in the editor.',
  },
  {
    number: '2',
    title: 'Explore & Analyze',
    description: 'View as table, create charts, apply filters.',
  },
  {
    number: '3',
    title: 'Export & Share',
    description: 'Download your data or share a link.',
  },
];

export function HowItWorksSection() {
  return (
    <div id="how-it-works" className="border-b border-border px-6 sm:px-8 lg:px-16 xl:px-24 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground mb-2">
          How it works
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10">
          From JSON to insights in three steps.
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-4">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex items-center gap-4 flex-1">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center h-8 w-8 rounded-sm bg-foreground text-background font-mono font-bold text-sm shrink-0">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <span className="hidden sm:block text-muted-foreground">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
