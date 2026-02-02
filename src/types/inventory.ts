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
    price: number;
    supplierId: number[];
    supplierNames : string[];
}

export interface InventoryStockCreateDto {
    productId: number;
    unitId: number;
    quantity: number;
    productCode: string;
    price: number;
    reorderLevel: number;
    preferredStockLevel: number;
    supplierIds: number[];   // MUST be plural
}

export interface InventoryStockUpdateDto extends InventoryStockCreateDto {
    id: number;
}