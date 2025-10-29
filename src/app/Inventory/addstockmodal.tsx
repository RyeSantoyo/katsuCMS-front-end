"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adjustmentServices } from "@/services/stockadjustmentservice";
import { toast } from "react-hot-toast";
import { ProductDto } from "@/types/products";
import SupplierMultiSelect, {CategoryMultiSelect} from "../product/multi-select";

interface SupplierOption{
    value: number;
    label: string;
}

interface StockAddProps{
    open : boolean,
    onClose :() => void,
    onCreated? : ()=> void
}

export default function StockAddModal({open, onClose, onCreated}: StockAddProps){

    const [products, setProducts] = useState<ProductDto[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const [selectedProductId, setSelectedProductId] = useState<number | null> (null);
    const selectedProduct = products.find(p=> p.id === selectedProductId ) ?? null;
    
    const [quantity , setQuantity] =useState<number>(0);
    const [reorderLevel, setReoderLevel] = useState<number>(0);
    const [selectedSupplier, setSelectedSupplier] = useState<SupplierOption[]>([]);
    const [inventoryValue, setInventoryValue] = useState<number>(0);
    const [submitting, setSubmitting] = useState(true);

    useEffect(()=>{

        if(!selectedProduct){
            setInventoryValue(0);
            setSelectedSupplier([]);
            return;
        }

        setInventoryValue(Number((selectedProduct.price * quantity).toFixed(2)));

        const supplierOptions : SupplierOption[] = selectedProduct.supplierIds.map((id, idx)=>({
            value: id,
            label: selectedProduct.supplierNames[idx] ?? `Supplier${id}`
        }));
        setSelectedSupplier(supplierOptions);
    }, [selectedProduct, quantity]);
}