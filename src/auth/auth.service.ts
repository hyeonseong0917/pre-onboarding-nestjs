import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ){}
    async signup(email: string, password: string){
        const user=await this.usersService.create(email, password);
        return {message: '회원가입 성공', userId: user.id};
    }
    async login(email: string, password: string){
        const user=await this.usersService.findByEmail(email);
        if(!user){
            throw new UnauthorizedException('이메일 또는 비밀번호가 틀림');
        }
        const isPasswordValid=await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new UnauthorizedException('이메일 또는 비밀번호가 틀림');
        }
        const payload={sub: user.id, email: user.email};
        const token=this.jwtService.sign(payload);
        return {accessToken: token};
    }
}
