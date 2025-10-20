"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";    
import { InventoryStockDto } from "@/types/inventory";

export const columns =({onDelete, onEdit}:
                        {
                            onDelete: (id: number, productName: string) => void;
                            onEdit :  (stocks: InventoryStockDto)=> void;
                        }): ColumnDef<InventoryStockDto>[] =>
[
{
    accessorKey: "id",
    header: "ID"
},
{
    accessorKey:"productCode",
    header: "Product Code"
},
{
    accessorKey:"productName",
    header: "Product Name"
},
{
    accessorKey: "category",
    header: "Category"
},
{
    accessorKey: "unitName",
    header : "Unit"
},
{
    accessorKey: "quantity",
    header: "Quantity"
},
{
    accessorKey: "supplierNames",
    header: "Supplier"
},
{
    accessorKey: "reorderLevel",
    header: "Re-Order Level"
},
{
    accessorKey: "preferredStockLevel",
    header: "Preferred Stock"
},
{
    accessorKey: "isLowStock",
    header: "Low in Stock?"
},
{
    accessorKey: "inventoryValue",
    header: "Inventory Value"
},
{
    accessorKey: "lastUpdated",
    header : "Latest Update"
},
{
    id: "action",
    header: "Actions",
    cell:({row})=>{
        const stocks = row.original
                return (
                    <div className="flex gap-2">
                        <Button
                        variant={"outline"}
                        size={"sm"}
                        onClick={()=>onEdit(stocks)}>Edit</Button>
                        <Button
                        variant={"destructive"}
                        size={"sm"}
                        onClick={()=>onDelete(row.original.id, row.original.productName)}>Delete</Button>
                    </div>
                )
    }
}
]