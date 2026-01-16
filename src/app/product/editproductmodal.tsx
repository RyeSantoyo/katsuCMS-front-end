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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PCategoryDto } from "@/types/category";
import { SupplierDto } from "@/types/supplier";
import { UnitDto } from "../units/columns";
import SupplierMultiSelect from "./multi-select";


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
    const [categories, setCategories] = useState<PCategoryDto[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);
    const [units, setUnits] = useState<UnitDto[]>([]);

    const [newSuppliers, setNewSuppliers] = useState<{ value: number; label: string }[]>([]);


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
        try {
            const [categoryData, supplierData, unitData] = await Promise.all([
                categoryServices.getAll(),
                supplierServices.getAll(),
                unitServices.getAll(),
            ]);

            setCategories(categoryData);
            setSuppliers(supplierData);
            setUnits(unitData);
        } catch (error) {
            console.error("Failed to load reference data", error);
            toast.error("Failed to load reference data");
        }
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
            toast.success("Product updated successfully");
            onEditSuccess?.();
            onClose();
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
                    <DialogTitle>Edit : {form.productName}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* <div className="grid gap-2 bg-gray"> */}
                    <div className="grid gap-2 bg-gray">
                        <Label htmlFor="productCode">Product Code</Label>
                        <p className="text-bold text-foreground">{form.productCode}</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                            id="productName"
                            value={form.productName}
                            onChange={(e) => setForm({ ...form, productName: e.target.value })}
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
                    <div className="space-y-2">

                        <Label htmlFor="unit">Unit</Label>
                        <Select
                            value={form.unitId?.toString() ?? ""}
                            onValueChange={(value) =>
                                setForm({ ...form, unitId: Number(value) })
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Unit" />
                            </SelectTrigger>
                            <SelectContent>
                                {units.map((unit) => (
                                    <SelectItem key={unit.id} value={unit.id.toString()}>
                                        {unit.unitName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={form.categoryId?.toString() ?? ""}
                            onValueChange={(value) =>
                                setForm({ ...form, categoryId: Number(value) })
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                        {cat.categoryName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="suppliers">Suppliers</Label>
                        <SupplierMultiSelect
                            suppliers={suppliers}
                            newSuppliers={newSuppliers}
                            setNewSuppliers={setNewSuppliers}
                            setForm={setForm}
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
