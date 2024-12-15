import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @MinLength(6,{
        message: 'Password must be at least 6 characters long'
    })
    password: string;
}