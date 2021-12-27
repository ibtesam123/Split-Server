import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/entity/event.entity';
import { Item } from 'src/entity/item.entity';
import { Due } from 'src/entity/due.entity';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [
        TokenModule,
        UserModule,
        NotificationModule,
        TypeOrmModule.forFeature([Event, Item, Due])
    ],
    controllers: [
        EventController,],
    providers: [
        EventService,],
    exports: [
        EventService,
    ]
})
export class EventModule { }
