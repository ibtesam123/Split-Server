import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Due } from "./due.entity"
import { Item } from "./item.entity"
import { Notification } from "./notification.entity"
import { User } from "./user.entity"

@Entity('event')
export class Event {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({ nullable: true })
    image?: number

    @ManyToMany(type => User, user => user.events, { onDelete: 'CASCADE' })
    @JoinTable()
    users: User[]

    @OneToMany(type => Item, item => item.event, { onDelete: 'CASCADE' })
    items: Item[]

    @OneToMany(type => Due, due => due.event, { onDelete: 'CASCADE' })
    dues: Due[]

    @OneToMany(type => Notification, noti => noti.event, { onDelete: 'CASCADE' })
    notifications: Notification[]

    @CreateDateColumn()
    created_at: Date

}