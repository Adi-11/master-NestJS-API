import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  getUserByEmail = async (email: string): Promise<User | HttpException> => {
    const user: User = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }

    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  };

  create = async (userData: CreateUserDto): Promise<User | HttpException> => {
    const newUser = this.userRepository.create(userData);
    if (newUser) {
      await this.userRepository.save(newUser);
      return newUser;
    }

    throw new HttpException(
      'INTERNAL SERVER ERROR',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  };
}
