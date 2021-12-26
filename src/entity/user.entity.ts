import { Exclude, instanceToPlain } from "class-transformer"
import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Due } from "./due.entity"
import { Event } from "./event.entity"
import { Item } from "./item.entity"

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    username: string

    @Column()
    @Exclude()
    password: string

    @Column({ nullable: true })
    token?: string

    @Column({ nullable: true })
    fcmToken?: string

    @Column({ nullable: true })
    image?: string

    @ManyToMany(type => Event, event => event.users, { onDelete: 'CASCADE' })
    events: Event[]

    @ManyToMany(type => Item, item => item.paidFor, { onDelete: 'CASCADE' })
    paidForItems: Item[]

    @OneToMany(type => Item, item => item.paidBy, { onDelete: 'CASCADE' })
    paidByItems: Item[]

    @OneToMany(type => Due, due => due.user1, { onDelete: 'CASCADE' })
    dueUser1: Due

    @OneToMany(type => Due, due => due.user2, { onDelete: 'CASCADE' })
    dueUser2: Due

    @CreateDateColumn()
    created_at: Date

    toJSON() {
        return instanceToPlain(this)
    }
}