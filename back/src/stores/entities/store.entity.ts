import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('stores')
export class StoreEntity {
  @PrimaryColumn({ type: 'varchar', length: 100 })
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'double precision' })
  lat: number;

  @Column({ type: 'double precision' })
  lng: number;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  // Índice para que el ordenamiento ORDER BY likes DESC sea instantáneo
  @Index()
  @Column({ type: 'int', default: 0 })
  likes: number;

  @Column({ type: 'text', nullable: true })
  bannerPreview: string | null;

  @Column({ type: 'text', nullable: true })
  logoPreview: string | null;

  @Column({ type: 'varchar', length: 30, default: '#FBFBFB' })
  color1: string;

  @Column({ type: 'varchar', length: 30, default: '#D600C4' })
  color2: string;

  // Lista de códigos de postres compatibles con Postgres y SQLite
  @Column('simple-array', { default: '' })
  postres: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
