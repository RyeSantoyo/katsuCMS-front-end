"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    onCreated?: () => void,
    onAddSuccess?: () => void
}

export default function StockAddModal({ open, onClose, onCreated }: StockAddProps) {

    const [products, setProducts] = useState<ProductDto[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const selectedProduct = products.find(p => p.id === selectedProductId) ?? null;

    const [quantity, setQuantity] = useState<number>(0);
    const [reorderLevel, setReorderLevel] = useState<number>(0);
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
                productCode: selectedProduct.productCode,
                quantity,
                reorderLevel,
                preferredStockLevel: reorderLevel,
                supplierIds: selectedSupplier.map(s => s.value),
                lastUpdated: new Date().toISOString(),
                inventoryStockId: selectedProduct.id,
                adjustmentType: "ADD",
                adjustedQuantity: quantity,
                reason : "Manual Addition"
            };
            await adjustmentServices.create(dto);
            toast.success("Stock added successfully");
            onCreated?.();
            onClose();
            setSelectedProductId(null);
            setQuantity(0);
            setReorderLevel(0);
            setReason("");
        }
        catch (error) {
            console.error("Failed to add stock:", error);
            toast.error("Failed to add stock");
        }
        finally {
            setSubmitting(false);
            //#region             
            // onCreated?.();
            // onClose();
            // setSelectedProductId(null);
            // setQuantity(0);
            // setReoderLevel(0);
            // setReason(""); 
            // #endregion
        }
    } // handle submit

return (
    <div>
        {/* Use a proper Dialog component (like from Shadcn UI) */}
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px]"> {/* Increased max-width for better two-column layout */}
                <DialogHeader>
                    <DialogTitle>Add Inventory Stock</DialogTitle>
                    <DialogDescription>
                        Update the stock level and reorder information for a product.
                    </DialogDescription>
                </DialogHeader>

                {/* Only render form content when open, better for state and performance */}
                {open && (
                    <div className="py-4 space-y-6"> {/* Add vertical padding and consistent spacing */}
                        
                        {/* === Product Selection (Full Width) === */}
                        <div className="space-y-2">
                            <Label htmlFor="product-select">Product</Label>
                            {/* Use a modern Select component */}
                            <Select
                                value={selectedProductId?.toString() ?? ""}
                                onValueChange={(value) => setSelectedProductId(Number(value) || null)}
                                
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="-- Select product --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map(p => (
                                        <SelectItem key={p.id} value={p.id.toString()}>
                                            {`${p.productName} — ${p.productCode}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* === Auto-filled Product Details (2-Column Grid) === */}
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t"> {/* Separator line and grid */}
                            <h3 className="col-span-2 text-sm font-semibold text-gray-500">Product Details</h3>
                            
                            {/* Product Code (Read-only Input for consistency) */}
                            <div className="space-y-2">
                                <Label>Product Code</Label>
                                <Input readOnly value={selectedProduct?.productCode ?? "-"} />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Input readOnly value={selectedProduct?.categoryName ?? "-"} />
                            </div>

                            {/* Unit */}
                            <div className="space-y-2">
                                <Label>Unit</Label>
                                <Input readOnly value={selectedProduct?.unitName ?? "-"} />
                            </div>
                            
                            {/* Price */}
                            <div className="space-y-2">
                                <Label>Price</Label>
                                <Input readOnly value={selectedProduct ? `$${selectedProduct.price.toFixed(2)}` : "-"} />
                            </div>
                        </div>

                        {/* === Stock Details (2-Column Grid) === */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <h3 className="col-span-2 text-sm font-semibold text-gray-500">Stock Information</h3>

                            {/* Quantity (User Input) */}
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    min="0"
                                />
                            </div>

                            {/* Reorder Level (User Input) */}
                            <div className="space-y-2">
                                <Label htmlFor="reorderLevel">Reorder Level</Label>
                                <Input
                                    id="reorderLevel"
                                    type="number"
                                    value={reorderLevel}
                                    onChange={(e) => setReorderLevel(Number(e.target.value))}
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* === Suppliers & Computed Value (Full Width Sections) === */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <h3 className="col-span-2 text-sm font-semibold text-gray-500">Other Data</h3>

                            {/* Suppliers (Checkbox Group) */}
                            <div className="space-y-2 col-span-1">
                                <Label>Suppliers</Label>
                                <div className="space-y-1">
                                    {selectedProduct?.supplierNames.length ? (
                                        selectedProduct.supplierNames.map((name, i) => {
                                            const id = selectedProduct!.supplierIds[i];
                                            const isChecked = selectedSupplier.some(s => s.value === id);
                                            const opt = { value: id, label: name };
                                            return (
                                                <div key={id} className="flex items-center space-x-2">
                                                    {/* Use a modern Checkbox component */}
                                                    <Checkbox
                                                        id={`supplier-${id}`}
                                                        checked={isChecked}
                                                        onCheckedChange={() => {
                                                            setSelectedSupplier(prev => {
                                                                const exists = prev.some(s => s.value === id);
                                                                if (exists) return prev.filter(s => s.value !== id);
                                                                return [...prev, opt];
                                                            });
                                                        }}
                                                    />
                                                    <Label htmlFor={`supplier-${id}`} className="font-normal cursor-pointer">
                                                        {name}
                                                    </Label>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-sm text-gray-500">No suppliers associated with this product.</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="col-span-1 space-y-4">
                                {/* Inventory Value (Computed) */}
                                <div className="space-y-2">
                                    <Label>Inventory Value</Label>
                                    {/* Use a disabled input to highlight it's a computed value */}
                                    <Input readOnly disabled value={`$${inventoryValue.toFixed(2)}`} className="font-bold text-lg" />
                                </div>

                                {/* LastUpdated auto */}
                                <div className="space-y-2">
                                    <Label>Latest Update</Label>
                                    <Input readOnly disabled value={new Date().toLocaleString()} />
                                </div>
                            </div>
                        </div>

                        {/* === Actions === */}
                        <DialogFooter className="pt-4 border-t">
                            <Button variant="outline" onClick={onClose} /*disabled={submitting}*/>Cancel</Button>
                            <Button onClick={handleSubmit} /*disabled={submitting || !selectedProductId}*/>
                                {/* Fixed submit button text logic for better UX */}
                                {submitting ? "Save Stock" : "Submitting... "}
                            </Button>
                        </DialogFooter>

                    </div>
                )}
            </DialogContent>
        </Dialog>
    </div>
);
}