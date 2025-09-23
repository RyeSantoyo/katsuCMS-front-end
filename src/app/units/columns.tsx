"use client";

import { ColumnDef } from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
export type Unit ={
    id: number
    unitName: string
}

export const columns = ({ onDelete }: { onDelete: (id: number) => void }): ColumnDef<Unit>[] => [
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
                    onClick={()=> console.log("Edit", unit)}>Edit</Button>
                    
                    <Button
                    variant="destructive"
                    size="sm"
                    onClick={()=> console.log("Delete", unit)}>Delete</Button>
                </div>
                
            )
        },
    
    }

]