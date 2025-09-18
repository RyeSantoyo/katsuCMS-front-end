"use client";
import { useEffect, useState } from "react";
import {getUnits, createUnit, deleteUnit, updateUnit} from "../../services/unitservice";
import { UnitDto, UnitCreateDto, UnitUpdateDto } from "../../types/unit";

export default function UnitsPage(){
    const [units, setUnits] = useState<UnitDto[]>([]);
    const [newUnit, setNewUnit]= useState<string>("");

    useEffect(()=>{
        loadUnits();
    },[]);

    async function loadUnits(){
        try{
            const data = await getUnits();
            setUnits(data);
        }catch(error){
            console.error("Failed to load units", error);
        }
    }

    async function handleAdd(){
        if(!newUnit.trim()) return;
        try{
            await createUnit({unitName: newUnit});
            setNewUnit("");
            loadUnits();
        }
        catch (err){
            console.error("Failed to create unit", err);
        }
    }

    async function handleDelete(id: number){
        try{
            await deleteUnit(id);
            loadUnits();
        }
        catch (err){
            console.error("Failed to delete unit", err);
        }
    }

    return(
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Units</h1>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newUnit}
                    onChange={(e)=> setNewUnit(e.target.value)}
                    placeholder="Add new unit"
                    className="border p-3 py-2 rounded w-64" />
                    <button onClick={handleAdd}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add
                    </button>
            </div>
            <table className="min-w-full bg-white border">
                <thead>
                    <tr> 
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Unit Name</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {units.map((u)=>(
                        <tr key={u.id}>
                            <td className="border px-4 py-2">{u.id}</td>
                            <td className="border px-4 py-2">{u.unitName}</td>
                            <td className="border px-4 py-2">
                                <button onClick={()=> handleDelete(u.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}