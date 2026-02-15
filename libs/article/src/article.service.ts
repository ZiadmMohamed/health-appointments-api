import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleEntity } from './entity/article.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepo: Repository<ArticleEntity>,
  ) {}

  async findAll(): Promise<ArticleEntity[]> {
    return await this.articleRepo.find();
  }

  async findOne(id: number): Promise<ArticleEntity> {
    const article = await this.articleRepo.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return article;
  }
  async create(data: Partial<ArticleEntity>): Promise<ArticleEntity> {
    const article = this.articleRepo.create(data);
    return await this.articleRepo.save(article);
  }
  async update(
    id: number,
    data: Partial<ArticleEntity>,
  ): Promise<UpdateResult> {
    const article = await this.articleRepo.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return await this.articleRepo.update(id, data);
  }
  async delete(id: number): Promise<DeleteResult> {
    const result = await this.articleRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return result;
  }
}
