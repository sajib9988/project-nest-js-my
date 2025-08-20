import { IsString, IsNumber } from "class-validator";


export class ProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;
}