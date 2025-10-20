"use client";
import {useEffect, useState} from "react";
import {productServices} from "../../services/productservice"
import {categoryServices} from "../../services/categoryservice"
import {supplierServices } from "@/services/supplierservice";
import {unitServices} from "@/services/unitservice";
import { inventoryService } from "@/services/inventoryservice";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { DataTable } from "../product/data-table";
import {columns} from "./columns";
import { PCategoryDto } from "../category/columns";
import { UnitDto } from "../units/columns";
import { SupplierDto } from "@/types/supplier";
import { InventoryStockDto } from "@/types/inventory";
import { ProductDto } from "@/types/products";
import SupplierMultiSelect from "../product/multi-select";

