import { useState } from "react";
import { POFormItems, PurchaseOrderStatus } from "@/types/purchaseorder";

export const initialPOForm =
{
    poNumber :"",
    supplierId : 0,
    orderDate: new Date().toISOString().split("T")[0],
    status: PurchaseOrderStatus.Pending,
    totalAmount: 0,
    items : [] as POFormItems[],
};

