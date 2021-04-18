import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { LocalAuthenticationGuard } from './localAuth.guard';
import RequestWithUser from './requestWithUser.interface';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookies = this.authService.getCookieWithToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookies', accessTokenCookies);
    return request.user;
  }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    console.log('Register');
    const user = await this.authService.registerUser(registrationData);
    user.password = undefined;
    return user;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    const accressTokencookie = this.authService.getCookieWithToken(user.id);
    const {
      cookie: refreshTokenCookie,
      token: refreshToken,
    } = this.authService.getCookieWithRefreshToken(user.id);
    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    request.res.setHeader('Set-Cookie', [refreshToken, refreshTokenCookie]);
    user.password = undefined;
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logOut(@Req() request: RequestWithUser, @Res() response: any) {
    await this.userService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookies', this.authService.getCookieForLogOut());
  }
}
