import { Request, Controller, Query, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Todos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
    constructor(private readonly todoService: TodosService){}

    @Post()
    create(@Request() req, @Body() createTodoDto: CreateTodoDto){
        return this.todoService.create(createTodoDto, req.user.sub);
    }
    @Get()
    findAll(@Request() req, @Query() query: PaginationQueryDto){
        return this.todoService.findAll(req.user.userId, query);
    }
    @Get(':id')
    findOne(@Request() req,@Param('id') id: string){
        return this.todoService.findOne(+id, req.user.sub);
    }
    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto){
        return this.todoService.update(+id,updateTodoDto, req.user.sub);
    }
    @Delete(':id')
    remove(@Request() req,@Param('id') id: string){
        return this.todoService.remove(+id, req.user.sub);
    }
}
