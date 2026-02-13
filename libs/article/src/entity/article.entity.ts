import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column({ default: 'draft' })
  status: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
