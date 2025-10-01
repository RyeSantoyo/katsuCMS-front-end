import { createCrudService } from "./crudServices";
import {UnitDto, UnitCreateDto, UnitUpdateDto} from "@/types/unit"

export const unitServices = 
    createCrudService<UnitDto,UnitCreateDto,UnitUpdateDto>("/units");