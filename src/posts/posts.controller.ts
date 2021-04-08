import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';
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
  async getAllPost() {
    return await this.postsService.getAllPosts();
  }

  /**
   * Returns a post with a given id
   * @param id
   */
  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return await this.postsService.getPostById((id as unknown) as number);
  }

  /**
   * Creates a new post
   * @param post
   */
  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    return await this.postsService.createPost(post, req.user);
  }

  /**
   * Replaces a post with a given id
   * @param id
   * @param post
   */
  @Put(':id')
  async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return await this.postsService.updatePost((id as unknown) as number, post);
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
