import { HttpException, HttpStatus, Injectable, Put } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';

export interface Post {
  id: number;
  content: string;
  title: string;
}

@Injectable()
export class PostsService {
  private lastPost = 0;
  private posts: Post[] = [];

  getAllPosts() {
    if (this.posts.length > 0) {
      return this.posts;
    }
    throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
  }

  getPostById(id: number) {
    const post = this.posts.find((post) => post.id === id);
    if (post) {
      return post;
    }

    throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
  }

  createPost(post: CreatePostDto) {
    const newPost = {
      id: ++this.lastPost,
      ...post,
    };
    this.posts.push(newPost);
    return newPost;
  }

  replacePost(id: number, post: UpdatePostDto) {
    const postIdx = this.posts.findIndex((post) => post.id === id);
    if (postIdx > -1) {
      this.posts[postIdx] = post;
    }

    throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
  }

  deletePost(id: number) {
    const postIdx = this.posts.findIndex((post) => post.id === id);
    if (postIdx > -1) {
      this.posts.splice(postIdx, 1);
    } else {
      throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
