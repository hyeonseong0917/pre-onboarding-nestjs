import { Body, Post, Controller } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @Post('signup')
    signup(@Body() dto: SignupDto){
        return this.authService.signup(dto.email, dto.password);
    }

    @Post('login')
    login(@Body() dto: LoginDto){
        return this.authService.login(dto.email, dto.password);
    }

}

