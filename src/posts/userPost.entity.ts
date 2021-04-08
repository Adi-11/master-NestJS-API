import Category from 'src/categories/category.entity';
import NestUser from 'src/users/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class PostUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Column({ nullable: true })
  public category?: string;

  @ManyToOne(() => NestUser, (author: NestUser) => author.posts)
  public author: NestUser;

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  public categories: Category[];
}

export default PostUser;
