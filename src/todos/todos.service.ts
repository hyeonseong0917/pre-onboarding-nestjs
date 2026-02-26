import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create(createTodoDto);
    return await this.todoRepository.save(todo);
  }

  async findAll(query: PaginationQueryDto) {
    const {page,limit}=query;
    const skip=(page-1)*limit;
    const [todos, total]=await this.todoRepository.findAndCount({
      skip: skip,
      take: limit,
      order: {createdAt: 'DESC'},
    });
    return {
      todos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total/limit),
      }
    }
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) throw new NotFoundException(`${id}번 Todo가 없습니다.`);
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    Object.assign(todo, updateTodoDto);
    return await this.todoRepository.save(todo);
  }

  async remove(id: number): Promise<{ message: string }> {
    const todo = await this.findOne(id);
    await this.todoRepository.remove(todo);
    return { message: '삭제되었습니다.' };
  }
}