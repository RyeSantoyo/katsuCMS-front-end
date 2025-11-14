"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { ProductDto } from "@/types/products";
import SupplierMultiSelect, { CategoryMultiSelect } from "../product/multi-select";
import { PCategoryDto } from "@/types/category";
import { SupplierDto } from "@/types/supplier";
import { UnitDto } from "@/types/unit";
import { productServices } from "@/services/productservice";
import { categoryServices } from "@/services/categoryservice";
import { supplierServices } from "@/services/supplierservice";
import { unitServices } from "@/services/unitservice";


interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: () => void;
    onSuccess?: () => void;
}

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [categories, setCategories] = useState<PCategoryDto[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);
    const [units, setUnits] = useState<UnitDto[]>([]);

    // const [showAddModal, setShowAddModal] = useState(false);
    // const [showEditModal, setShowEditModal] = useState(false);
    // const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
    const [newSuppliers, setNewSuppliers] = useState<{ value: number; label: string }[]>([]);
    const [newCategory, setNewCategory] = useState<{ value: number; label: string }[]>([]);

    const [form, setForm] = useState({
        productCode: "",
        productName: "",
        description: "",
        price: 0,
        categoryId: [] as number[],
        unitId: 0,
        supplierIds: [] as number[],
    });

    const inititialFormState = {
        productCode: "",
        productName: "",
        description: "",
        price: 0,
        categoryId: [] as number[],
        unitId: 0,
        supplierIds: [] as number[],
    }

    const updateForm = (field: string, value: unknown) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    useEffect(() => {
        // loadProducts();
        loadAllData();
    }, []);



    async function loadAllData() {
        try {
            const [prodData, catData, supData, unitData] = await Promise.all([
                productServices.getAll(),
                categoryServices.getAll(),
                supplierServices.getAll(),
                unitServices.getAll()
            ]);
            setProducts(prodData);
            setCategories(catData);
            setSuppliers(supData);
            setUnits(unitData);
        } catch (error) {
            console.error("Failed to load data", error);
            toast.error("Failed to load data");
        }
    }

    async function handleAdd() {
        console.log("Add button clicked");

        try {
            await productServices.create({
                productCode: form.productCode,
                productName: form.productName,
                description: form.description,
                price: form.price,
                categoryId: form.categoryId,
                unitId: parseInt(form.unitId.toString()),
                supplierIds: form.supplierIds
            });

            setForm(inititialFormState);
            onClose();
            await loadAllData()
            toast.success("Product added");
        } catch (err) {
            console.log("Failed", err)
            toast.error("Failed misserably");
        }
    }

    // async function handleDelete(id: number, productName: string) {
    //     const confirm = window.confirm(`Are you sure you want to delete ${productName}`)

    //     if (!confirm) return;

    //     try {
    //         await productServices.delete(id);
    //         loadAllData();
    //     }
    //     catch (err) {
    //         console.log("Failed to delete product", err)
    //         toast.error("Failed to delete product");
    //     }
    //     return;
    // }

    // async function handleEdit(product: ProductDto) {
    //     setEditingProduct(product)
    //     setShowEditModal(true);
    // }
    // async function handleUpdate() {
    //     if (!editingProduct) return;
    //     try {
    //         await productServices.update(editingProduct.id, editingProduct);
    //         toast.success("Product updated successfully");
    //         loadAllData();
    //         setShowEditModal(false);
    //         setEditingProduct(null);
    //     } catch (err) {
    //         console.log(err);
    //         toast.error("Failed to update product");
    //     }
    // }

    return (
        <div>
            { /* Dialog Components */}
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to add a new product.
                        </DialogDescription>
                    </DialogHeader>

                    {/*Form rendering*/}
                    {isOpen && (
                        <div className="py-4 space-y-4">
                            {/* Product Code */}
                            <div className="space-y-2">
                                <Label htmlFor="productCode">Product Code</Label>
                                <Input
                                    id="productCode"
                                    type="text"
                                    value={form.productCode}
                                    onChange={(e) => updateForm("productCode", e.target.value)}
                                    placeholder="Enter product code"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="productName">Product Name</Label>
                                <Input
                                    id="productName"
                                    type="text"
                                    value={form.productName}
                                    onChange={(e) => updateForm("productName", e.target.value)}
                                    placeholder="Enter product name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => updateForm("price", parseFloat(e.target.value) || 0)}
                                    placeholder="Enter price" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    type="text"
                                    value={form.description}
                                    onChange={(e) => updateForm("description", e.target.value)}
                                    placeholder="Enter description" />
                            </div>
                            <div className="space-y-2">

                                <Label htmlFor="unit">Unit</Label>
                                <Select
                                    onValueChange={(value) => updateForm("unitId", parseInt(value, 10) || 0)} >
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
                                <CategoryMultiSelect
                                    category={categories}
                                    newCategory={newCategory}
                                    setNewCategory={setNewCategory}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="suppliers">Suppliers</Label>
                                <SupplierMultiSelect
                                    suppliers={suppliers}
                                    newSuppliers={newSuppliers}
                                    setNewSuppliers={setNewSuppliers}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="pt-4 border-t">
                        <Button variant="outline" onClick={onClose} /*disabled={submitting}*/>Cancel</Button>
                        <Button onClick={handleAdd} /*disabled={submitting || !selectedProductId}*/>
                            Add Product
                        </Button>
                    </DialogFooter>

                </DialogContent>
            </Dialog>

        </div> // END DIV
    ); // END RETURN
}