/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, /*DialogClose*/ } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { POForm, POFormItems, /*POFormItems,*/ PurchaseOrderCreateDto, PurchaseOrderStatus } from "@/types/purchaseorder";
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
    suppliers: { id: number; name: string; supplierCode: string; address: string }[];
    products: { id: number; name: string; unitName: string; price?: number; quantity?: number, unitId: number }[];
    setSuppliers: (value: { id: number; name: string; supplierCode: string; address: string }[]) => void;
    setProducts: (value: { id: number; name: string; unitName: string; price?: number; quantity?: number, unitId: number }[]) => void;
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
            const res = await poServices.generatePoNumber();
            setForm(prev => ({ ...prev, poNumber: res.data.poNumber }));
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
                    name: s.supplierName,
                    supplierCode: s.supplierCode,
                    address: s.address
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
        setForm(prev => ({ ...prev, supplierId, items: [], totalAmount: 0 }));
        try {
            const res = await productServices.getAll();
            const filtered = res.filter(p => p.supplierIds.includes(supplierId));
            setProducts(
                filtered.map((p => ({
                    id: p.id,
                    name: p.productName,
                    unitName: p.unitName,
                    price: p.price,
                    unitId: p.unitId,
                })))
            );
        }
        catch (error) {
            toast.error("Failed to load products for the selected supplier.");
        }
    }

    const onClosed = () => {
        setOpen(false);
        setForm(initialPOForm);
    };

    const addProductRow = () => {
        setForm(prev => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    productId: 0,
                    productName: "",
                    unitName: "",
                    quantity: 0,
                    unitPrice: 0,
                    subTotal: 0
                }
            ]
        }));
    };

    const computeTotal = (items: POFormItems[]) => {
        return items.reduce((total, item) => total + item.subTotal, 0);
    };

    const handleProductChange = (index: number, productId: number) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        setForm(prev => {

            const updatedItems = [...prev.items];
            const quantity = updatedItems[index].quantity || 1;
            const unitPrice = product.price || 0;
            const subTotal = unitPrice * quantity;

            updatedItems[index] = {
                ...updatedItems[index],
                productId: product.id,
                productName: product.name,
                unitName: product.unitName,
                quantity,
                unitPrice,
                subTotal
            };

            return {
                ...prev,
                items: updatedItems,
                totalAmount: computeTotal(updatedItems)
            };
        });
    }

    // console.log("Products:", products);
    console.log("Form Items:", form.items);

    const handleQuantityChange = (index: number, quantity: number) => {
        setForm(prev => {
            const updatedItems = [...prev.items];
            updatedItems[index].quantity = quantity;
            updatedItems[index].subTotal = updatedItems[index].unitPrice * quantity;
            return {
                ...prev,
                items: updatedItems,
                totalAmount: computeTotal(updatedItems)
            };
        });
    }

    const removeRow = (index: number) => {
        setForm(prev => {
            const addedItems = [...prev.items];
            addedItems.splice(index, 1);
            return {
                ...prev,
                items: addedItems,
                totalAmount: computeTotal(addedItems)
            };
        });
    }
    if (!open) return null;
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max">
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
                            type="text"
                            value={form.poNumber}
                            onChange={e => setForm(prev => ({ ...prev, poNumber: e.target.value }))}
                            className="w-full border rounded px-2 py-1"
                            disabled />
                    </div>
                    <div>
                        <label>Supplier ID</label>
                        {<input
                            type="number"
                            value={form.supplierId}
                            onChange={e => setForm(prev => ({ ...prev, supplierId: Number(e.target.value) }))}
                            className="w-full border rounded px-2 py-1"
                            readOnly />}
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
                            onChange={e => handleSupplierChange(Number(e.target.value))}>
                            <option value="">Select Supplier</option>
                            {suppliers.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="bg-muted p-3 rounded text-sm">
                    <strong>Supplier Details : </strong>
                    <div>
                        <strong>Supplier Name : </strong>{suppliers.find(s => s.id === form.supplierId)?.name || "N/A"} </div>
                    <div>
                        <strong>Supplier Code : </strong> {suppliers.find(s => s.id === form.supplierId)?.supplierCode || "N/A"}
                    </div>
                    <div>
                        <strong>Address:</strong> {suppliers.find(s => s.id === form.supplierId)?.address || "N/A"}
                    </div>

                </div>
                <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Order Items</h3>
                        <Button variant="outline" size="sm" onClick={addProductRow}>
                            + Add Item
                        </Button>
                    </div>

                    <table className="w-full mt-6 text-left border-collapse">
                        <thead>
                            <tr className="text-sm font-medium text-gray-500 border-b">
                                <th className="pb-2">Product</th>
                                <th className="pb-2">Quantity</th>
                                <th className="pb-2">Base Unit</th>
                                <th className="pb-2">Unit </th>
                                <th className="pb-2">Unit Price</th>
                                <th className="pb-2">Sub Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {form.items.map((item, index) => (
                                <tr key={index} className="text-sm">
                                    <td className="py-3 pr-2">
                                        <select
                                            value={item.productId}
                                            onChange={(e) => handleProductChange(index, Number(e.target.value))}
                                            className="w-full border rounded px-2 py-1"
                                        >
                                            <option value={0}>Select Product</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-3 pr-2">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                                            className="w-full border rounded px-2 py-1"
                                            placeholder="Qty"
                                            min={1}
                                        />
                                    </td>
                                    <td className="py-3 pr-2">
                                        <input
                                            type="text"
                                            value={item.unitName}
                                            readOnly
                                            className="w-full border rounded px-2 py-1 bg-gray-100"
                                        />
                                    </td>
                                    <td className="py-3 pr-2">
                                        <input
                                            type="text"
                                            value={item.unitName}
                                            readOnly
                                            className="w-full border rounded px-2 py-1 bg-gray-100"
                                        />
                                    </td>
                                    <td className="py-3 pr-2">
                                        <input
                                            type="number"
                                            value={item.unitPrice?.toString() || ""}
                                            readOnly
                                            className="w-full border rounded px-2 py-1 bg-gray-100 text-right"
                                        />
                                    </td>
                                    <td className="py-3 pr-2">
                                        <input
                                            type="number"
                                            value={item.subTotal?.toString() || ""}
                                            readOnly
                                            className="w-full border rounded px-2 py-1 bg-gray-100 text-right"
                                        />
                                    </td>
                                    <td className="py-3 pr-2">
                                        <Button variant="ghost" size="sm" onClick={() => removeRow(index)}>
                                            X
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

                <div className="mt-4 text-right font-semibold text-lg">
                    Total : {form.totalAmount.toFixed(2)}
                </div>
                { /* Add more form fields as necessary */}
                <DialogFooter className="pt-4">
                    <Button
                        variant="outline"
                        onClick={onClosed}>Cancel</Button>
                    <Button onClick={onSubmitted}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}