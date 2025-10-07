//import {api }from "../lib/api";
import { createCrudService } from "./crudServices";
import {ProductCreateDto, ProductDto, ProductUpdateDto} from "../types/products";

export const productServices = 
createCrudService<ProductDto, 
ProductCreateDto, 
ProductUpdateDto>("/products");

//#region 
// export async function getProducts(){
//     const res = await api.get<ProductDto[]>("/product");
//     return res.data;
// }

// export async function getProduct(id: number): Promise<ProductDto>{
//     const res = await api.get<ProductDto>(`/product/${id}`);
//     return res.data;
// }

// export async function createProduct(dto: ProductCreateDto): Promise<ProductDto>{
//     const res = await api.post<ProductDto>(`/product`, dto);
//     return res.data;
// }
// export async function  updateProduct(id: number, dto: ProductUpdateDto){
//     const res = await api.put<ProductDto>(`/product/${id}`, dto);
//     return res.data;
// }

// export async function deleteProduct(id: number){
//     const res = await api.delete<ProductDto>(`/product/${id}`);
//     return res.data;
// }
//#endregion
