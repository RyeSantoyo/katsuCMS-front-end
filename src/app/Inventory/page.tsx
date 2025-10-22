"use client";
import { useEffect, useState } from "react";
// import { DataTable } from "./data-table";
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"
import { InventoryStockDto } from "@/types/inventory";
import { Button } from "@/components/ui/button";

export default function InventoryStockPage() {
  const [stocks, setStocks] = useState<InventoryStockDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from your backend
  const fetchStocks = async () => {
    try {
      const res = await fetch("http://localhost:5058/api/inventorystock");
      const data = await res.json();
      setStocks(data);
    } catch (error) {
      console.error("Failed to fetch stocks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleDelete = async (id: number, productName: string) => {
    if (confirm(`Are you sure you want to delete stock for "${productName}"?`)) {
      try {
        await fetch(`http://localhost:5058/api/inventorystock/${id}`, { method: "DELETE" });
        setStocks((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error("Failed to delete stock:", error);
      }
    }
  };

  const handleEdit = (stock: InventoryStockDto) => {
    console.log("Edit clicked for:", stock);
    // TODO: open modal with stock details
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📦 Inventory Stocks</h1>
        <Button onClick={fetchStocks}>🔄 Refresh</Button>
      </div>

      <div className="container mx-auto py-10">
        <DataTable columns={columns({ onDelete: handleDelete, onEdit: handleEdit })} data={stocks} />
      </div>
    </div>
  );
}
