"use client";

import { ColumnDef } from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
//import { UnitDto } from "@/types/unit"; commented out

export type Unit ={
    id: number
    unitName: string
}

export const columns = ({ onDelete,   onEdit }: { 
                            onDelete: (id: number) => void;                           
                            onEdit: (id:Unit)=> void;
                            }): ColumnDef<Unit>[] => [
    {
        accessorKey:"id",   
        header : "Id"
    },
    {
        accessorKey:"unitName",
        header : "Unit Name"
    },
    {
        id: "action",
        header: "Actions",
        cell : ({row}) => 
        {
            const unit = row.original
            return (
                <div className="flex gap-2">
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(unit)}>Edit</Button>
                    
                    <Button
                    variant="destructive"
                    size="sm"
                    onClick={()=> onDelete(row.original.id)}>Delete</Button>
                </div>             
            )
        },
    
    }

]