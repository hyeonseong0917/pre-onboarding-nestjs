import { Injectable, NotFoundException } from '@nestjs/common';
import {CreateTodoDto} from './dto/create-todo.dto';
import {UpdateTodoDto} from './dto/update-todo.dto';
import {Todo} from './entities/todo.entity';


@Injectable()
export class TodosService {
    private todos: Todo[]=[];
    private nextId=1;
    create(createTodoDto: CreateTodoDto): Todo{
        const todo: Todo={
            id: this.nextId++,
            title: createTodoDto.title,
            description: createTodoDto.description,
            isCompleted: false,
            createdAt: new Date(),
        };
        this.todos.push(todo);
        return todo;
    }
    findAll(): Todo[]{
        return this.todos;
    }
    findOne(id: number): Todo{
        const todo=this.todos.find(t=>t.id===id);
        if(!todo) throw new NotFoundException(`${id}번 Todo가 없습니다.`);
        return todo;
    }
    update(id: number, updateTodoDto: UpdateTodoDto){
        const todo=this.findOne(id);
        Object.assign(todo, updateTodoDto);
        return todo;
    }
    remove(id: number){
        // id인거 삭제
        const index=this.todos.findIndex((t)=>t.id===id);
        if(index===-1) throw new NotFoundException(`${id}번 Todo가 없습니다.`);
        this.todos.splice(index,1);
        return {message: "삭제되었습니다."};
    }


}
