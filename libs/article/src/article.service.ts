import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ArticleEntity } from './entity/article.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepo: Repository<ArticleEntity>,
  ) {}
}
