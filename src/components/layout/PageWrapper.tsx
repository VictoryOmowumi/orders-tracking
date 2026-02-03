import type { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export const PageWrapper = ({ children, className = '' }: PageWrapperProps) => {
  return (
    <div className="relative w-full h-dvh overflow-hidden font-display text-slate-900">
      {/* Layer 0: The Static Map Background */}
      <div className="map-bg fixed inset-0 z-0" aria-hidden="true" />

      {/* Layer 1: The App Content */}
      <main className={`relative z-10 w-full h-full flex  flex-col ${className}`}>
        {children}
      </main>
    </div>
  );
};