import { Body, Controller, Get, Post } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  async list() {
    return this.historyService.list();
  }

  @Post()
  async add(@Body() body: { sessionId?: string; path: string }) {
    return this.historyService.add(body.sessionId, body.path);
  }
}








