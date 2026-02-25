import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
export enum articleStatus{
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived'
}
@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column({ default: articleStatus.DRAFT })
  status?: articleStatus;
@CreateDateColumn()
  createdAt: Date;
}
