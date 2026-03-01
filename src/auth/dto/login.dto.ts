import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto{
    @ApiProperty({example: 'a@a.com', description: '이메일'})
    @IsEmail()
    email: string;

    @ApiProperty({example: '1234', description: '비밀번호'})
    @IsString()
    password: string;
}