// import { create } from "domain";
import { createCrudService } from "./crudServices";
import { PurchaseOrderDto, PurchaseOrderCreateDto, PurchaseOrderUpdateDto } from "@/types/purchaseorder";
import { api } from "@/lib/api";

export const poServices = {
...createCrudService<
PurchaseOrderDto, 
PurchaseOrderCreateDto, 
PurchaseOrderUpdateDto>("../types/purchaseorder"),

generatePoNumber: () => 
    api.get<{poNumber: string}>("/purchaseorder/GeneratePONumber"),
};