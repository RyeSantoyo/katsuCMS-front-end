import { createCrudService } from "./crudServices";
import {StoreCreateDto, StoreUpdateDto, StoreDto} from "../types/store";

export const storeServices = 
createCrudService<StoreCreateDto, 
StoreUpdateDto, 
StoreDto>("/products");