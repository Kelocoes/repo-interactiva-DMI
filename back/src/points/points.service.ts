import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Point } from './point.entity';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
  ) {}

  async findAll(): Promise<Point[]> {
    return await this.pointRepository.find({
      order: { id: 'ASC' },
    });
  }

  async create(data: {
    lat: number;
    lng: number;
    title?: string;
    description?: string;
    color?: string;
    icon?: string;
  }): Promise<Point> {
    const point = this.pointRepository.create({
      lat: data.lat,
      lng: data.lng,
      title: data.title || 'Punto en Cali',
      description: data.description || '',
      color: data.color || '#ef4444',
      icon: data.icon || 'map-pin',
    });
    return await this.pointRepository.save(point);
  }

  async clearAll(): Promise<void> {
    await this.pointRepository.clear();
  }
}
