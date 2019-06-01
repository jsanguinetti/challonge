import { Get, Controller } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger'

@Controller()
@ApiBearerAuth()
export class AppController {
    @Get()
    public root(): string {
        return 'Hello World!';
    }
}
