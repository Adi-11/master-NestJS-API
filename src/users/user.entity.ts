import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class PostUser {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public title: string;

  @Column()
  public content: string;
}

export default PostUser;
