"use client";
import {useEffect, useState} from "react";
import {categoryServices} from "../../services/categoryservice"
//import {getCategories, createCategory, deleteCategory, updateCategory} from "../../services/categoryservice"
import { PCategoryDto } from "../../types/category";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { DataTable} from "./data-table";
import {columns } from "./columns";
//import { tree } from "next/dist/build/templates/app-page";

export default function CategoryPage(){

        const [category, setCategory] = useState<PCategoryDto[]>([]);
        const [newCategory, setNewcategory] = useState("");

        const [showAddModal, setShowAddModal] = useState(false);
        const [showEditModal, setShowEditModal] = useState(false);
        const [editingCategory, setEditingCategory] = useState<PCategoryDto |null>(null);

        useEffect(()=>{
            loadCategory();
        },[]);

        async function loadCategory(){
            try{
                const data = await categoryServices.getAll();
                setCategory(data);
            }catch(error){
                console.error("Failed to load Category", error);
                toast.error("Failed")
            }
        }

        async function handleAdd(){
            console.log("Add button Clicked");

            if(!newCategory.trim()){
                loadCategory();
                return toast.error("No available Category.")
            }
            else{
                try{
                    await categoryServices.create({categoryName : newCategory});
                    setNewcategory("");
                    setShowAddModal(false);
                    await loadCategory();
                    toast.success("New category added");
                }
                catch(err){
                    console.error("Failed to create category ", err);
                    toast.error("Failed");
                }
            }
        }

            function handleEdit(category:PCategoryDto){
                setEditingCategory(category);
                setShowEditModal(true);
            }

        async function handleUpdate(){
            if(!editingCategory) return;

            try{
                await (editingCategory.id, editingCategory);
                toast.success("Updated Successfully");
                loadCategory()
                setShowEditModal(false);
                setEditingCategory(null);
            }
            catch (err){
                console.log("Failed bai", err);
                toast.error("Failed ka bai");
            }
        }

        async function handleDelete(id:number){
            const categoryToDelete = category.find(cat => cat.id === id);
            const confirmDelete = window.confirm(
                `Are you sure to remove ${categoryToDelete ? categoryToDelete.categoryName : "this category"} ?`
            );

            if(!confirmDelete) return;
            try{
                await categoryServices.delete(id);
                loadCategory();
            }
            catch(err){
                console.error("Failed to delete category", err);
                toast.error("Failed");
            }
        }

        return(
                <div className="p-4 bg-gray rounder shadow max-w-3xl mx-auto mt-10">
                    <h1 className="text-2x font-bold mb-4 text-black"> Category</h1>
                
                <div className="flex gap-2 mb-4 text-black">
                    <button onClick={()=> setShowAddModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400">
                        Add
                    </button>
                </div>
                <DataTable columns={columns({onDelete:handleDelete, onEdit:handleEdit})} data={category}/>

                <Modal
                    isOpen={showAddModal}
                    title = "Add New Category"
                    content ={
                        <>
                            <input type="text" value={newCategory}
                            onChange={(e)=> setNewcategory(e.target.value)}
                            placeholder="New Category"
                            className="w-full border px-3 py-2 rounded"/>
                        </>
                    }
                    onCancel={()=>{
                        setNewcategory("");
                        setShowAddModal(false);
                    }}
                    onConfirm={handleAdd}
                    confirmText="Save"
                    confirmColor="bg-blue-600"
                    />

                    <Modal
                        isOpen = {showEditModal}
                        title  = "Edit Category"
                        content={
                            <>
                             <input type="text"
                             value = {editingCategory?.categoryName || ""}
                             onChange={(e)=>
                                setEditingCategory((prev)=>
                                prev?{...prev, categoryName: e.target.value} : null)
                             }
                        placeholder="Category "
                        className="w-full borde px-3 py-2 rounded"/>

                            </>
                        }
                        onCancel={()=>{
                        setNewcategory("");
                        setShowAddModal(false);
                        }}
                        onConfirm={handleUpdate}
                        confirmText="Save"
                        confirmColor="bg-blue-600"
                        />
                </div>               
        )

}