import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { createAskDto } from '../../../../../libs/ask/src/DTO/create.ask.dto';
import { Ask } from '@pp/ask/entity/ask.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AskService } from '@pp/ask/service/ask.service';
import { CheckAbility } from '@app/common/auth/casl/check-policies.decorator';
import { action } from '@app/common/auth/casl/types';
import { CaslGuard } from '@app/common/auth/casl/policies.guard';
@ApiTags('Ask')
@Controller('ask')
export class AskController {
  constructor(private readonly askService: AskService) {}


  @ApiOperation({ summary: 'Create a new ask' })
  @ApiResponse({
    status: 201,
    description: 'The ask has been successfully created.',
    type: Ask,
  })
  @Post()
   @CheckAbility(action.Read, Ask)
   @UseGuards(CaslGuard)
  //  @user() user: UserPayload
  async createAsk(@Body() body: createAskDto): Promise<Ask> {
    // body,user
    return await this.askService.createAsk(body);
  }
  @Get('my-asks')
  @UseGuards(CaslGuard)
  @CheckAbility(action.Read, Ask) 
  @ApiOperation({ summary: 'Get my own Ask forms' })
  async findOwn(@Request() req) {
    return await this.askService.findMyAsks(req.user.id);
  }

}
