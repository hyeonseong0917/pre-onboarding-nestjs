import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class SignupDto{
    @ApiProperty({example: 'a@a.com', description: '이메일'})
    @IsEmail()
    email: string;

    @ApiProperty({example: '1234', description: '비밀번호 (최소 4자)'})
    @IsString()
    @MinLength(4)
    password: string;
}