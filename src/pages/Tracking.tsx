import { useMemo, useRef, useState } from "react";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { OrderDetailsModal, type OrderItem } from "@/features/tracking/OrderDetailsModal";
import { LiveMap } from "@/features/tracking/LiveMap";
import { OrderSummaryCard } from "@/features/tracking/OrderSummaryCard";
import { TrackingTimeline, type TrackingEvent } from "@/features/tracking/TrackingTimeline";
import { DriverCard } from "@/features/tracking/DriverCard";
import { ChevronLeft, Truck, Package, MapPin, PhoneCall } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { VarianceList } from "@/features/pod/VarianceList";
import { SuccessRating } from "@/features/rating/SuccessRating";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export const sevenUpItems: OrderItem[] = [
    {
        id: "1",
        name: "Pepsi 50cl (Glass)",
        sku: "PEP-50-GL",
        qtyOrdered: 100,
        qtyReceived: 100,
        image: "https://via.placeholder.com/150/004B93/FFFFFF?text=Pepsi",
    },
    {
        id: "2",
        name: "7Up 35cl (PET)",
        sku: "7UP-35-PT",
        qtyOrdered: 50,
        qtyReceived: 50,
        image: "https://via.placeholder.com/150/009B3A/FFFFFF?text=7Up",
    },
    {
        id: "3",
        name: "Mirinda Orange 50cl",
        sku: "MIR-50-OR",
        qtyOrdered: 25,
        qtyReceived: 25,
        image: "https://via.placeholder.com/150/FF6600/FFFFFF?text=Mirinda",
    },
    {
        id: "4",
        name: "Aquafina Water 75cl",
        sku: "AQU-75-WT",
        qtyOrdered: 200,
        qtyReceived: 200,
        image: "https://via.placeholder.com/150/005C9C/FFFFFF?text=Aquafina",
    },
];

const mockEvents: TrackingEvent[] = [
    { status: "Order Placed", date: "Oct 24, 09:15 AM", icon: Package, completed: true },
    { status: "Warehouse Processing", date: "Oct 24, 02:30 PM", icon: Package, active: true },
    // { status: "In Transit", date: "", sub: "Logistics Hub", icon: Truck, pending: true },
    // { status: "Out for Delivery", date: "", sub: "Driver is near Ikotun", icon: Truck, pending: true },
    // { status: "Delivered", date: "", icon: MapPin, pending: true },
];


