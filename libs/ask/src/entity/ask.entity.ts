import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
export enum AskStatus {
  PENDING = 'pending',
  ANSWERED = 'answered',
  CLOSED = 'closed',
}
@Entity('asks')
export class Ask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  question: string;

  //   @Column({ nullable: true })
  //   patientId: number;

  @Column({ default: AskStatus.PENDING })
  status: AskStatus;

  @CreateDateColumn()
  createdAt: Date;
}
