"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventoryStockDto } from "@/types/inventory";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns = ({ onDelete, onEdit }:
    {
        onDelete: (id: number, productName: string) => void;
        onEdit: (stocks: InventoryStockDto) => void;
    }): ColumnDef<InventoryStockDto>[] =>
    [
        {
            accessorKey: "id",
            header: "ID"
        },
        {
            accessorKey: "productCode",
            header: "Product Code"
        },
        {
            accessorKey: "productName",
            header: "Product Name"
        },
        {
            accessorKey: "category",
            header: "Category"
        },
        {
            accessorKey: "unitName",
            header: "Unit"
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
        // {
        //     accessorKey: "isLowStock",
        //     header: "Low in Stock?"
        // },
        {
            accessorKey: "inventoryValue",
            header: () => <div className="text-right">Inventory Value</div>,
            cell: ({ row }) => {
                const value = parseFloat(row.getValue("inventoryValue"))
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(value)

                return <div className="text-right font-medium">{formatted}</div>
            },
        },
        {
            accessorKey: "lastUpdated",
            header: "Latest Update"
        },
        {
            id: "action",
            header: "Actions",
            cell: ({ row }) => {
                const stocks = row.original

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
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(stocks.productCode)}>
                                Copy Product Code
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem >View Customer</DropdownMenuItem>
                            <DropdownMenuItem> View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={()=> onEdit(stocks)}> Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(row.original.id, row.original.productName)}> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]