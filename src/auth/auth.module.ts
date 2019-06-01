import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { IsAuthenticated } from './auth.middleware';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        UsersModule
    ],
    providers: [AuthService, IsAuthenticated],
    controllers: [AuthController],
    exports: [IsAuthenticated]
})
export class AuthModule { }
