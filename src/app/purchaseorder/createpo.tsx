// "use client";

// import { poServices } from "@/services/poservice";
// import { POForm, POFormItems, PurchaseOrderCreateDto, PurchaseOrderStatus } from "@/types/purchaseorder";
// import { useState } from "react";

// export const initialPOForm =
// {
//     poNumber: "",
//     supplierId: 0,
//     orderDate: new Date().toISOString().split("T")[0],
//     status: PurchaseOrderStatus.Pending,
//     totalAmount: 0,
//     items: [] as POFormItems[],
// };

// export default function CreatePO() {
//     const [form, setForm] = useState<POForm>(initialPOForm);
//     const [open, setOpen] = useState(false);

//     function handleSubmit() {
//         const dto: PurchaseOrderCreateDto = {
//             poNumber: form.poNumber,
//             supplierId: Number(form.supplierId),
//             orderDate: form.orderDate,
//             status: form.status,
//             totalAmount: form.totalAmount,
//             purchaseOrderDetails: form.items.map(i => ({
//                 productId: Number(i.productId),
//                 quantity: i.quantity,
//                 unitPrice: i.unitPrice,
//                 subtotal: i.subTotal

//             }))
//         };

//         poServices.create(dto)
//             .then(() => alert("Po created"))
//             .catch(() => alert("Error"))
//     }
//     return (
//         <>
//         <button onClick ={() => setOpen(true)}> Create PO</button>
        
//         <CreatePO
//             open = {open}
//             setOpen = {setOpen}
//             form = {form}
//             setForm = {setForm} />
//         </>

//     )
// }