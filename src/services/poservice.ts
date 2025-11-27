import { createCrudService } from "./crudServices";
import { PurchaseOrderDto, PurchaseOrderCreateDto, PurchaseOrderUpdateDto } from "@/types/purchaseorder";

export const poServices = 
createCrudService<PurchaseOrderDto, PurchaseOrderCreateDto, PurchaseOrderUpdateDto>
("/purchaseorder");