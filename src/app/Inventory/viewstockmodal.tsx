"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ViewStockModalProps {
    open: boolean;
    onClose: () => void;
    stockId: number | null;
    productCode?: string;
    productName?: string;
    currentQuantity?: number;
    unitName?: string;
    category?: string;
    inventoryValue?: number;
}

// ✅ Small reusable item component
function DetailItem({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <div className="flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground">{label}</span>
            <span className="text-sm">{value ?? "-"}</span>
        </div>
    );
}

export default function ViewStockModal({
    open,
    onClose,
    productCode,
    productName,
    currentQuantity,
    unitName,
    category,
    inventoryValue,
}: ViewStockModalProps) {

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold tracking-tight">
                        Stock Details
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Overview of this item current inventory data.
                    </p>
                </DialogHeader>

                <div className="py-4 space-y-6">

                    {/* Basic Information */}
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="Product Code" value={productCode} />
                            <DetailItem label="Product Name" value={productName} />
                            <DetailItem label="Category" value={category} />
                            <DetailItem label="Unit" value={unitName} />
                        </div>
                    </div>

                    {/* Inventory Info */}
                    <div className="border-t pt-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Inventory Data
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem
                                label="Current Quantity"
                                value={currentQuantity?.toLocaleString()}
                            />
                            <DetailItem
                                label="Inventory Value"
                                value={
                                    inventoryValue
                                        ? `₱${inventoryValue.toLocaleString()}`
                                        : "-"
                                }
                            />
                        </div>
                    </div>

                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
