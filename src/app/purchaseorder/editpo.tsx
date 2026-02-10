"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
//import { poServices } from "@/services/poservice";
import axios from "axios";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

interface EditPoProps {
    open: boolean;
    onClose: () => void;
    purchaseOrderId: number;
    poNumber?: string;
    supplierName?: string;
    orderDate?: string;
    totalAmount?: number;
    status?: string;
    productName?: string;
    products?: {
        productName: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }[];
}

function DetailItem({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <div className="flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground">{label}</span>
            <span className="text-sm">{value ?? "-"}</span>
        </div>
    );
}

export enum PurchaseOrderStatus {
    Pending = 0,
    Approved = 1,
    Completed = 2,
    Cancelled = 3,
}

const statusOptions = [
    { label: "Pending", value: PurchaseOrderStatus.Pending },
    { label: "Approved", value: PurchaseOrderStatus.Approved },
    { label: "Completed", value: PurchaseOrderStatus.Completed },
    { label: "Cancelled", value: PurchaseOrderStatus.Cancelled },
];


export default function EditPo({
    open,
    onClose,
    purchaseOrderId,
    poNumber,
    //productName,
    supplierName,
    orderDate,
    totalAmount,
    status,
    products,

}: EditPoProps) {
    const [selectedStatus, setSelectedStatus] = useState<number | undefined>();
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async () => {
        if (!purchaseOrderId || selectedStatus === undefined) return;

        setLoading(true);

        try {

            await api.patch(`/purchaseorder/${purchaseOrderId}/status`,
                {
                    status: selectedStatus,
                    updatedAt: new Date().toISOString()
                });


            console.log("Status updated successfully");
            onClose();
        } catch (error: unknown) {
            const message = axios.isAxiosError(error) ? error.response?.data?.message || "Failed to update status" : "Failed to update status";
            console.warn(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        if (status !== undefined) {
            const matched = statusOptions.find(s => s.label === status);
            setSelectedStatus(matched?.value);
        }
    }, [status, open]);


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
                            Edit Purchase Order Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailItem label="Purchase Order ID" value={purchaseOrderId} />
                            <DetailItem label="Purchase Order Number" value={poNumber} />
                            <DetailItem label="Supplier Name" value={supplierName} />
                            <DetailItem label="Order Date" value={orderDate} />
                            <DetailItem label="Total Amount" value={totalAmount} />
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-muted-foreground">Status</span>
                                <select
                                    className="border rounded-md px-3 py-2 text-sm"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(Number(e.target.value))}
                                >
                                    {statusOptions.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Ordered Items
                        </h3>
                        <div className="space-y-2">
                            {products && products.length > 0 ? (
                                products.map((product, index) => (
                                    <div key={index} className="p-4 border rounded-md">
                                        <DetailItem label="Product Name" value={product.productName} />
                                        <DetailItem label="Quantity" value={product.quantity} />
                                        <DetailItem label="Supplier Name" value={supplierName} />
                                        <DetailItem label="Unit Price" value={product.unitPrice} />
                                        <DetailItem label="Total Price" value={product.totalPrice} />
                                    </div>
                                ))) : (
                                <p className="text-sm text-muted-foreground">No products available.</p>
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button variant="default" onClick={() => {
                        // Handle save logic here
                        handleStatusChange();
                    }}> {loading ? "Processing..." : "Save Adjustment"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}