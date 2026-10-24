import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Todo } from "../../todos/entities/todo.entity";

export type RoleType = 'user' | 'admin';
 const Role : RoleType[] = ['user', 'admin'];
@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid') 
    id: string;

    @Column({ unique: true }) 
    email: string;

    @Column({ select: false })
     passwordHash: string;

    @Column({ type: 'enum', enum: Role , default: Role[0] })
    role: RoleType;

    @OneToMany(() => Todo, (todo) => todo.owner)
    todos: Todo[];
}
