import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { PointsModule } from './points/points.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: join(__dirname, '..', 'database.sqlite'),
      autoLoadEntities: true,
      synchronize: true, // Sincroniza esquemas automáticamente
    }),
    TasksModule,
    PointsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
