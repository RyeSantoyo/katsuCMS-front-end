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
            console.error("Failed to load units", error);
            toast.error("Failed to load units");
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
        const confirm = window.confirm(`Are you sure you want to delete ${storeToDelete}?`);
        if(!confirm) return toast.error("Store not found");

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

        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Store Management</h1>
                </div>
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" >
                    Add Store
                    </button>
                <DataTable columns={columns({onEdit: handleEdit, onDelete: handleDelete})} data={stores} />
                    <Modal
                        isOpen={showAddModal}
                        title = "Register New Store"
                        content ={
                            <>
                            <input type="text" value={newStoreName}
                            onChange={(e)=> setNewStoreName(e.target.value)}
                            placeholder="Store Name"
                            className="w-full p-2 border border-gray-300 rounded mb-2"
                            />
                            <input type="text" value={newAddress}
                            onChange={(e)=> setNewAddress(e.target.value)}
                            placeholder="Address"
                            className="w-full p-2 border border-gray-300 rounded mb-2"
                            />
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