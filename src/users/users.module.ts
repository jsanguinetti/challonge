import { Module, NestModule, forwardRef } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallongeModule } from '../challonge/challonge.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ChallongeModule,
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule { }
