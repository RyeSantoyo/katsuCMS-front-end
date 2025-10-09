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

    }}