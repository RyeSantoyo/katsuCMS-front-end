"use client";
import  {useEffect, useState} from "react";
import {storeServices} from "../../services/storeServices"
import { StoreDto } from "../../types/store";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { DataTable } from "./data-table";
import {columns} from "./columns";

export default function StorePage(){
    const [stores, setStores] = useState<StoreDto[]>([]);
    const [newStoreName, setNewStoreName] = useState("");

    const [newAddress, setNewAddress] = useState("");
    const [newContactNumber, setNewContactNumber] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingStore, setEditingStore] = useState<StoreDto | null>(null);

    useEffect(()=>{
            loadStores();
    },[]);
    async function loadStores(){
        try{
            const data = await storeServices.getAll();
            setStores(data);
        }catch(error){
            console.error("Failed to load stores", error);
            toast.error("Failed to load stores");
        }
    }
    async function handleAdd(){
        console.log("Add button Clicked");

        if(!newStoreName.trim()){
            loadStores();
            return toast.error("No available Store Name.")
        }
        else{
            try{
                await storeServices.create({name: newStoreName, address: newAddress, contactNumber: newContactNumber});
                setNewStoreName("");
                setNewAddress("");
                setNewContactNumber("");
                setShowAddModal(false);
                await loadStores();
                toast.success("New Store added");
            }
            catch(err){
                console.error("Failed to create Store ", err);
                toast.error("Failed to create Store");
            }
        }
    }

    function handleEdit(store:StoreDto){
        setEditingStore(store);
        setShowEditModal(true);
    }

    async function handleUpdate(){
        if(!editingStore) return;

        try{
            await storeServices.update(editingStore.id, editingStore);
            setEditingStore(null);
            setShowEditModal(false);
            await loadStores();
            toast.success("Store updated");
        }
        catch (err){
            console.error("Failed to update Store", err);
            toast.error("Failed to update Store");
        }
    }

    async function handleDelete(id: number){
        const storeToDelete = stores.find((s) => s.id === id);
        const confirm = window.confirm(`Are you sure you want to delete ${storeToDelete ? storeToDelete.name: "this store"}`);
        if(!confirm) return;

        try{
            await storeServices.delete(id);
            await loadStores();
            toast.success("Store deleted");
        }
        catch(err){
            console.error("Failed to delete Store", err);
            toast.error("Failed to delete Store");
        }
    }

    return(

        <div className="p-4 bg-gray rounder shadow max-w-3xl mx-auto mt-10">
                <h1 className="text-2x font-bold mb-4 text-black">Store Management</h1>
                <button onClick={()=>setShowAddModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" >
                    Add Store
                    </button>
                <DataTable columns={columns({onEdit: handleEdit, onDelete: handleDelete})} data={stores} />
                    <Modal
                        isOpen={showAddModal}
                        title = "Register New Store"
                        content ={
                            <>
                            <label>Store Name</label>
                            <input type="text" value={newStoreName}
                            onChange={(e)=> setNewStoreName(e.target.value)}
                            placeholder="Store Name"
                            className="w-full p-2 border border-gray-300 rounded mb-2"
                            />
                            <label>Address</label>
                            <input type="text" value={newAddress}
                            onChange={(e)=> setNewAddress(e.target.value)}
                            placeholder="Address"
                            className="w-full p-2 border border-gray-300 rounded mb-2"
                            />
                            <label>Contact Number</label>
                            <input type="text" value={newContactNumber}
                            onChange={(e)=> setNewContactNumber(e.target.value)}
                            placeholder="Contact Number"
                            className="w-full p-2 border border-gray-300 rounded mb-2"
                            />

                           </>
                            }
                            onCancel={()=>{
                                setShowAddModal(false);
                                setNewContactNumber("");
                                setNewAddress("");
                                setNewStoreName("");
                            }}                            
                            onConfirm={handleAdd}
                            confirmText="Save"
                            confirmColor="bg-blue-600"
                            />
                    <Modal
                        isOpen = {showEditModal}
                        title = "Edit Store"
                        content ={
                            <>
                            <label>Store Name</label>
                            <input type="text" value={editingStore?.name || ""}
                            onChange={(e)=>
                                setEditingStore((prev)=>
                                    prev?{...prev, categoryName: e.target.value} : null)
                                }
                            placeholder="Store Name"
                            className="w-full p-2 border border-gray-300 rounded mb-2"
                            />
                            <input type="text" value={editingStore?.address || ""}
                                                onChange={(e)=> 
                                                    setEditingStore((prev)=>
                                                        prev?{...prev, address: e.target.value} : null)
                                                        }> 
                            </input>
                            <input type="text" value={editingStore?.contactNumber || ""}
                                                onChange={(e)=> 
                                                    setEditingStore((prev)=>
                                                        prev?{...prev, contactNumber: e.target.value} : null)
                                                        }> 
                            </input>
                            
                            </>
                        }
                        onCancel={()=>{
                            setShowEditModal(false);
                            setEditingStore(null);
                        }}
                        onConfirm={handleUpdate}
                        confirmText="Save"
                        confirmColor="bg-blue-600"

                       />                  
        </div>
    )
    
}