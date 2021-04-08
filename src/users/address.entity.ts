import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import NestUser from './user.entity';

@Entity()
export default class UserAddress extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public street: string;

  @Column()
  public city: string;

  @Column()
  public country: string;

  @OneToOne(() => NestUser, (user: NestUser) => user.address)
  public user: NestUser;
}
