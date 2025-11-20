"use client";
import React from "react";
import Select from "react-select";

interface SupplierOption {
  value: number;
  label: string;
}
export interface ProductForm {
  productCode: string;
  productName: string;
  description: string;
  price: number;
  categoryId: number;
  unitId: number;
  supplierIds: number[];
  supplierNames?: string[];
}
// interface CategoryOption {
//   value: number;
//   label: string;
// }

interface Props {
  suppliers: { id: number; supplierName: string; }[];
  newSuppliers: SupplierOption[];
  setNewSuppliers: React.Dispatch<React.SetStateAction<SupplierOption[]>>;
  setForm: React.Dispatch<React.SetStateAction<ProductForm>>;

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
// interface CatProps  {
//   category: { id: number; categoryName: string } []
//   newCategory: CategoryOption[];
//   setNewCategory: React.Dispatch<React.SetStateAction<CategoryOption[]>>;
// }

// export function CategoryMultiSelect({
//   category, // Destructure the corrected prop name
//   newCategory,
//   setNewCategory,
// }: CatProps) {
//   // 2. Map over the array of categories to create options
//   const categoryOptions: CategoryOption[] = category.map((categ) => ({
//     value: categ.id, // Use 'categ' from the map callback
//     label: categ.categoryName, // Use 'categ' from the map callback
//   }));

//   // 3. Add the return statement to render the Select component
//   return (
//     <Select
//       isMulti
//       name="categories"
//       options={categoryOptions}
//       className="basic-multi-select"
//       classNamePrefix="select"
//       placeholder="Select categories..."
//       value={newCategory}
//       onChange={(selected) => setNewCategory(selected as CategoryOption[])}
//     />
//   );
// }