import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ default: 'TODO' })
  status: string;

  @Column({ default: false })
  starred: boolean;

  @Column({ type: 'int', default: 0 })
  position: number;
  // todo.entity.ts — every to-do has an owner
  @ManyToOne(() => User, (u) => u.todos)
  owner: User;

  @Column({ type: 'uuid', nullable: true })
  ownerId: string;
}
