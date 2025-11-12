"use client";
import { useEffect, useState } from "react";
// import { DataTable } from "./data-table";
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"
import { InventoryStockDto } from "@/types/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, RefreshCcw } from "lucide-react";
import StockAdjustmentModal from "./stockadjustmentmodal";
import StockAddModal from "./addstockmodal";

export default function InventoryStockPage() {
  const [stocks, setStocks] = useState<InventoryStockDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, startRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<InventoryStockDto | null>(null);
  // Fetch data from your backend
  const fetchStocks = async () => {
    try {
      startRefresh(true);
      const res = await fetch("http://localhost:5058/api/inventorystock");
      const data = await res.json();
      setStocks(data);
    } catch (error) {
      console.error("Failed to fetch stocks:", error);
    } finally {
      setLoading(false);
      startRefresh(false);
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
    setSelectedStock(stock);
    setIsModalOpen(true);
    // TODO: open modal with stock details
  };

  // const handleAdjustment = () => {
  //   setSelectedStock(null);
  //   setIsModalOpen(true)
  // }

  const fetchAdjustments = async () => {
    try {
      const res = await fetch("http://localhost:5058/api/stockadjustments");
      const data = await res.json();
      console.log("Fetched adjustments:", data);
    } catch (error) {
      console.error("Failed to fetch adjustments:", error);
    }
    finally {
      setLoading(false);
      startRefresh(false);
    }
  }
    useEffect(() => {
    fetchAdjustments();
  }, []);

  const handleAddStock = () => {
    setAddStockOpen(true);
  }


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-500">
        <Loader2 className=" h-6 w-6 animate-spin mr-2" /> Loading Stocks.
      </div>
    )
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold"> 📦 Inventory Stocks </CardTitle>
            <p className="text-gray-500 text-sm"> Manage and monitor current stock levels.</p>
          </div>
          <div className="flex gap-2">
            <Button variant={"outline"} onClick={(fetchStocks)} disabled={refresh}>
              {refresh ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 w-4 mr-2" /> Refreshing....
                </>
              ) : (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
                </>
              )}
            </Button>
            <Button onClick={handleAddStock}>
              <PlusCircle className="h-4 w-4 mr-2" /> Manually Add Stock
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="py-4">
            <DataTable
              columns={columns({ onDelete: handleDelete, onEdit: handleEdit })}
              data={stocks}
            />
          </div>
        </CardContent>
      </Card>

      <StockAdjustmentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stockId={selectedStock?.id ?? null}
        productName={selectedStock?.productName}
        currentQuantity={selectedStock?.quantity}
        onAdjustmentSuccess={fetchStocks}
      />

      <StockAddModal
        open={addStockOpen}
        onClose={() => setAddStockOpen(false)}
        onAddSuccess={fetchStocks}
      />

    </div >
  );
}

/*      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📦 Inventory Stocks</h1>
        <p className="text-gray-500 text-sm">Manage and monitor current stock levels</p>

               <div className="flex gap-2">
          <Button variant={"outline"} onClick={(fetchStocks)} disabled={refresh}>
            {refresh ?(
              <>
              <Loader2 className="animate-spin h-4 w-4 w-4 mr-2"/> Refreshing....
              </>
            ) : (
              <>
              <RefreshCcw className="h-4 w-4 mr-2"/> Refresh
              </>
            )}
          </Button>
          <Button onClick={()=> console.log("Manual adding of stock activated" ,)}>
            <PlusCircle className="h-4 w-4 mr-2"/> Manually Add Stock
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto py-10">
        <DataTable columns={columns({ onDelete: handleDelete, onEdit: handleEdit })} data={stocks} />
      </div>
       */