import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import { RegisterUserDto } from "./dtos/register-user.dto";
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from "./dtos/login-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    // sign up user
    async signUp(registerUserDto:RegisterUserDto) {
        try {
            // check if user already exists
            const user = await this.prisma.user.findUnique({
                where: {
                    email: registerUserDto.email,
                },
            })

            if (user) {
                throw new BadRequestException('User already exists');
            }
            // create user
            // first bcrypt password
            const password = await bcrypt.hash(registerUserDto.password, 10);
            // save user
            const newUser = await this.prisma.user.create({
                data: {
                    userName: registerUserDto.userName,
                    email: registerUserDto.email,
                    password: password,
                    role: registerUserDto.role
                },
            });
            // generate token
            const token = await this.generateToken(newUser.id);
            return {
                token
            }
        } catch (error) {
            throw new BadRequestException(error, 'Failed to register user');
        }
    }    

    // login user
   async logIn(loginUserDto:LoginUserDto) {
    try {
        const user = await this.prisma.user.findUnique({
            where: {
                email: loginUserDto.email
            }
        })

        if (!user) {
            throw new BadRequestException('not user found  for this email');
        }

        const passwordMatch = await bcrypt.compare(loginUserDto.password, user.password);        
        if (!passwordMatch) {
            throw new BadRequestException('Invalid password');
        }

        const token =await this.generateToken(user.id);
        return {
            token
        }
    } catch (error) {
      throw new BadRequestException(error, 'Failed to login user');        
    } 
}

    // generate user token 
    private async generateToken(userId:String) {
       return this.jwtService.sign(
            { userId },
            {
              secret: process.env.JWT_SECRET,
              expiresIn: '30d',
            },
          );
    }

    // get user data by id 
    async findUser(userId: string){
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                },
                select:{
                    id: true,
                    userName: true,
                    email: true,
                    role: true
                }
            })
            return user
        } catch (error) {
           throw new BadRequestException(error, "Failed to get user data")  
        }
    }
}