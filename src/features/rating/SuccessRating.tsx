import { useState } from "react";
import { Check, Star, Home, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface SuccessRatingProps {
  onHome: () => void;
  handoffCode: string;
  deliveryType: "complete" | "incomplete";
}

export const SuccessRating = ({ onHome, handoffCode, deliveryType }: SuccessRatingProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const navigate = useNavigate();
  console.log(onHome)

  return (
    <div className="flex flex-col h-full items-center text-center px-4 pt-6 pb-4">
      
      {/* 1. Animated Success Icon */}
      <div className="mb-6 relative">
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75" />
        
        {/* Main Circle */}
        <div className="relative w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 animate-in zoom-in duration-500">
            <Check size={32} className="text-primary-foreground stroke-4" />
          </div>
        </div>
      </div>

      {/* 2. Text Content */}
      <div className="mb-6 animate-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
        <h4 className="text-primary text-xs font-extrabold uppercase tracking-[0.2em] mb-2">
          {deliveryType === "complete" ? "Delivery Complete" : "Delivery Incomplete"}
        </h4>
        <h2 className="text-3xl font-extrabold text-foreground mb-3">
          {deliveryType === "complete" ? "Awesome!" : "Noted"}
        </h2>
        <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-[280px] mx-auto">
          {deliveryType === "complete"
            ? "Share the code below with the driver to finalize this delivery."
            : "Share the code below with the driver to confirm an incomplete delivery."}
        </p>
      </div>

      <div className="mb-8 w-full max-w-[260px] rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-center">
        {/* <p className="text-[10px] uppercase tracking-wider text-primary font-bold">6-digit code</p> */}
        <p className="mt-1 text-3xl font-extrabold tracking-[0.3em] text-foreground">
          {handoffCode}
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Please give this code to the driver.
        </p>
      </div>

      {/* 3. Star Rating */}
      <div className="w-full max-w-[280px] mb-auto animate-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          How was your experience?
        </p>
        
        <div className="flex justify-between px-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-1 transition-transform hover:scale-110 focus:outline-none"
            >
              <Star 
                size={32} 
                className={cn(
                  "transition-all duration-200",
                  (hoverRating || rating) >= star 
                    ? "fill-primary text-primary drop-shadow-md" 
                    : "fill-gray-100 text-gray-200"
                )} 
              />
            </button>
          ))}
        </div>
      </div>

      {/* 4. Bottom Actions */}
      {/* <div className="w-full space-y-4 animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both mt-4">
        <button 
          onClick={() => navigate('/')}
          className="w-full py-4 rounded-2xl bg-foreground text-white font-bold text-lg shadow-xl shadow-black/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <Home size={20} />
          Back to Home
        </button>

        <button className="flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-foreground transition-colors">
          <HelpCircle size={16} />
          Need help with this delivery?
        </button>
      </div> */}

    </div>
  );
};