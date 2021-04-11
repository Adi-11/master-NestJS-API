import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { Helper } from 'src/helper/bcrypt';
import { User, UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

export interface TokenPayload {
  userId: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  registerUser = async (registrationData: RegisterDto): Promise<User> => {
    const { email, name, password } = registrationData;

    const hashedPassword = await Helper.hashPassword(password, 10);
    try {
      const createUser = await this.userService.create({
        ...registrationData,
        password: hashedPassword as any,
      });
      createUser.password = undefined;
      return createUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  gerAuthenticatedUser = async (
    email: string,
    hashedPassword: string,
  ): Promise<User> => {
    try {
      const user: User = await this.userService.getUserByEmail(email);

      const isPasswordMatched = Helper.passwordsAreEqual(
        hashedPassword,
        user.password,
      );
      if (!isPasswordMatched) {
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  };

  public getCookieWithToken = (userId: number) => {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}h`,
    });
    return `Authentication=${token}; httpOnly; path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  };

  public getCookieWithRefreshToken = (userId: number) => {
    const payload: TokenPayload = { userId };
    const token: string = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}h`,
    });
    const cookie: string = `Authentication=${token}; httpOnly; path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;

    return {
      cookie,
      token,
    };
  };

  public getCookieForLogOut = () => {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  };
}
