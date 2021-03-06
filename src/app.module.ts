import { NotificationModule } from './module/notification/notification.module';
import { EventModule } from './module/event/event.module';
import { UserModule } from './module/user/user.module';
import { TokenModule } from './module/token/token.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBConfig } from './config/db.config';
import { User } from './entity/user.entity';
import { Due } from './entity/due.entity';
import { Event } from './entity/event.entity';
import { Item } from './entity/item.entity';
import { Notification } from './entity/notification.entity';

export const entities = [
  User,
  Due,
  Event,
  Item,
  Notification
]

@Module({
  imports: [
    NotificationModule,
    EventModule,
    UserModule,
    TokenModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (dbConfig: ConfigService<DBConfig>) => ({
        type: 'postgres',
        url: dbConfig.get<string>('DB_URL'),
        synchronize: true,
        entities: entities,
      })
    }),
  ],
})
export class AppModule { }
