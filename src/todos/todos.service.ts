import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: number): Promise<Todo> {
    const todo = this.todoRepository.create({
      ...createTodoDto,
      userId, // ✅ 생성할 때 userId 심기
    });
    return this.todoRepository.save(todo);
  }

  async findAll(userId: number, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;

    const [todos, total] = await this.todoRepository.findAndCount({
      where: { userId }, // ✅ 내 Todo만 조회
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: todos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });

    if (!todo) {
      throw new NotFoundException(`Todo #${id}를 찾을 수 없습니다`);
    }

    // ✅ 남의 Todo 접근 차단
    if (todo.userId !== userId) {
      throw new ForbiddenException('본인의 Todo만 조회할 수 있습니다');
    }

    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, userId: number): Promise<Todo> {
    const todo = await this.findOne(id, userId); // ✅ findOne에서 권한 체크 같이 함
    Object.assign(todo, updateTodoDto);
    return this.todoRepository.save(todo);
  }

  async remove(id: number, userId: number): Promise<void> {
    const todo = await this.findOne(id, userId); // ✅ findOne에서 권한 체크 같이 함
    await this.todoRepository.remove(todo);
  }
}