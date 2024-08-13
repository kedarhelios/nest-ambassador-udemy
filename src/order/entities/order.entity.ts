import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from '../../user/entity/user';
import { Exclude, Expose } from 'class-transformer';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  transaction_id: string;

  @Column()
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user_id: number;

  @Column()
  code: string;

  @Column()
  ambassador_email: string;

  @Column()
  @Exclude()
  first_name: string;

  @Column()
  @Exclude()
  last_name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  zip: string;

  @Column({ nullable: true, default: false })
  @Exclude()
  complete: boolean;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  order_items: OrderItem[];

  @Expose()
  get name() {
    return `${this.first_name} ${this.last_name}`;
  }

  @Expose()
  get total() {
    return this.order_items.reduce(
      (total, item) => total + item.admin_revenue,
      0,
    );
  }
}
