"use client";
import {useEffect, useState} from "react";
import {productServices} from "../../services/productservice"
import {categoryServices} from "../../services/categoryservice"
import {supplierServices } from "@/services/supplierservice";
import {unitServices} from "@/services/unitservice";
//import {createProduct, updateProduct, deleteProduct, getProducts} from "../../services/productservice"
import { ProductDto } from "@/types/products";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { DataTable } from "./data-table";
import {columns} from "./columns";
import { PCategoryDto } from "../category/columns";
import { UnitDto } from "../units/columns";
import { SupplierDto } from "@/types/supplier";

export default function ProductPage(){
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [newProductCode, setNewProductCode] = useState("");
    const [newProduct, setNewProduct] = useState("");
    const [newPrice, setNewPrice] = useState(0);
    const [newStock, setNewStock] = useState(0);
    const [newDescription , setNewDescription] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newSupplier, setNewSupplier] = useState("");
    const [newUnit, setNewUnit] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
    const [categories, setCategories] = useState<PCategoryDto[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);
    const [units, setUnits] = useState<UnitDto[]>([]);

    useEffect(()=>{

            loadAllData();
    },[]);

    async function loadProducts(){
        try{
            const data = await productServices.getAll();
            setProducts(data);
        }catch(error){
            console.error("Failed to load products" , error);
            toast.error("Failed to load products");
        }
    }
    async function loadAllData(){
        try{
            const [prodData, catData, supData, unitData] = await Promise.all([
                productServices.getAll(),
                categoryServices.getAll(),
                supplierServices.getAll(),
                unitServices.getAll()
            ]);
            setProducts(prodData);
            setCategories(catData);
            setSuppliers(supData);
            setUnits(unitData);
        } catch(error){
            console.error("Failed to load data", error);
            toast.error("Failed to load data");
        }
    }
 
    async function handleAdd(){
        console.log("Add button clicked");
 
        if(!newProduct.trim() || !newCategory.trim() || !newUnit.trim() || !newSupplier.trim()){
                loadAllData();
                return toast.error("No available data");
        }
        else{
            try{
                await productServices.create({
                    productCode: `P-${Math.floor(1000 + Math.random() * 9000)}`,
                    productName: newProduct,
                    quantity: newStock,
                    description: newDescription,
                    price: newPrice,
                    categoryId: parseInt(newCategory),
                    unitId: parseInt(newUnit),
                    supplierId: [parseInt(newSupplier)]
                });
                setNewProduct("");
                setShowAddModal(false);
                await loadAllData()
                toast.success("Product added");
            } catch(err){
                console.log("Failed",err)
                toast.error("Failed misserably");
            }
        }   
    }

    async function handleDelete(id: number , productName:string ){
            const confirm = window.confirm(`Are you sure you want to delete ${productName}`)

            if(!confirm) return;

            try{
                await productServices.delete(id);
                loadAllData();
            }
            catch(err){
                console.log("Failed to delete product", err)
                toast.error("Failed to delete product");
            }
            return;
    }

    async function handleEdit(product : ProductDto){
        setEditingProduct(product)
        setShowEditModal(true);
    }
}