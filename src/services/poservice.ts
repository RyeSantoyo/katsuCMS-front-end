import { createCrudService } from "./crudServices";
import { InventoryStockCreateDto, InventoryStockDto,InventoryStockUpdateDto } from "../types/inventory";

export const poServices = 
createCrudService<InventoryStockDto, InventoryStockCreateDto, InventoryStockUpdateDto>
("/purchaseorder");