import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { LoginCommand } from './handlers/login.handler';
import { LoginParams } from './params/login-params';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @Post('login')
  async login(@Body() params: LoginParams) {
    return this.commandBus.execute(new LoginCommand(params));
  }
}
