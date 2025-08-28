import { IsEmail, IsString, IsOptional, IsIn } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsIn(['ADMIN', 'USER', 'MODERATOR'])
    role?: 'ADMIN' | 'USER' | 'MODERATOR';
}