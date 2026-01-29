"use client";

import { poServices } from "@/services/poservice";
import { POForm, POFormItems, PurchaseOrderCreateDto, PurchaseOrderDto, PurchaseOrderListDto, PurchaseOrderStatus } from "@/types/purchaseorder";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CreatePOModal from "./createpomodal";
import { supplierServices } from "@/services/supplierservice";
import { productServices } from "@/services/productservice";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
// import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import ViewPo from "./viewpo";
import { Loader2, PlusCircle, RefreshCcw } from "lucide-react";
import EditPo from "./editpo";

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

    const [refresh, startRefresh] = useState(false);
    const [isLoading, startLoading] = useState(false);

    const [isPoViewOpen, setIsPoViewOpen] = useState(false);

    const [isPoEditOpen, setIsPoEditOpen] = useState(false);

    const [suppliers, setSuppliers] = useState<{ id: number; name: string; supplierCode: string; address: string }[]>([]);

    const [products, setProducts] = useState<{ id: number; name: string; unitName: string, unitId: number }[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderListDto[]>([]);

    const [selectedPo, setSelectedPo] = useState<PurchaseOrderDto | null>(null);

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
            startLoading(true);
            startRefresh(true);
            const res = await fetch("http://localhost:5058/api/purchaseorder");
            const json = await res.json();
            setPurchaseOrders(json.data);
        } catch (error) {
            console.error("Failed to fetch purchase orders:", error);
        }
        finally {
            startRefresh(false);
            startLoading(false);
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
                totalAmount: i.subTotal,
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

    const handleEdit = async (po: PurchaseOrderListDto) => {
        try {
            const res = await fetch(`http://localhost:5058/api/purchaseorder/${po.id}`);
            const json = await res.json();

            setSelectedPo(json.data); // PurchaseOrderDto
            setIsPoEditOpen(true);
        } catch (error) {
            console.error("Failed to load purchase order details", error);
            toast.error("Failed to load PO details");
        }
    }

    const handleDelete = async (id: number, poNumber: string) => {
        if (confirm(`Are you sure you want to delete Purchase Order "${poNumber}"?`)) {
            try {
                await fetch(`http://localhost:5058/api/purchaseorder/${id}`, { method: "DELETE" });
                setPurchaseOrders((prev) => prev.filter((po) => po.id !== id));
            } catch (error) {
                console.error("Failed to delete Purchase Order:", error);
            }
        }
    }
    useEffect(() => {
        console.log("Selected PO:", selectedPo);
        console.log("Order Details:", selectedPo?.purchaseOrderDetails);
    }, [selectedPo]);

    const handleView = async (po: PurchaseOrderListDto) => {
        try {
            const res = await fetch(`http://localhost:5058/api/purchaseorder/${po.id}`);
            const json = await res.json();

            setSelectedPo(json.data);
            setIsPoViewOpen(true);
        } catch (error) {
            console.error("Failed to load PO details", error);
        }
    };

    console.log("ViewPo received products:", products);


    // const handleEdit = (po: PurchaseOrderCreateDto) => {
    //     // Implement edit functionality
    // };
    //     const handleDelete = (id: number, poNumber: string) => {
    //     // Implement delete functionality
    // };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh] text-gray-500">
                <Loader2 className=" h-6 w-6 animate-spin mr-2" /> Loading Orders.
            </div>
        )
    }

    return (
        <>
            <div className="p-4 bg-gray rounded shadow max-w-7xl mx-auto mt-10">
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center pb-4">
                        <div>
                            <CardTitle className="flex items-center gap-2"> Purchase Order </CardTitle>
                            <p className="text-sm text-muted-foreground"> Manage your purchase orders </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant={"outline"} onClick={(fetchData)} disabled={refresh}>
                                {refresh ? (
                                    <>
                                        <Loader2 className="animate-spin h-4 w-4 w-4 mr-2" /> Refreshing....
                                    </>
                                ) : (
                                    <>
                                        <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
                                    </>
                                )}
                            </Button>
                            <Button onClick={() => setOpen(true)}>
                                <PlusCircle className="h-4 w-4 mr-2" /> New Purchase Order
                            </Button>
                        </div>

                    </CardHeader>

                </Card>
                <br />
                <DataTable columns={columns({ 
                    onEdit: 
                    handleEdit, 
                    onDelete: 
                    handleDelete, 
                    onView: 
                    handleView })} 
                    data={purchaseOrders}
                     />


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

                <ViewPo
                    open={isPoViewOpen}
                    onClose={() => setIsPoViewOpen(false)}
                    purchaseOrderId={selectedPo?.id || 0}
                    poNumber={selectedPo?.poNumber}
                    supplierName={selectedPo?.supplierName}
                    orderDate={selectedPo?.orderDate}
                    totalAmount={selectedPo?.totalAmount}
                    status={selectedPo?.status?.toString()}
                    products={selectedPo?.purchaseOrderDetails?.map(d => ({
                        productName: d.productName,
                        quantity: d.quantity,
                        unitPrice: d.unitPrice,
                        totalPrice: d.quantity * d.unitPrice
                    })) ?? []}
                />

                <EditPo
                    open={isPoEditOpen}
                    onClose={() => setIsPoEditOpen(false)}
                    purchaseOrderId={selectedPo?.id || 0}
                    poNumber={selectedPo?.poNumber}
                    supplierName=""
                    orderDate={selectedPo?.orderDate}
                    totalAmount={selectedPo?.totalAmount}
                    status={selectedPo?.status?.toString()}
                    products={selectedPo?.purchaseOrderDetails?.map(d => ({
                        productName: d.productName,
                        quantity: d.quantity,
                        unitPrice: d.unitPrice,
                        totalPrice: d.quantity * d.unitPrice
                    })) ?? []}
                />


            </div>
        </>
    );
}