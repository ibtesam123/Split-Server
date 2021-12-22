import { UserModule } from './module/user/user.module';
import { TokenModule } from './module/token/token.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBConfig } from './config/db.config';
import { User } from './entity/user.entity';

export const entities = [
  User,
]

@Module({
  imports: [
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
