import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entites';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}
    async create(email: string, password: string): Promise<User>{
        const existing=await this.userRepository.findOne({where:{email}});
        if(existing){
            throw new ConflictException("이미 사용중인 이메일입니다");
        }
        const hashedPassword=await bcrypt.hash(password, 10);
        const user=this.userRepository.create({
            email,
            password: hashedPassword,
        });
        return this.userRepository.save(user);
    }
    async findByEmail(email: string): Promise<User | null>{
        return this.userRepository.findOne({where: {email}});
    }
}
