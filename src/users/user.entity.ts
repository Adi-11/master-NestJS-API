import { Exclude, Expose } from 'class-transformer';
import PostUser from 'src/posts/userPost.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import UserAddress from './address.entity';

@Entity()
export default class NestUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @OneToOne(() => UserAddress, { eager: true, cascade: true })
  @JoinColumn()
  public address: UserAddress;

  @OneToMany(() => PostUser, (post: PostUser) => post.author)
  public posts: PostUser[];

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;
}
