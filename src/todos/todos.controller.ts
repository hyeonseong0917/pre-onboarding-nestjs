import { Controller, Query, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
    constructor(private readonly todoService: TodosService){}

    @Post()
    create(@Body() createTodoDto: CreateTodoDto){
        return this.todoService.create(createTodoDto);
    }
    @Get()
    findAll(@Query() query: PaginationQueryDto){
        return this.todoService.findAll(query);
    }
    @Get(':id')
    findOne(@Param('id') id: string){
        return this.todoService.findOne(+id);
    }
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto){
        return this.todoService.update(+id,updateTodoDto);
    }
    @Delete(':id')
    remove(@Param('id') id: string){
        return this.todoService.remove(+id);
    }
}
