import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { IdGuard } from 'src/guard/id.guard';
import { NotificationRes, NotificationListRes, NotificationDeleteRes } from 'src/response/notification.res';
import { CreateNotificationDTO } from 'src/validation/notification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notiService: NotificationService,
    ) { }

    @Get('user')
    @UseGuards(IdGuard)
    getAllForUser(@Param('id') userID: number): Promise<NotificationListRes> {
        return this.notiService.getAllForUser(userID)
    }

    @Get(':id')
    getOne(@Param('id') id: number): Promise<NotificationRes> {
        return this.notiService.getOne(id)
    }

    @Delete()
    @UseGuards(IdGuard)
    deleteAllForUser(@Param('id') userID: number): Promise<NotificationDeleteRes> {
        return this.notiService.deleteAllForUser(userID)
    }
}
