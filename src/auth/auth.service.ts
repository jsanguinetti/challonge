import { Injectable, HttpException } from '@nestjs/common';
import { IUser, ICreateUser } from '../users/user.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService
    ) { }

    public login(user: ICreateUser) {
        return this.usersService.create(user);
    }
}
