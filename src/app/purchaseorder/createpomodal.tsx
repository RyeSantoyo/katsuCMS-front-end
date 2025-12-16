/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, /*DialogClose*/ } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { POForm, /*POFormItems,*/ PurchaseOrderCreateDto, PurchaseOrderStatus } from "@/types/purchaseorder";
import { poServices } from "@/services/poservice";
import { initialPOForm } from "./page";
import { toast } from "react-hot-toast";
import { Label, Select } from "@radix-ui/react-select";
import { Input } from "@/components/ui/input";
import { supplierServices } from "@/services/supplierservice";
import { productServices } from "@/services/productservice";

interface CreatePOModalProps {
    open: boolean;
    onClose: () => void;
    setOpen: (open: boolean) => void;
    form: POForm;
    setForm: Dispatch<SetStateAction<POForm>>;
    onSubmitted: () => void;
    suppliers: { id: number; name: string }[];
    products: { id: number; name: string; unitName: string; price?: number }[];
    setSuppliers: (value: { id: number; name: string }[]) => void;
    setProducts: (value: { id: number; name: string; unitName: string; price?: number }[]) => void;
}

export default function CreatePOModal({
    open,
    onClose,
    setOpen,
    form,
    setForm,
    onSubmitted,
    suppliers,
    products,
    setSuppliers,
    setProducts
}: CreatePOModalProps) {



    const loadGeneratedPO = async () => {
        try {
            const res = await poServices.getAll();
            setForm(prev => ({ ...prev, poNumber: "" }));
        }
        catch (error) {
            toast.error("Failed to load generated PO Number.");
        }
    };
    const loadSuppliers = async () => {
        try {
            const res = await supplierServices.getAll();
            setSuppliers(
                res.map(s => ({
                    id: s.id,
                    name: s.supplierName
                }))
            );
        }
        catch (error) {
            toast.error("Failed to load suppliers.");
        }
    }
    useEffect(() => {
        if (open) {
            if (!form.poNumber) loadGeneratedPO();
            loadSuppliers();
        }
    }, [open]);

    const handleSupplierChange = async (supplierId: number) => {
        setForm(prev => ({ ...prev, supplierId, items: [] }));
        try {
            const res = await productServices.getAll();
            const filtered = res.filter(p => p.supplierIds.includes(supplierId));
            setProducts(
                filtered.map((p => ({
                    id: p.id,
                    name: p.productName,
                    unitName: p.unitName,
                    price: p.price
                })))
            );
        }
        catch (error) {
            toast.error("Failed to load products for the selected supplier.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Create Purchase Order</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new Purchase Order.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                        <label>PO Number</label>
                        <input
                            //type="text"
                            value={form.poNumber}
                            //onChange={e => setForm(prev => ({ ...prev, poNumber: e.target.value }))}
                            className="w-full border rounded px-2 py-1"
                            disabled />
                    </div>
                    <div>
                        <label>Supplier ID</label>
                        { <input
                            type="number"
                            value={form.supplierId}
                            onChange={e => setForm(prev => ({ ...prev, supplierId: Number(e.target.value) }))}
                            className="w-full border rounded px-2 py-1"
                            readOnly/> }
                    </div>
                    {/*date*/}
                    <div>
                        <label>Order Date</label>
                        <Input
                            type="date"
                            value={form.orderDate}
                            onChange={e => setForm(prev => ({ ...prev, orderDate: e.target.value }))} />
                    </div>
                    {/*Supplier */}
                    <div>
                        <label>Supplier</label>
                        <select
                            className="w-full border rounded px-2 py-1"
                            value={form.supplierId}
                            onChange={e => setForm(prev => ({ ...prev, supplierId: Number(e.target.value) }))}>
                            <option value="">Select Supplier</option>
                            {suppliers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="bg-muted p-3 rounded text-sm">
                    Supplier Info: (Will auto-fill when a supplier is selected)
                </div>

                <div>
                    <label>Total Amount</label>
                    <input
                        type="number"
                        value={form.totalAmount}
                        onChange={e => setForm(prev => ({ ...prev, totalAmount: Number(e.target.value) }))}
                        className="w-full border rounded px-2 py-1" />
                </div>

                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Products</h3>
                        <Button variant="outline" size="sm">
                            Add Item
                        </Button>
                    </div>
                    <div className="border rounded p-3 text-sm">
                        <p className="text-muted-forground">
                            (Product list and item details will be displayed here)
                        </p>
                    </div>
                </div>
                <div className="mt-4 text-right font-semibold text-lg">
                    Total : {form.totalAmount.toFixed(2)}
                </div>
                { /* Add more form fields as necessary */}
                <DialogFooter className="pt-4">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={onSubmitted}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}