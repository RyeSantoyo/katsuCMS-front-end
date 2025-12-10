"use client";

import { poServices } from "@/services/poservice";
import { POForm, POFormItems, PurchaseOrderCreateDto, PurchaseOrderStatus } from "@/types/purchaseorder";
import { useState } from "react";
import toast from "react-hot-toast";
import CreatePOModal from "./createpomodal";

export const initialPOForm =
{
    poNumber: "",
    supplierId: 0,
    orderDate: new Date().toISOString().split("T")[0],
    status: PurchaseOrderStatus.Pending,
    totalAmount: 0,
    items: [] as POFormItems[],
};

export default function CreatePOPage() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<POForm>(initialPOForm);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [products, setProducts] = useState<{ id: number; name: string; unitName: string }[]>([]);

    const handleSubmit = async () => {
        const dto: PurchaseOrderCreateDto = {
            poNumber: form.poNumber,
            supplierId: typeof form.supplierId === "number" ? form.supplierId : Number(form.supplierId),
            orderDate: form.orderDate,
            status: form.status,
            totalAmount: form.totalAmount,
            purchaseOrderDetails: form.items.map(i => ({
                productId: typeof i.productId === "number" ? i.productId : Number(i.productId),
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                subtotal: i.subTotal
            }))
        };

        try {
            await poServices.create(dto);
            toast.success("Purchase Order created!");
            setOpen(false);
            setForm(initialPOForm);
        } catch (error) {
            toast.error("Failed to create PO");
            console.error(error);
        }
    };
    return (
        <>
            <button onClick={() => setOpen(true)}>Create PO</button>

            <CreatePOModal
                open={open}
                onClose={() => setOpen(false)}
                setOpen={setOpen}
                form={form}
                setForm={setForm}
                onSubmitted={handleSubmit}
                suppliers={suppliers}
                products={products}
            />
        </>
    );
}