"use client";
import React from "react";
import Select from "react-select";

interface SupplierOption {
  value: number;
  label: string;
}

interface Props {
  suppliers: { id: number; supplierName: string }[];
  newSuppliers: SupplierOption[];
  setNewSuppliers: React.Dispatch<React.SetStateAction<SupplierOption[]>>;
}

export default function SupplierMultiSelect({
  suppliers,
  newSuppliers,
  setNewSuppliers,
}: Props) {
  const supplierOptions: SupplierOption[] = suppliers.map((sup) => ({
    value: sup.id,
    label: sup.supplierName,
  }));

  return (
    <Select
      isMulti
      name="suppliers"
      options={supplierOptions}
      className="basic-multi-select"
      classNamePrefix="select"
      placeholder="Select suppliers..."
      value={newSuppliers}
      onChange={(selected) => setNewSuppliers(selected as SupplierOption[])}
    />
  );
}
