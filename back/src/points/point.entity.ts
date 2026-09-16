import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('points')
export class Point {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  lat: number;

  @Column('float')
  lng: number;

  @Column({ default: 'Punto en Cali' })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: '#ef4444' })
  color: string;

  @Column({ default: 'map-pin' })
  icon: string;

  @CreateDateColumn()
  createdAt: Date;
}
