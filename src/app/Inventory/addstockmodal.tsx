"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adjustmentServices } from "@/services/stockadjustmentservice";
import { toast } from "react-hot-toast";
import { ProductDto } from "@/types/products";
import SupplierMultiSelect, { CategoryMultiSelect } from "../product/multi-select";
import { api } from "@/lib/api";

interface SupplierOption {
    value: number;
    label: string;
}

interface StockAddProps {
    open: boolean,
    onClose: () => void,
    onCreated?: () => void
}

export default function StockAddModal({ open, onClose, onCreated }: StockAddProps) {

    const [products, setProducts] = useState<ProductDto[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const selectedProduct = products.find(p => p.id === selectedProductId) ?? null;

    const [quantity, setQuantity] = useState<number>(0);
    const [reorderLevel, setReoderLevel] = useState<number>(0);
    const [reason, setReason] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState<SupplierOption[]>([]);
    const [inventoryValue, setInventoryValue] = useState<number>(0);
    const [submitting, setSubmitting] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoadingProducts(true);
            try {
                const res = await api.get<ProductDto[]>("/products");
                setProducts(res.data);
            }
            catch (error) {
                console.error("Failed to fetch products:", error);
                toast.error("Failed to fetch products");
            }
            finally {
                setLoadingProducts(false);
            }
        };
        if (open) fetchProducts();
    }, [open]);

    useEffect(() => {

        if (!selectedProduct) {
            setInventoryValue(0);
            setSelectedSupplier([]);
            return;
        }

        setInventoryValue(Number((selectedProduct.price * quantity).toFixed(2)));

        const supplierOptions: SupplierOption[] = selectedProduct.supplierIds.map((id, idx) => ({
            value: id,
            label: selectedProduct.supplierNames[idx] ?? `Supplier${id}`
        }));
        setSelectedSupplier(supplierOptions);
    }, [selectedProduct, quantity]);
 /* ------------------------------------------------------------------------------------------------ */
    const handleSubmit = async () => {
        if (!selectedProduct) {
            toast.error("Please select a product");
            return;
        }
        if (quantity <= 0) {
            toast.error("Please enter a valid quantity");
            return;
        }

        setSubmitting(true);
        try {
            const dto = {
                productId: selectedProduct.id,
                unitId: selectedProduct.unitId,
                quantity,
                reorderLevel,
                preferredStockLevel: reorderLevel,
                supplierIds: selectedSupplier.map(s => s.value),
                lastUpdated: new Date().toISOString(),
                inventoryStockId: selectedProduct.id,
                adjustmentType: "ADD",
                adjustedQuantity: quantity,
                reason

            };
            await adjustmentServices.create(dto);
        }
        catch (error) {
            console.error("Failed to add stock:", error);
            toast.error("Failed to add stock");
        }
    } // handle submit
 // not final will update tomorrow  
    return (
        <div>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add Stock</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div>
                            <Label htmlFor="product">Product</Label>
                            {loadingProducts ? (
                                <p>Loading products...</p>
                            ) : (
                                <select
                                    id="product"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                                    value={selectedProductId ?? ""}
                                    onChange={(e) => setSelectedProductId(Number(e.target.value) || null)}
                                >
                                    <option value="">Select a product</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.productName} ({product.productCode})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                type="number"
                                className="w-full mt-1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="reorderLevel">Reorder Level</Label>
                            <Input
                                id="reorderLevel"
                                type="number"
                                className="w-full mt-1"
                                value={reorderLevel}
                                onChange={(e) => setReoderLevel(Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <Label>Suppliers</Label>
                            {/* <SupplierMultiSelect
                                suppliers={selectedProduct ? selectedProduct.supplierIds : []}
                                newSuppliers={selectedSupplier}
                                setNewSuppliers={setSelectedSupplier}
                            /> */}
                        </div>
                        <div>
                            <Label htmlFor="inventoryValue">Inventory Value</Label>
                            <Input
                                id="inventoryValue"
                                type="number"
                                className="w-full mt-1"
                                value={inventoryValue}
                                readOnly
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={submitting}>
                            {submitting ? "Adding..." : "Add Stock"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </div>
    )
}