import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
    constructor(
        private readonly userService: UsersService
    ) { }
}
