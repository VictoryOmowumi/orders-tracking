import type { ReactNode } from "react";
import { cn } from "@/lib/utils"; // Ensure you have your cn utility or classnames

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
}

export const MobileContainer = ({ children, className }: MobileContainerProps) => {
  return (
    <div className="min-h-screen w-full bg-gray-200 flex items-center justify-center p-0 md:p-4">
      {/* The "Phone" Frame */}
      <div className={cn(
        "w-full h-dvh md:h-[850px] max-w-[430px] bg-background relative overflow-hidden shadow-2xl md:rounded-[2.5rem] flex flex-col font-display",
        className
      )}>
        {/* Map Background Layer (Always underneath) */}
        <div className="absolute inset-0 z-0 map-bg grayscale opacity-60" />
        <div className="absolute inset-0 z-0 bg-background/10 backdrop-blur-[1px]" />
        
        {/* Content Layer (On top) */}
        <div className="relative z-10 w-full h-full flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};