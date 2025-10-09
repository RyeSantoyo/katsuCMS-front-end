export interface StoreDto {
    id: number;
    name: string;
    address: string;
    contactNumber: string;
}

export interface StoreCreateDto {
    name: string;
    address: string;
    contactNumber: string;
}
export interface StoreUpdateDto extends StoreCreateDto {
    id: number;
}