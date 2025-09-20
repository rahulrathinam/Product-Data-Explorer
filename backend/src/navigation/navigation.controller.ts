import { Controller, Get, Query } from '@nestjs/common';
import { NavigationService } from './navigation.service';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  async list() {
    return this.navigationService.listHeadings();
  }
}








