import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';

@Module({
    imports: [
        TokenModule,
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [
        UserController,],
    providers: [
        UserService,],
    exports: [
        UserService,
    ]
})
export class UserModule { }
