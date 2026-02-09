import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('articles')
export class BaseArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column({ default: 'draft' })
  status: string;
}
