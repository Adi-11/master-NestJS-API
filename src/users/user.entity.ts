import { Exclude, Expose } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
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

  @OneToOne(() => UserAddress)
  @JoinColumn()
  public addess: UserAddress;
}
