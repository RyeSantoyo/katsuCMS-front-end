export interface InventoryStockDto{
    id: number;
    productId: number;
    productCode: string;
    productName: string;
    unitName : string;
    category: string;
    quantity: number;
    reorderLevel: number;
    preferredStockLevel: number;
    isLowStock : boolean;
    inventoryValue : number;
    lastUpdated: string;
    supplierNames : string[];
}

export interface InventoryStockCreateDto{
    productId : number;
    unitId : number;
    quantity: number;
    reorderLevel: number;
    preferredStockLevel: number;
}

export interface InventoryStockUpdateDto extends InventoryStockCreateDto {
    id: number;
}