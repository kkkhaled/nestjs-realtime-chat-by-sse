import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dtos/register-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { JwtAuthGuard } from "src/decorators/jwt-auth-decorator";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    // sign up user
    @Post('signup')
    async signUp(@Body() registerUserDto: RegisterUserDto) {
        return await this.authService.signUp(registerUserDto);
    }

    // logIn user
    @Post('login')
    async logIn(@Body()loginUserDto:LoginUserDto) {
        return await this.authService.logIn(loginUserDto);
    }

    
    // get user data by id
    @Get('user')
    @UseGuards(JwtAuthGuard)
    async findUser(@Req() req) {        
        return await this.authService.findUser(req.user.id);
    }
}