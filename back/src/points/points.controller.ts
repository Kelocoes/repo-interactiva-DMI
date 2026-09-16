import { Controller, Get, Post, Delete, Body } from '@nestjs/common';
import { PointsService } from './points.service';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get()
  findAll() {
    return this.pointsService.findAll();
  }

  @Post()
  create(
    @Body()
    body: {
      lat: number;
      lng: number;
      title?: string;
      description?: string;
      color?: string;
      icon?: string;
    },
  ) {
    return this.pointsService.create(body);
  }

  @Delete()
  clearAll() {
    return this.pointsService.clearAll();
  }
}
