import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Event } from "./event.entity"
import { User } from "./user.entity"

@Entity('due')
export class Due {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'float' })
    amount: number

    @ManyToOne(type => User, user => user.dueUser1, { onDelete: 'CASCADE' })
    user1: User

    @ManyToOne(type => User, user => user.dueUser2, { onDelete: 'CASCADE' })
    user2: User

    @ManyToOne(type => Event, event => event.dues, { onDelete: 'CASCADE' })
    event: Event

    @CreateDateColumn()
    created_at: Date
}