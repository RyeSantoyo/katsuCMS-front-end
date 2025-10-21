import { createCrudService } from "./crudServices";
import { InventoryStockCreateDto, InventoryStockDto,InventoryStockUpdateDto } from "../types/inventory";

export const inventoryServices = 
createCrudService<InventoryStockCreateDto, InventoryStockDto, InventoryStockUpdateDto>
("/inventorystock");