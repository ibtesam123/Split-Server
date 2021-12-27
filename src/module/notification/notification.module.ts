import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entity/notification.entity';

@Module({
    imports: [
        TokenModule,
        UserModule,
        TypeOrmModule.forFeature([Notification])
    ],
    controllers: [
        NotificationController,],
    providers: [
        NotificationService,],
    exports: [
        NotificationService
    ]
})
export class NotificationModule { }
