import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Event } from "./event.entity"
import { User } from "./user.entity"

@Entity('item')
export class Item {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    icon: string

    @Column({ type: 'float' })
    amount: number

    @ManyToMany(type => User, user => user.paidForItems, { onDelete: 'CASCADE' })
    @JoinTable()
    paidFor: User[]

    @ManyToOne(type => User, user => user.paidByItems, { onDelete: 'CASCADE' })
    paidBy: User

    @ManyToOne(type => Event, event => event.items, { onDelete: 'CASCADE' })
    event: Event

    @CreateDateColumn()
    created_at: Date
} 