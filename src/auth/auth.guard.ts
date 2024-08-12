import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    try {
      const jwt = req.cookies['jwt'];

      const data = await this.jwtService.verifyAsync(jwt);
      if (!Boolean(data?.id)) return false;

      req.user = data?.id;
      return true;
    } catch (error) {
      console.log('error', error);
      return false;
    }
  }
}
