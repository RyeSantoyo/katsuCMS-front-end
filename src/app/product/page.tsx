"use client";
import { useEffect, useState } from "react";
import { productServices } from "../../services/productservice"
import { categoryServices } from "../../services/categoryservice"
import { supplierServices } from "@/services/supplierservice";
import { unitServices } from "@/services/unitservice";
//import {createProduct, updateProduct, deleteProduct, getProducts} from "../../services/productservice"
import { ProductDto } from "@/types/products";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { DataTable } from "@/components/data-table"
import { columns } from "./columns";
import { PCategoryDto } from "../category/columns";
import { UnitDto } from "../units/columns";
import { SupplierDto } from "@/types/supplier";
import SupplierMultiSelect from "./multi-select";


export default function ProductPage() {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [newProductCode, setNewProductCode] = useState("");
    const [newProductName, setNewProductName] = useState("");
    const [newPrice, setNewPrice] = useState(0);
    //const [newStock, setNewStock] = useState(0);
    const [newDescription, setNewDescription] = useState("");
    const [newCategory, setNewCategory] = useState("");
    //const [newSupplier, setNewSupplier] = useState("");
    const [newUnit, setNewUnit] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
    const [categories, setCategories] = useState<PCategoryDto[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);
    const [units, setUnits] = useState<UnitDto[]>([]);

    const [newSuppliers, setNewSuppliers] = useState<{ value: number; label: string }[]>([]);

    useEffect(() => {
        loadProducts();
        loadAllData();
    }, []);

    async function loadProducts() {
        try {
            const data = await productServices.getAll();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products", error);
            toast.error("Failed to load products");
        }
    }
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
                productCode: newProductCode,
                productName: newProductName,
                //quantity: newStock,
                description: newDescription,
                price: newPrice,
                categoryId: parseInt(newCategory),
                unitId: parseInt(newUnit),
                supplierIds: newSuppliers.map((s) => s.value),
            });
            setNewProductName("");
            setNewProductCode("");
            setNewPrice(0);
            //setNewStock(0);
            setNewDescription("");
            setNewCategory("");
            setNewUnit("");
            setNewSuppliers([]);
            setShowAddModal(false);
            setNewSuppliers([]);
            await loadAllData()
            toast.success("Product added");
        } catch (err) {
            console.log("Failed", err)
            toast.error("Failed misserably");
        }

    }

    async function handleDelete(id: number, productName: string) {
        const confirm = window.confirm(`Are you sure you want to delete ${productName}`)

        if (!confirm) return;

        try {
            await productServices.delete(id);
            loadAllData();
        }
        catch (err) {
            console.log("Failed to delete product", err)
            toast.error("Failed to delete product");
        }
        return;
    }

    async function handleEdit(product: ProductDto) {
        setEditingProduct(product)
        setShowEditModal(true);
    }
    async function handleUpdate() {
        if (!editingProduct) return;
        try {
            await productServices.update(editingProduct.id, editingProduct);
            toast.success("Product updated successfully");
            loadAllData();
            setShowEditModal(false);
            setEditingProduct(null);
        } catch (err) {
            console.log(err);
            toast.error("Failed to update product");
        }
    }

    return (
        <div className="p-4 bg-gray rounded shadow max-w-7xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <div className="flex gap-2 mb-4 text-black">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    onClick={() => setShowAddModal(true)}
                >
                    Add Product
                </button>
                <DataTable columns={columns({ onEdit: handleEdit, onDelete: handleDelete })} data={products} />

                <Modal
                    isOpen={showAddModal}
                    onConfirm={handleAdd}
                    onCancel={() => setShowAddModal(false)}
                    title="Add Product"

                    content={
                        <div className="space-y-4">
                            <label>Product Code</label>
                            <input type="text" placeholder="Product Code" value={newProductCode} onChange={(e) => setNewProductCode(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                            <label>Product Name</label>
                            <input type="text" placeholder="Product Name" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
                            <label>Price</label>
                            <input type="number" placeholder="Price" value={newPrice} onChange={(e) => setNewPrice(parseFloat(e.target.value))} className="w-full p-2 border border-gray-300 rounded" />
                            {/* <input type="number" placeholder="Stock" value={newStock} onChange ={(e) => setNewStock(parseInt(e.target.value))} className="w-full p-2 border border-gray-300 rounded" /> */}
                            <textarea placeholder="Description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />

                            {/* Category Dropdown */}
                            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full p-2 border border-gray-300 rounded">
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                                ))}
                            </select>
                            {/* Unit Dropdown */}

                            <select value={newUnit} onChange={(e) => setNewUnit(parseInt(e.target.value).toString())} className="w-full p-2 border border-gray-300 rounded">
                                <option value="">Select Unit</option>
                                {units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>{unit.unitName}</option>
                                ))}
                            </select>

                            {/* Supplier Dropdown */}
                            <SupplierMultiSelect
                                suppliers={suppliers}
                                newSuppliers={newSuppliers}
                                setNewSuppliers={setNewSuppliers}
                            />

                        </div>
                    }
                />
                <Modal
                    isOpen={showEditModal}
                    title="Edit Supplier Info."
                    content={
                        <>
                            <input
                                type="text"
                                value={editingProduct?.productName || ""}
                                onChange={(e) =>
                                    setEditingProduct((prev) =>
                                        prev ? { ...prev, supplierName: e.target.value } : null
                                    )
                                }
                                placeholder="Supplier Name"
                                className="w-full border px-3 py-2 rounded"
                            />
                            <SupplierMultiSelect
                                suppliers={suppliers}
                                newSuppliers={newSuppliers}
                                setNewSuppliers={setNewSuppliers}
                            />
                            <input
                                type="text"
                                value={editingProduct?.categoryName || ""}
                                onChange={(e) =>
                                    setEditingProduct((prev) =>
                                        prev ? { ...prev, ContactNumber: e.target.value } : null
                                    )
                                }
                                placeholder="ContactNumber"
                                className="w-full border px-3 py-2 rounded"
                            />
                        </>
                    }
                    onCancel={() => {
                        setNewProductName("");
                        setNewSuppliers([]);
                        setShowEditModal(false);
                    }}

                    onConfirm={handleUpdate}
                    confirmText="Save"
                    confirmColor="bg-blue-600"
                />
            </div>
        </div>
    )
}