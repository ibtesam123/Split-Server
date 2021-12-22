import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { IdGuard } from 'src/guard/id.guard';
import { UserRes, UserListRes } from 'src/response/user.res';
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from 'src/validation/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
    ) { }

    @Get('me')
    @UseGuards(IdGuard)
    getOne(@Param('id') id: number): Promise<UserRes> {
        return this.userService.getOne(id)
    }

    @Get()
    getAll(): Promise<UserListRes> {
        return this.userService.getAll()
    }

    @Post('login')
    login(@Body() loginDTO: LoginUserDTO): Promise<UserRes> {
        return this.userService.login(loginDTO)
    }

    @Post()
    create(@Body() userDTO: CreateUserDTO): Promise<UserRes> {
        return this.userService.create(userDTO)
    }

    @Put()
    @UseGuards(IdGuard)
    update(@Param('id') userID: number,@Body() userDTO: UpdateUserDTO): Promise<UserRes> {
        return this.userService.update(userID,userDTO)
    }

}
