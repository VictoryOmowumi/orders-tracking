import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  qtyOrdered: number;
  qtyReceived: number;
  image: string;
}

type OrderDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  items: OrderItem[];
};

export function OrderDetailsModal({ open, onClose, items }: OrderDetailsModalProps) {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Order Details</DialogTitle>
          <DialogDescription className="text-base text-gray-500">
            View the details of your order.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
        {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
              <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-gray-400">SKU: {item.sku}</p>
              </div>
              <div className="text-right text-xs">
                <p className="text-gray-400">Ordered</p>
                <p className="font-semibold text-foreground">{item.qtyOrdered}</p>
              </div>
            </div>
          ))}
        </div>
    </DialogContent>
    </Dialog>
  );
}
