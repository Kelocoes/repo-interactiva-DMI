import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  IsArray,
} from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la tienda es requerido' })
  @MaxLength(150, { message: 'El nombre no puede exceder 150 caracteres' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @MaxLength(2000, { message: 'La descripción no puede exceder 2000 caracteres' })
  descripcion: string;

  @IsNumber({}, { message: 'La latitud debe ser un número válido' })
  lat: number;

  @IsNumber({}, { message: 'La longitud debe ser un número válido' })
  lng: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  bannerPreview?: string | null;

  @IsString()
  @IsOptional()
  logoPreview?: string | null;

  @IsString()
  @IsOptional()
  color1?: string;

  @IsString()
  @IsOptional()
  color2?: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsNumber()
  @IsOptional()
  likes?: number;

  @IsArray()
  @IsOptional()
  postres?: string[];
}
