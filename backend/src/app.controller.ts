import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service.js';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get greeting message' })
  @ApiOkResponse({ description: 'Greeting text returned successfully.', type: String })
  getHello(): string {
    return this.appService.getHello();
  }
}
