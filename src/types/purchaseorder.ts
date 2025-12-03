export interface PurchaseOrderDto{
    id: number;
    poNumber : string;
    supplierId : number;
    orderDate : string;
    status: PurchaseOrderStatus;
    totalAmount: number;
    createdDate : string;
    updatedAt : string;
    orderDetails : PurchaseOrderDetailDto[];
}
export interface PurchaseOrderCreateDto{
    poNumber: string;
    supplierId: number;
    orderDate: string;
    status: PurchaseOrderStatus;
    totalAmount: number;
    purchaseOrderDetails: PurchaseOrderDetailDto[];
}
export interface PurchaseOrderUpdateDto extends PurchaseOrderCreateDto{
    status: PurchaseOrderStatus;
    updatedAt:string;
}
export interface PurchaseOrderResponseDto{
    poNumber: string;
    supplierName: string;
    orderDate: string;
    status : PurchaseOrderStatus;
    totalAmount : number;
    orderDetails: PurchaseOrderDetailResponseDto[];
}

export enum PurchaseOrderStatus{
    Pending = 0,
    Approved = 1,
    Completed = 2,
    Cancelled = 3
}

export interface PurchaseOrderDetailDto{
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface PurchaseOrderDetailResponseDto{
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    unitName: string;
}

export interface POForm{
    poNumber: string;
    supplierId : number | "";
    orderDate: string;
    status: PurchaseOrderStatus;
    totalAmount: number;
    items: POFormItems[];
}

export interface    POFormItems{
    productId : number | "";
    quantity: number;
    unitPrice: number;
    subTotal: number;
}