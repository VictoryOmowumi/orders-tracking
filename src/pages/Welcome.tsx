import { MobileContainer } from "@/components/layout/MobileContainer";
import { TrackingInput } from "@/features/search/TrackingInput";
import { Truck } from "lucide-react";

export const WelcomePage = () => {
  return (
    <MobileContainer>
      {/* Top Section: Spacer to push content down */}
      <div className="flex-1"></div>

      {/* Bottom Sheet Card */}
      <div className="bg-background/80 backdrop-blur-md border-t border-white/20 p-6 pb-12 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        
        {/* Animated Icon */}
        <div className="mb-6 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40">
            <Truck className="text-primary-foreground w-8 h-8" strokeWidth={1.5} />
        </div>

        <h1 className="text-4xl font-extrabold text-foreground mb-3 leading-tight">
          Track your <br />
          <span className="text-primary">parcel delivery.</span>
        </h1>
        
        <p className="text-gray-500 font-medium mb-8">
          Enter your tracking number to see real-time updates and proof of delivery.
        </p>

        {/* Input Component */}
        <div className="mb-8">
            <TrackingInput />
        </div>

        

      </div>
    </MobileContainer>
  );
};
