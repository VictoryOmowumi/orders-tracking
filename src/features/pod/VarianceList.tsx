import { useState } from "react";
import { VarianceItem, type OrderItem } from "./VarianceItem";
import { AlertCircle, ChevronLeft } from "lucide-react";


interface VarianceListProps {
  onBack: () => void;
  onSubmit: (items: OrderItem[]) => void;
  initialItems: OrderItem[];
}

export const VarianceList = ({ onBack, onSubmit, initialItems }: VarianceListProps) => {
  const [items, setItems] = useState<OrderItem[]>(initialItems);

  // Update logic
  const handleUpdate = (id: string, newQty: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, qtyReceived: Math.max(0, newQty) } : item
    ));
  };

  const hasVariance = items.some(i => i.qtyReceived !== i.qtyOrdered);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 px-1">
        <button 
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-extrabold text-foreground">Report Issues</h2>
          <p className="text-xs text-gray-400">Adjust quantities to match what you received.</p>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4 no-scrollbar">
        {items.map(item => (
          <VarianceItem 
            key={item.id} 
            item={item} 
            onUpdate={handleUpdate} 
          />
        ))}
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-gray-100 mt-auto">
        {hasVariance && (
            <div className="bg-red-50 text-red-600 text-xs font-bold px-4 py-2 rounded-lg mb-4 flex items-center gap-2">
                <AlertCircle size={16} />
                Shortage detected. Photo evidence required next.
            </div>
        )}
        
        <button 
          onClick={() => onSubmit(items)}
          className="w-full py-4 rounded-full bg-foreground text-white font-bold text-sm shadow-xl shadow-black/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          {hasVariance ? "Submit Report" : "Confirm Full Receipt"}
        </button>
      </div>
    </div>
  );
};