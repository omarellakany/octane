import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('admin') {
  private logger = new Logger(AdminGuard.name);

  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    this.logger.debug('canActivate');

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.role.name !== 'admin') {
      throw new UnauthorizedException();
    }

    return true;
  }
}
