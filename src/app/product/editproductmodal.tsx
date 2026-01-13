"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { productServices } from "@/services/productservice";
import { toast } from "react-hot-toast";
import { ProductDto, ProductForm } from "@/types/products";
import { categoryServices } from "@/services/categoryservice";
import { supplierServices } from "@/services/supplierservice";
import { unitServices } from "@/services/unitservice";


interface ProductAdjustmentModalProps {
    open: boolean;
    onClose: () => void;
    productId: number | null;
    productData: ProductDto | null;
    onEditSuccess?: () => void;
}

export default function EditProductModal({
    open,
    onClose,
    productId,
    productData,
    onEditSuccess,
}: ProductAdjustmentModalProps) {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<ProductForm>({
        productCode: "",
        productName: "",
        description: "",
        price: 0,
        categoryId: 0,
        unitId: 0,
        supplierIds: [],
        supplierNames: []
    });

    useEffect(() => {
        // loadProducts();
        //loadAllData();

        if (!productData) return;
        setForm({
            productCode: productData.productCode,
            productName: productData.productName,
            description: productData.description,
            price: productData.price,
            categoryId: productData.categoryId,
            unitId: productData.unitId,
            supplierIds: productData.supplierIds,
            supplierNames: productData.supplierNames
        });
    }, [productData, open]);

    // async function loadAllData() {
    //     try {
    //         const [prodData] = await Promise.all([

    //             categoryServices.getAll(),
    //             supplierServices.getAll(),
    //             unitServices.getAll()
    //         ]);
    //         //setProductName(prodData);

    //     } catch (error) {
    //         console.error("Failed to load data", error);
    //         toast.error("Failed to load data");
    //     }
    // }

    useEffect(() => {
        if (!open) return;

        loadAll();
    }, [open]);

    async function loadAll() {
        categoryServices.getAll();
        supplierServices.getAll();
        unitServices.getAll();
    }

    const handleSubmit = async () => {
        if (!productId) return;

        setLoading(true);
        try {
            await productServices.update(productId, {
                productCode: form.productCode,
                productName: form.productName,
                description: form.description,
                price: form.price,
                categoryId: form.categoryId,
                unitId: form.unitId,
                supplierIds: form.supplierIds,
                id: productId
            });
        } catch (error) {
            console.error("Failed to update product", error);
            toast.error("Failed to update product");
        } finally {
            setLoading(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                            id="productName"
                            value={form.productName}
                            onChange={(e) => setForm({ ...form, productName: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="productCode">Product Code</Label>
                        <Input
                            id="productCode"
                            value={form.productCode}
                            onChange={(e) => setForm({ ...form, productCode: e.target.value })}
                        />

                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button disabled={loading} onClick={handleSubmit}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
