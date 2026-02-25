import { Injectable } from '@nestjs/common';
import { ArticleRepo } from '../repository/article.repo';
import { UpdateArticleDto } from '../DTO/update.article';
import { CreateArticleDto } from '../DTO/create.article.dto';

@Injectable()
export class ArticleService {
  constructor(
   private readonly articleRepo: ArticleRepo
  ) {}
  async create(data: CreateArticleDto) {
    return await this.articleRepo.create(data);
  }
  async findAll() {
    return await this.articleRepo.findAll();
  }
  async update(id: number, body:UpdateArticleDto) {
    return await this.articleRepo.update(id, body);
  } 
  async remove(id: number) {
    return await this.articleRepo.delete(id);
  }
}