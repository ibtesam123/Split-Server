import { NotificationType } from "src/interface/notification.enum"
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Event } from "./event.entity"
import { User } from "./user.entity"

@Entity('notification')
export class Notification {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column({ enumName: 'NotificationType', default: NotificationType.SIMPLE })
    type: NotificationType

    @ManyToOne(type => Event, event => event.notifications, { onDelete: 'CASCADE', nullable: true })
    event?: Event

    @ManyToOne(type => User, user => user.notifications, { onDelete: 'CASCADE' })
    user: User

    @CreateDateColumn()
    created_at: Date

}