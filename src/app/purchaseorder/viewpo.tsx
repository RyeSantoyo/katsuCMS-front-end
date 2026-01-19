"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ViewPoProps{
    open: boolean;
    onClose: () => void;
    purchaseOrderId: number;
    supplierName?: string;
    orderDate?: string;
    totalAmount?: number;
    status?: string;
    products?: Array<{ productName: string; quantity: number; unitPrice: number; totalPrice: number }>;
}

function DetailItem({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <div className="flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground">{label}</span>
            <span className="text-sm">{value ?? "-"}</span>
        </div>
    );
}

export default function ViewPo({
    open,
    onClose,
    purchaseOrderId,
    supplierName,
    orderDate,
    totalAmount,
    status,
    products,
}: ViewPoProps) {

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold tracking-tight">
                        Purchase Order Details
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Overview of this purchase order details.
                    </p>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Purchase Order Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="Purchase Order ID" value={purchaseOrderId} />
                            <DetailItem label="Supplier Name" value={supplierName} />
                            <DetailItem label="Order Date" value={orderDate} />
                            <DetailItem label="Total Amount" value={totalAmount} />
                            <DetailItem label="Status" value={status} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Products
                        </h3>
                        <div className="space-y-2">
                            {products && products.length > 0 ? (
                                products.map((product, index) => (
                                    <div key={index} className="p-4 border rounded-md">
                                        <DetailItem label="Product Name" value={product.productName} />
                                        <DetailItem label="Quantity" value={product.quantity} />
                                        <DetailItem label="Unit Price" value={product.unitPrice} />
                                        <DetailItem label="Total Price" value={product.totalPrice} />
                                    </div>
                                ))): (
                                <p className="text-sm text-muted-foreground">No products available.</p>
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}