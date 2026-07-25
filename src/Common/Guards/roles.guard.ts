import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../Decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const allowedRoles = this.reflector.get<string[] | string[][]>(
      'roles',
      context.getHandler(),
    );

    if (
      !allowedRoles ||
      (Array.isArray(allowedRoles) && allowedRoles.length === 0)
    ) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authUser = request.user || request['user'];

    if (!authUser) {
      throw new UnauthorizedException('User authentication required');
    }

    const userRole = authUser.user?.role || authUser.role;

    if (!userRole) {
      throw new UnauthorizedException('User role is missing or invalid');
    }

    const rolesArray = Array.isArray(allowedRoles)
      ? allowedRoles.flat()
      : [allowedRoles];

    if (rolesArray.includes(userRole)) {
      return true;
    } else {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
  }
}
