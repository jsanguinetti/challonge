import { Injectable, HttpException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly usersService: UsersService
    ) { }

    public async validateUser(userId: string) {
        return await this.usersService.validateUser(userId);
    }

    public login(userId: string) {
        if (!userId) throw new HttpException('Email is required', 422);
        return {};
    }
}
