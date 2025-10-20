import { createCrudService } from "./crudServices";
import { InventoryStockCreateDto, InventoryStockDto,InventoryStockUpdateDto } from "@/types/inventory";

export const inventoryService = 
createCrudService<InventoryStockCreateDto, InventoryStockDto, InventoryStockUpdateDto>
("/inventorystock");