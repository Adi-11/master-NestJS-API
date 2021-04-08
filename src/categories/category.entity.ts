import PostUser from 'src/posts/userPost.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  public name: string;

  @ManyToMany(() => PostUser, (post: PostUser) => post.categories)
  public posts: PostUser[];
}
