import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport';
import { ExtractJwt } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { TokenPayload } from './auth.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refersh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFormRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refersh;
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refersToken = request.cookies?.Refersh;

    return this.userService.getUserIfTokenMatches(refersToken, payload.userId);
  }
}
