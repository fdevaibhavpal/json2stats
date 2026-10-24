'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  linkToHome?: boolean;
}

export function Logo({ collapsed = false, className, linkToHome = true }: LogoProps) {
  const content = (
    <>
      <span className="text-xl text-muted-foreground">{'{ }'}</span>
      {!collapsed && <span className="text-lg">JsonDash</span>}
    </>
  );

  const classes = cn('flex items-center gap-2 font-mono font-bold shrink-0', className);

  if (!linkToHome) {
    return <span className={classes}>{content}</span>;
  }

  return (
    <Link href="/" className={classes}>
      {content}
    </Link>
  );
}
