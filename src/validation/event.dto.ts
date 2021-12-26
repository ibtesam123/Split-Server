import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateEventDTO {

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    image?: number

}

export class UpdateEventDTO {

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    image?: number

}

export class CreateItemDTO{

    @IsNotEmpty()
    @IsString()
    title: string

    @IsNumber()
    amount: number

    @IsNumber({},{each:true})
    paidForIDs: number[]

    @IsNumber()
    eventID: number

}

export class EventInvitaionDTO{

    @IsString()
    @IsNotEmpty()
    username:string

    @IsNumber()
    eventID:number

}