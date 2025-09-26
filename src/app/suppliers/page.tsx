"use client";
import {useEffect, useState} from "react";
import {getSupplier, createSupplier, updateSupplier, deleteSupplier, getSuppliers} from "../../services/supplierservice"
import { SupplierDto } from "@/types/supplier";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
//import { DataTable } from "./data-table";
//import {columns} from "./columns";

export default function SupplierPage(){

    const [supplier, setSupplier] = useState<SupplierDto[]>([]);
    const [newSupplier, setNewSupplier] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [newContact, setNewContact] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<SupplierDto | null>(null);

    useEffect(()=>{
            loadSupplier();
    },[]);

    async function loadSupplier(){
        try{
            const data = await getSuppliers();
            setSupplier(data);
        }catch(error){
            console.error("Failed to load suppliers" , error);
            toast.error("Failed to load supplier");
        }
    }

    async function handleAdd(){
        console.log("Add button clicked");

        if(!newSupplier.trim()){
                loadSupplier();
                return toast.error("No available supplier");
        }
        else{
            try{
                await createSupplier({
                    supplierName: newSupplier,
                    address: newAddress,
                    ContactNumber: newContact
                });
                setNewSupplier("");
                setShowAddModal(false);
                await loadSupplier();
                toast.success("Supplier added");
            } catch(err){
                console.log("Failed",err)
                toast.error("Failed misserably");
            }
        }            
    }

    async function handleDelete(id: number , supplierName:string ){
            const confirm = window.confirm(`Are you sure you want to delete ${supplierName}`)

            if(!confirm) return;

            try{
                await deleteSupplier(id);
                loadSupplier();
            }
            catch(err){
                console.log("Failed to delete supplier", err)
                toast.error("Failed to delete supplier");
            }
            return;
    }
    function handleEdit(supplier : SupplierDto){
        setEditingSupplier(supplier)
        setShowAddModal(true);
    }
    async function handleUpdate(){
        if(!editingSupplier) return;

        try{
            await updateSupplier(editingSupplier.id, editingSupplier);
            toast.success("Supplier updated successfully");
            loadSupplier();
            setShowEditModal(false);
            setEditingSupplier(null);

        }
        catch(err){
            console.log(err);
            toast.error(`Failed to update ${editingSupplier.supplierName}`);
        }
    }

        return(
                <div>
                    
                </div>
        )

}