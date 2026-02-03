import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrackingEvent {
  status: string;
  date: string;
  sub?: string;
  icon?: LucideIcon;
  completed?: boolean;
  active?: boolean;
  pending?: boolean;
}

interface TimelineProps {
  events: TrackingEvent[];
}

export const TrackingTimeline = ({ events }: TimelineProps) => {
  // Ordering goal:
  // - Current step (active) first
  // - Upcoming steps next (in the original array order)
  // - Past steps last, most-recent first (reverse order)
  const currentIndex = (() => {
    const activeIndex = events.findIndex((e) => e.active);
    if (activeIndex !== -1) return activeIndex;
    // If nothing is active, treat the most recent completed step as current.
    let lastCompleted = -1;
    events.forEach((e, idx) => {
      if (e.completed) lastCompleted = idx;
    });
    return Math.max(0, lastCompleted);
  })();

  const orderedEvents = [
    ...events.slice(currentIndex),
    ...events.slice(0, currentIndex).reverse(),
  ];

  return (
    <div className="relative pl-4 space-y-8 -z-10 mb-10 mt-2">
      {/* The Vertical Line (Background) */}
      <div className="absolute left-[27px] top-2 bottom-4 w-0.5 bg-gray-200" />

      {orderedEvents.map((event, index) => (
        <div key={index} className="relative flex gap-4 items-start z-10">
          
          {/* The Icon/Dot */}
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center border-[3px] bg-white transition-all",
            event.completed ? "border-black bg-black text-white" : 
            event.active ? "border-primary bg-primary text-primary-foreground shadow-[0_0_0_4px_rgba(43,238,108,0.2)] animate-pulse" : 
            "border-gray-300 text-gray-300"
          )}>
            {event.completed && <Check size={12} strokeWidth={4} />}
            {event.active && <div className="w-2 h-2 bg-black rounded-full animate-pulse" />}
          </div>

          {/* Text Content */}
          <div className="pt-0.5">
            <h4 className={cn(
              "text-sm font-bold", 
              event.active ? "text-primary" : event?.pending ? "text-gray-400" : "text-foreground"
            )}>
              {event.status}
            </h4>
            
            {(event.sub || event.pending || event.active) && (
              <p className="text-xs font-medium text-gray-500 mt-0.5">
                {event.sub
                  ? event.sub
                  : event.active
                    ? "In progress"
                    : "Upcoming"}
              </p>
            )}
            
            {!!event.date && (
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                {event.date}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};