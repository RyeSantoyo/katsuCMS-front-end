export interface StockAdjustmentDto{
    id: number;
    productName: string,
    productCode: string,
    unitName: string,
    previousQuantity: number;
    adjustedQuantity: number;
    adjustmentType: string;
    reason: string;
    adjustmentDate: string;   
}

export interface StockAdjusmentCreateDto{
    inventoryStockId: number;
    adjustmentType: string;
    adjustedQuantity: number;
    reason: string;
}

export interface StockAdjustmentUpdateDto extends StockAdjusmentCreateDto{
    id: number;
}