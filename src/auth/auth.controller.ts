import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiBearerAuth } from '@nestjs/swagger'

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('/login')
    public async login(@Body() body: LoginDto) {
        return await this.authService.login(body);
    }
}
