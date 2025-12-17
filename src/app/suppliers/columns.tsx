"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {SupplierDto} from "@/types/supplier"

// export type SupplierDto={
//     id: number 
//     supplierName: string
//     address : string
//     contactNumber : string
// }

export const columns =({onDelete, onEdit}:{
                        onDelete: (id: number, supplierName:string) => void;
                        onEdit : (id:SupplierDto) => void;
                        }): ColumnDef<SupplierDto>[]=>[
// {
//     accessorKey: "id",
//     header: "ID"
// },
{
    accessorKey: "supplierName",
    header : "Supplier"
},
// {
//     accessorKey:"productName",
//     header : "Product"
// },
{
    accessorKey:"address",
    header: "Address"
},
{
    accessorKey: "contactNumber",
    header : "Contact"
},
{
    accessorKey: "supplierCode",
    header : "Supplier Code"
},
{
    id: "action",
    header: "Actions",
    cell:({row})=>{
        const supplier = row.original
            return(
                <div className="flex gap-2">
                    <Button 
                    variant="outline"
                    size="sm"
                    onClick={()=> onEdit(supplier)}>Edit</Button>

                    <Button 
                    variant="destructive"
                    size="sm"
                    onClick={()=> onDelete(row.original.id, row.original.supplierName)}>Delete</Button>
                </div>
            )
    }
}
]
 