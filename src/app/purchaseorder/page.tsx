"use client";

import { poServices } from "@/services/poservice";
import { POForm, POFormItems, PurchaseOrderCreateDto, PurchaseOrderDto, PurchaseOrderListDto, PurchaseOrderStatus } from "@/types/purchaseorder";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreatePOModal from "./createpomodal";
import { supplierServices } from "@/services/supplierservice";
import { productServices } from "@/services/productservice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
// import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

export const initialPOForm =
{
    poNumber: "",
    supplierId: 0,
    supplierCode: "",
    orderDate: new Date().toISOString().split("T")[0],
    status: PurchaseOrderStatus.Pending,
    totalAmount: 0,
    items: [] as POFormItems[],
};

export default function CreatePOPage() {

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<POForm>(initialPOForm);

    const [suppliers, setSuppliers] = useState<{ id: number; name: string; supplierCode: string; address: string }[]>([]);

    const [products, setProducts] = useState<{ id: number; name: string; unitName: string, unitId: number }[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderListDto[]>([]);

    useEffect(() => {

        const loadDropDown = async () => {
            try {
                const supplierData = await supplierServices.getAll();
                const productData = await productServices.getAll();

                setSuppliers(
                    supplierData.map(s => ({ id: s.id, name: s.supplierName, supplierCode: s.supplierCode, address: s.address }))
                );
                setProducts(
                    productData.map(p => ({ id: p.id, name: p.productName, unitName: p.unitName, unitId: p.unitId }))
                );
            }
            catch (error) {
                console.error("Error loading dropdown data:", error);
                toast.error("Failed to load suppliers or products");
            }
        }
        loadDropDown();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("http://localhost:5058/api/purchaseorder");
            const json = await res.json();
            setPurchaseOrders(json.data);
        } catch (error) {
            console.error("Failed to fetch purchase orders:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async () => {
        const dto: PurchaseOrderCreateDto = {
            poNumber: form.poNumber,
            supplierId: typeof form.supplierId === "number" ? form.supplierId : Number(form.supplierId),
            supplierCode: suppliers.find(s => s.id === (typeof form.supplierId === "number" ? form.supplierId : Number(form.supplierId)))?.supplierCode || "",
            orderDate: form.orderDate,
            status: form.status,
            totalAmount: form.totalAmount,
            orderDetails: form.items.map(i => ({
                poNumber: form.poNumber,
                productId: typeof i.productId === "number" ? i.productId : Number(i.productId),
                productName: products.find(p => p.id === (typeof i.productId === "number" ? i.productId : Number(i.productId)))?.name || "",
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                unitId: products.find(p => p.id === (typeof i.productId === "number" ? i.productId : Number(i.productId)))?.unitId || 0,
                subtotal: i.subTotal
            }))
        };

        try {
            await poServices.create(dto);
            toast.success("Purchase Order created!");
            setOpen(false);
            //setForm(initialPOForm);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create Purchase Order");
            console.error(error);
        }

    };

    function handleEdit(po: PurchaseOrderListDto): void {
        throw new Error("Function not implemented.");
    }

    function handleDelete(id: number, poNumber: string): void {
        throw new Error("Function not implemented.");
    }

    function handleView(po: PurchaseOrderListDto): void {
        throw new Error("Function not implemented.");
    }

    // const handleEdit = (po: PurchaseOrderCreateDto) => {
    //     // Implement edit functionality
    // };
    //     const handleDelete = (id: number, poNumber: string) => {
    //     // Implement delete functionality
    // };
    return (
        <>
            <div className="p-4 bg-gray rounded shadow max-w-7xl mx-auto mt-10">
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center pb-4">
                        <div>
                            <CardTitle className="flex items-center gap-2"> Purchase Order </CardTitle>
                            <p className="text-sm text-muted-foreground"> Manage your purchase orders </p>
                        </div>
                        <Button onClick={() => setOpen(true)}>Create PO</Button>
                    </CardHeader>

                </Card>
                <br />
                <DataTable columns={columns({ onEdit: handleEdit, onDelete: handleDelete, onView: handleView })} data={purchaseOrders} />


                <CreatePOModal
                    open={open}
                    onClose={() => setOpen(false)}
                    setOpen={setOpen}
                    form={form}
                    setForm={setForm}
                    onSubmitted={handleSubmit}
                    suppliers={suppliers}
                    products={products}
                    setSuppliers={setSuppliers}
                    setProducts={setProducts}
                />
            </div>
        </>
    );
}