//import { ok } from "assert";
import { api } from "@/lib/api";
import {UnitDto, UnitCreateDto, UnitUpdateDto} from "../types/unit";

//const API_URL = "http://localhost:5058/api/units";

// export async function getUnits(): Promise<UnitDto[]> {
//     // const res = await fetch(API_URL);
//     // if (!res.ok) {
//     //     throw new Error('Failed to fetch units');
//     // }
//     // return res.json();
//     const res = await api.get<UnitDto[]>("/units");
//     return res.data;
// }

export async function getUnits(): Promise<UnitDto[]> {
    const res = await api.get<UnitDto[]>("/units");
    return res.data;
}

export async function getUnit(id: number): Promise<UnitDto>{
    // const res = await fetch(`${API_URL}/units/${id}`);
    // if (!res.ok) throw new Error("Failed to fetch unit");
    // return res.json();
        const res = await api.get<UnitDto>(`/units/${id}`);
         return res.data;
}

export async function createUnit(dto: UnitCreateDto): Promise<UnitDto>{
    // const res = await fetch(API_URL,{
    //     method: "POST",
    //     headers: {"Content-Type": "application/json"},
    //     body: JSON.stringify(dto)
    // })
    // if (!res.ok) throw new Error("Failed to create unit");
    // return res.json();
        const res = await api.post<UnitDto>("/units",dto);
        return res.data;
}

export async function  updateUnit(id: number, dto: UnitUpdateDto){
    // const res = await fetch(`${API_URL}/${id}`,{
    //     method: "PUT",
    //     headers: {"Content-Type": "application/json"},
    //     body: JSON.stringify(dto)
    // })
    // if (!res.ok) throw new Error("Failed to update unit");
    // if(res.status ===204) return null;

    // return res.json();
    const res = await api.put<UnitDto>(`/units/${id}`,dto);
        return res.data;
}

export async function deleteUnit(id: number){
    // const res = await fetch(`${API_URL}/${id}`,{
    //     method: "DELETE"
    // })
    // if (!res.ok) throw new Error("Failed to delete unit");
    const res = await api.delete<UnitDto>(`/units/${id}`);
    return res.data;
}