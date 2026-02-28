
import { Todo } from '../todos/entities/todo.entity';
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: Number;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(()=>Todo, (todo)=>todo.user)
    todos: Todo[];
}