"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export type StoreDto ={
    id: number
    name : string
    address : string
    contactNumber : string
}

export const columns = ({onDelete, onEdit}: {
                        onDelete:(id:number, storeName:string) => void;
                        onEdit: (store:StoreDto) => void;
                            }) : ColumnDef<StoreDto>[] =>[
            {
                accessorKey: "id",
                header: "Id"
            },
            {
                accessorKey : "name",
                header: "Store Name",
            },
            {
                accessorKey : "address",
                header: "Address",
            },
            {
                accessorKey: "contactNumber",
                header: "Contact Number",
            },
            {
                id: "action",
                header: "Actions",
                cell : ({row}) =>
                {
                    const store = row.original
                    return(
                        <div className="flex gap-2">
                            <Button
                            variant="outline"
                            size="sm"
                            onClick={()=> onEdit(store)}>Edit</Button>

                            <Button
                            variant="destructive"
                            size="sm"
                            onClick={()=> onDelete(row.original.id, row.original.name)}>Delete</Button>
                        </div>
                    )
                }
            }
]