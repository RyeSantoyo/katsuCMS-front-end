export interface ProductDto{
    id: number;
    productCode : string;
    productName : string;
    //quantity : number;
    description : string;
    price : number;
    categoryId : number;
    categoryName : string;
    unitId : number;
    unitName : string;
    supplierIds : number[];
    supplierNames : string[];
}

export interface ProductCreateDto{
    productCode: string;
    productName: string;
    //quantity: number;
    description: string;
    price: number;
    categoryId: number;
    unitId: number;
    supplierIds: number[];
}
export interface ProductUpdateDto extends ProductCreateDto {
    id: number
}

export interface SupplierOption {
  value: number;
  label: string;
}

export interface ProductForm {
  productCode: string;
  productName: string;
  description: string;
  price: number;
  categoryId: number;
  unitId: number;
  supplierIds: number[];
  supplierNames?: string[];
}

