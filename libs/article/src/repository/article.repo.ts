import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ArticleEntity } from '../entity/article.entity';
@Injectable()
export class ArticleRepository extends Repository<ArticleEntity> {
  constructor(private DataSource: DataSource) {
    super(ArticleEntity, DataSource.createEntityManager());
  }
}
