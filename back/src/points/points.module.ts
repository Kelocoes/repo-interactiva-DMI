import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from './point.entity';
import { PointsService } from './points.service';
import { PointsGateway } from './points.gateway';
import { PointsController } from './points.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Point])],
  providers: [PointsService, PointsGateway],
  controllers: [PointsController],
  exports: [PointsService],
})
export class PointsModule {}
