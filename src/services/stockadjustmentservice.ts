import { createCrudService } from "./crudServices";
import { StockAdjustmentDto, StockAdjusmentCreateDto, StockAdjustmentUpdateDto } from "@/types/stockadjustment";

export const adjustmentServices=
createCrudService<StockAdjustmentDto, 
StockAdjusmentCreateDto, StockAdjustmentUpdateDto>("/stockadjustments");