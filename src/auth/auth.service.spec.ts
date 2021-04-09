import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import NestUser from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const authenticationService = new AuthService(
    new UsersService(new Repository<NestUser>()),
    new JwtService({
      secretOrPrivateKey: 'Secret key',
    }),
    new ConfigService(),
  );
  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = 1;
      expect(typeof authenticationService.getCookieWithToken(userId)).toEqual(
        'string',
      );
    });
  });
});
