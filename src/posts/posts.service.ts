import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import PostUser from './userPost.entity';
import { Repository } from 'typeorm/repository/Repository';
import { DeleteResult } from 'typeorm';
import { User } from 'src/users/users.service';
import { PostNotFoundException } from './exception/postNotFund.exception';

export interface Post {
  id: number;
  content: string;
  title: string;
}

@Injectable()
export class PostsService {
  // private lastPost = 0;
  // private posts: Post[] = [];
  constructor(
    @InjectRepository(PostUser)
    private postRepository: Repository<PostUser>,
  ) {}

  getAllPosts = async (): Promise<PostUser[]> => {
    const post: PostUser[] = await this.postRepository.find({
      relations: ['author'],
    });
    if (post.length > 0) {
      return post;
    }

    throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
  };

  getPostById = async (id: number): Promise<PostUser> => {
    const post: PostUser = await this.postRepository.findOne(id, {
      relations: ['author'],
    });
    if (post) {
      return post;
    }

    throw new PostNotFoundException(id);
  };

  createPost = async (post: CreatePostDto, user: User): Promise<PostUser> => {
    const newPost: PostUser = this.postRepository.create({
      ...post,
      author: user,
    });
    if (newPost) {
      await this.postRepository.save(newPost);
      return newPost;
    }

    throw new HttpException(
      'INTERNAL SERVER ERROR',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  };

  updatePost = async (id: number, post: UpdatePostDto): Promise<PostUser> => {
    await this.postRepository.update(id, post as any);
    const updatedUser: PostUser = await this.postRepository.findOne(id, {
      relations: ['author'],
    });
    if (updatedUser) {
      return updatedUser;
    }

    throw new PostNotFoundException(id);
  };

  deletePost = async (id: number): Promise<any> => {
    const deletePost: DeleteResult = await this.postRepository.delete(id);
    if (!deletePost.affected) {
      throw new PostNotFoundException(id);
    }
  };
}
