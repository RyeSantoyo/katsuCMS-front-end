 import { createCrudService } from "./crudServices";
 import {PCategoryDto, PCategoryCreateDto, PCategoryUpdateDto} from "../types/category";

export const categoryServices = 
    createCrudService<PCategoryDto,
    PCategoryCreateDto, PCategoryUpdateDto>("/category");








// //import { ok } from "assert";
// import { api } from "@/lib/api";
// import {PCategoryDto, PCategoryCreateDto, PCategoryUpdateDto} from "../types/category";

// //const API_URL = "http://localhost:5058/api/category";

// export async function getCategories(){
//     // const res = await fetch(API_URL);
//     // if (!res.ok) {
//     //     throw new Error('Failed to fetch category');
//     // }
//     // return res.json();
//         const res = await api.get<PCategoryDto[]>("/category");
//         return res.data;
// }

// export async function getCategory(id: number): Promise<PCategoryDto>{
//     // const res = await fetch(`${API_URL}/category/${id}`);
//     // if (!res.ok) throw new Error("Failed to fetch unit");
//     // return res.json();
//         const res = await api.get<PCategoryDto>(`/units/${id}`);
//         return res.data;
// }

// export async function createCategory(dto: PCategoryCreateDto): Promise<PCategoryDto>{
//     // const res = await fetch(API_URL,{
//     //     method: "POST",
//     //     headers: {"Content-Type": "application/category"},
//     //     body: JSON.stringify(dto)
//     // })
//     // if (!res.ok) throw new Error("Failed to create category");
//     // return res.json();
//         const res = await api.post<PCategoryDto>(`/category`, dto);
//         return res.data;
// }

// export async function  updateCategory(id: number, dto: PCategoryUpdateDto){
//     // const res = await fetch(`${API_URL}/${id}`,{
//     //     method: "PUT",
//     //     headers: {"Content-Type": "application/json"},
//     //     body: JSON.stringify(dto)
//     // })
//     // if (!res.ok) throw new Error("Failed to update unit");
//     // if(res.status ===204) return null;

//     // return res.json();
//         const res = await api.put<PCategoryDto>(`/category${id}`, dto);
//         return res.data;

// }

// export async function deleteCategory(id: number){
//         const res = await api.delete<PCategoryDto>(`/category/${id}`);
//         return res.data;
//     // const res = await fetch(`${API_URL}/${id}`,{
//     //     method: "DELETE"
//     // })
//     // if (!res.ok) throw new Error("Failed to delete unit");
// }

