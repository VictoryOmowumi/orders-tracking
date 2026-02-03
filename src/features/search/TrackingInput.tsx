import { Search, ScanLine } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const TrackingInput = () => {
  const [trackingId, setTrackingId] = useState("");
  const navigate = useNavigate();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId) {
      navigate(`/track/${trackingId}`);
    }
  };

  return (
    <div className="w-full">
      <form 
        onSubmit={handleTrack}
        className="relative flex items-center group"
      >
        <div className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors">
          <Search size={24} />
        </div>
        
        <input 
          type="text" 
          placeholder="Enter tracking number..." 
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="w-full h-16 pl-12 pr-14 rounded-full bg-white border-none text-foreground font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
        />

        <button 
          type="button"
          className="absolute right-2 p-2 bg-gray-100 rounded-xl text-gray-500 hover:text-primary transition-colors"
        >
          <ScanLine size={20} />
        </button>
      </form>
    </div>
  );
};