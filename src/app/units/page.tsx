"use client";
import { useEffect, useState } from "react";
import {getUnits, createUnit, deleteUnit} from "../../services/unitservice"; //, updateUnit - Remove
import { UnitDto } from "../../types/unit"; //, UnitCreateDto, UnitUpdateDto - Removed
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function UnitsPage(){
    const [units, setUnits] = useState<UnitDto[]>([]);
    const [newUnit, setNewUnit]= useState("");

    //const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal]= useState(false);
    
    useEffect(()=>{
        loadUnits();
    },[]);

    async function loadUnits(){
        try{
            const data = await getUnits();
            setUnits(data);
        }catch(error){
            console.error("Failed to load units", error);
            toast.error("Failed to load units");
        }
    }
    async function handleAdd() {
       console.log("Add Button Clicked");

        if (!newUnit.trim()){
            loadUnits();
             return toast.error("No available Unit");
        }
        else{
        try {
            await createUnit({ unitName: newUnit });
            setNewUnit("");
            setShowAddModal(false);
            await loadUnits();
            toast.success("Unit created successfully ✅"); // success instead of error
        } catch (err) {
            console.error("Failed to create unit", err);
            toast.error("Failed to create unit ❌");
        }
        }

    }

    async function handleDelete(id: number){
        const confirmDelete = window.confirm("Are you sure you want to delete this unit?");
        if (!confirmDelete) return;
        try{
            await deleteUnit(id);
            loadUnits();
        }
        catch (err){
            console.error("Failed to delete unit", err);
            toast.error("Failed to delete unit");
        }
        return(
            <DataTable columns={columns({onDelete: handleDelete})}
            data={units}/>
        )
    }
    // if(loading) return<p>Loading....</p>;

    return(
        <div className="p-4 bg-white rounded shadow max-w-3xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4 text-black" >Units</h1>

            <div className="flex gap-2 mb-4 text-black">
                {/* <input
                    type="text"
                    value={newUnit}
                    onChange={(e)=> setNewUnit(e.target.value)}
                    placeholder="Add new unit"
                    className="border p-3 py-2 rounded w-64" /> */}
                    <button onClick={()=> setShowAddModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add
                    </button>
                    
            </div>
                        <DataTable columns={columns({onDelete:handleDelete})} data={units}/>

                    <Modal
                        isOpen={showAddModal}
                        title="Add New Unit"
                        content={
                            <input type="text" value={newUnit}
                            onChange={(e) => setNewUnit(e.target.value)}
                            placeholder="Unit name"
                            className="w-full border px-3 py-2 rounded"
                            />
                        }
                        onCancel={()=> {
                            setNewUnit("");
                            setShowAddModal(false)
                        }}
                        onConfirm={handleAdd}
                        confirmText="Save"
                        confirmColor="bg-green-600"
                    />
        </div>
    )
}

/*            <table className="min-w-full border text-center">
                <thead className="text-center text-lg text-gray-700">
                    <tr> 
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Unit Name</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-center text-lg text-gray-700">
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
            </table> */