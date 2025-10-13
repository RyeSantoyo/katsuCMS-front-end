import { createCrudService } from "./crudServices";
import {StoreCreateDto, StoreUpdateDto, StoreDto} from "../types/store";
import { ProductUpdateDto } from "@/types/products";

export const storeServices = 
createCrudService<StoreDto, StoreCreateDto, StoreUpdateDto>("/store");