import { createCrudService } from "./crudServices";
import { StockAdjustmentDto, StockAdjustmentCreateDto, StockAdjustmentUpdateDto } from "@/types/stockadjustment";

export const adjustmentServices=
createCrudService<StockAdjustmentDto, 
StockAdjustmentCreateDto, StockAdjustmentUpdateDto>("/stockadjustments");