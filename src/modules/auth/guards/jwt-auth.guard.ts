import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard JWT personalizado
 * Patrón: Guard (NestJS)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
