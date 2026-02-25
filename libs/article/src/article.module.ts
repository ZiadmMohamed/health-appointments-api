import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entity/article.entity';
import { ArticleService } from './service/article.service';
import { ArticleAdminController } from 'apps/admin/src/modules/article/article/article.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
  controllers: [ArticleAdminController],
  providers: [ArticleService],
  exports: [ArticleService, TypeOrmModule],
})
export class ArticleModule {}
