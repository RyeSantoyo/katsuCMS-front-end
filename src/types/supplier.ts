export interface SupplierDto{
    id: number,
    supplierName: string,
    address: string,
    contactNumber: string,
    supplierCode: string
}

export interface SupplierCreateDto{
    supplierName: string,
    address: string,
    contactNumber: string,
    supplierCode: string
}

export interface SupplierUpdateDto{
    supplierName: string,
    address: string,
    contactNumber: string,
    supplierCode : string
}