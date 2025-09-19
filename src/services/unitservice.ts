import {UnitDto, UnitCreateDto, UnitUpdateDto} from "../types/unit";

const API_URL = "http://localhost:5058/api/units";

export async function getUnits(): Promise<UnitDto[]> {
    const res = await fetch(API_URL);
    if (!res.ok) {
        throw new Error('Failed to fetch units');
    }
    return res.json();
}

export async function getUnit(id: number): Promise<UnitDto>{
    const res = await fetch(`${API_URL}/units/${id}`);
    if (!res.ok) throw new Error("Failed to fetch unit");
    return res.json();
}

export async function createUnit(dto: UnitCreateDto): Promise<UnitDto>{
    const res = await fetch(API_URL,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dto)
    })
    if (!res.ok) throw new Error("Failed to create unit");
    return res.json();
}

export async function  updateUnit(id: number, dto: UnitUpdateDto): Promise<UnitDto>{
    const res = await fetch(`${API_URL}/${id}`,{
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dto)
    })
    if (!res.ok) throw new Error("Failed to update unit");
    return res.json();
}

export async function deleteUnit(id: number): Promise<void>{
    const res = await fetch(`${API_URL}/${id}`,{
        method: "DELETE"
    })
    if (!res.ok) throw new Error("Failed to delete unit");
}