import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ICreateUser } from './user.interface';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    public async validateUser(userId: string): Promise<boolean> {
        const foundUser = await this.userRepository.findOne(userId);
        if (!foundUser) throw { err: 'Invalid user.' };

        return !!foundUser;
    }
}
