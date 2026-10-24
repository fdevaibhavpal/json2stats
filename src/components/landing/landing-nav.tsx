'use client';

import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Github } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Use cases', href: '#demo-section' },
  { label: 'Templates', href: '#demo-section' },
];

export function LandingNav() {
  return (
    <nav className="border-b border-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-24 h-16 flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center gap-6 font-mono text-sm uppercase tracking-wide">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="default" size="sm" asChild>
            <a href="https://github.com/fdevaibhavpal/jsondash" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
