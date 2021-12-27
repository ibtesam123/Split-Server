import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Event } from "src/entity/event.entity"
import { Notification } from "src/entity/notification.entity"
import { NotificationRes, NotificationListRes, NotificationDeleteRes } from "src/response/notification.res"
import { Logger } from "src/utils/logger.util"
import { CreateNotificationDTO } from "src/validation/notification.dto"
import { Repository } from "typeorm"
import { UserService } from "../user/user.service"

export const module: string = 'Notification'

@Injectable()
export class NotificationService {

    constructor(
        @InjectRepository(Notification) private readonly notificationRepo: Repository<Notification>,
        private readonly userService: UserService,
    ) { }

    async getOne(id: number): Promise<NotificationRes> {

        let notification = await this.notificationRepo.findOne(id, {
            relations: [
                'user',
                'event'
            ]
        })

        if (!notification)
            throw new HttpException('Notification not found', HttpStatus.NOT_FOUND)

        return {
            success: true,
            data: notification,
        }

    }

    async getAllForUser(userID: number): Promise<NotificationListRes> {

        let user = (await this.userService.getOne(userID)).data

        let notificationList = await this.notificationRepo.find({
            where: {
                user
            },
            relations: [
                'user',
                'event'
            ]
        })

        return {
            success: true,
            data: notificationList,
        }
    }

    async create(notificationDTO: CreateNotificationDTO): Promise<NotificationRes> {

        let user = (await this.userService.getOne(notificationDTO.userID)).data
        delete notificationDTO.userID

        let res = await this.notificationRepo.insert({
            ...notificationDTO,
            user,
        }).catch(({ message }) => {
            Logger(message, 'create', module)
            throw new HttpException('Cannot create notification', HttpStatus.BAD_REQUEST)
        })

        let notification = (await this.getOne(res.identifiers[0].id)).data

        return {
            success: true,
            data: notification,
        }
    }

    async deleteAllForUser(userID: number): Promise<NotificationDeleteRes> {

        let user = (await this.userService.getOne(userID)).data

        await this.notificationRepo.createQueryBuilder('notification')
            .leftJoinAndSelect('notification.user','user')
            .where(`user.id=${user.id}`)
            .delete()
            .execute()

        return {
            success: true,
            data: true,
        }
    }
}