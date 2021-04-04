import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import NestUser from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([NestUser])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
