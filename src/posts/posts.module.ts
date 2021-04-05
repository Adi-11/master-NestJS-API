import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostUser from './userPost.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostUser])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
