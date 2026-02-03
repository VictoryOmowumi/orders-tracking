import { Minus, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  qtyOrdered: number;
  qtyReceived: number;
  image: string;
}

interface VarianceItemProps {
  item: OrderItem;
  onUpdate: (id: string, newQty: number) => void;
}

export const VarianceItem = ({ item, onUpdate }: VarianceItemProps) => {
  const isShortage = item.qtyReceived < item.qtyOrdered;
  const isZero = item.qtyReceived === 0;

  return (
    <div className={cn(
      "p-4 rounded-2xl border transition-all duration-300",
      isShortage 
        ? "bg-red-50 border-red-200" 
        : "bg-white border-gray-100"
    )}>
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 p-1 flex-shrink-0">
          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
        </div>

        {/* Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-foreground text-sm">{item.name}</h4>
              <p className="text-xs text-gray-400">{item.sku}</p>
            </div>
            
            {/* Status Badge */}
            <div className={cn(
              "text-[10px] font-bold uppercase px-2 py-1 rounded-full flex items-center gap-1",
              isShortage ? "text-red-600 bg-red-100" : "text-primary-foreground bg-primary"
            )}>
              {isShortage ? (
                <>
                  <AlertCircle size={10} />
                  <span>Short: {item.qtyOrdered - item.qtyReceived}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={10} />
                  <span>Full</span>
                </>
              )}
            </div>
          </div>

          {/* Stepper Control */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Received Qty
            </span>

            <div className="flex items-center gap-3 bg-white shadow-sm border border-gray-200 rounded-xl p-1">
              <button 
                onClick={() => onUpdate(item.id, item.qtyReceived - 1)}
                disabled={isZero}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-600 transition-colors"
              >
                <Minus size={16} />
              </button>
              
              <span className={cn(
                "w-8 text-center font-bold text-sm",
                isShortage ? "text-red-600" : "text-foreground"
              )}>
                {item.qtyReceived}
              </span>

              <button 
                onClick={() => onUpdate(item.id, item.qtyReceived + 1)}
                disabled={item.qtyReceived >= item.qtyOrdered}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-600 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};