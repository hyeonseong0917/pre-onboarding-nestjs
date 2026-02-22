import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Todo{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({nullable: true})
    description: string;

    @Column({default: false})
    isCompleted: boolean;

    @CreateDateColumn()
    createdAt: Date;
}