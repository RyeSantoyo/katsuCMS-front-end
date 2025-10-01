"use client";
import {useEffect, useState} from "react";
import {getCategories, createCategory, deleteCategory, updateCategory} from "../../services/categoryservice"
import { PCategoryDto } from "../../types/category";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { DataTable} from "./data-table";
import {columns } from "./columns";
import { tree } from "next/dist/build/templates/app-page";

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
                const data = await getCategories();
                setCategory(data);
            }catch(error){
                console.error("Failed to load Category");
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
                    await createCategory({categoryName : newCategory});
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
                await updateCategory(editingCategory.id, editingCategory);
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
                await deleteCategory(id);
                loadCategory();
            }
            catch(err){
                console.error("Failed to delete category");
                toast.error("Failed");
            }

            return(
                <DataTable columns={columns({onDelete: handleDelete, onEdit: handleEdit }

                )}
                data={category}/>    
            
            )
        }
}