import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { Event } from "src/entity/event.entity"

export class CreateNotificationDTO {

    title: string

    description: string

    userID: number

    event?: Event
}