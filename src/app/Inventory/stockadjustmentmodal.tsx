"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adjustmentServices } from "@/services/stockadjustmentservice";
import { toast } from "react-hot-toast";

interface StockAdjustmentModalProps {
  open: boolean;
  onClose: () => void;
  stockId: number | null;
  productName?: string;
  currentQuantity?: number;
  onAdjustmentSuccess?: () => void;
}

export default function StockAdjustmentModal({
  open,
  onClose,
  stockId,
  productName,
  currentQuantity,
  onAdjustmentSuccess
}: StockAdjustmentModalProps) {

  const [adjustmentType, setAdjustmentType] = useState("Add");
  const [adjustedQuantity, setAdjustedQuantity] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!stockId) return;
    if (adjustedQuantity <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    setLoading(true);
    try {
      await adjustmentServices.create({
        inventoryStockId: stockId,
        adjustmentType,
        adjustedQuantity,
        reason,
      });

      toast.success(`Stock ${adjustmentType.toLowerCase()}ed successfully.`);
      onAdjustmentSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to adjust stock.");
    } finally {
      setLoading(false);
    }

    setAdjustedQuantity(0);
    setReason("")
    setAdjustmentType("");

  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Edit Stock</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div>
            <Label>Product</Label>
            <p className="text-sm text-muted-foreground">{productName}</p>
          </div>

          <div>
            <Label>Current Quantity</Label>
            <p className="text-sm text-muted-foreground">{currentQuantity}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Adjustment Type</Label>
              <select
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value)}
                className="w-full border rounded-md p-2"
              >
                <option value="Add">Add</option>
                <option value="Deduct">Deduct</option>
              </select>
            </div>

            <div>
              <Label>Adjusted Quantity</Label>
              <Input
                type="number"
                value={adjustedQuantity}
                onChange={(e) => setAdjustedQuantity(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label>Reason</Label>
            <Input
              type="text"
              placeholder="Reason for adjustment"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? "Processing..." : "Save Adjustment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
