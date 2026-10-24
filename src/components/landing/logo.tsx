'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-2 font-mono font-bold shrink-0', className)}
    >
      <span className="text-xl text-muted-foreground">{'{ }'}</span>
      {!collapsed && <span className="text-lg">JsonDash</span>}
    </Link>
  );
}
