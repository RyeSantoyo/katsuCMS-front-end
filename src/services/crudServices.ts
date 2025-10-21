// import { promises } from "dns";
import {api} from "../lib/api"

export function createCrudService<TDto, TCreateDto, TUpdateDto>(basePath : string){
    return {
        getAll: async (): Promise<TDto[]> =>{
            try{
            const res = await api.get<TDto[]>(basePath);
            return res.data;
            }
            catch (err: unknown){
                  console.error(`Failed to fetch ${basePath}: `, err)
                  throw err;      
            }
        },
        get: async (id:number) : Promise<TDto>=> {
            const res = await api.get<TDto>(`${basePath}/${id}`);
            return res.data;
        },
        create: async (dto: TCreateDto): Promise <TDto> =>{
            const res = await api.post<TDto>(basePath, dto);
            return res.data;
        },
        update : async(id:number, dto:TUpdateDto) : Promise<TDto> => {
            const res = await api.put<TDto>(`${basePath}/${id}`, dto);
            return res.data;
        },
        delete : async (id:number): Promise<void> => {
            await api.delete(`${basePath}/${id}`);
        },
        patch : async(id:number, dto:Partial<TUpdateDto>) : Promise<TDto> =>{
            const res = await api.patch<TDto>(`${basePath}/${id}`,dto);
            return res.data;
        }
    };
}