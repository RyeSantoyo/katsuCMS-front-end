"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { /*PurchaseOrderDto,*/ PurchaseOrderListDto } from "@/types/purchaseorder";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns = ({ onDelete, onEdit, onView }: {
    onDelete: (id: number, poNumber: string) => void;
    onEdit: (po: PurchaseOrderListDto) => void;
    onView: (po: PurchaseOrderListDto) => void;
}): ColumnDef<PurchaseOrderListDto>[] => [
        {
            accessorKey: "poNumber",
            header: "PO Number"
        },
        {
            accessorKey: "supplierName",
            header: "Supplier"
        },
        {
            accessorKey: "orderDate",
            header: "Order Date",
            cell: ({ row }) => new Date(row.original.orderDate).toLocaleDateString()
        },
        {
            accessorKey: "status",
            header: "Status"
        },
        {
            accessorKey: "totalAmount",
            header: "Total Amount",
            cell: ({ row }) => `$${row.original.totalAmount.toFixed(2)}`
        },
        {
            accessorKey: "createdDate",
            header: "Created Date",
            cell: ({ row }) => new Date(row.original.orderDate).toLocaleDateString()
        },
        {
            accessorKey: "updatedAt",
            header: "Updated At",
            cell: ({ row }) => new Date(row.original.orderDate).toLocaleDateString()
        },
        {
            accessorKey: "itemsCount",
            header: "Items Ordered",
            cell: ({ row }) => (
                <span>
                    {row.original.itemsCount} item
                    {row.original.itemsCount !== 1 ? "s" : ""}
                </span>
            )
        },

        {
            id: "action",
            header: "Actions",
            cell: ({ row }) => {
                const po = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={"ghost"} className="h-8 w-8 p-0">
                                <span className="sr-only"> Open Menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(po.poNumber)}>
                                Copy Product Name
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onView(row.original)} >View Info</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(po)}> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(row.original.id, row.original.poNumber)}> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]