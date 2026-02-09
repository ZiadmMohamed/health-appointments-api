import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BaseArticleEntity } from '../entity/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDBRepo } from '@app/base-repository';
@Injectable()
export class ArticleRepository extends BaseDBRepo<BaseArticleEntity> {
  constructor(
    @InjectRepository(BaseArticleEntity)
    private readonly articleRepo: Repository<BaseArticleEntity>,
  ) {
    super(articleRepo);
  }
}
