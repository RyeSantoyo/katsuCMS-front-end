export interface StockAdjustmentDto {
    id: number;
    productName: string,
    productCode: string,
    unitName: string,
    previousQuantity: number;
    adjustedQuantity: number;
    reorderLevel: number;
    preferredStockLevel: number;
    adjustmentType: string;
    reason: string;
    adjustmentDate: string;
}

export interface StockAdjustmentCreateDto {
    productCode: string;
    inventoryStockId: number;
    adjustmentType: string;
    reorderLevel: number;
    preferredStockLevel: number;
    adjustedQuantity: number;
    reason: string;
}

export interface StockAdjustmentUpdateDto extends StockAdjustmentCreateDto {
    id: number;
}