import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsOptional, IsBoolean} from 'class-validator';

export class UpdateTodoDto{
    @ApiProperty({example: '운동하기', description: 'Todo 제목', required: false})
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({example: '헬스장 1시간', description: 'Todo 설명', required: false})
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({example: true, description: '완료 여부', required: false})
    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean;
}