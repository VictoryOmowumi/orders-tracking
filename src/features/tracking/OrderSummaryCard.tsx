type OrderSummaryProps = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  orderId: string;
  totalItems: number;
  totalQty: number;
  eta: string;
  onViewDetails?: () => void;
};

export function OrderSummaryCard({
  customerName,
  customerPhone,
  customerAddress,
  orderId,
  totalItems,
  totalQty,
  eta,
  onViewDetails,
}: OrderSummaryProps) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          {/* <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Customer</p> */}
          <p className="text-sm font-bold text-foreground">{customerName}</p>
          <p className="text-xs text-gray-500">{customerPhone}</p>
        </div>
        <div className="text-right">
          {/* <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Order ID</p> */}
          <p className="text-sm font-mono font-bold text-foreground">{orderId}</p>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">{customerAddress}</div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-xl bg-white p-2 text-center">
          <p className="text-gray-400">Items</p>
          <p className="font-bold text-foreground">{totalItems}</p>
        </div>
        <div className="rounded-xl bg-white p-2 text-center">
          <p className="text-gray-400">Qty</p>
          <p className="font-bold text-foreground">{totalQty}</p>
        </div>
        <div className="rounded-xl bg-white p-2 text-center">
          <p className="text-gray-400">ETA</p>
          <p className="font-bold text-foreground">{eta}</p>
        </div>
      </div>

      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="mt-4 w-full rounded-xl bg-white border border-gray-200 py-2 text-xs font-semibold text-foreground hover:bg-gray-100"
        >
          View Full Order Details
        </button>
      )}
    </div>
  );
}
