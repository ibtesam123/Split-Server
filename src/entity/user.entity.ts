import {  Exclude, instanceToPlain } from "class-transformer"
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

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

    @CreateDateColumn()
    created_at: Date

    toJSON() {
        return instanceToPlain(this)
    }
}