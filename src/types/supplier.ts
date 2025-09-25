export interface SupplierDto{
    id: number,
    supplierName: string,
    address: string,
    ContactNumber: string
}

export interface SupplierCreateDto{
    supplierName: string,
    address: string,
    ContactNumber: string
}

export interface SupplierUpdateDto{
    supplierName: string,
    address: string,
    ContactNumber: string
}