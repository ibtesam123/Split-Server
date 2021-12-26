import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { hash, verify } from "argon2"
import { User } from "src/entity/user.entity"
import { UserRes, UserListRes } from "src/response/user.res"
import { Logger } from "src/utils/logger.util"
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "src/validation/user.dto"
import { Repository } from "typeorm"
import { TokenService } from "../token/token.service"

export const module: string = 'User'

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly tokenService: TokenService,
    ) { }

    async getOne(id: number): Promise<UserRes> {

        let user = await this.userRepo.findOne(id)

        if (!user)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)

        return {
            success: true,
            data: user,
        }

    }

    async getOneWithUsername(username: string): Promise<UserRes> {

        let user = await this.userRepo.findOne({
            where: {
                username: username,
            }
        })

        if (!user)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)

        return {
            success: true,
            data: user,
        }

    }

    async getByIDs(ids: number[]): Promise<UserListRes> {
        let users = await this.userRepo.findByIds(ids)

        return {
            success: true,
            data: users,
        }
    }

    async getAll(): Promise<UserListRes> {
        let userList = await this.userRepo.find()

        return {
            success: true,
            data: userList,
        }
    }

    async create(userDTO: CreateUserDTO): Promise<UserRes> {

        let hashedPass = await hash(userDTO.password)
        userDTO.password = hashedPass

        let res = await this.userRepo.insert({
            ...userDTO
        }).catch(({ message }) => {
            Logger(message, 'create', module)
            if (message.includes('duplicate'))
                throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST)
            throw new HttpException('Cannot create user', HttpStatus.BAD_REQUEST)
        })

        let user = (await this.getOne(res.identifiers[0].id)).data

        let token = await this.tokenService.encode({
            id: user.id,
        })

        user.token = token
        user = await this.userRepo.save(user)

        return {
            success: true,
            data: user,
        }
    }

    async update(userID: number, userDTO: UpdateUserDTO): Promise<UserRes> {

        let user = (await this.getOne(userID)).data

        await this.userRepo.update(userID, {
            ...userDTO,
        }).catch(({ message }) => {
            Logger(message, 'update', module)
            throw new HttpException('Cannot update user', HttpStatus.BAD_REQUEST)
        })

        user = (await this.getOne(userID)).data

        return {
            success: true,
            data: user,
        }
    }

    async login(loginDTO: LoginUserDTO): Promise<UserRes> {

        let user = (await this.getOneWithUsername(loginDTO.username)).data

        let res = await verify(user.password, loginDTO.password)

        if (!res)
            throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST)

        return {
            success: true,
            data: user,
        }

    }
}