export const TrackingPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [viewMode, setViewMode] = useState<'tracking' | 'variance' | 'success'>('tracking');
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deliveryType, setDeliveryType] = useState<"complete" | "incomplete">("complete");
    const [handoffCode, setHandoffCode] = useState("000000");
    const sheetRef = useRef<HTMLDivElement | null>(null);
    const [sheetOffset, setSheetOffset] = useState(0);
    const dragState = useRef({ startY: 0, startOffset: 0, minOffset: 0, maxOffset: 0, dragging: false });
    const activeIndex = useMemo(() => {
        const active = mockEvents.findIndex((event) => event.active);
        if (active !== -1) {
            return active;
        }
        let lastCompleted = -1;
        mockEvents.forEach((event, index) => {
            if (event.completed) {
                lastCompleted = index;
            }
        });
        return lastCompleted;
    }, []);

    const showDriverActions = activeIndex >= 2;
    const totalQty = useMemo(() => {
        return sevenUpItems.reduce((sum, item) => sum + item.qtyOrdered, 0);
    }, []);

    const generateCode = () => {
        const code = Math.floor(100000 + Math.random() * 900000);
        return String(code);
    };

    const clampOffset = (value: number) => {
        const { minOffset, maxOffset } = dragState.current;
        return Math.max(minOffset, Math.min(value, maxOffset));
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!sheetRef.current) return;
        const rect = sheetRef.current.getBoundingClientRect();
        const maxOffset = Math.max(0, window.innerHeight - rect.top - 120);
        const minOffset = Math.min(0, 24 - rect.top);
        dragState.current = {
            startY: event.clientY,
            startOffset: sheetOffset,
            minOffset,
            maxOffset,
            dragging: true,
        };
        (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!dragState.current.dragging) return;
        const delta = event.clientY - dragState.current.startY;
        setSheetOffset(clampOffset(dragState.current.startOffset + delta));
    };

    const handlePointerUp = () => {
        if (!dragState.current.dragging) return;
        dragState.current.dragging = false;
        const { minOffset, maxOffset } = dragState.current;
        const snapPoints = [minOffset, 0, maxOffset];
        let closest = snapPoints[0];
        let closestDistance = Math.abs(sheetOffset - closest);
        snapPoints.forEach((point) => {
            const distance = Math.abs(sheetOffset - point);
            if (distance < closestDistance) {
                closest = point;
                closestDistance = distance;
            }
        });
        setSheetOffset(closest);
    };
    return (
        <MobileContainer>

            {/* --- LAYER 1: Floating Header --- */}
            <div className="absolute -top-5 left-0 right-0 z-20 p-6 flex justify-between items-start pt-12">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-foreground hover:bg-gray-50"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Live Status Pill */}
                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">Order Tracking</span>
                </div>
            </div>



            {/* --- LAYER 2: Map Spacer --- */}
            <div className="flex-1 ">
                <LiveMap />
            </div>

            {/* --- LAYER 3: The Bottom Sheet --- */}
            <div
                ref={sheetRef}
                className="relative z-30 bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-3 overflow-hidden flex flex-col transition-transform duration-300 ease-out"
                style={{
                    height: viewMode === "variance" ? "85vh" : "auto",
                    maxHeight: "90vh",
                    transform: `translateY(${sheetOffset}px)`,
                }}
            >
                {/* Drag Handle */}
                <div
                    className="w-full flex justify-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    style={{ touchAction: "none" }}
                >
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                </div>
                {/* CONTENT SWITCHER */}
                <div className="flex-1 overflow-hidden flex flex-col px-6 pt-2 ">
                    {/* VIEW 1: TRACKING TIMELINE */}
                    {viewMode === "tracking" && (
                        <>
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-foreground">
                                        {activeIndex < 2 ? "Processing Order" : "Arriving Soon"}
                                    </h2>
                                    <p className="text-gray-400 text-sm font-medium mt-1">
                                        {activeIndex < 2 ? "At Warehouse" : "Est. 2:30 PM • Today"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 uppercase font-bold">Order ID</p>
                                    <p className="font-bold font-mono text-foreground">{id || "#8839-XZ"}</p>
                                </div>
                            </div>

                            <OrderSummaryCard
                                customerName="Chinedu Obi"
                                customerPhone="+234 803 123 4567"
                                customerAddress="12 Admiralty Way, Lekki Phase 1, Lagos"
                                orderId={id || "#8839-XZ"}
                                totalItems={sevenUpItems.length}
                                totalQty={totalQty}
                                eta={activeIndex < 2 ? "Pending Dispatch" : "2:30 PM"}
                                onViewDetails={() => setDetailsOpen(true)}
                            />


                            {/* Timeline */}
                            <div className="my-2 overflow-y-auto no-scrollbar">
                                <TrackingTimeline events={mockEvents} />
                            </div>

                            {/* Sticky Actions */}
                            <div className="mt-auto pt-4 border-t border-gray-100">
                                {showDriverActions ? (
                                    <>
                                        <DriverCard />
                                        <div className="grid grid-cols-[1fr_4fr] gap-3 mt-4">
                                            <button
                                                onClick={() => {
                                                    setDeliveryType("incomplete");
                                                    setViewMode("variance");
                                                }}
                                                className="flex items-center justify-center py-4 rounded-full bg-gray-100 text-foreground font-bold text-sm hover:bg-gray-200 transition-colors"
                                            >
                                                <PhoneCall size={20} />
                                            </button>
                                            <button
                                                onClick={() => setConfirmOpen(true)}
                                                className="py-4 rounded-full bg-foreground text-white font-bold text-sm shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                                            >
                                                Confirm Delivery
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    // <div className="bg-gray-50 rounded-2xl p-2 text-center">
                                    //     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-primary">
                                    //         <Package size={24} />
                                    //     </div>
                                    //     <h4 className="font-bold text-foreground">Preparing your Order</h4>
                                    //     <p className="text-xs text-gray-500 mt-1">
                                    //         Driver details will appear once the truck leaves the logistics hub.
                                    //     </p>
                                    // </div>
                                    null
                                )}
                            </div>

                        </>
                    )}

                    {/* VIEW 2: VARIANCE REPORTING */}
                    {viewMode === "variance" && (
                        <div className="h-full animate-in slide-in-from-bottom-10 duration-300">
                            <VarianceList
                                onBack={() => setViewMode("tracking")}
                                onSubmit={(items) => {
                                    console.log("Submitted Variance:", items);
                                    setHandoffCode(generateCode());
                                    setViewMode("success");
                                }}
                                initialItems={sevenUpItems}
                            />
                        </div>
                    )}

                    {/* VIEW 3: SUCCESS (Placeholder) */}
                    {viewMode === 'success' && (
                        <div className="h-full">
                            <SuccessRating
                                onHome={() => navigate('/')}
                                handoffCode={handoffCode}
                                deliveryType={deliveryType}
                            />
                        </div>
                    )}
                </div>
            </div>

                <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <DialogContent className="max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-foreground">Confirm delivery status</DialogTitle>
                            <DialogDescription className="text-base text-gray-500">
                                Is this a complete delivery or an incomplete delivery?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-6 flex gap-3">
                       
                            <button
                                onClick={() => {
                                    setDeliveryType("incomplete");
                                    setHandoffCode(generateCode());
                                    setConfirmOpen(false);
                                    setViewMode("variance");
                                }}
                                className="w-full py-4 rounded-full bg-gray-100 text-foreground font-bold text-sm hover:bg-gray-200 transition-colors"
                            >
                                Incomplete delivery
                            </button>
                            <button
                                onClick={() => {
                                    setDeliveryType("complete");
                                    setHandoffCode(generateCode());
                                    setConfirmOpen(false);
                                    setViewMode("success");
                                }}
                                className="w-full py-4 rounded-full bg-foreground text-white font-bold text-sm shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                            >
                                Complete delivery
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>

            <OrderDetailsModal
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                items={sevenUpItems}
                orderId={id || "#8839-XZ"}
            />

        </MobileContainer>
    );
};