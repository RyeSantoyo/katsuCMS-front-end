"use client";
import { useEffect, useState } from "react";
import { supplierServices } from "../../services/supplierservice"
// import {createSupplier, updateSupplier, deleteSupplier, getSuppliers} from "../../services/supplierservice"
import { SupplierDto } from "@/types/supplier";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { DataTable } from "@/components/data-table"
//import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function SupplierPage() {

    const [supplier, setSupplier] = useState<SupplierDto[]>([]);
    const [newSupplier, setNewSupplier] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [newContact, setNewContact] = useState("");
    const [newSupplierCode, setNewSupplierCode] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<SupplierDto | null>(null);

    useEffect(() => {
        loadSupplier();
    }, []);

    async function loadSupplier() {
        try {
            const data = await supplierServices.getAll();
            setSupplier(data);
            console.log(data);
        } catch (error) {
            console.error("Failed to load suppliers", error);
            toast.error("Failed to load supplier");
        }
    }

    async function handleAdd() {
        console.log("Add button clicked");

        if (!newSupplier.trim()) {
            loadSupplier();
            return toast.error("No available supplier");
        }
        else {
            try {
                await supplierServices.create({
                    supplierName: newSupplier,
                    address: newAddress,
                    contactNumber: newContact,
                    supplierCode: newSupplierCode
                });
                setNewSupplier("");
                setShowAddModal(false);
                await loadSupplier();
                toast.success("Supplier added");
            } catch (err) {
                console.log("Failed", err)
                toast.error("Failed misserably");
            }
        }
    }

    async function handleDelete(id: number, supplierName: string) {
        const confirm = window.confirm(`Are you sure you want to delete ${supplierName}`)

        if (!confirm) return;

        try {
            await supplierServices.delete(id);
            loadSupplier();
        }
        catch (err) {
            console.log("Failed to delete supplier", err)
            toast.error("Failed to delete supplier");
        }
        return;
    }
    function handleEdit(supplier: SupplierDto) {
        setEditingSupplier(supplier)
        setShowEditModal(true);
    }
    async function handleUpdate() {
        if (!editingSupplier) return;

        try {
            await supplierServices.update(editingSupplier.id, editingSupplier);
            toast.success("Supplier updated successfully");
            loadSupplier();
            setShowEditModal(false);
            setEditingSupplier(null);

        }
        catch (err) {
            console.log(err);
            toast.error(`Failed to update ${editingSupplier.supplierName}`);
        }
    }

    return (
        <div className="p-4 bg-gray rounded shadow max-w-3xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4 text-black" >Supplier</h1>

            <div className="flex gap-2 mb-4 text-black">
                <button onClick={() => setShowAddModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Add
                </button>
            </div>

            <DataTable columns={columns({ onDelete: handleDelete, onEdit: handleEdit })} data={supplier} />

            <Modal
                isOpen={showAddModal}
                title="Add New Supplier"
                content={
                    <>
                        <input type="text" value={newSupplier}
                            onChange={(e) => setNewSupplier(e.target.value)}
                            placeholder="Supplier"
                            className="w-full border px-3 py-2 rounded" />

                        <input type="text" value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            placeholder="Set New Address"
                            className="w-full border px-3 py-2 rounded" />

                        <input type="text" value={newContact}
                            onChange={(e) => setNewContact(e.target.value)}
                            placeholder="Set Contact Number"
                            className="w-full border px-3 py-2 rounded" />

                        <input type="text" value={newSupplierCode}
                            onChange={(e) => setNewSupplierCode(e.target.value)}
                            placeholder="Set Supplier Code"
                            className="w-full border px-3 py-2 rounded" />
                    </>
                }
                onCancel={() => {
                    setNewAddress("");
                    setNewContact("");
                    setNewSupplier("");
                    setShowAddModal(false);
                }}

                onConfirm={handleAdd}
                confirmText="Save"
                confirmColor="bg-blue-600"
            />
            <Modal
                isOpen={showEditModal}
                title="Edit Supplier Info."
                content={
                    <>
                        <input
                            type="text"
                            value={editingSupplier?.supplierName || ""}
                            onChange={(e) =>
                                setEditingSupplier((prev) =>
                                    prev ? { ...prev, supplierName: e.target.value } : null
                                )
                            }
                            placeholder="Supplier Name"
                            className="w-full border px-3 py-2 rounded"
                        />

                        <input
                            type="text"
                            value={editingSupplier?.address || ""}
                            onChange={(e) =>
                                setEditingSupplier((prev) =>
                                    prev ? { ...prev, address: e.target.value } : null
                                )
                            }
                            placeholder="Address"
                            className="w-full border px-3 py-2 rounded"
                        />

                        <input
                            type="text"
                            value={editingSupplier?.contactNumber || ""}
                            onChange={(e) =>
                                setEditingSupplier((prev) =>
                                    prev ? { ...prev, ContactNumber: e.target.value } : null
                                )
                            }
                            placeholder="Contact Number"
                            className="w-full border px-3 py-2 rounded"
                        />

                        <input
                            type="text"
                            value={editingSupplier?.supplierCode || ""}
                            onChange={(e) =>
                                setEditingSupplier((prev) =>
                                    prev ? { ...prev, supplierCode: e.target.value } : null
                                )
                            }
                            placeholder="Supplier Code"
                            className="w-full border px-3 py-2 rounded"
                        />
                    </>
                }
                onCancel={() => {
                    setNewAddress("");
                    setNewContact("");
                    setNewSupplier("");
                    setNewSupplierCode("");
                    setShowEditModal(false);
                }}

                onConfirm={handleUpdate}
                confirmText="Save"
                confirmColor="bg-blue-600"
            />
        </div>
    )
}