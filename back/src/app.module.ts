import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoresModule } from './stores/stores.module';

const isPostgres = process.env.DB_TYPE === 'postgres' || !process.env.DB_TYPE;

@Module({
  imports: [
    TypeOrmModule.forRoot(
      isPostgres
        ? {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USER || 'bocao_user',
            password: process.env.DB_PASSWORD || 'bocao_password',
            database: process.env.DB_NAME || 'bocao_db',
            autoLoadEntities: true,
            synchronize: true,
            extra: {
              max: 30, // Pool de conexiones para múltiples usuarios concurrentes
              connectionTimeoutMillis: 5000,
              idleTimeoutMillis: 30000,
            },
          }
        : {
            type: 'better-sqlite3',
            database: 'database.sqlite',
            autoLoadEntities: true,
            synchronize: true,
          },
    ),
    StoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

