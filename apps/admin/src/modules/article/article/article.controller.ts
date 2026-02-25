import { CreateArticleDto } from '@app/article/DTO/create.article.dto';
import { UpdateArticleDto } from '@app/article/DTO/update.article';
import { ArticleEntity } from '@app/article/entity/article.entity';
import { ArticleService } from '@app/article/service/article.service';
import { action } from '@app/common/auth/casl';
import { CheckAbility } from '@app/common/auth/casl/check-policies.decorator';
import { CaslGuard } from '@app/common/auth/casl/policies.guard';
import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin/Article')
@Controller('admin/article')
@UseGuards(CaslGuard)
export class ArticleAdminController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully created.',
    type: ArticleEntity,
  })
  @CheckAbility(action.Create, ArticleEntity)
  async create(@Body() body: CreateArticleDto) {
    return await this.articleService.create(body);
  }
  @Patch(':id')
    @ApiOperation({ summary: 'update an article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully updated.',
    type: ArticleEntity,
  })
  @CheckAbility(action.Update, ArticleEntity)
  async update(@Param('id') id: number, @Body() body: UpdateArticleDto) {
    return await this.articleService.update(id, body);
  }

  @Delete(':id')
      @ApiOperation({ summary: 'delete an article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully deleted.',
    type: ArticleEntity,
  })
  @CheckAbility(action.Delete, ArticleEntity)
  async remove(@Param('id') id: number) {
    return await this.articleService.remove(id);
  }
}
