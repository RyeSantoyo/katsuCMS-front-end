//import { ok } from "assert";
import { api } from '@/lib/api';
import {SupplierDto, SupplierCreateDto, SupplierUpdateDto} from '../types/supplier'

//const API_URL = "http://localhost:5058/api/supplier"

export async function getSuppliers(){
    // const res = await fetch (API_URL);
    // if(!res.ok) throw new Error('Failed to fetch supplier');
    //     return res.json();
    const res = await api.get<SupplierDto[]>('/supplier');
    return res.data;
}

export async function getSupplier(id: number): Promise<SupplierDto>{
    // const res = await fetch (`${API_URL}/supplier/${id}`);
    // if(!res.ok) throw new Error('Failed to fetch supplier');
    //     return res.json();
     const res = await api.get<SupplierDto>(`/supplier/${id}`);
     return res.data;
}

export async function createSupplier(dto: SupplierCreateDto){
    // const res = await fetch(API_URL,{
    //     method: "POST",
    //     headers: {"Content-Type": "application/json"},
    //     body: JSON.stringify(dto)
    // })
    // if(!res.ok) throw new Error ('Failed to create supplier');
    // return res.json();
    const res = await api.post<SupplierDto>('/supplier',dto);
    return res.data;
}

export async function updateSupplier(id: number, dto: SupplierUpdateDto){
        const res = await api.put<SupplierDto>(`/supplier/${id}`,dto);
        return res.data;
    // const res = await fetch (API_URL,{
    //     method: "PUT",
    //     headers: {"Content-Type": "application/json"},
    //     body: JSON.stringify(dto)
    // })

    // if(!res.ok) throw new Error('Failed to update supplier')
    //     if(res.status===204) return null;
    //     return res.json();
}
export async function deleteSupplier(id:number){ //: Promise<void>
        const res = await api.delete<SupplierDto>(`'/supplier/${id}`);
        return res.data;
    // const res = await fetch(`${API_URL}/${id}`,{
    //     method: "DELETE"
    // })

    // if(!res.ok) throw new Error(`Failed to delete ${id}`);
}