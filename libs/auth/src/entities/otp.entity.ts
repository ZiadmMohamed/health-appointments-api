import { hash } from '@app/common/security/hash.util';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
} from 'typeorm';


@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ length: 255 })
  email: string;

  @Column()
  otpHash: string;

  @Column({ type: 'timestamp', default: () => "now() + interval '10 minutes'" })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashOtp() {
    if (!this.otpHash) return;
    this.otpHash = await hash(this.otpHash);
  }
}
