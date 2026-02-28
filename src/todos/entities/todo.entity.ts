import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column,
    CreateDateColumn,
    // 여러 todo가 한 명의 user에게 속하다는 것을
    ManyToOne,
} from 'typeorm';
import { User } from '../../users/user.entites';

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

    @ManyToOne(()=>User, (user)=>(user.todos), {onDelete: 'CASCADE'})
    user: User;

    @Column()
    userId: number;
}