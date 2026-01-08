"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { ProductDto, ProductForm } from "@/types/products";
//import SupplierMultiSelect, { CategorySelect } from "../product/multi-select";
import SupplierMultiSelect from "../product/multi-select";
import { PCategoryDto } from "@/types/category";
import { SupplierDto } from "@/types/supplier";
import { UnitDto } from "@/types/unit";
import { productServices } from "@/services/productservice";
import { categoryServices } from "@/services/categoryservice";
import { supplierServices } from "@/services/supplierservice";
import { unitServices } from "@/services/unitservice";

interface Props {
  productId: number;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditProductModal({ productId, open, onClose, onUpdated }: Props) {
const [form, setForm] = useState<ProductForm>(initialForm);
const [loading, setLoading] = useState(false);

useEffect(() => {
  if (!open || !productId) return;

  const loadProduct = async () => {
    setLoading(true);

    const data = await productServices.getById(productId);

    setForm({
      name: data.name,
      sku: data.sku,
      categoryId: data.categoryId,
      unitId: data.unitId,
      price: data.price,
      supplierIds: data.suppliers.map((s: any) => s.id),
      supplierNames: data.suppliers.map((s: any) => s.supplierName)
    });

    setLoading(false);
  };

  loadProduct();
}, [open, productId]);

}