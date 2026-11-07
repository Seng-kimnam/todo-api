import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid') 
    id: string;

    @Column({ unique: true }) 
    email: string;

    @Column({ select: false })
     passwordHash: string;

    @Column({ default: 0 })
    refreshTokenVersion: number;

}
