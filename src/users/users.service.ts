import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Helper } from 'src/helper/bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import NestUser from './user.entity';

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(NestUser)
    private userRepository: Repository<NestUser>,
  ) {}

  getUserByEmail = async (email: string): Promise<User> => {
    const user: User = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }

    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  };

  create = async (userData: CreateUserDto): Promise<User> => {
    const newUser = this.userRepository.create(userData);
    console.log({ user: newUser });
    if (newUser) {
      await this.userRepository.save(newUser);
      return newUser;
    } else {
      throw new HttpException(
        'INTERNAL SERVER ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  getUserById = async (id: number): Promise<User> => {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  };

  setCurrentRefreshToken = async (refreshToken: string, userId: number) => {
    const currentRefreshToken = await Helper.hashPassword(refreshToken, 10);

    await this.userRepository.update(userId, {
      currentHashedRefreshToken: currentRefreshToken,
    });
  };

  getUserIfTokenMatches = async (refreshToken: string, userId: number) => {
    const user = await this.userRepository.findOne({ id: userId });

    if (user) {
      const isRefreshToken: boolean = await Helper.passwordsAreEqual(
        user.currentHashedRefreshToken,
        refreshToken,
      );

      if (isRefreshToken) {
        return user;
      }
    }

    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  };

  removeRefreshToken = async (userId: number) => {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  };
}
