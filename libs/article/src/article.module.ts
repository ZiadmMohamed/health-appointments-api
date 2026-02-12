import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleRepository } from './repository/article.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entity/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
  providers: [ArticleService],
  exports: [ArticleService, ArticleRepository],
})
export class ArticleModule {}
