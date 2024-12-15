import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from "class-validator";

export class RegisterUserDto {
    @IsNotEmpty()
    userName: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @MinLength(6,{
        message: 'Password must be at least 6 characters long'
    })
    password: string;
    @IsEnum(Role)
    role: Role;
}