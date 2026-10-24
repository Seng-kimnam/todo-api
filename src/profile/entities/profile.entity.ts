import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id : number;
    
    @Column({length : 100})
    username: string;
    
    @Column({length : 100})
    displayName: string;

    @Column({length : 100})
    email: string;

}
