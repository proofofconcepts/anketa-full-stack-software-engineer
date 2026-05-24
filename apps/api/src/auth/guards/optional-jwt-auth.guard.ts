import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Never reject — returns null for unauthenticated requests
  handleRequest(_err: any, user: any) {
    return user ?? null;
  }
}
