import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}
@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column({ default: ArticleStatus.DRAFT })
  status: ArticleStatus;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
