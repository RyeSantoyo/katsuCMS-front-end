// "use client";
// import { ColumnDef } from "@tanstack/react-table";
// import { MoreHorizontal } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { StockAdjustmentDto } from "@/types/stockadjustment";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// export const columns = ({ onDelete, onEdit }:
//     {
//         onDelete: (id: number, productName: string) => void;
//         onEdit: (stocks: StockAdjustmentDto) => void;
//     }): ColumnDef<StockAdjustmentDto>[] =>
//     [
//         {
//             accessorKey: "id",
//             header: "ID"
//         },
//         {
//             accessorKey: "productName",
//             header: "Product Name"
//         },
//         {
//             accessorKey: "productCode",
//             header: "Product Code"
//         },
//         {
//             accessorKey: "previousQuantity",
//             header: "Quantity"
//         },
//         {
//             accessorKey: "adjustedQuantity",
//             header: "Added Quantity"
//         },

//     ]