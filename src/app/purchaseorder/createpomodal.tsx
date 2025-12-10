"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, /*DialogClose*/ } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { POForm, /*POFormItems,*/ PurchaseOrderCreateDto, PurchaseOrderStatus } from "@/types/purchaseorder";
import { poServices } from "@/services/poservice";
import { initialPOForm } from "./createpo";
import { toast } from "react-hot-toast";
import { Label } from "@radix-ui/react-select";

interface CreatePOModalProps {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
    setOpen: (value: boolean) => void;
    form: POForm;
    setForm: React.Dispatch<React.SetStateAction<POForm>>;
    onSubmitted?: () => void;
    suppliers: { id: number; name: string }[];
    products: { id: number; name: string; unitName: string }[];
}

export default function CreatePOModal({
    open,
    onClose,
    onCreated,
    setOpen,
    form,
    setForm,
    onSubmitted,
    suppliers,
    products,
}: CreatePOModalProps) {
    // const [form, setForm] = useState<POForm>(initialPOForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const dto: PurchaseOrderCreateDto = {
                poNumber: form.poNumber,
                supplierId: Number(form.supplierId),
                orderDate: form.orderDate,
                status: form.status,
                totalAmount: form.totalAmount,
                purchaseOrderDetails: form.items.map(i => ({
                    productId: Number(i.productId),
                    quantity: i.quantity,
                    unitPrice: i.unitPrice,
                    subtotal: i.subTotal
                }))
            };
            await poServices.create(dto);
            toast.success("Purchase Order created successfully");
            onClose();
            onCreated?.();
            onClose();

            setForm(initialPOForm);
        }
        catch (error) {
            console.error("Error creating Purchase Order:", error);
            toast.error("Failed to create Purchase Order");
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Purchase Order</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new Purchase Order.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div>
                        <Label>PO Number</Label>
                        <input
                            type="text"
                            value={form.poNumber}
                            onChange={e => setForm(prev => ({ ...prev, poNumber: e.target.value }))}
                            className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                        <Label>Supplier ID</Label>
                        {/* <input
                            type="number"
                            value={form.supplierId}
                            onChange={e => setForm(prev => ({ ...prev, supplierId: Number(e.target.value) }))}
                            className="w-full border rounded px-2 py-1" /> */}
                        <select
                            value={form.supplierId}
                            onChange={e => setForm(prev => ({ ...prev, supplierId: Number(e.target.value) }))}
                            className="w-full border rounded px-2 py-1"
                        >
                            <option value={0}>Select Supplier</option>
                            {suppliers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>

                    </div>
                    <div>
                        <Label>Order Date</Label>
                        <input
                            type="date"
                            value={form.orderDate}
                            onChange={e => setForm(prev => ({ ...prev, orderDate: e.target.value }))}
                            className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                        <Label>Status</Label>
                        <select
                            value={form.status}
                            onChange={e => setForm(prev => ({ ...prev, status: Number(e.target.value) }))}
                            className="w-full border rounded px-2 py-1">
                            <option value={PurchaseOrderStatus.Pending}>Pending</option>
                            <option value={PurchaseOrderStatus.Approved}>Approved</option>
                            <option value={PurchaseOrderStatus.Completed}>Completed</option>
                            <option value={PurchaseOrderStatus.Cancelled}>Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <Label>Total Amount</Label>
                        <input
                            type="number"
                            value={form.totalAmount}
                            onChange={e => setForm(prev => ({ ...prev, totalAmount: Number(e.target.value) }))}
                            className="w-full border rounded px-2 py-1" />
                    </div>
                    <div>
                        <Label>Items</Label>
                        {form.items.map((item, index) => (
                            <div key={index} className="border p-2 mb-2 rounded">
                                <div>
                                    <Label>Product ID</Label>
                                    <input
                                        type="number"
                                        value={item.productId}
                                        onChange={e => {
                                            const newItems = [...form.items];
                                            newItems[index].productId = Number(e.target.value);
                                            setForm(prev => ({ ...prev, items: newItems }));
                                        }}
                                        className="w-full border rounded px-2 py-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                    { /* Add more form fields as necessary */}
                </div>
                <DialogFooter className="pt-4">
                    <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button onClick={onSubmitted} disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}