import { hash } from '@app/common/security/hash.util';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 255 })
  email: string;

  @Column({ select: false })
  password: string;

  @Index({ unique: true })
  @Column({ length: 11 })
  phone: string;

  @Column({ type: 'enum', enum: ['male', 'female'] })
  Gender: 'male' | 'female';

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: 0 })
  tokenVersion: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;

    await hash(this.password).then((hashed) => {
      this.password = hashed;
    });
  }
}
