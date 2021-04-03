import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  /**
   * Returns all posts
   */
  @Get()
  getAllPost() {
    return this.postsService.getAllPosts();
  }

  /**
   * Returns a post with a given id
   * @param id
   */
  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postsService.getPostById((id as unknown) as number);
  }

  /**
   * Creates a new post
   * @param post
   */
  @Post()
  async createPost(@Body() post: CreatePostDto) {
    return this.postsService.createPost(post);
  }

  /**
   * Replaces a post with a given id
   * @param id
   * @param post
   */
  @Put(':id')
  async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postsService.replacePost((id as unknown) as number, post);
  }

  /**
   * Removes a post with a given id
   * @param id
   */
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    this.postsService.deletePost((id as unknown) as number);
  }
}
