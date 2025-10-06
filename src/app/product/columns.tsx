"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {ProductDto} from "../../types/products"

export const columns =({onDelete, onEdit}:
                        {
                            onDelete: (id: number, productName: string) => void;
                            onEdit : (product:ProductDto) => void;
                        }): ColumnDef<ProductDto>[]=>
[
{
    accessorKey: "id",
    header: "ID"
},
{
    accessorKey: "productCode",
    header : "Code"
},
{
    accessorKey:"productName",
    header : "Product"
},
{
    accessorKey:"quantity",
    header: "Quantity"
},
{
    accessorKey: "description",
    header : "Description"
},
{
    accessorKey: "price",
    header : "Price"
},
{
    accessorKey: "categoryName",
    header : "Category"
},
{
    accessorKey: "unitName",
    header : "Unit"
},
{
    accessorKey: "supplierName",
    header : "Suppliers"
},
{
    id: "action",
    header: "Actions",
    cell:({row})=>{
        const product = row.original
            return(
                <div className="flex gap-2">
                    <Button 
                    variant="outline"
                    size="sm"
                    onClick={()=> onEdit(product)}>Edit</Button>
                    <Button
                    variant="destructive"
                    size="sm"
                    onClick={()=> onDelete(row.original.id, row.original.productName)}>Delete</Button>
                </div>
            )
    }
}
]