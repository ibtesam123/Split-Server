import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateUserDTO {

    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    fcmToken: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    image?: string

}


export class UpdateUserDTO {

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    password?: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    image?: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    fcmToken?: string

}

export class LoginUserDTO {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    password: string
}