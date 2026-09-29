import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from './entities/store.entity';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { StoresGateway } from './stores.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity])],
  controllers: [StoresController],
  providers: [StoresService, StoresGateway],
  exports: [StoresService],
})
export class StoresModule {}
