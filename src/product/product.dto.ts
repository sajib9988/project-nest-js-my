import { IsString, IsNumber } from "class-validator";


export class ProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsNumber()
    stock: number; // Optional field for stock quantity, default to 0 in the database
}