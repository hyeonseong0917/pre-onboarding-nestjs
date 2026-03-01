import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsNotEmpty, IsOptional} from 'class-validator';

export class CreateTodoDto{
    @ApiProperty({example: '운동하기', description: 'Todo 제목'})
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({example: '헬스장 1시간', description: 'Todo 설명', required: false})
    @IsOptional()
    @IsString()
    description: string;
}