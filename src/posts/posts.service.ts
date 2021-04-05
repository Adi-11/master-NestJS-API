import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import PostUser from './userPost.entity';
import { Repository } from 'typeorm/repository/Repository';
import { DeleteResult } from 'typeorm';

export interface Post {
  id: number;
  content: string;
  title: string;
}

@Injectable()
export class PostsService {
  private lastPost = 0;
  private posts: Post[] = [];
  constructor(
    @InjectRepository(PostUser)
    private postRepository: Repository<PostUser>,
  ) {}

  getAllPosts = async (): Promise<PostUser[] | HttpException> => {
    const post: PostUser[] = await this.postRepository.find();
    if (post.length > 0) {
      return post;
    }

    throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
  };

  getPostById = async (id: number): Promise<PostUser | HttpException> => {
    const post: PostUser = await this.postRepository.findOne(id);
    if (post) {
      return post;
    }

    throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
  };

  createPost = async (
    post: CreatePostDto,
  ): Promise<PostUser | HttpException> => {
    // const newPost = {
    //   id: ++this.lastPost,
    //   ...post,
    // };
    // this.posts.push(newPost);

    const newPost: PostUser = this.postRepository.create(post);
    if (newPost) {
      await this.postRepository.save(newPost);
      return newPost;
    }

    throw new HttpException(
      'INTERNAL SERVER ERROR',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  };

  updatePost = async (
    id: number,
    post: UpdatePostDto,
  ): Promise<PostUser | HttpException> => {
    await this.postRepository.update(id, post as any);
    const updatedUser: PostUser = await this.postRepository.findOne(id);
    if (updatedUser) {
      return updatedUser;
    }

    throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
  };

  deletePost = async (id: number): Promise<any> => {
    const deletePost: DeleteResult = await this.postRepository.delete(id);
    if (!deletePost.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  };
}
