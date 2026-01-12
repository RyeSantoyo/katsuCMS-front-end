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
    productData: ProductDto;
    productName?: string;
    onAdjustmentSuccess?: () => void;
}

export default function EditProductModal({
    open,
    onClose,
    productId,
    productData,
    productName,
    onAdjustmentSuccess
}: ProductAdjustmentModalProps) {
    const [products, setProductName] = useState(productData ? [productData] : []);
    const [description, setDescription] = useState(productData?.description || "");
    const [price, setPrice] = useState(productData?.price || 0);
    const [loading, setLoading] = useState(false);

    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const selectedProduct = products.find(p => p.id === selectedProductId) ?? null;

    const [form, setForm] = useState<ProductForm>({
        productCode: productData?.productCode || "",
        productName: productData?.productName || "",
        description: productData?.description || "",
        price: productData?.price || 0,
        categoryId: productData?.categoryId || 0,
        unitId: productData?.unitId || 0,
        supplierIds: [],
        supplierNames: [],
    });
    
    useEffect(() => {
        // loadProducts();
        loadAllData();
    }, []);

        async function loadAllData() {
            try {
                const [prodData] = await Promise.all([
                    productServices.getAll(),
                    categoryServices.getAll(),
                    supplierServices.getAll(),
                    unitServices.getAll()
                ]);
                setProductName(prodData);

            } catch (error) {
                console.error("Failed to load data", error);
                toast.error("Failed to load data");
            }
        }

}